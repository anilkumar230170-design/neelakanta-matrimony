import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Shield, Heart, Sparkles, Star, Users, CheckCircle2, ArrowRight, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import heroImg from "@/assets/hero-couple.jpg";
import mandala from "@/assets/pattern-mandala.jpg";
import shivaBlessing from "@/assets/shiva-blessing.png";
import { stats, successStories } from "@/lib/mock-data";
import { ProfileCard } from "@/components/ProfileCard";
import { supabase } from "@/integrations/supabase/client";
import { PUBLIC_PROFILE_COLS } from "@/lib/constants";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Neelakanta Matrimony — Premium Telugu Matrimony" },
      { name: "description", content: "Over 1.2M verified profiles. Find your life partner by caste, gotra, and nakshatra. తెలుగువారి కోసం ప్రీమియం మ్యాట్రిమొనీ." },
    ],
  }),
  component: Home,
});

function Home() {
  const { t } = useLang();
  const { data: featured = [] } = useQuery({
    queryKey: ["featured-profiles"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select(PUBLIC_PROFILE_COLS).eq("profile_complete", true).order("last_seen", { ascending: false }).limit(4);
      return data ?? [];
    },
  });
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <img src={heroImg} alt="Telugu wedding couple" width={1920} height={1080} className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32 grid lg:grid-cols-2 gap-10 items-center">
          <div className="text-primary-foreground">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-semibold mb-5">
              <Sparkles className="h-3.5 w-3.5" /> {t("భారతదేశంలో నం.1 తెలుగు మ్యాట్రిమొనీ", "India's #1 Telugu Matrimony")}
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">
              {t(
                <>మీ <span className="text-gold">జీవిత భాగస్వామిని</span><br />గౌరవంగా కనుగొనండి</>,
                <>Find your <span className="text-gold">life partner</span><br />with dignity</>
              )}
            </h1>
            <p className="mt-5 text-lg text-primary-foreground/85 max-w-xl leading-relaxed">
              {t(
                "నీలకంఠ మ్యాట్రిమొనీ — తెలుగు సంప్రదాయాలతో, ఆధునిక సాంకేతికతతో. వెరిఫైడ్ ప్రొఫైల్స్, జాతక మ్యాచ్, గోత్ర, నక్షత్ర వడపోతలతో.",
                "Neelakanta Matrimony — Telugu tradition with modern technology. Verified profiles, horoscope match, gotra & nakshatra filters."
              )}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="btn-gold px-7 py-3.5 rounded-full font-semibold inline-flex items-center gap-2">
                {t("ఉచిత నమోదు", "Free Sign Up")} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/browse" className="px-7 py-3.5 rounded-full font-semibold border border-gold/60 text-gold hover:bg-gold/10">
                {t("ప్రొఫైల్స్ చూడండి", "Browse Profiles")}
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              {[
                { v: stats.totalProfiles, te: "ప్రొఫైల్స్", en: "Profiles" },
                { v: stats.verified, te: "వెరిఫైడ్", en: "Verified" },
                { v: stats.successStories, te: "విజయగాథలు", en: "Success Stories" },
              ].map((s) => (
                <div key={s.en}>
                  <div className="font-display text-2xl md:text-3xl font-bold text-gold">{s.v}</div>
                  <div className="text-xs text-primary-foreground/70 mt-1">{t(s.te, s.en)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Search card */}
          <div className="royal-card p-6 md:p-7 bg-card/95 backdrop-blur">
            <h3 className="font-display text-xl font-bold text-primary">{t("త్వరిత శోధన", "Quick Search")}</h3>
            <p className="text-xs text-muted-foreground mt-1">Find your match in seconds</p>
            <div className="mt-5 space-y-4">
              <Field label={t("నేను వెతుకుతున్నాను", "I'm looking for")}>
                <select className="input-royal">
                  <option>{t("వధువు (Bride)", "Bride")}</option>
                  <option>{t("వరుడు (Groom)", "Groom")}</option>
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label={t("వయస్సు", "Age")}><select className="input-royal"><option>22 - 28</option><option>25 - 32</option><option>28 - 35</option></select></Field>
                <Field label={t("మతం", "Religion")}><select className="input-royal"><option>{t("హిందూ", "Hindu")}</option></select></Field>
              </div>
              <Field label={t("కులం", "Caste")}>
                <select className="input-royal"><option>{t("ఏదైనా", "Any")}</option><option>{t("కమ్మ", "Kamma")}</option><option>{t("రెడ్డి", "Reddy")}</option><option>{t("బ్రాహ్మణ", "Brahmin")}</option><option>{t("కాపు", "Kapu")}</option><option>{t("రాజు", "Raju")}</option><option>{t("యాదవ", "Yadav")}</option></select>
              </Field>
              <Link to="/browse" className="btn-royal w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold">
                <Search className="h-4 w-4" /> {t("మ్యాచ్ కనుగొనండి", "Find Match")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SHIVA BLESSING */}
      <section className="relative overflow-hidden border-y border-gold/20 bg-gradient-to-b from-secondary/40 via-background to-secondary/40">
        <img src={mandala} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-[0.06]" />
        <div className="relative mx-auto max-w-5xl px-6 py-16 md:py-20 flex flex-col md:flex-row items-center gap-10 md:gap-14">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-gold/20 blur-3xl scale-110" aria-hidden="true" />
            <img
              src={shivaBlessing}
              alt="Lord Shiva blessing"
              loading="lazy"
              width={260}
              height={260}
              className="relative h-48 w-48 md:h-64 md:w-64 object-contain drop-shadow-[0_8px_24px_rgba(180,120,40,0.25)]"
            />
          </div>
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold font-semibold">
              <Sparkles className="h-3.5 w-3.5" /> {t("ఆశీర్వాదం", "Blessing")}
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mt-3 leading-tight">
              {t("ఓం నమః శివాయ", "Om Namah Shivaya")}
            </h2>
            <div className="divider-gold w-24 mx-auto md:mx-0 mt-4" />
            <p className="mt-5 text-base md:text-lg text-foreground/85 leading-relaxed max-w-xl">
              {t(
                "పరమశివుని ఆశీస్సులతో — ప్రతి జంటకు సుఖ సంతోషాలు, ధర్మబద్ధమైన గృహస్థ జీవితం, శాశ్వత అనుబంధం కలగాలని మా ప్రార్థన.",
                "With the blessings of Lord Shiva — we pray that every couple be granted happiness, a righteous home, and an eternal bond."
              )}
            </p>
            <p className="mt-3 text-sm text-muted-foreground italic">
              "May Lord Shiva bless every union with harmony, devotion, and eternal love."
            </p>
          </div>
        </div>
      </section>


      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeading eyebrow={t("ప్రత్యేకతలు", "Features")} title={t("మీకు ఎందుకు నీలకంఠ?", "Why Neelakanta?")} subtitle={t("తెలుగు కుటుంబాల అవసరాలకు తగిన ప్రత్యేక ఫీచర్లు", "Features built for Telugu families")} />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Shield, te: "100% వెరిఫైడ్", en: "100% Verified", dTe: "ఆధార్, ఫొటో, ఫోన్ — త్రి-స్థాయి ధృవీకరణ", dEn: "Aadhaar, photo, phone — 3-step verification" },
            { icon: Star, te: "జాతక మ్యాచింగ్", en: "Horoscope Match", dTe: "నక్షత్రం, రాశి, గోత్ర, మాంగల్యం వడపోతలు", dEn: "Nakshatra, rasi, gotra & manglik filters" },
            { icon: Users, te: "కుటుంబ నియంత్రణ", en: "Family Friendly", dTe: "తల్లిదండ్రులు, పెద్దలు కూడా చేరవచ్చు", dEn: "Parents and elders can join too" },
            { icon: Award, te: "ప్రీమియం సహాయం", en: "Premium Assist", dTe: "వ్యక్తిగత మ్యాచ్‌మేకర్ సేవ", dEn: "Personal matchmaker service" },
          ].map((f) => (
            <div key={f.en} className="royal-card p-6 text-center group hover:-translate-y-1 transition-transform">
              <div className="mx-auto h-14 w-14 rounded-2xl btn-royal flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-primary">{t(f.te, f.en)}</h3>
              <p className="text-sm text-muted-foreground mt-2">{t(f.dTe, f.dEn)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PROFILES */}
      <section className="bg-secondary/40 py-20 border-y border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <div className="text-xs uppercase tracking-widest text-gold font-semibold">Featured</div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mt-1">{t("కొత్త ప్రొఫైల్స్", "New Profiles")}</h2>
            </div>
            <Link to="/browse" className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1">
              {t("అన్నీ చూడండి", "View all")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">{t("త్వరలో కొత్త ప్రొఫైల్స్ వస్తాయి.", "New profiles coming soon.")} <Link to="/register" className="text-primary hover:underline">{t("మొదట మీరే నమోదు అవ్వండి", "Be the first to register")}</Link></div>
            ) : featured.map((p) => <ProfileCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeading eyebrow={t("ఎలా పని చేస్తుంది", "How it works")} title={t("3 సులువైన దశలు", "3 Easy Steps")} subtitle="" />
        <div className="mt-12 grid md:grid-cols-3 gap-6 relative">
          {[
            { n: "01", te: "ఉచిత నమోదు", en: "Free Sign Up", dTe: "మీ ప్రొఫైల్‌ని 5 నిమిషాల్లో సృష్టించండి", dEn: "Create your profile in 5 minutes" },
            { n: "02", te: "మ్యాచ్‌లు చూడండి", en: "Browse Matches", dTe: "మీకు సరిపోయే వెరిఫైడ్ ప్రొఫైల్‌లను బ్రౌజ్ చేయండి", dEn: "Browse verified profiles that match you" },
            { n: "03", te: "కనెక్ట్ అవ్వండి", en: "Connect", dTe: "ఆసక్తి పంపండి, చాట్ చేయండి, మీ భాగస్వామిని కలవండి", dEn: "Send interest, chat, meet your partner" },
          ].map((s) => (
            <div key={s.n} className="royal-card p-8 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 font-display text-8xl font-bold text-gold/20 select-none">{s.n}</div>
              <div className="relative">
                <CheckCircle2 className="h-7 w-7 text-gold mb-3" />
                <h3 className="font-display text-xl font-bold text-primary">{t(s.te, s.en)}</h3>
                <p className="text-sm text-muted-foreground mt-2">{t(s.dTe, s.dEn)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SUCCESS STORIES */}
      <section className="relative py-20 overflow-hidden">
        <img src={mandala} alt="" width={1024} height={1024} loading="lazy" className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-10" />
        <div className="relative mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow={t("విజయగాథలు", "Success Stories")} title={t("మా జంటల కథలు", "Couples' Stories")} subtitle={t("నీలకంఠ ద్వారా కలిసిన వేలాది జంటల్లో కొందరు", "A few of the thousands who met through Neelakanta")} />
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {successStories.map((s) => (
              <div key={s.id} className="royal-card p-6">
                <div className="flex gap-1 text-gold mb-3">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="text-sm leading-relaxed text-foreground/85">"{s.quote}"</p>
                <div className="divider-gold my-4" />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-primary">{s.names}</div>
                    <div className="text-xs text-muted-foreground">{s.location}</div>
                  </div>
                  <div className="text-xs text-gold font-bold">{s.year}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-center text-primary-foreground" style={{ background: "var(--gradient-royal)" }}>
          <img src={mandala} alt="" width={1024} height={1024} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-15" />
          <div className="relative">
            <Heart className="h-10 w-10 text-gold mx-auto fill-current" />
            <h2 className="font-display text-3xl md:text-5xl font-bold mt-4">{t("మీ శుభ ముహూర్తం ఈరోజే ప్రారంభించండి", "Start your auspicious journey today")}</h2>
            <p className="mt-3 text-primary-foreground/85 max-w-2xl mx-auto">{t("ఉచితంగా నమోదు చేసుకోండి. వేలాది వెరిఫైడ్ ప్రొఫైల్స్‌ని ఇప్పుడే చూడండి.", "Register for free. Browse thousands of verified profiles now.")}</p>
            <Link to="/register" className="btn-gold inline-flex items-center gap-2 mt-7 px-8 py-4 rounded-full font-semibold">
              {t("ఇప్పుడే నమోదు చేసుకోండి", "Sign Up Now")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-foreground/80">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">{eyebrow}</div>
      <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mt-2">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
      <div className="divider-gold w-32 mx-auto mt-5" />
    </div>
  );
}
