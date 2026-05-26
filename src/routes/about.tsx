import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Shield, Users, Award, Mail, Phone, MapPin, History } from "lucide-react";
import { useLang } from "@/lib/i18n";
import ourHistoryImg from "@/assets/our-history-shiva.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Neelakanta Matrimony" },
      { name: "description", content: "Neelakanta Matrimony — trusted Telugu matchmaking since 2026." },
    ],
  }),
  component: About,
});

function About() {
  const { t, lang } = useLang();
  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold font-semibold">
          <Heart className="h-3.5 w-3.5 fill-current" /> {t("మా గురించి", "About Us")}
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mt-3">{t("నీలకంఠ మ్యాట్రిమొనీ", "Neelakanta Matrimony")}</h1>
        <div className="divider-gold w-32 mx-auto mt-5" />
        <p className="mt-6 text-lg text-foreground/85 max-w-3xl mx-auto leading-relaxed">
          {t(
            "2026 నుండి తెలుగు కుటుంబాలకు సేవ చేస్తున్నాము. మా లక్ష్యం — ప్రతి యువతీ యువకుడికి తగిన జీవిత భాగస్వామిని గౌరవంగా, నమ్మదగిన విధానంలో కనుగొనడం.",
            "Serving Telugu families since 2026. Our mission — to help every young woman and man find a suitable life partner with dignity and trust."
          )}
        </p>
      </div>

      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { icon: Users, k: "0", te: "ప్రొఫైల్స్", en: "Profiles" },
          { icon: Shield, k: "0", te: "వెరిఫైడ్", en: "Verified" },
          { icon: Heart, k: "0", te: "విజయగాథలు", en: "Success Stories" },
          { icon: Award, k: "0", te: "సంవత్సరాల అనుభవం", en: "Years of Experience" },
        ].map((s) => (
          <div key={s.en} className="royal-card p-6 text-center">
            <s.icon className="h-8 w-8 text-gold mx-auto" />
            <div className="font-display text-3xl font-bold text-primary mt-3">{s.k}</div>
            <div className="text-sm text-muted-foreground">{t(s.te, s.en)}</div>
          </div>
        ))}
      </div>

      <div className="mt-14 royal-card p-8 md:p-10">
        <h2 className="font-display text-2xl font-bold text-primary">{t("మా విలువలు", "Our Values")}</h2>
        <div className="divider-gold w-20 mt-2 mb-5" />
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          {[
            { te: "నమ్మకం", en: "Trust", dTe: "ప్రతి ప్రొఫైల్‌ని మేము ధృవీకరిస్తాము. మీ గోప్యత మాకు ముఖ్యం.", dEn: "We verify every profile. Your privacy matters to us." },
            { te: "సంప్రదాయం", en: "Tradition", dTe: "తెలుగు సంస్కృతి, కుటుంబ విలువలను గౌరవిస్తాము.", dEn: "We respect Telugu culture and family values." },
            { te: "ఆధునికత", en: "Modern", dTe: "AI ఆధారిత మ్యాచింగ్, సురక్షిత చాట్, మొబైల్ స్నేహపూర్వకం.", dEn: "AI-powered matching, secure chat, mobile friendly." },
          ].map((v) => (
            <div key={v.en}>
              <h3 className="font-display font-bold text-lg text-primary">{t(v.te, v.en)}</h3>
              <p className="mt-2 text-foreground/80 leading-relaxed">{t(v.dTe, v.dEn)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14 royal-card p-8 md:p-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gold/15 flex items-center justify-center">
            <History className="h-5 w-5 text-gold" />
          </div>
          <h2 className="font-display text-2xl font-bold text-primary">{t("మా చరిత్ర", "Our History")}</h2>
        </div>
        <div className="divider-gold w-20 mt-2 mb-6" />
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-foreground/85 leading-relaxed text-[15px]">
            {t(
              <>
                <p>
                  1997లో స్థాపించబడిన 'శ్రీ నీలకంఠి సంఘం హైదరాబాద్', మరింత అనుబంధం మరియు ఉత్తేజం కలిగిన సమాజాన్ని
                  నిర్మించాలనే ఒక గొప్ప సంకల్పంతో కొద్దిమంది వ్యక్తుల కలయికగా ప్రారంభమైంది. కేవలం 15 మంది సభ్యులతో
                  మొదలైన మా ప్రయాణం, నేడు 130కి పైగా క్రియాశీల కుటుంబాలతో ఒక వర్ధిల్లుతున్న సంస్థగా ఎదిగింది.
                </p>
                <p>
                  గడిచిన సంవత్సరాలలో, మేము ఎన్నో కార్యక్రమాలను నిర్వహించాము, సామాజిక సేవా కార్యక్రమాలను చేపట్టాము
                  మరియు మన సమాజ పునాదిని బలోపేతం చేసే శాశ్వత సంబంధాలను నిర్మించాము. మా ఈ ప్రయాణం సామూహిక కృషి యొక్క
                  శక్తికి మరియు సమాజం పట్ల మనకున్న నిరంతర నిబద్ధతకు నిదర్శనం.
                </p>
              </>,
              <>
                <p>
                  Founded in 1997, Shri Neelakanthi Sangham Hyderabad began as a small gathering of few individuals
                  who shared a vision of creating a more connected and vibrant community. What started with just 15
                  members has grown into a thriving organization of over 130 active families.
                </p>
                <p>
                  Over the years, we've organized many events, started community initiatives, and built lasting
                  relationships that strengthen the fabric of our community. Our journey reflects the power of
                  collective action and the enduring spirit of community.
                </p>
              </>
            )}
          </div>
          <div className="relative">
            <img
              src={ourHistoryImg}
              alt={t("శ్రీ నీలకంఠి సంఘం చరిత్ర", "Shri Neelakanthi Sangham history")}
              className="w-full rounded-2xl shadow-lg border border-gold/20"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <div className="mt-10 grid md:grid-cols-3 gap-5">
        <ContactItem icon={<Phone className="h-5 w-5" />} label={t("ఫోన్", "Phone")} value="+91 8805865828" />
        <ContactItem icon={<Mail className="h-5 w-5" />} label={t("ఇమెయిల్", "Email")} value="care@neelakanta.com" />
        <ContactItem icon={<MapPin className="h-5 w-5" />} label={t("కార్యాలయం", "Office")} value={t("హైదరాబాద్, తెలంగాణ", "Hyderabad, Telangana")} />
      </div>

      <div className="mt-12 text-center">
        <Link to="/register" className="btn-royal inline-block px-8 py-3.5 rounded-full font-semibold">{t("ఇప్పుడే నమోదు చేసుకోండి", "Sign Up Now")}</Link>
      </div>
    </div>
  );
}

function ContactItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="royal-card p-5 flex items-center gap-4">
      <div className="h-11 w-11 rounded-full btn-royal flex items-center justify-center">{icon}</div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-semibold text-primary">{value}</div>
      </div>
    </div>
  );
}
