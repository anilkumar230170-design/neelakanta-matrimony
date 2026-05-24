import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Heart, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { CASTES, CASTES_TELUGU, RELIGIONS, INCOME_RANGES, HEIGHTS } from "@/lib/constants";
import { NAKSHATRAS, NAKSHATRAS_TELUGU, RASIS, RASIS_TELUGU } from "@/lib/horoscope";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Free Sign Up — Neelakanta Matrimony" }] }),
  component: Register,
});

type FormData = {
  email: string; password: string; full_name: string; gender: "male" | "female"; phone: string;
  date_of_birth: string; height_cm: number; religion: string; caste: string; city: string; state: string;
  rasi: string; nakshatra: string; gotra: string; manglik: boolean; birth_time: string; birth_place: string;
  education: string; profession: string; annual_income: string; father_name: string; mother_name: string; about: string;
};

const initial: FormData = {
  email: "", password: "", full_name: "", gender: "male", phone: "",
  date_of_birth: "", height_cm: 170, religion: "Hindu", caste: "Kamma", city: "", state: "Telangana",
  rasi: "Mesha", nakshatra: "Ashwini", gotra: "", manglik: false, birth_time: "", birth_place: "",
  education: "", profession: "", annual_income: "₹5-10 LPA", father_name: "", mother_name: "", about: "",
};

