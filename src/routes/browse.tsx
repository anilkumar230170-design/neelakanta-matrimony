import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter, Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { ProfileCard } from "@/components/ProfileCard";
import { supabase } from "@/integrations/supabase/client";
import { CASTES, CASTES_TELUGU } from "@/lib/constants";
import { NAKSHATRAS, NAKSHATRAS_TELUGU } from "@/lib/horoscope";
import { ageFromDob } from "@/lib/profile-utils";

export const Route = createFileRoute("/browse")({
  head: () => ({
    meta: [
      { title: "ప్రొఫైల్స్ — Neelakanta Matrimony" },
      { name: "description", content: "Browse verified Telugu matrimony profiles by caste, gotra, nakshatra, location and education." },
    ],
  }),
  component: Browse,
});

function Browse() {
  const [gender, setGender] = useState<"all" | "male" | "female">("all");
  const [caste, setCaste] = useState("all");
  const [nakshatra, setNakshatra] = useState("all");
  const [q, setQ] = useState("");
  const [verified, setVerified] = useState(false);
  const [ageRange, setAgeRange] = useState<[number, number]>([22, 40]);

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ["profiles", "browse"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(PUBLIC_PROFILE_COLS)
        .eq("profile_complete", true)
        .order("last_seen", { ascending: false })
        .limit(120);
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = useMemo(() => profiles.filter(p => {
    if (gender !== "all" && p.gender !== gender) return false;
    if (caste !== "all" && p.caste !== caste) return false;
    if (nakshatra !== "all" && p.nakshatra !== nakshatra) return false;
    if (verified && !p.verified) return false;
    const age = ageFromDob(p.date_of_birth);
    if (age !== null && (age < ageRange[0] || age > ageRange[1])) return false;
    if (q) {
      const hay = `${p.full_name ?? ""} ${p.full_name_telugu ?? ""} ${p.city ?? ""} ${p.state ?? ""}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  }), [profiles, gender, caste, nakshatra, q, verified, ageRange]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-primary font-telugu">ప్రొఫైల్స్ బ్రౌజ్ చేయండి</h1>
        <p className="text-muted-foreground mt-1 font-telugu">
          {isLoading ? "లోడ్ అవుతోంది..." : `${filtered.length} మ్యాచింగ్ ప్రొఫైల్స్`}
        </p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <aside className="royal-card p-6 h-fit lg:sticky lg:top-24">
          <div className="flex items-center gap-2 mb-5">
            <SlidersHorizontal className="h-5 w-5 text-gold" />
            <h2 className="font-display text-lg font-bold text-primary font-telugu">వడపోతలు</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-xs font-semibold font-telugu">శోధించండి</label>
              <div className="mt-1.5 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="పేరు, ఊరు..." className="input-royal pl-9" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold font-telugu mb-2 block">లింగం</label>
              <div className="grid grid-cols-3 gap-1.5">
                {([["all", "అన్నీ"], ["female", "వధువు"], ["male", "వరుడు"]] as const).map(([v, l]) => (
                  <button key={v} onClick={() => setGender(v)} className={`px-2 py-2 rounded-md text-xs font-semibold font-telugu transition-colors ${gender === v ? "btn-royal" : "bg-secondary text-foreground"}`}>{l}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold font-telugu">కులం</label>
              <select value={caste} onChange={(e) => setCaste(e.target.value)} className="input-royal mt-1.5 font-telugu">
                <option value="all">అన్నీ</option>
                {CASTES.map(c => <option key={c} value={c}>{CASTES_TELUGU[c] ?? c}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold font-telugu">వయస్సు: {ageRange[0]} - {ageRange[1]}</label>
              <div className="flex gap-2 mt-1.5">
                <input type="number" min={18} max={70} value={ageRange[0]} onChange={(e) => setAgeRange([Number(e.target.value), ageRange[1]])} className="input-royal" />
                <input type="number" min={18} max={70} value={ageRange[1]} onChange={(e) => setAgeRange([ageRange[0], Number(e.target.value)])} className="input-royal" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold font-telugu">నక్షత్రం</label>
              <select value={nakshatra} onChange={(e) => setNakshatra(e.target.value)} className="input-royal mt-1.5 font-telugu">
                <option value="all">ఏదైనా</option>
                {NAKSHATRAS.map(n => <option key={n} value={n}>{NAKSHATRAS_TELUGU[n]}</option>)}
              </select>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-border">
              <Toggle checked={verified} onChange={setVerified} label="వెరిఫైడ్ మాత్రమే" />
            </div>

            <button onClick={() => { setGender("all"); setCaste("all"); setNakshatra("all"); setQ(""); setVerified(false); setAgeRange([22, 40]); }} className="w-full text-xs text-primary hover:underline font-telugu pt-2">వడపోతలు రీసెట్ చేయండి</button>
          </div>
        </aside>

        <div>
          {isLoading ? (
            <div className="royal-card p-16 text-center"><Loader2 className="h-8 w-8 text-gold animate-spin mx-auto" /></div>
          ) : filtered.length === 0 ? (
            <div className="royal-card p-12 text-center">
              <Filter className="h-10 w-10 text-gold mx-auto mb-3" />
              <p className="font-telugu text-muted-foreground">మ్యాచింగ్ ప్రొఫైల్స్ లేవు. వడపోతలను మార్చండి.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map(p => <ProfileCard key={p.id} p={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm font-telugu">{label}</span>
      <button type="button" onClick={() => onChange(!checked)} className={`relative h-5 w-9 rounded-full transition-colors ${checked ? "bg-primary" : "bg-border"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
      </button>
    </label>
  );
}
