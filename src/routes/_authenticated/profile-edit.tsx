import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Upload, Camera, Save, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { CASTES, HEIGHTS, INCOME_RANGES, MARITAL, RELIGIONS } from "@/lib/constants";
import { NAKSHATRAS, NAKSHATRAS_TELUGU, RASIS, RASIS_TELUGU } from "@/lib/horoscope";
import { PHOTO_BUCKET, photoStoragePath, resolvePhotoUrl } from "@/lib/photo";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/profile-edit")({
  head: () => ({ meta: [{ title: "My Profile — Neelakanta Matrimony" }] }),
  component: ProfileEdit,
});

type FormState = Record<string, any>;

function ProfileEdit() {
  const { t, lang } = useLang();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [form, setForm] = useState<FormState>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["me-edit", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.rpc("get_my_profile")).data,
  });

  useEffect(() => {
    if (profile) {
      setForm(profile);
      resolvePhotoUrl(profile.photo_url).then(setPhotoPreview);
    }
  }, [profile]);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const onPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) { toast.error(t("ఫైల్ 5MB కంటే తక్కువ ఉండాలి", "File must be under 5MB")); return; }
    setUploading(true);
    const path = photoStoragePath(user.id, file);
    const { error: upErr } = await supabase.storage.from(PHOTO_BUCKET).upload(path, file, { upsert: true, contentType: file.type });
    if (upErr) { toast.error(upErr.message); setUploading(false); return; }
    if (form.photo_url && !/^https?:/i.test(form.photo_url) && form.photo_url !== path) {
      await supabase.storage.from(PHOTO_BUCKET).remove([form.photo_url]);
    }
    const { error: dbErr } = await supabase.from("profiles").update({ photo_url: path }).eq("id", user.id);
    if (dbErr) { toast.error(dbErr.message); setUploading(false); return; }
    set("photo_url", path);
    const signed = await resolvePhotoUrl(path);
    setPhotoPreview(signed);
    setUploading(false);
    qc.invalidateQueries({ queryKey: ["me-edit", user.id] });
    qc.invalidateQueries({ queryKey: ["me", user.id] });
    qc.invalidateQueries({ queryKey: ["profile", user.id] });
    toast.success(t("ఫొటో అప్‌లోడ్ అయింది ✓", "Photo uploaded ✓"));
  };

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const payload: any = {
      full_name: form.full_name,
      full_name_telugu: form.full_name_telugu,
      phone: form.phone,
      gender: form.gender,
      date_of_birth: form.date_of_birth || null,
      birth_time: form.birth_time || null,
      birth_place: form.birth_place,
      height_cm: form.height_cm ? Number(form.height_cm) : null,
      marital_status: form.marital_status,
      religion: form.religion,
      caste: form.caste,
      sub_caste: form.sub_caste,
      gotra: form.gotra,
      rasi: form.rasi,
      nakshatra: form.nakshatra,
      nakshatra_pada: form.nakshatra_pada ? Number(form.nakshatra_pada) : null,
      manglik: !!form.manglik,
      education: form.education,
      profession: form.profession,
      annual_income: form.annual_income,
      employed_in: form.employed_in,
      city: form.city,
      state: form.state,
      country: form.country,
      father_name: form.father_name,
      mother_name: form.mother_name,
      family_type: form.family_type,
      family_status: form.family_status,
      siblings: form.siblings,
      about: form.about,
      profile_complete: true,
    };
    const { error } = await supabase.from("profiles").update(payload).eq("id", user.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(t("ప్రొఫైల్ సేవ్ చేయబడింది ✓", "Profile saved ✓"));
    qc.invalidateQueries();
  };

  if (isLoading) return <div className="py-24 text-center"><Loader2 className="h-8 w-8 text-gold animate-spin mx-auto" /></div>;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="text-center mb-8">
        <h1 className="font-display text-4xl text-primary">{t("నా ప్రొఫైల్", "My Profile")}</h1>
        <div className="divider-gold w-24 mx-auto mt-3" />
        <p className="mt-3 text-sm text-muted-foreground">{t("మీ వివరాలు పూర్తి చేయండి. ఫొటో ఆసక్తి అంగీకరించిన తర్వాతే ఇతరులకు కనిపిస్తుంది.", "Complete your details. Photo is visible only after an interest is accepted.")}</p>
      </div>

      <div className="royal-card p-6 md:p-8 space-y-8">
        <section>
          <h2 className="font-display text-xl text-primary mb-4 flex items-center gap-2">
            <Camera className="h-5 w-5 text-gold" /> {t("ఫొటో", "Photo")}
            <span className="ml-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-secondary text-foreground/70 px-2 py-0.5 rounded-full"><Lock className="h-3 w-3" /> Private</span>
          </h2>
          <div className="flex items-center gap-5">
            <div className="h-28 w-28 rounded-full overflow-hidden bg-secondary flex items-center justify-center border-2 border-gold/40">
              {photoPreview ? <img src={photoPreview} alt="me" className="h-full w-full object-cover" /> : <Camera className="h-8 w-8 text-muted-foreground" />}
            </div>
            <label className="btn-royal px-5 py-2.5 rounded-full text-sm font-semibold cursor-pointer inline-flex items-center gap-2">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {photoPreview ? t("ఫొటో మార్చండి", "Change Photo") : t("ఫొటో అప్‌లోడ్", "Upload Photo")}
              <input type="file" accept="image/*" className="hidden" onChange={onPhoto} disabled={uploading} />
            </label>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{t("JPG/PNG, గరిష్ఠంగా 5MB. ఆసక్తి accept చేసిన సభ్యులు మాత్రమే చూడగలరు.", "JPG/PNG, max 5MB. Visible only to members whose interest you've accepted.")}</p>
        </section>

        <Section title={t("ప్రాథమిక వివరాలు", "Basic Details")}>
          <Field label={t("పూర్తి పేరు (English)", "Full Name (English)")}><input className="input" value={form.full_name ?? ""} onChange={(e) => set("full_name", e.target.value)} /></Field>
          <Field label={t("పేరు (తెలుగు)", "Name (Telugu)")}><input className="input" value={form.full_name_telugu ?? ""} onChange={(e) => set("full_name_telugu", e.target.value)} /></Field>
          <Field label={t("ఫోన్", "Phone")}><input className="input" value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} /></Field>
          <Field label={t("లింగం", "Gender")}>
            <select className="input" value={form.gender ?? ""} onChange={(e) => set("gender", e.target.value)}>
              <option value="male">{t("పురుషుడు", "Male")}</option><option value="female">{t("స్త్రీ", "Female")}</option>
            </select>
          </Field>
          <Field label={t("పుట్టిన తేదీ", "Date of Birth")}><input type="date" className="input" value={form.date_of_birth ?? ""} onChange={(e) => set("date_of_birth", e.target.value)} /></Field>
          <Field label={t("ఎత్తు", "Height")}>
            <select className="input" value={form.height_cm ?? ""} onChange={(e) => set("height_cm", e.target.value)}>
              <option value="">—</option>
              {HEIGHTS.map((h) => <option key={h.cm} value={h.cm}>{h.label}</option>)}
            </select>
          </Field>
          <Field label={t("వైవాహిక స్థితి", "Marital Status")}>
            <select className="input" value={form.marital_status ?? "never_married"} onChange={(e) => set("marital_status", e.target.value)}>
              {MARITAL.map((m) => <option key={m.v} value={m.v}>{m.l}</option>)}
            </select>
          </Field>
          <Field label={t("మతం", "Religion")}>
            <select className="input" value={form.religion ?? "Hindu"} onChange={(e) => set("religion", e.target.value)}>
              {RELIGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          <Field label={t("కులం", "Caste")}>
            <select className="input" value={form.caste ?? ""} onChange={(e) => set("caste", e.target.value)}>
              <option value="">—</option>{CASTES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label={t("ఉప కులం", "Sub-caste")}><input className="input" value={form.sub_caste ?? ""} onChange={(e) => set("sub_caste", e.target.value)} /></Field>
          <Field label={t("గోత్రం", "Gotra")}><input className="input" value={form.gotra ?? ""} onChange={(e) => set("gotra", e.target.value)} /></Field>
        </Section>

        <Section title={t("జాతక వివరాలు", "Horoscope Details")}>
          <Field label={t("రాశి", "Rasi")}>
            <select className="input" value={form.rasi ?? ""} onChange={(e) => set("rasi", e.target.value)}>
              <option value="">—</option>{RASIS.map((r) => <option key={r} value={r}>{lang === "te" ? RASIS_TELUGU[r] : r}</option>)}
            </select>
          </Field>
          <Field label={t("నక్షత్రం", "Nakshatra")}>
            <select className="input" value={form.nakshatra ?? ""} onChange={(e) => set("nakshatra", e.target.value)}>
              <option value="">—</option>{NAKSHATRAS.map((n) => <option key={n} value={n}>{lang === "te" ? NAKSHATRAS_TELUGU[n] : n}</option>)}
            </select>
          </Field>
          <Field label={t("పాదం", "Pada")}>
            <select className="input" value={form.nakshatra_pada ?? ""} onChange={(e) => set("nakshatra_pada", e.target.value)}>
              <option value="">—</option>{[1,2,3,4].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </Field>
          <Field label={t("పుట్టిన సమయం", "Birth Time")}><input type="time" className="input" value={form.birth_time ?? ""} onChange={(e) => set("birth_time", e.target.value)} /></Field>
          <Field label={t("పుట్టిన ప్రదేశం", "Birth Place")}><input className="input" value={form.birth_place ?? ""} onChange={(e) => set("birth_place", e.target.value)} /></Field>
          <Field label={t("మాంగల్యం", "Manglik")}>
            <label className="flex items-center gap-2 mt-2 text-sm">
              <input type="checkbox" checked={!!form.manglik} onChange={(e) => set("manglik", e.target.checked)} /> {t("అవును", "Yes")}
            </label>
          </Field>
        </Section>

        <Section title={t("విద్య & ఉద్యోగం", "Education & Career")}>
          <Field label={t("చదువు", "Education")}><input className="input" value={form.education ?? ""} onChange={(e) => set("education", e.target.value)} /></Field>
          <Field label={t("వృత్తి", "Profession")}><input className="input" value={form.profession ?? ""} onChange={(e) => set("profession", e.target.value)} /></Field>
          <Field label={t("ఆదాయం", "Income")}>
            <select className="input" value={form.annual_income ?? ""} onChange={(e) => set("annual_income", e.target.value)}>
              <option value="">—</option>{INCOME_RANGES.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </Field>
          <Field label={t("ఉద్యోగ రకం", "Employment Type")}><input className="input" value={form.employed_in ?? ""} onChange={(e) => set("employed_in", e.target.value)} placeholder="Private / Govt / Business" /></Field>
        </Section>

        <Section title={t("నివాసం", "Location")}>
          <Field label={t("నగరం", "City")}><input className="input" value={form.city ?? ""} onChange={(e) => set("city", e.target.value)} /></Field>
          <Field label={t("రాష్ట్రం", "State")}><input className="input" value={form.state ?? ""} onChange={(e) => set("state", e.target.value)} /></Field>
          <Field label={t("దేశం", "Country")}><input className="input" value={form.country ?? "India"} onChange={(e) => set("country", e.target.value)} /></Field>
        </Section>

        <Section title={t("కుటుంబ వివరాలు", "Family Details")}>
          <Field label={t("తండ్రి పేరు", "Father's Name")}><input className="input" value={form.father_name ?? ""} onChange={(e) => set("father_name", e.target.value)} /></Field>
          <Field label={t("తల్లి పేరు", "Mother's Name")}><input className="input" value={form.mother_name ?? ""} onChange={(e) => set("mother_name", e.target.value)} /></Field>
          <Field label={t("కుటుంబ రకం", "Family Type")}>
            <select className="input" value={form.family_type ?? ""} onChange={(e) => set("family_type", e.target.value)}>
              <option value="">—</option><option>Nuclear</option><option>Joint</option>
            </select>
          </Field>
          <Field label={t("కుటుంబ స్థితి", "Family Status")}>
            <select className="input" value={form.family_status ?? ""} onChange={(e) => set("family_status", e.target.value)}>
              <option value="">—</option><option>Middle Class</option><option>Upper Middle</option><option>Affluent</option><option>Rich</option>
            </select>
          </Field>
          <Field label={t("తోబుట్టువులు", "Siblings")}><input className="input" value={form.siblings ?? ""} onChange={(e) => set("siblings", e.target.value)} placeholder="1 brother, 1 sister" /></Field>
        </Section>

        <Section title={t("మీ గురించి", "About You")} cols={1}>
          <Field label={t("పరిచయం", "Introduction")} full>
            <textarea className="input min-h-[120px]" value={form.about ?? ""} onChange={(e) => set("about", e.target.value)} placeholder={t("మీ గురించి, మీ ఆశలు, మీ ఆశించే భాగస్వామి...", "About you, your hopes, your ideal partner...")} />
          </Field>
        </Section>

        <div className="flex justify-end pt-2">
          <button onClick={save} disabled={saving} className="btn-royal px-8 py-3 rounded-full font-semibold flex items-center gap-2 disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} {t("సేవ్ చేయండి", "Save")}
          </button>
        </div>
      </div>

      <style>{`.input{width:100%;padding:0.6rem 0.85rem;border:1px solid hsl(var(--border));border-radius:0.5rem;background:hsl(var(--background));font-size:0.875rem;outline:none}.input:focus{border-color:hsl(var(--primary))}`}</style>
    </div>
  );
}

function Section({ title, children, cols = 2 }: { title: string; children: React.ReactNode; cols?: 1 | 2 }) {
  return (
    <section>
      <h2 className="font-display text-xl text-primary mb-4">{title}</h2>
      <div className={`grid ${cols === 2 ? "md:grid-cols-2" : "grid-cols-1"} gap-4`}>{children}</div>
    </section>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block text-sm ${full ? "md:col-span-2" : ""}`}>
      <span className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</span>
      {children}
    </label>
  );
}
