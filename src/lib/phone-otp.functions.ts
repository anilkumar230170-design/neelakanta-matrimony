import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/twilio";

const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+[1-9]\d{6,14}$/, "Phone must be E.164, e.g. +919876543210");

function syntheticEmail(phone: string) {
  // Deterministic synthetic email used to back the phone identity in Supabase Auth.
  return `phone_${phone.replace(/[^0-9]/g, "")}@phone.neelakanta.local`;
}

async function sha256Hex(input: string) {
  const enc = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

type TwilioIncomingNumber = {
  phone_number?: string;
  capabilities?: { sms?: boolean };
};

function isE164Phone(value: string | undefined) {
  return !!value && /^\+[1-9]\d{6,14}$/.test(value.trim());
}

async function resolveTwilioSender(params: {
  lovableKey: string;
  twilioKey: string;
  configuredFrom: string | undefined;
}) {
  const configuredFrom = params.configuredFrom?.trim();
  const res = await fetch(`${GATEWAY_URL}/IncomingPhoneNumbers.json?PageSize=20`, {
    headers: {
      Authorization: `Bearer ${params.lovableKey}`,
      "X-Connection-Api-Key": params.twilioKey,
    },
  });

  if (!res.ok) {
    const errBody = await res.text();
    console.error("Twilio number lookup failed", res.status, errBody);
    if (isE164Phone(configuredFrom)) return configuredFrom;
    throw new Error("SMS sender not configured");
  }

  const payload = (await res.json()) as { incoming_phone_numbers?: TwilioIncomingNumber[] };
  const smsNumbers = (payload.incoming_phone_numbers ?? [])
    .filter((number) => number.capabilities?.sms && isE164Phone(number.phone_number))
    .map((number) => number.phone_number!.trim());

  if (configuredFrom && smsNumbers.includes(configuredFrom)) return configuredFrom;
  const fallback = smsNumbers[0];
  if (!fallback) throw new Error("No SMS-capable Twilio sender found");
  return fallback;
}

export const sendPhoneOtp = createServerFn({ method: "POST" })
  .inputValidator((input: { phone: string }) =>
    z.object({ phone: phoneSchema }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Rate limit: max 5 OTPs in 15 minutes per phone
    const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("phone_otps")
      .select("id", { count: "exact", head: true })
      .eq("phone", data.phone)
      .gte("created_at", since);
    if ((count ?? 0) >= 5) {
      throw new Error("Too many OTP requests. Please try again later.");
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const code_hash = await sha256Hex(code);
    const expires_at = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const { error: insertErr } = await supabaseAdmin
      .from("phone_otps")
      .insert({ phone: data.phone, code_hash, expires_at });
    if (insertErr) throw new Error("Failed to create OTP");

    const lovableKey = process.env.LOVABLE_API_KEY;
    const twilioKey = process.env.TWILIO_API_KEY;
    if (!lovableKey || !twilioKey) {
      throw new Error("SMS provider not configured");
    }
    const from = await resolveTwilioSender({
      lovableKey,
      twilioKey,
      configuredFrom: process.env.TWILIO_FROM_NUMBER,
    });

    const body = new URLSearchParams({
      To: data.phone,
      From: from,
      Body: `Your Neelakanta Matrimony verification code is ${code}. It expires in 5 minutes.`,
    });

    const res = await fetch(`${GATEWAY_URL}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": twilioKey,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    if (!res.ok) {
      const errBody = await res.text();
      console.error("Twilio send failed", res.status, errBody);
      throw new Error("Could not send SMS. Check the phone number and try again.");
    }

    return { ok: true };
  });

export const verifyPhoneOtp = createServerFn({ method: "POST" })
  .inputValidator((input: { phone: string; code: string }) =>
    z
      .object({
        phone: phoneSchema,
        code: z.string().trim().regex(/^\d{6}$/, "Code must be 6 digits"),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: rows, error } = await supabaseAdmin
      .from("phone_otps")
      .select("id, code_hash, expires_at, attempts, consumed_at")
      .eq("phone", data.phone)
      .order("created_at", { ascending: false })
      .limit(1);
    if (error || !rows || rows.length === 0) {
      throw new Error("No OTP found. Please request a new code.");
    }
    const row = rows[0];
    if (row.consumed_at) throw new Error("Code already used. Request a new one.");
    if (new Date(row.expires_at).getTime() < Date.now()) {
      throw new Error("Code expired. Request a new one.");
    }
    if (row.attempts >= 5) throw new Error("Too many attempts. Request a new code.");

    const incoming = await sha256Hex(data.code);
    if (incoming !== row.code_hash) {
      await supabaseAdmin
        .from("phone_otps")
        .update({ attempts: row.attempts + 1 })
        .eq("id", row.id);
      throw new Error("Invalid code");
    }

    await supabaseAdmin
      .from("phone_otps")
      .update({ consumed_at: new Date().toISOString() })
      .eq("id", row.id);

    // Find or create the auth user keyed by a synthetic email.
    const email = syntheticEmail(data.phone);
    const { data: existing } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    let user = existing?.users.find((u) => u.email === email);
    if (!user) {
      const { data: created, error: createErr } =
        await supabaseAdmin.auth.admin.createUser({
          email,
          phone: data.phone,
          email_confirm: true,
          phone_confirm: true,
          user_metadata: { phone: data.phone, signup_method: "phone_otp" },
        });
      if (createErr || !created.user) {
        console.error("createUser failed", createErr);
        throw new Error("Could not create account");
      }
      user = created.user;
    }

    // Issue a magiclink the client can immediately consume to obtain a session.
    const { data: linkData, error: linkErr } =
      await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email,
      });
    if (linkErr || !linkData?.properties?.hashed_token) {
      console.error("generateLink failed", linkErr);
      throw new Error("Could not start session");
    }

    return {
      email,
      tokenHash: linkData.properties.hashed_token,
    };
  });
