import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, Heart, Send, Star, TrendingUp, Bell, Crown, BadgeCheck, ArrowUpRight, Sparkles, Calendar, MessageCircle, Loader2, Check, X } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { ProfileCard } from "@/components/ProfileCard";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "డాష్‌బోర్డ్ — Neelakanta Matrimony" }],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login", search: { redirect: "/dashboard" } });
  }, [user, authLoading, navigate]);

  const { data: me } = useQuery({
    queryKey: ["me", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle()).data,
  });

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const [views, recv, sent, shortlisted] = await Promise.all([
        supabase.from("profile_views").select("id", { count: "exact", head: true }).eq("profile_id", user!.id),
        supabase.from("interests").select("id", { count: "exact", head: true }).eq("receiver_id", user!.id),
        supabase.from("interests").select("id", { count: "exact", head: true }).eq("sender_id", user!.id),
        supabase.from("shortlists").select("id", { count: "exact", head: true }).eq("user_id", user!.id),
      ]);
      return {
        views: views.count ?? 0,
        recv: recv.count ?? 0,
        sent: sent.count ?? 0,
        shortlisted: shortlisted.count ?? 0,
      };
    },
  });

  const { data: matches = [] } = useQuery({
    queryKey: ["recommended", user?.id, me?.gender],
    enabled: !!user && !!me,
    queryFn: async () => {
      const oppGender = me!.gender === "male" ? "female" : "male";
      const { data } = await supabase.from("profiles").select("*")
        .eq("gender", oppGender).eq("profile_complete", true).neq("id", user!.id)
        .order("last_seen", { ascending: false }).limit(4);
      return data ?? [];
    },
  });

  const { data: incomingInterests = [] } = useQuery({
    queryKey: ["interests-recv", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("interests")
        .select("id, status, created_at, sender_id, profiles!interests_sender_id_fkey(id, full_name, full_name_telugu, photo_url)")
        .eq("receiver_id", user!.id).eq("status", "pending")
        .order("created_at", { ascending: false }).limit(5);
      // The FK alias may not exist; fall back to manual join
      if (!data) return [];
      return data as any[];
    },
  });

  // Manual join fallback if FK alias not present
  const { data: pendingPretty = [] } = useQuery({
    queryKey: ["interests-pretty", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data: ints } = await supabase.from("interests")
        .select("*").eq("receiver_id", user!.id).eq("status", "pending")
        .order("created_at", { ascending: false }).limit(5);
      if (!ints?.length) return [];
      const ids = ints.map(i => i.sender_id);
      const { data: senders } = await supabase.from("profiles").select("id, full_name, full_name_telugu, photo_url").in("id", ids);
      return ints.map(i => ({ ...i, sender: senders?.find(s => s.id === i.sender_id) }));
    },
  });

  const respondInterest = async (interestId: string, status: "accepted" | "declined") => {
    const { error } = await supabase.from("interests").update({ status }).eq("id", interestId);
    if (error) { toast.error(error.message); return; }
    toast.success(status === "accepted" ? "ఆసక్తి అంగీకరించబడింది" : "ఆసక్తి తిరస్కరించబడింది");
    qc.invalidateQueries({ queryKey: ["interests-pretty", user?.id] });
    qc.invalidateQueries({ queryKey: ["dashboard-stats", user?.id] });
  };

  if (authLoading || !user) return <div className="py-24 text-center"><Loader2 className="h-8 w-8 text-gold animate-spin mx-auto" /></div>;

  const completeness = me ? computeCompleteness(me) : 0;
  const tiles = [
    { icon: Eye, label: "ప్రొఫైల్ వీక్షణలు", value: stats?.views ?? 0, color: "from-rose-500/15 to-rose-500/5", iconColor: "text-rose-600" },
    { icon: Heart, label: "ఆసక్తులు అందుకున్నవి", value: stats?.recv ?? 0, color: "from-amber-500/15 to-amber-500/5", iconColor: "text-amber-600" },
    { icon: Send, label: "ఆసక్తులు పంపినవి", value: stats?.sent ?? 0, color: "from-emerald-500/15 to-emerald-500/5", iconColor: "text-emerald-600" },
    { icon: Star, label: "షార్ట్‌లిస్ట్", value: stats?.shortlisted ?? 0, color: "from-violet-500/15 to-violet-500/5", iconColor: "text-violet-600" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-gold uppercase tracking-widest font-semibold">
            <Sparkles className="h-3.5 w-3.5" /> శుభోదయం
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-primary mt-1 font-telugu">
            స్వాగతం, {me?.full_name_telugu || me?.full_name || "మిత్రమా"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/messages" className="relative p-2.5 rounded-full bg-secondary hover:bg-secondary/80">
            <Bell className="h-5 w-5 text-primary" />
          </Link>
          <Link to="/browse" className="btn-royal px-5 py-2.5 rounded-full text-sm font-semibold font-telugu">కొత్త మ్యాచ్‌లు</Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {tiles.map((t) => (
          <div key={t.label} className={`royal-card p-5 bg-gradient-to-br ${t.color}`}>
            <div className="flex items-start justify-between">
              <div className={`h-11 w-11 rounded-xl bg-white flex items-center justify-center ${t.iconColor} shadow-sm`}>
                <t.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <div className="font-display text-3xl font-bold text-primary">{t.value}</div>
              <div className="text-xs text-foreground/70 mt-1 font-telugu">{t.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid lg:grid-cols-[2fr_1fr] gap-6">
        <div className="space-y-6">
          <div className="royal-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-xl font-bold text-primary font-telugu">ప్రొఫైల్ పూర్తి</h2>
                <p className="text-xs text-muted-foreground font-telugu">పూర్తి ప్రొఫైల్ = మంచి మ్యాచ్‌లు</p>
              </div>
              <div className="font-display text-4xl font-bold text-gold">{completeness}%</div>
            </div>
            <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${completeness}%`, background: "var(--gradient-gold)" }} />
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {completenessSections(me).map((s) => (
                <div key={s.l} className={`px-3 py-2 rounded-lg flex items-center gap-1.5 font-telugu ${s.done ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  <BadgeCheck className="h-3.5 w-3.5" /> {s.l}
                </div>
              ))}
            </div>
          </div>

          {pendingPretty.length > 0 && (
            <div className="royal-card p-6">
              <h2 className="font-display text-xl font-bold text-primary font-telugu mb-4">కొత్త ఆసక్తులు</h2>
              <ul className="space-y-3">
                {pendingPretty.map((i: any) => (
                  <li key={i.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/40">
                    <Link to="/profile/$id" params={{ id: i.sender_id }} className="flex-1 flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-full btn-royal flex items-center justify-center text-sm font-bold font-telugu">{(i.sender?.full_name_telugu || i.sender?.full_name || "?").slice(0, 2)}</div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm font-telugu truncate">{i.sender?.full_name_telugu || i.sender?.full_name}</div>
                        <div className="text-xs text-muted-foreground">{new Date(i.created_at).toLocaleDateString()}</div>
                      </div>
                    </Link>
                    <button onClick={() => respondInterest(i.id, "accepted")} className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 flex items-center justify-center"><Check className="h-4 w-4" /></button>
                    <button onClick={() => respondInterest(i.id, "declined")} className="h-9 w-9 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200 flex items-center justify-center"><X className="h-4 w-4" /></button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold text-primary font-telugu">సూచించబడిన మ్యాచ్‌లు</h2>
              <Link to="/browse" className="text-sm text-primary hover:underline inline-flex items-center gap-1 font-telugu">అన్నీ <ArrowUpRight className="h-4 w-4" /></Link>
            </div>
            {matches.length === 0 ? (
              <div className="royal-card p-8 text-center text-sm text-muted-foreground font-telugu">త్వరలో మరిన్ని ప్రొఫైల్స్ చేర్చబడతాయి.</div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-5">
                {matches.map(p => <ProfileCard key={p.id} p={p} />)}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-2xl p-6 text-primary-foreground" style={{ background: "var(--gradient-royal)" }}>
            <Crown className="h-8 w-8 text-gold" />
            <h3 className="font-display text-xl font-bold mt-2 font-telugu">ప్రీమియం అవ్వండి</h3>
            <p className="text-sm text-primary-foreground/85 mt-1 font-telugu">అపరిమిత సందేశాలు, ప్రాధాన్యత మ్యాచ్‌లు.</p>
            <button className="btn-gold mt-4 px-5 py-2.5 rounded-full text-sm font-semibold font-telugu">అప్‌గ్రేడ్ చేయండి</button>
          </div>

          <Link to="/messages" className="royal-card p-6 block hover:shadow-[var(--shadow-royal)] transition-all">
            <MessageCircle className="h-6 w-6 text-gold" />
            <h3 className="font-display font-bold text-primary mt-2 font-telugu">సందేశాలు</h3>
            <p className="text-sm text-muted-foreground mt-1 font-telugu">మీ మ్యాచ్‌లతో సంభాషించండి</p>
          </Link>

          <div className="royal-card p-6 border-l-4 border-l-gold">
            <Calendar className="h-6 w-6 text-gold" />
            <h3 className="font-display font-bold text-primary mt-2 font-telugu">శుభ ముహూర్తం</h3>
            <p className="text-sm text-muted-foreground mt-1 font-telugu">వివాహ ముహూర్తాలు త్వరలో</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function completenessSections(p: any) {
  return [
    { l: "ప్రాథమికం", done: !!(p?.full_name && p?.date_of_birth && p?.gender) },
    { l: "జాతకం", done: !!(p?.rasi && p?.nakshatra) },
    { l: "కుటుంబం", done: !!(p?.father_name && p?.mother_name) },
    { l: "ఫొటో", done: !!p?.photo_url },
  ];
}

function computeCompleteness(p: any) {
  const s = completenessSections(p);
  return Math.round((s.filter(x => x.done).length / s.length) * 100);
}
