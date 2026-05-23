import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { NAKSHATRAS, NAKSHATRAS_TELUGU, RASIS, RASIS_TELUGU, calculateAshtakoot, calculateSimpleMatch } from "@/lib/horoscope";
import { PUBLIC_PROFILE_COLS } from "@/lib/constants";

export const Route = createFileRoute("/horoscope")({
  validateSearch: (s: Record<string, unknown>) => ({
    a: (s.a as string) || "",
    b: (s.b as string) || "",
  }),
  head: () => ({ meta: [{ title: "జాతక మ్యాచ్ — Neelakanta Matrimony" }] }),
  component: HoroscopePage,
});

function HoroscopePage() {
  const { a, b } = Route.useSearch();
  const { user } = useAuth();

  const { data: profA } = useQuery({
    queryKey: ["profile", a || user?.id],
    enabled: !!(a || user?.id),
    queryFn: async () => {
      const targetId = a || user!.id;
      if (user && targetId === user.id) {
        return (await supabase.rpc("get_my_profile")).data;
      }
      return (await supabase.from("profiles").select(PUBLIC_PROFILE_COLS).eq("id", targetId).maybeSingle()).data;
    },
  });
  const { data: profB } = useQuery({
    queryKey: ["profile", b],
    enabled: !!b,
    queryFn: async () => (await supabase.from("profiles").select(PUBLIC_PROFILE_COLS).eq("id", b).maybeSingle()).data,
  });

  // Manual override
  const [boyRasi, setBoyRasi] = useState("Mesha");
  const [boyNak, setBoyNak] = useState("Ashwini");
  const [girlRasi, setGirlRasi] = useState("Vrishabha");
  const [girlNak, setGirlNak] = useState("Rohini");

  const useDb = !!(profA && profB && profA.rasi && profA.nakshatra && profB.rasi && profB.nakshatra);

  const boy = useDb
    ? { rasi: (profA!.gender === "male" ? profA! : profB!).rasi!, nakshatra: (profA!.gender === "male" ? profA! : profB!).nakshatra! }
    : { rasi: boyRasi, nakshatra: boyNak };
  const girl = useDb
    ? { rasi: (profA!.gender === "female" ? profA! : profB!).rasi!, nakshatra: (profA!.gender === "female" ? profA! : profB!).nakshatra! }
    : { rasi: girlRasi, nakshatra: girlNak };

  const ashtakoot = useMemo(() => calculateAshtakoot(boy, girl), [boy, girl]);
  const simple = useMemo(() => calculateSimpleMatch(
    { rasi: boy.rasi, nakshatra: boy.nakshatra, manglik: useDb ? (profA?.manglik ?? false) : false },
    { rasi: girl.rasi, nakshatra: girl.nakshatra, manglik: useDb ? (profB?.manglik ?? false) : false }
  ), [boy, girl, useDb, profA, profB]);

  const rows: [string, number, number, string][] = [
    ["వర్ణ (Varna)", ashtakoot.varna, 1, "ఆధ్యాత్మిక అనుకూలత"],
    ["వశ్య (Vashya)", ashtakoot.vashya, 2, "పరస్పర ఆకర్షణ"],
    ["తార (Tara)", ashtakoot.tara, 3, "శ్రేయస్సు"],
    ["యోని (Yoni)", ashtakoot.yoni, 4, "శారీరక అనుకూలత"],
    ["గ్రహ మైత్రి", ashtakoot.grahaMaitri, 5, "మానసిక అనుకూలత"],
    ["గణ (Gana)", ashtakoot.gana, 6, "స్వభావం"],
    ["భకూట (Bhakoot)", ashtakoot.bhakoot, 7, "సంసార సుఖం"],
    ["నాడి (Nadi)", ashtakoot.nadi, 8, "ఆరోగ్యం & సంతానం"],
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="text-center mb-8">
        <Sparkles className="h-10 w-10 text-gold mx-auto" />
        <h1 className="font-display text-3xl md:text-4xl font-bold text-primary mt-3 font-telugu">అష్టకూట జాతక మ్యాచ్</h1>
        <p className="text-muted-foreground mt-2 font-telugu">8 గుణాలు · 36 పాయింట్లు · వేద జ్యోతిష్యం</p>
      </div>

      {!useDb && (
        <div className="royal-card p-6 mb-6">
          <h2 className="font-display text-lg font-bold text-primary font-telugu mb-4">వివరాలు నమోదు చేయండి</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-primary mb-2 font-telugu">వరుడు</h3>
              <select className="input-royal font-telugu mb-2" value={boyRasi} onChange={(e) => setBoyRasi(e.target.value)}>
                {RASIS.map(r => <option key={r} value={r}>రాశి: {RASIS_TELUGU[r]}</option>)}
              </select>
              <select className="input-royal font-telugu" value={boyNak} onChange={(e) => setBoyNak(e.target.value)}>
                {NAKSHATRAS.map(n => <option key={n} value={n}>నక్షత్రం: {NAKSHATRAS_TELUGU[n]}</option>)}
              </select>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-primary mb-2 font-telugu">వధువు</h3>
              <select className="input-royal font-telugu mb-2" value={girlRasi} onChange={(e) => setGirlRasi(e.target.value)}>
                {RASIS.map(r => <option key={r} value={r}>రాశి: {RASIS_TELUGU[r]}</option>)}
              </select>
              <select className="input-royal font-telugu" value={girlNak} onChange={(e) => setGirlNak(e.target.value)}>
                {NAKSHATRAS.map(n => <option key={n} value={n}>నక్షత్రం: {NAKSHATRAS_TELUGU[n]}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="royal-card p-6 text-center" style={{ background: "var(--gradient-royal)" }}>
        <div className="text-primary-foreground/85 text-sm font-telugu">మొత్తం స్కోర్</div>
        <div className="font-display text-7xl font-bold text-gold mt-1">{ashtakoot.total}<span className="text-3xl text-primary-foreground/70">/36</span></div>
        <div className="text-gold font-semibold text-xl mt-2 font-telugu">{ashtakoot.verdict}</div>
      </div>

      <div className="royal-card p-6 mt-6">
        <h2 className="font-display text-xl font-bold text-primary font-telugu mb-4">8 గుణాల వివరాలు</h2>
        <div className="space-y-3">
          {rows.map(([name, got, max, desc]) => (
            <div key={name} className="grid grid-cols-[1fr_auto] gap-3 items-center">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold font-telugu">{name}</span>
                  <span className="text-xs text-muted-foreground">{desc}</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden mt-1.5">
                  <div className="h-full rounded-full transition-all" style={{ width: `${(got / max) * 100}%`, background: got === max ? "var(--gradient-gold)" : "var(--gradient-royal)" }} />
                </div>
              </div>
              <div className="font-display font-bold text-primary text-lg w-14 text-right">{got}<span className="text-xs text-muted-foreground">/{max}</span></div>
            </div>
          ))}
        </div>
      </div>

      <div className="royal-card p-6 mt-6">
        <h2 className="font-display text-lg font-bold text-primary font-telugu">సరళ మ్యాచ్</h2>
        <div className="mt-2 font-display text-3xl text-gold font-bold">{simple.score}/100</div>
        <ul className="mt-2 text-sm font-telugu text-muted-foreground space-y-1">
          {simple.notes.map((n, i) => <li key={i}>• {n}</li>)}
        </ul>
      </div>

      {!user && (
        <div className="mt-6 text-center">
          <Link to="/register" className="btn-royal px-6 py-3 rounded-full font-semibold font-telugu">పూర్తి ప్రొఫైల్ సృష్టించండి</Link>
        </div>
      )}

      {profA && profB && <Loader2 className="hidden" />}
    </div>
  );
}