function Register() {
  const { t, lang } = useLang();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initial);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const steps = [t("ఖాతా", "Account"), t("వ్యక్తిగత", "Personal"), t("జాతక", "Horoscope"), t("కుటుంబ", "Family")];

  useEffect(() => { if (user) navigate({ to: "/dashboard" }); }, [user, navigate]);

  const update = <K extends keyof FormData>(k: K, v: FormData[K]) => setData((d) => ({ ...d, [k]: v }));

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/profile-edit" });
    if (result.error) toast.error("Google sign-in failed");
  };

  const validateStep = () => {
    if (step === 0) {
      if (!data.email || !data.password || !data.full_name) { toast.error(t("అన్ని ఫీల్డ్‌లు పూరించండి", "Fill all fields")); return false; }
      if (data.password.length < 8) { toast.error(t("పాస్‌వర్డ్ కనీసం 8 అక్షరాలు", "Password at least 8 chars")); return false; }
    }
    if (step === 1 && !data.date_of_birth) { toast.error(t("పుట్టిన తేదీ నమోదు చేయండి", "Enter date of birth")); return false; }
    return true;
  };

  const next = () => { if (validateStep()) setStep(s => s + 1); };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setLoading(true);
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email, password: data.password,
      options: { emailRedirectTo: window.location.origin, data: { full_name: data.full_name, gender: data.gender } },
    });
    if (error) { setLoading(false); toast.error(error.message); return; }
    if (!authData.user) { setLoading(false); toast.error(t("నమోదు విఫలమైంది", "Registration failed")); return; }

    const { error: pe } = await supabase.from("profiles").update({
      full_name: data.full_name, phone: data.phone, gender: data.gender,
      date_of_birth: data.date_of_birth, height_cm: data.height_cm, religion: data.religion, caste: data.caste,
      city: data.city, state: data.state, rasi: data.rasi, nakshatra: data.nakshatra, gotra: data.gotra,
      manglik: data.manglik, birth_time: data.birth_time || null, birth_place: data.birth_place,
      education: data.education, profession: data.profession, annual_income: data.annual_income,
      father_name: data.father_name, mother_name: data.mother_name, about: data.about, profile_complete: true,
    }).eq("id", authData.user.id);

    setLoading(false);
    if (pe) { toast.error(t("ప్రొఫైల్ సేవ్ సమస్య: ", "Profile save error: ") + pe.message); return; }
    toast.success(t("నమోదు విజయవంతం!", "Registration successful!"));
    navigate({ to: "/dashboard" });
  };

  const sp = { data, update, t, lang };

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="text-center">
        <div className="h-14 w-14 rounded-full btn-royal mx-auto flex items-center justify-center"><Heart className="h-6 w-6 fill-current" /></div>
        <h1 className="font-display text-3xl font-bold text-primary mt-4">{t("ఉచిత నమోదు", "Free Sign Up")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("మీ సంపూర్ణ ప్రొఫైల్‌ని సృష్టించండి", "Create your complete profile")}</p>
      </div>

      {step === 0 && (
        <div className="mt-6">
          <button onClick={handleGoogle} className="w-full py-3 rounded-full border border-border font-semibold text-sm hover:bg-secondary">{t("Google తో నమోదు", "Sign up with Google")}</button>
          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="flex-1 h-px bg-border" /> {t("లేదా", "or")} <span className="flex-1 h-px bg-border" /></div>
        </div>
      )}

      <div className="mt-2 flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={s} className="flex-1 flex items-center">
            <div className={`flex flex-col items-center ${i <= step ? "" : "opacity-40"}`}>
              <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold ${i < step ? "bg-gold text-gold-foreground" : i === step ? "btn-royal" : "bg-secondary text-muted-foreground"}`}>
                {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className="text-[10px] mt-1 text-center">{s}</span>
            </div>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? "bg-gold" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <div className="royal-card p-7 mt-8">
        {step === 0 && <Step0 {...sp} />}
        {step === 1 && <Step1 {...sp} />}
        {step === 2 && <Step2 {...sp} />}
        {step === 3 && <Step3 {...sp} />}
        <div className="mt-7 flex justify-between gap-3">
          <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="px-5 py-2.5 rounded-full border border-border font-semibold text-sm disabled:opacity-40">{t("వెనుకకు", "Back")}</button>
          {step < steps.length - 1
            ? <button onClick={next} className="btn-royal px-7 py-2.5 rounded-full font-semibold text-sm">{t("తదుపరి", "Next")}</button>
            : <button onClick={handleSubmit} disabled={loading} className="btn-gold px-7 py-2.5 rounded-full font-semibold text-sm disabled:opacity-60">{loading ? "..." : t("నమోదు పూర్తి", "Finish")}</button>}
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-6">{t("ఇప్పటికే ఖాతా ఉందా?", "Already have an account?")} <Link to="/login" className="text-primary font-semibold hover:underline">{t("లాగిన్", "Login")}</Link></p>
    </div>
  );
}

type T = (te: string, en: string) => string;
type SP = { data: FormData; update: <K extends keyof FormData>(k: K, v: FormData[K]) => void; t: T; lang: "te" | "en" };
function Row({ children }: { children: React.ReactNode }) { return <div className="grid sm:grid-cols-2 gap-4">{children}</div>; }
function Lbl({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-xs font-semibold">{label}</span><div className="mt-1.5">{children}</div></label>;
}

function Step0({ data, update, t }: SP) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold text-primary">{t("ఖాతా సమాచారం", "Account Info")}</h2>
      <Row>
        <Lbl label={t("నేను", "I am")}><select className="input-royal" value={data.gender} onChange={(e) => update("gender", e.target.value as "male" | "female")}><option value="female">{t("వధువు", "Bride")}</option><option value="male">{t("వరుడు", "Groom")}</option></select></Lbl>
        <Lbl label={t("పూర్తి పేరు", "Full Name")}><input className="input-royal" value={data.full_name} onChange={(e) => update("full_name", e.target.value)} placeholder={t("మీ పేరు", "Your name")} /></Lbl>
      </Row>
      <Row>
        <Lbl label={t("ఇమెయిల్", "Email")}><input type="email" className="input-royal" value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="email@example.com" /></Lbl>
        <Lbl label={t("ఫోన్", "Phone")}><input className="input-royal" value={data.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91" /></Lbl>
      </Row>
      <Lbl label={t("పాస్‌వర్డ్ (కనీసం 8)", "Password (min 8)")}><input type="password" className="input-royal" value={data.password} onChange={(e) => update("password", e.target.value)} placeholder="••••••••" /></Lbl>
    </div>
  );
}
function Step1({ data, update, t, lang }: SP) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold text-primary">{t("వ్యక్తిగత వివరాలు", "Personal Details")}</h2>
      <Row>
        <Lbl label={t("పుట్టిన తేదీ", "Date of Birth")}><input type="date" className="input-royal" value={data.date_of_birth} onChange={(e) => update("date_of_birth", e.target.value)} /></Lbl>
        <Lbl label={t("ఎత్తు", "Height")}><select className="input-royal" value={data.height_cm} onChange={(e) => update("height_cm", Number(e.target.value))}>{HEIGHTS.map((h) => <option key={h.cm} value={h.cm}>{h.label}</option>)}</select></Lbl>
      </Row>
      <Row>
        <Lbl label={t("మతం", "Religion")}><select className="input-royal" value={data.religion} onChange={(e) => update("religion", e.target.value)}>{RELIGIONS.map(r => <option key={r}>{r}</option>)}</select></Lbl>
        <Lbl label={t("కులం", "Caste")}><select className="input-royal" value={data.caste} onChange={(e) => update("caste", e.target.value)}>{CASTES.map(c => <option key={c} value={c}>{lang === "te" ? (CASTES_TELUGU[c] ?? c) : c}</option>)}</select></Lbl>
      </Row>
      <Row>
        <Lbl label={t("నగరం", "City")}><input className="input-royal" value={data.city} onChange={(e) => update("city", e.target.value)} placeholder={t("హైదరాబాద్", "Hyderabad")} /></Lbl>
        <Lbl label={t("రాష్ట్రం", "State")}><input className="input-royal" value={data.state} onChange={(e) => update("state", e.target.value)} /></Lbl>
      </Row>
    </div>
  );
}
function Step2({ data, update, t, lang }: SP) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold text-primary">{t("జాతక వివరాలు", "Horoscope Details")}</h2>
      <Row>
        <Lbl label={t("రాశి", "Rasi")}><select className="input-royal" value={data.rasi} onChange={(e) => update("rasi", e.target.value)}>{RASIS.map(r => <option key={r} value={r}>{lang === "te" ? RASIS_TELUGU[r] : r}</option>)}</select></Lbl>
        <Lbl label={t("నక్షత్రం", "Nakshatra")}><select className="input-royal" value={data.nakshatra} onChange={(e) => update("nakshatra", e.target.value)}>{NAKSHATRAS.map(n => <option key={n} value={n}>{lang === "te" ? NAKSHATRAS_TELUGU[n] : n}</option>)}</select></Lbl>
      </Row>
      <Row>
        <Lbl label={t("గోత్రం", "Gotra")}><input className="input-royal" value={data.gotra} onChange={(e) => update("gotra", e.target.value)} placeholder="Bharadwaja" /></Lbl>
        <Lbl label={t("మాంగల్యం", "Manglik")}><select className="input-royal" value={data.manglik ? "yes" : "no"} onChange={(e) => update("manglik", e.target.value === "yes")}><option value="no">{t("కాదు", "No")}</option><option value="yes">{t("అవును", "Yes")}</option></select></Lbl>
      </Row>
      <Row>
        <Lbl label={t("జన్మ సమయం", "Birth Time")}><input type="time" className="input-royal" value={data.birth_time} onChange={(e) => update("birth_time", e.target.value)} /></Lbl>
        <Lbl label={t("జన్మ స్థలం", "Birth Place")}><input className="input-royal" value={data.birth_place} onChange={(e) => update("birth_place", e.target.value)} /></Lbl>
      </Row>
    </div>
  );
}
function Step3({ data, update, t }: SP) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold text-primary">{t("కుటుంబ & వృత్తి", "Family & Career")}</h2>
      <Row>
        <Lbl label={t("చదువు", "Education")}><input className="input-royal" value={data.education} onChange={(e) => update("education", e.target.value)} placeholder="B.Tech, MBA..." /></Lbl>
        <Lbl label={t("వృత్తి", "Profession")}><input className="input-royal" value={data.profession} onChange={(e) => update("profession", e.target.value)} placeholder="Software Engineer" /></Lbl>
      </Row>
      <Row>
        <Lbl label={t("వార్షిక ఆదాయం", "Annual Income")}><select className="input-royal" value={data.annual_income} onChange={(e) => update("annual_income", e.target.value)}>{INCOME_RANGES.map(i => <option key={i}>{i}</option>)}</select></Lbl>
        <Lbl label={t("తండ్రి పేరు", "Father's Name")}><input className="input-royal" value={data.father_name} onChange={(e) => update("father_name", e.target.value)} /></Lbl>
      </Row>
      <Lbl label={t("తల్లి పేరు", "Mother's Name")}><input className="input-royal" value={data.mother_name} onChange={(e) => update("mother_name", e.target.value)} /></Lbl>
      <Lbl label={t("మీ గురించి", "About you")}><textarea rows={4} className="input-royal" value={data.about} onChange={(e) => update("about", e.target.value)} placeholder={t("మీ గురించి...", "About yourself...")} /></Lbl>
    </div>
  );
}
