import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BadgeCheck, Crown, MapPin, GraduationCap, Briefcase, Heart, MessageCircle, Star, Share2, ArrowLeft, Phone } from "lucide-react";
import { profiles } from "@/lib/mock-data";

export const Route = createFileRoute("/profile/$id")({
  head: ({ params }) => {
    const p = profiles.find(x => x.id === params.id);
    return {
      meta: [
        { title: p ? `${p.nameTelugu} — Neelakanta Matrimony` : "Profile" },
        { name: "description", content: p?.about ?? "" },
      ],
    };
  },
  loader: ({ params }) => {
    const p = profiles.find(x => x.id === params.id);
    if (!p) throw notFound();
    return p;
  },
  component: ProfilePage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl text-center py-24 px-6">
      <h1 className="font-display text-3xl text-primary font-telugu">ప్రొఫైల్ కనుగొనబడలేదు</h1>
      <Link to="/browse" className="btn-royal inline-block mt-6 px-6 py-3 rounded-full font-telugu">ప్రొఫైల్స్‌కి తిరిగి వెళ్ళండి</Link>
    </div>
  ),
});

function ProfilePage() {
  const p = Route.useLoaderData();

  const details: [string, string, string][] = [
    ["వయస్సు", `${p.age} సంవత్సరాలు`, "Age"],
    ["ఎత్తు", p.height, "Height"],
    ["కులం", p.caste, "Caste"],
    ["గోత్రం", p.gotra, "Gotra"],
    ["రాశి", p.rasi, "Rasi"],
    ["నక్షత్రం", p.nakshatra, "Nakshatra"],
    ["మాంగల్యం", p.manglik ? "అవును" : "కాదు", "Manglik"],
    ["చదువు", p.education, "Education"],
    ["వృత్తి", p.profession, "Profession"],
    ["ఆదాయం", p.income, "Income"],
    ["నివాసం", p.locationTelugu, "Location"],
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <Link to="/browse" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mb-6 font-telugu">
        <ArrowLeft className="h-4 w-4" /> ప్రొఫైల్స్
      </Link>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-8">
        {/* Left */}
        <div className="space-y-5">
          <div className="royal-card overflow-hidden">
            <div className={`relative h-72 bg-gradient-to-br ${p.color} flex items-center justify-center`}>
              <span className="font-display text-9xl text-white/95 drop-shadow-lg">{p.initials}</span>
              {p.premium && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-gold text-gold-foreground px-3 py-1 rounded-full text-xs font-bold">
                  <Crown className="h-3.5 w-3.5" /> PREMIUM
                </div>
              )}
            </div>
            <div className="p-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <h1 className="font-display text-2xl font-bold text-primary font-telugu">{p.nameTelugu}</h1>
                {p.verified && <BadgeCheck className="h-5 w-5 text-primary" />}
              </div>
              <p className="text-sm text-muted-foreground">{p.name}</p>
              <p className="text-xs text-gold font-mono mt-1">ID: {p.id}</p>

              <div className="divider-gold my-4" />

              <div className="space-y-2.5">
                <button className="btn-royal w-full py-3 rounded-full font-semibold flex items-center justify-center gap-2 font-telugu">
                  <Heart className="h-4 w-4 fill-current" /> ఆసక్తి పంపండి
                </button>
                <button className="btn-gold w-full py-3 rounded-full font-semibold flex items-center justify-center gap-2 font-telugu">
                  <MessageCircle className="h-4 w-4" /> సందేశం పంపండి
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-2.5 rounded-full border border-border text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-secondary font-telugu">
                    <Star className="h-4 w-4" /> షార్ట్‌లిస్ట్
                  </button>
                  <button className="py-2.5 rounded-full border border-border text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-secondary font-telugu">
                    <Share2 className="h-4 w-4" /> షేర్
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="royal-card p-5">
            <h3 className="font-display font-bold text-primary font-telugu flex items-center gap-2"><Phone className="h-4 w-4" /> సంప్రదింపు</h3>
            <p className="text-sm text-muted-foreground mt-2 font-telugu">ప్రీమియం సభ్యులు మాత్రమే నేరుగా సంప్రదించగలరు.</p>
            <button className="btn-royal w-full mt-3 py-2.5 rounded-full text-sm font-semibold font-telugu">ప్రీమియం అప్‌గ్రేడ్</button>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-5">
          <Card title="నా గురించి" titleEn="About me">
            <p className="text-foreground/85 leading-relaxed font-telugu">{p.about}</p>
          </Card>

          <Card title="వ్యక్తిగత వివరాలు" titleEn="Personal Details">
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
              {details.map(([k, v, ke]) => (
                <div key={k} className="flex items-center justify-between border-b border-border/60 pb-2.5">
                  <div>
                    <div className="text-sm font-medium font-telugu">{k}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{ke}</div>
                  </div>
                  <div className="text-sm font-semibold text-primary text-right font-telugu">{v}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="భాగస్వామి ప్రాధాన్యతలు" titleEn="Partner Preferences">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <Pref icon={<Heart className="h-4 w-4" />} k="వయస్సు" v="25 - 32 సంవత్సరాలు" />
              <Pref icon={<MapPin className="h-4 w-4" />} k="ప్రాంతం" v="ఆంధ్ర, తెలంగాణ, NRI" />
              <Pref icon={<GraduationCap className="h-4 w-4" />} k="చదువు" v="గ్రాడ్యుయేషన్ లేదా అంతకంటే ఎక్కువ" />
              <Pref icon={<Briefcase className="h-4 w-4" />} k="వృత్తి" v="ఏ ఉద్యోగమైనా" />
            </div>
          </Card>

          <Card title="కుటుంబ వివరాలు" titleEn="Family">
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <Detail k="తండ్రి" v="రిటైర్డ్ ఉద్యోగి" />
              <Detail k="తల్లి" v="గృహిణి" />
              <Detail k="సోదరులు" v="1 (వివాహితుడు)" />
              <Detail k="సోదరిలు" v="ఏదీ లేదు" />
              <Detail k="కుటుంబ విలువలు" v="సంప్రదాయ" />
              <Detail k="కుటుంబ స్థితి" v="మధ్యతరగతి" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Card({ title, titleEn, children }: { title: string; titleEn: string; children: React.ReactNode }) {
  return (
    <div className="royal-card p-6">
      <div className="mb-4">
        <h3 className="font-display text-lg font-bold text-primary font-telugu">{title}</h3>
        <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{titleEn}</div>
        <div className="divider-gold w-20 mt-2" />
      </div>
      {children}
    </div>
  );
}

function Detail({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-border/60 pb-2 font-telugu">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-semibold text-foreground">{v}</span>
    </div>
  );
}

function Pref({ icon, k, v }: { icon: React.ReactNode; k: string; v: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
      <div className="text-gold mt-0.5">{icon}</div>
      <div>
        <div className="text-xs text-muted-foreground font-telugu">{k}</div>
        <div className="font-semibold font-telugu">{v}</div>
      </div>
    </div>
  );
}
