import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, Heart, Send, Star, TrendingUp, Bell, Crown, BadgeCheck, ArrowUpRight, Sparkles, Calendar, MessageCircle } from "lucide-react";
import { dashboardStats, profiles } from "@/lib/mock-data";
import { ProfileCard } from "@/components/ProfileCard";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "డాష్‌బోర్డ్ — Neelakanta Matrimony" },
      { name: "description", content: "Your matrimony dashboard — matches, interests, profile views, and activity." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const tiles = [
    { icon: Eye, label: "ప్రొఫైల్ వీక్షణలు", value: dashboardStats.profileViews, change: "+12%", color: "from-rose-500/15 to-rose-500/5", iconColor: "text-rose-600" },
    { icon: Heart, label: "ఆసక్తులు అందుకున్నవి", value: dashboardStats.interestsReceived, change: "+8", color: "from-amber-500/15 to-amber-500/5", iconColor: "text-amber-600" },
    { icon: Send, label: "ఆసక్తులు పంపినవి", value: dashboardStats.interestsSent, change: "+3", color: "from-emerald-500/15 to-emerald-500/5", iconColor: "text-emerald-600" },
    { icon: Star, label: "షార్ట్‌లిస్ట్", value: dashboardStats.shortlisted, change: "+2", color: "from-violet-500/15 to-violet-500/5", iconColor: "text-violet-600" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Welcome */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-gold uppercase tracking-widest font-semibold">
            <Sparkles className="h-3.5 w-3.5" /> శుభోదయం
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-primary mt-1 font-telugu">
            స్వాగతం, రాజేష్ గారు
          </h1>
          <p className="text-muted-foreground mt-1 font-telugu">ఈరోజు మీకు 5 కొత్త మ్యాచ్‌లు ఉన్నాయి</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2.5 rounded-full bg-secondary hover:bg-secondary/80">
            <Bell className="h-5 w-5 text-primary" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
          </button>
          <Link to="/browse" className="btn-royal px-5 py-2.5 rounded-full text-sm font-semibold font-telugu">కొత్త మ్యాచ్‌లు</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {tiles.map((t) => (
          <div key={t.label} className={`royal-card p-5 bg-gradient-to-br ${t.color}`}>
            <div className="flex items-start justify-between">
              <div className={`h-11 w-11 rounded-xl bg-white flex items-center justify-center ${t.iconColor} shadow-sm`}>
                <t.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-emerald-700 inline-flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" /> {t.change}
              </span>
            </div>
            <div className="mt-4">
              <div className="font-display text-3xl font-bold text-primary">{t.value}</div>
              <div className="text-xs text-foreground/70 mt-1 font-telugu">{t.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid lg:grid-cols-[2fr_1fr] gap-6">
        {/* Profile completeness + matches */}
        <div className="space-y-6">
          {/* Completeness */}
          <div className="royal-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-xl font-bold text-primary font-telugu">మ్యాచ్ స్కోర్</h2>
                <p className="text-xs text-muted-foreground font-telugu">మీ ప్రొఫైల్‌ని పూర్తి చేస్తే మంచి మ్యాచ్‌లు వస్తాయి</p>
              </div>
              <div className="text-right">
                <div className="font-display text-4xl font-bold text-gold">{dashboardStats.matchScore}%</div>
              </div>
            </div>
            <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${dashboardStats.matchScore}%`, background: "var(--gradient-gold)" }} />
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {[
                { l: "ప్రాథమిక సమాచారం", done: true },
                { l: "ఫొటోలు (3/5)", done: true },
                { l: "జాతక వివరాలు", done: true },
                { l: "కుటుంబ వివరాలు", done: false },
              ].map((s) => (
                <div key={s.l} className={`px-3 py-2 rounded-lg flex items-center gap-1.5 font-telugu ${s.done ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  <BadgeCheck className="h-3.5 w-3.5" /> {s.l}
                </div>
              ))}
            </div>
          </div>

          {/* Recommended matches */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold text-primary font-telugu">మీకు సూచించబడిన మ్యాచ్‌లు</h2>
              <Link to="/browse" className="text-sm text-primary hover:underline inline-flex items-center gap-1 font-telugu">అన్నీ <ArrowUpRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {profiles.slice(0, 4).map(p => <ProfileCard key={p.id} p={p} />)}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Premium banner */}
          <div className="relative overflow-hidden rounded-2xl p-6 text-primary-foreground" style={{ background: "var(--gradient-royal)" }}>
            <Crown className="h-8 w-8 text-gold" />
            <h3 className="font-display text-xl font-bold mt-2 font-telugu">ప్రీమియం అవ్వండి</h3>
            <p className="text-sm text-primary-foreground/85 mt-1 font-telugu">అపరిమిత సందేశాలు, నేరుగా సంప్రదింపు, ప్రాధాన్యత మ్యాచ్‌లు.</p>
            <button className="btn-gold mt-4 px-5 py-2.5 rounded-full text-sm font-semibold font-telugu">అప్‌గ్రేడ్ చేయండి</button>
          </div>

          {/* Recent activity */}
          <div className="royal-card p-6">
            <h3 className="font-display text-lg font-bold text-primary mb-4 font-telugu">ఇటీవలి కార్యకలాపాలు</h3>
            <ul className="space-y-3.5">
              {[
                { icon: Heart, color: "text-rose-600 bg-rose-50", t: "శ్రావణి ఆసక్తి పంపారు", ts: "2 గంటల క్రితం" },
                { icon: Eye, color: "text-sky-600 bg-sky-50", t: "మీ ప్రొఫైల్‌ని 18 మంది చూశారు", ts: "ఈరోజు" },
                { icon: MessageCircle, color: "text-emerald-600 bg-emerald-50", t: "అర్జున్ సందేశం పంపారు", ts: "నిన్న" },
                { icon: Star, color: "text-amber-600 bg-amber-50", t: "దివ్యని షార్ట్‌లిస్ట్ చేశారు", ts: "2 రోజుల క్రితం" },
              ].map((a, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center ${a.color}`}>
                    <a.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium font-telugu">{a.t}</div>
                    <div className="text-xs text-muted-foreground font-telugu">{a.ts}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Horoscope reminder */}
          <div className="royal-card p-6 border-l-4 border-l-gold">
            <Calendar className="h-6 w-6 text-gold" />
            <h3 className="font-display font-bold text-primary mt-2 font-telugu">శుభ ముహూర్తం</h3>
            <p className="text-sm text-muted-foreground mt-1 font-telugu">డిసెంబర్ 2026 — వివాహ ముహూర్తాలు చూడండి</p>
            <button className="text-sm text-primary font-semibold mt-3 hover:underline font-telugu">ముహూర్తాలు చూడండి →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
