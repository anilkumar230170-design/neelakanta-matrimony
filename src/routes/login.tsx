import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Heart, Mail, Lock, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/i18n";
import { sendPhoneOtp, verifyPhoneOtp } from "@/lib/phone-otp.functions";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({ redirect: (s.redirect as string) || "/dashboard" }),
  head: () => ({ meta: [{ title: "Login — Neelakanta Matrimony" }] }),
  component: Login,
});

function Login() {
  const { t } = useLang();
  const navigate = useNavigate();
  const go = (to: string) => navigate({ to });
  const { redirect } = Route.useSearch();
  const { user } = useAuth();
  const sendOtpFn = useServerFn(sendPhoneOtp);
  const verifyOtpFn = useServerFn(verifyPhoneOtp);
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) go(redirect); }, [user, redirect]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { toast.error(error.message === "Invalid login credentials" ? t("ఇమెయిల్ లేదా పాస్‌వర్డ్ తప్పు", "Invalid email or password") : error.message); return; }
    toast.success(t("స్వాగతం!", "Welcome!"));
    go(redirect);
  };

  const normalizePhone = (p: string) => {
    const trimmed = p.trim().replace(/\s|-/g, "");
    return trimmed.startsWith("+") ? trimmed : `+91${trimmed}`;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) { toast.error(t("ఫోన్ నంబర్ నమోదు చేయండి", "Enter phone number")); return; }
    setLoading(true);
    try {
      await sendOtpFn({ data: { phone: normalizePhone(phone) } });
      setOtpSent(true);
      toast.success(t("OTP పంపబడింది", "OTP sent"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { tokenHash } = await verifyOtpFn({
        data: { phone: normalizePhone(phone), code: otp },
      });
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: "magiclink",
      });
      if (error) throw error;
      toast.success(t("స్వాగతం!", "Welcome!"));
      go(redirect);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + redirect });
    if (result.error) toast.error("Google sign-in failed");
  };

  const handleReset = async () => {
    if (!email) { toast.error(t("ముందుగా ఇమెయిల్ నమోదు చేయండి", "Enter email first")); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    if (error) toast.error(error.message); else toast.success(t("పాస్‌వర్డ్ రీసెట్ లింక్ పంపబడింది", "Password reset link sent"));
  };

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <div className="royal-card p-8">
        <div className="text-center">
          <div className="h-14 w-14 rounded-full btn-royal mx-auto flex items-center justify-center"><Heart className="h-6 w-6 fill-current" /></div>
          <h1 className="font-display text-2xl font-bold text-primary mt-4">{t("తిరిగి స్వాగతం", "Welcome back")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("మీ ఖాతాలోకి లాగిన్ అవ్వండి", "Log in to your account")}</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2 p-1 bg-secondary rounded-full text-sm font-semibold">
          <button onClick={() => { setMode("email"); setOtpSent(false); }} className={`py-2 rounded-full transition-colors ${mode === "email" ? "bg-background text-primary shadow-sm" : "text-muted-foreground"}`}>{t("ఇమెయిల్", "Email")}</button>
          <button onClick={() => { setMode("phone"); setOtpSent(false); }} className={`py-2 rounded-full transition-colors ${mode === "phone" ? "bg-background text-primary shadow-sm" : "text-muted-foreground"}`}>{t("ఫోన్ OTP", "Phone OTP")}</button>
        </div>

        {mode === "email" && (
          <form className="mt-6 space-y-4" onSubmit={handleEmailLogin}>
            <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("ఇమెయిల్", "Email")} className="input-royal pl-10" /></div>
            <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("పాస్‌వర్డ్", "Password")} className="input-royal pl-10" /></div>
            <div className="flex items-center justify-end text-xs"><button type="button" onClick={handleReset} className="text-primary hover:underline">{t("పాస్‌వర్డ్ మర్చిపోయారా?", "Forgot password?")}</button></div>
            <button disabled={loading} className="btn-royal w-full py-3 rounded-full font-semibold disabled:opacity-60">{loading ? "..." : t("లాగిన్", "Login")}</button>
          </form>
        )}

        {mode === "phone" && !otpSent && (
          <form className="mt-6 space-y-4" onSubmit={handleSendOtp}>
            <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t("ఫోన్ (+91...)", "Phone (+91...)")} className="input-royal pl-10" /></div>
            <p className="text-xs text-muted-foreground">{t("మేము SMS ద్వారా OTP పంపుతాము", "We'll send an OTP via SMS")}</p>
            <button disabled={loading} className="btn-royal w-full py-3 rounded-full font-semibold disabled:opacity-60">{loading ? "..." : t("OTP పంపండి", "Send OTP")}</button>
          </form>
        )}

        {mode === "phone" && otpSent && (
          <form className="mt-6 space-y-4" onSubmit={handleVerifyOtp}>
            <p className="text-sm text-muted-foreground text-center">{t("OTP పంపబడింది", "OTP sent to")} <span className="font-semibold text-foreground">{normalizePhone(phone)}</span></p>
            <input type="text" inputMode="numeric" maxLength={6} required value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" className="input-royal text-center tracking-[0.5em] text-lg font-bold" />
            <button disabled={loading} className="btn-royal w-full py-3 rounded-full font-semibold disabled:opacity-60">{loading ? "..." : t("ధృవీకరించండి", "Verify & Login")}</button>
            <button type="button" onClick={() => setOtpSent(false)} className="w-full text-xs text-primary hover:underline">{t("నంబర్ మార్చండి", "Change number")}</button>
          </form>
        )}

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><span className="flex-1 h-px bg-border" /> {t("లేదా", "or")} <span className="flex-1 h-px bg-border" /></div>

        <button onClick={handleGoogle} className="w-full py-3 rounded-full border border-border font-semibold text-sm hover:bg-secondary">{t("Google తో కొనసాగండి", "Continue with Google")}</button>

        <p className="text-center text-sm text-muted-foreground mt-6">{t("ఖాతా లేదా?", "No account?")} <Link to="/register" className="text-primary font-semibold hover:underline">{t("ఉచితంగా నమోదు చేసుకోండి", "Sign up free")}</Link></p>
      </div>
    </div>
  );
}
