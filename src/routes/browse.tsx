import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { profiles } from "@/lib/mock-data";
import { ProfileCard } from "@/components/ProfileCard";

export const Route = createFileRoute("/browse")({
  head: () => ({
    meta: [
      { title: "ప్రొఫైల్స్ — Neelakanta Matrimony" },
      { name: "description", content: "Browse verified Telugu matrimony profiles by caste, gotra, nakshatra, location and education." },
    ],
  }),
  component: Browse,
});

const castes = ["అన్నీ", "కమ్మ", "రెడ్డి", "బ్రాహ్మణ", "కాపు", "రాజు", "యాదవ"];

function Browse() {
  const [gender, setGender] = useState<"all" | "M" | "F">("all");
  const [caste, setCaste] = useState("అన్నీ");
  const [q, setQ] = useState("");
  const [verified, setVerified] = useState(false);
  const [online, setOnline] = useState(false);

  const filtered = useMemo(() => profiles.filter(p =>
    (gender === "all" || p.gender === gender) &&
    (caste === "అన్నీ" || p.caste === caste) &&
    (!verified || p.verified) &&
    (!online || p.online) &&
    (!q || p.nameTelugu.includes(q) || p.name.toLowerCase().includes(q.toLowerCase()) || p.location.toLowerCase().includes(q.toLowerCase()))
  ), [gender, caste, q, verified, online]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-primary font-telugu">ప్రొఫైల్స్ బ్రౌజ్ చేయండి</h1>
        <p className="text-muted-foreground mt-1 font-telugu">{filtered.length} మ్యాచింగ్ ప్రొఫైల్స్ కనుగొనబడ్డాయి</p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Filters */}
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
                {([["all","అన్నీ"],["F","వధువు"],["M","వరుడు"]] as const).map(([v, l]) => (
                  <button key={v} onClick={() => setGender(v)} className={`px-2 py-2 rounded-md text-xs font-semibold font-telugu transition-colors ${gender===v ? "btn-royal" : "bg-secondary text-foreground"}`}>{l}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold font-telugu">కులం</label>
              <select value={caste} onChange={(e) => setCaste(e.target.value)} className="input-royal mt-1.5 font-telugu">
                {castes.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold font-telugu">వయస్సు</label>
              <select className="input-royal mt-1.5"><option>22 - 30</option><option>25 - 35</option><option>30 - 40</option></select>
            </div>

            <div>
              <label className="text-xs font-semibold font-telugu">నక్షత్రం</label>
              <select className="input-royal mt-1.5 font-telugu"><option>ఏదైనా</option><option>అశ్విని</option><option>భరణి</option><option>రోహిణి</option><option>మృగశిర</option><option>పుష్యమి</option><option>మఘ</option><option>హస్త</option><option>చిత్ర</option><option>అనురాధ</option></select>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-border">
              <Toggle checked={verified} onChange={setVerified} label="వెరిఫైడ్ మాత్రమే" />
              <Toggle checked={online} onChange={setOnline} label="ఇప్పుడు ఆన్‌లైన్" />
            </div>

            <button onClick={() => { setGender("all"); setCaste("అన్నీ"); setQ(""); setVerified(false); setOnline(false); }} className="w-full text-xs text-primary hover:underline font-telugu pt-2">వడపోతలు రీసెట్ చేయండి</button>
          </div>
        </aside>

        {/* Results */}
        <div>
          {filtered.length === 0 ? (
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
