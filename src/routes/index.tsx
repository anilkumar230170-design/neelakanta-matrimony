import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Shield, Heart, Sparkles, Star, Users, CheckCircle2, ArrowRight, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import heroImg from "@/assets/hero-couple.jpg";
import mandala from "@/assets/pattern-mandala.jpg";
import { stats, successStories } from "@/lib/mock-data";
import { ProfileCard } from "@/components/ProfileCard";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Neelakanta Matrimony — తెలుగువారి కోసం ప్రీమియం మ్యాట్రిమొనీ" },
      { name: "description", content: "12 లక్షల పైగా వెరిఫైడ్ ప్రొఫైల్స్. కులం, గోత్రం, నక్షత్రం ఆధారంగా జీవిత భాగస్వామిని కనుగొనండి." },
    ],
  }),
  component: Home,
});

function Home() {
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
              <Sparkles className="h-3.5 w-3.5" /> భారతదేశంలో నం.1 తెలుగు మ్యాట్రిమొనీ
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight font-telugu">
              మీ <span className="text-gold">జీవిత భాగస్వామిని</span><br />
              గౌరవంగా కనుగొనండి
            </h1>
            <p className="mt-5 text-lg text-primary-foreground/85 max-w-xl font-telugu leading-relaxed">
              నీలకంఠ మ్యాట్రిమొనీ — తెలుగు సంప్రదాయాలతో, ఆధునిక సాంకేతికతతో. వెరిఫైడ్ ప్రొఫైల్స్, జాతక మ్యాచ్, గోత్ర, నక్షత్ర వడపోతలతో.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="btn-gold px-7 py-3.5 rounded-full font-semibold inline-flex items-center gap-2 font-telugu">
                ఉచిత నమోదు <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/browse" className="px-7 py-3.5 rounded-full font-semibold border border-gold/60 text-gold hover:bg-gold/10 font-telugu">
                ప్రొఫైల్స్ చూడండి
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              {[
                { v: stats.totalProfiles, l: "ప్రొఫైల్స్" },
                { v: stats.verified, l: "వెరిఫైడ్" },
                { v: stats.successStories, l: "విజయగాథలు" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-2xl md:text-3xl font-bold text-gold">{s.v}</div>
                  <div className="text-xs text-primary-foreground/70 font-telugu mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Search card */}
          <div className="royal-card p-6 md:p-7 bg-card/95 backdrop-blur">
            <h3 className="font-display text-xl font-bold text-primary font-telugu">త్వరిత శోధన</h3>
            <p className="text-xs text-muted-foreground mt-1">Find your match in seconds</p>
            <div className="mt-5 space-y-4">
              <Field label="నేను వెతుకుతున్నాను">
                <select className="input-royal">
                  <option>వధువు (Bride)</option>
                  <option>వరుడు (Groom)</option>
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="వయస్సు"><select className="input-royal"><option>22 - 28</option><option>25 - 32</option><option>28 - 35</option></select></Field>
                <Field label="మతం"><select className="input-royal"><option>హిందూ</option></select></Field>
              </div>
              <Field label="కులం">
                <select className="input-royal"><option>ఏదైనా</option><option>కమ్మ</option><option>రెడ్డి</option><option>బ్రాహ్మణ</option><option>కాపు</option><option>రాజు</option><option>యాదవ</option></select>
              </Field>
              <Link to="/browse" className="btn-royal w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold font-telugu">
                <Search className="h-4 w-4" /> మ్యాచ్ కనుగొనండి
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeading eyebrow="ప్రత్యేకతలు" title="మీకు ఎందుకు నీలకంఠ?" subtitle="తెలుగు కుటుంబాల అవసరాలకు తగిన ప్రత్యేక ఫీచర్లు" />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Shield, t: "100% వెరిఫైడ్", d: "ఆధార్, ఫొటో, ఫోన్ — త్రి-స్థాయి ధృవీకరణ" },
            { icon: Star, t: "జాతక మ్యాచింగ్", d: "నక్షత్రం, రాశి, గోత్ర, మాంగల్యం వడపోతలు" },
            { icon: Users, t: "కుటుంబ నియంత్రణ", d: "తల్లిదండ్రులు, పెద్దలు కూడా చేరవచ్చు" },
            { icon: Award, t: "ప్రీమియం సహాయం", d: "వ్యక్తిగత మ్యాచ్‌మేకర్ సేవ" },
          ].map((f) => (
            <div key={f.t} className="royal-card p-6 text-center group hover:-translate-y-1 transition-transform">
              <div className="mx-auto h-14 w-14 rounded-2xl btn-royal flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-primary font-telugu">{f.t}</h3>
              <p className="text-sm text-muted-foreground mt-2 font-telugu">{f.d}</p>
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
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mt-1 font-telugu">కొత్త ప్రొఫైల్స్</h2>
            </div>
            <Link to="/browse" className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1 font-telugu">
              అన్నీ చూడండి <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground font-telugu">త్వరలో కొత్త ప్రొఫైల్స్ వస్తాయి. <Link to="/register" className="text-primary hover:underline">మొదట మీరే నమోదు అవ్వండి</Link></div>
            ) : featured.map((p) => <ProfileCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeading eyebrow="ఎలా పని చేస్తుంది" title="3 సులువైన దశలు" subtitle="" />
        <div className="mt-12 grid md:grid-cols-3 gap-6 relative">
          {[
            { n: "01", t: "ఉచిత నమోదు", d: "మీ ప్రొఫైల్‌ని 5 నిమిషాల్లో సృష్టించండి" },
            { n: "02", t: "మ్యాచ్‌లు చూడండి", d: "మీకు సరిపోయే వెరిఫైడ్ ప్రొఫైల్‌లను బ్రౌజ్ చేయండి" },
            { n: "03", t: "కనెక్ట్ అవ్వండి", d: "ఆసక్తి పంపండి, చాట్ చేయండి, మీ భాగస్వామిని కలవండి" },
          ].map((s) => (
            <div key={s.n} className="royal-card p-8 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 font-display text-8xl font-bold text-gold/20 select-none">{s.n}</div>
              <div className="relative">
                <CheckCircle2 className="h-7 w-7 text-gold mb-3" />
                <h3 className="font-display text-xl font-bold text-primary font-telugu">{s.t}</h3>
                <p className="text-sm text-muted-foreground mt-2 font-telugu">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SUCCESS STORIES */}
      <section className="relative py-20 overflow-hidden">
        <img src={mandala} alt="" width={1024} height={1024} loading="lazy" className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-10" />
        <div className="relative mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="విజయగాథలు" title="మా జంటల కథలు" subtitle="నీలకంఠ ద్వారా కలిసిన వేలాది జంటల్లో కొందరు" />
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {successStories.map((s) => (
              <div key={s.id} className="royal-card p-6">
                <div className="flex gap-1 text-gold mb-3">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="text-sm leading-relaxed text-foreground/85 font-telugu">"{s.quote}"</p>
                <div className="divider-gold my-4" />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-primary font-telugu">{s.names}</div>
                    <div className="text-xs text-muted-foreground font-telugu">{s.location}</div>
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
            <h2 className="font-display text-3xl md:text-5xl font-bold mt-4 font-telugu">మీ శుభ ముహూర్తం ఈరోజే ప్రారంభించండి</h2>
            <p className="mt-3 text-primary-foreground/85 max-w-2xl mx-auto font-telugu">ఉచితంగా నమోదు చేసుకోండి. వేలాది వెరిఫైడ్ ప్రొఫైల్స్‌ని ఇప్పుడే చూడండి.</p>
            <Link to="/register" className="btn-gold inline-flex items-center gap-2 mt-7 px-8 py-4 rounded-full font-semibold font-telugu">
              ఇప్పుడే నమోదు చేసుకోండి <ArrowRight className="h-4 w-4" />
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
      <span className="text-xs font-semibold text-foreground/80 font-telugu">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="text-xs uppercase tracking-[0.3em] text-gold font-semibold font-telugu">{eyebrow}</div>
      <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mt-2 font-telugu">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground font-telugu">{subtitle}</p>}
      <div className="divider-gold w-32 mx-auto mt-5" />
    </div>
  );
}
