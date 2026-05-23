import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Shield, Users, Award, Mail, Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "మా గురించి — Neelakanta Matrimony" },
      { name: "description", content: "Neelakanta Matrimony — trusted Telugu matchmaking since 2026." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold font-semibold">
          <Heart className="h-3.5 w-3.5 fill-current" /> మా గురించి
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mt-3 font-telugu">నీలకంఠ మ్యాట్రిమొనీ</h1>
        <div className="divider-gold w-32 mx-auto mt-5" />
        <p className="mt-6 text-lg text-foreground/85 max-w-3xl mx-auto leading-relaxed font-telugu">
          2026 నుండి తెలుగు కుటుంబాలకు సేవ చేస్తున్నాము. మా లక్ష్యం — ప్రతి యువతీ యువకుడికి తగిన జీవిత భాగస్వామిని గౌరవంగా, నమ్మదగిన విధానంలో కనుగొనడం.
        </p>
      </div>

      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { icon: Users, k: "0", v: "ప్రొఫైల్స్" },
          { icon: Shield, k: "0", v: "వెరిఫైడ్" },
          { icon: Heart, k: "0", v: "విజయగాథలు" },
          { icon: Award, k: "0", v: "సంవత్సరాల అనుభవం" },
        ].map((s) => (
          <div key={s.v} className="royal-card p-6 text-center">
            <s.icon className="h-8 w-8 text-gold mx-auto" />
            <div className="font-display text-3xl font-bold text-primary mt-3">{s.k}</div>
            <div className="text-sm text-muted-foreground font-telugu">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="mt-14 royal-card p-8 md:p-10">
        <h2 className="font-display text-2xl font-bold text-primary font-telugu">మా విలువలు</h2>
        <div className="divider-gold w-20 mt-2 mb-5" />
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          {[
            { t: "నమ్మకం", d: "ప్రతి ప్రొఫైల్‌ని మేము ధృవీకరిస్తాము. మీ గోప్యత మాకు ముఖ్యం." },
            { t: "సంప్రదాయం", d: "తెలుగు సంస్కృతి, కుటుంబ విలువలను గౌరవిస్తాము." },
            { t: "ఆధునికత", d: "AI ఆధారిత మ్యాచింగ్, సురక్షిత చాట్, మొబైల్ స్నేహపూర్వకం." },
          ].map((v) => (
            <div key={v.t}>
              <h3 className="font-display font-bold text-lg text-primary font-telugu">{v.t}</h3>
              <p className="mt-2 text-foreground/80 font-telugu leading-relaxed">{v.d}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 grid md:grid-cols-3 gap-5">
        <ContactItem icon={<Phone className="h-5 w-5" />} label="ఫోన్" value="+91 8805865828" />
        <ContactItem icon={<Mail className="h-5 w-5" />} label="ఇమెయిల్" value="care@neelakanta.com" />
        <ContactItem icon={<MapPin className="h-5 w-5" />} label="కార్యాలయం" value="హైదరాబాద్, తెలంగాణ" />
      </div>

      <div className="mt-12 text-center">
        <Link to="/register" className="btn-royal inline-block px-8 py-3.5 rounded-full font-semibold font-telugu">ఇప్పుడే నమోదు చేసుకోండి</Link>
      </div>
    </div>
  );
}

function ContactItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="royal-card p-5 flex items-center gap-4">
      <div className="h-11 w-11 rounded-full btn-royal flex items-center justify-center">{icon}</div>
      <div>
        <div className="text-xs text-muted-foreground font-telugu">{label}</div>
        <div className="font-semibold text-primary">{value}</div>
      </div>
    </div>
  );
}
