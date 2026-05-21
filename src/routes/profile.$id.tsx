import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BadgeCheck, Crown, MapPin, GraduationCap, Briefcase, Heart, MessageCircle, Star, Share2, ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { CASTES_TELUGU } from "@/lib/constants";
import { NAKSHATRAS_TELUGU, RASIS_TELUGU, calculateSimpleMatch, calculateAshtakoot } from "@/lib/horoscope";
import { ageFromDob, colorFor, heightLabel, initialsTelugu, shortId } from "@/lib/profile-utils";

export const Route = createFileRoute("/profile/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `ప్రొఫైల్ ${shortId(params.id)} — Neelakanta Matrimony` },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: p, isLoading } = useQuery({
    queryKey: ["profile", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: me } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle();
      return data;
    },
  });

  const { data: shortlisted } = useQuery({
    queryKey: ["shortlist", user?.id, id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("shortlists").select("id").eq("user_id", user!.id).eq("profile_id", id).maybeSingle();
      return !!data;
    },
  });

  // Log view
  useEffect(() => {
    if (user && p && user.id !== p.id) {
      supabase.from("profile_views").insert({ viewer_id: user.id, profile_id: p.id }).then(() => {});
    }
  }, [user, p]);

  const [busy, setBusy] = useState(false);

  if (isLoading) return <div className="py-24 text-center"><Loader2 className="h-8 w-8 text-gold animate-spin mx-auto" /></div>;
  if (!p) return (
    <div className="mx-auto max-w-2xl text-center py-24 px-6">
      <h1 className="font-display text-3xl text-primary font-telugu">ప్రొఫైల్ కనుగొనబడలేదు</h1>
      <Link to="/browse" className="btn-royal inline-block mt-6 px-6 py-3 rounded-full font-telugu">తిరిగి వెళ్ళండి</Link>
    </div>
  );

  const age = ageFromDob(p.date_of_birth);
  const color = colorFor(p.id);
  const isSelf = user?.id === p.id;
  const premium = p.plan && p.plan !== "free";

  const simpleMatch = me ? calculateSimpleMatch(
    { rasi: me.rasi, nakshatra: me.nakshatra, manglik: me.manglik },
    { rasi: p.rasi, nakshatra: p.nakshatra, manglik: p.manglik }
  ) : null;

  const fullMatch = me && me.rasi && me.nakshatra && p.rasi && p.nakshatra
    ? calculateAshtakoot({ rasi: me.rasi, nakshatra: me.nakshatra }, { rasi: p.rasi, nakshatra: p.nakshatra })
    : null;

  const sendInterest = async () => {
    if (!user) { navigate({ to: "/login" }); return; }
    setBusy(true);
    const { error } = await supabase.from("interests").insert({ sender_id: user.id, receiver_id: p.id });
    setBusy(false);
    if (error) {
      if (error.code === "23505") toast.info("ఇప్పటికే పంపబడింది");
      else toast.error(error.message);
      return;
    }
    toast.success("ఆసక్తి పంపబడింది");
  };

  const toggleShortlist = async () => {
    if (!user) { navigate({ to: "/login" }); return; }
    if (shortlisted) {
      await supabase.from("shortlists").delete().eq("user_id", user.id).eq("profile_id", p.id);
      toast.success("షార్ట్‌లిస్ట్ నుండి తీసివేయబడింది");
    } else {
      await supabase.from("shortlists").insert({ user_id: user.id, profile_id: p.id });
      toast.success("షార్ట్‌లిస్ట్‌కి జోడించబడింది ⭐");
    }
    qc.invalidateQueries({ queryKey: ["shortlist", user.id, p.id] });
  };

  const startChat = () => {
    if (!user) { navigate({ to: "/login" }); return; }
    navigate({ to: "/messages/$id", params: { id: p.id } });
  };

  const details: [string, string, string][] = [
    ["వయస్సు", age ? `${age} సంవత్సరాలు` : "—", "Age"],
    ["ఎత్తు", heightLabel(p.height_cm), "Height"],
    ["కులం", p.caste ? (CASTES_TELUGU[p.caste] ?? p.caste) : "—", "Caste"],
    ["ఉప కులం", p.sub_caste ?? "—", "Sub-caste"],
    ["గోత్రం", p.gotra ?? "—", "Gotra"],
    ["రాశి", p.rasi ? (RASIS_TELUGU[p.rasi] ?? p.rasi) : "—", "Rasi"],
    ["నక్షత్రం", p.nakshatra ? (NAKSHATRAS_TELUGU[p.nakshatra] ?? p.nakshatra) : "—", "Nakshatra"],
    ["మాంగల్యం", p.manglik ? "అవును" : "కాదు", "Manglik"],
    ["చదువు", p.education ?? "—", "Education"],
    ["వృత్తి", p.profession ?? "—", "Profession"],
    ["ఆదాయం", p.annual_income ?? "—", "Income"],
    ["నివాసం", [p.city, p.state].filter(Boolean).join(", ") || "—", "Location"],
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <Link to="/browse" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mb-6 font-telugu">
        <ArrowLeft className="h-4 w-4" /> ప్రొఫైల్స్
      </Link>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-8">
        <div className="space-y-5">
          <div className="royal-card overflow-hidden">
            <div className={`relative h-72 bg-gradient-to-br ${color} flex items-center justify-center`}>
              {p.photo_url ? (
                <img src={p.photo_url} alt={p.full_name} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <span className="font-display text-9xl text-white/95 drop-shadow-lg font-telugu">{initialsTelugu(p.full_name_telugu ?? p.full_name)}</span>
              )}
              {premium && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-gold text-gold-foreground px-3 py-1 rounded-full text-xs font-bold z-10">
                  <Crown className="h-3.5 w-3.5" /> PREMIUM
                </div>
              )}
            </div>
            <div className="p-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <h1 className="font-display text-2xl font-bold text-primary font-telugu">{p.full_name_telugu ?? p.full_name}</h1>
                {p.verified && <BadgeCheck className="h-5 w-5 text-primary" />}
              </div>
              <p className="text-sm text-muted-foreground">{p.full_name}</p>
              <p className="text-xs text-gold font-mono mt-1">ID: {shortId(p.id)}</p>

              <div className="divider-gold my-4" />

              {!isSelf && (
                <div className="space-y-2.5">
                  <button onClick={sendInterest} disabled={busy} className="btn-royal w-full py-3 rounded-full font-semibold flex items-center justify-center gap-2 font-telugu disabled:opacity-60">
                    <Heart className="h-4 w-4 fill-current" /> ఆసక్తి పంపండి
                  </button>
                  <button onClick={startChat} className="btn-gold w-full py-3 rounded-full font-semibold flex items-center justify-center gap-2 font-telugu">
                    <MessageCircle className="h-4 w-4" /> సందేశం పంపండి
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={toggleShortlist} className={`py-2.5 rounded-full border text-sm font-semibold flex items-center justify-center gap-1.5 font-telugu transition-colors ${shortlisted ? "bg-gold/20 border-gold text-primary" : "border-border hover:bg-secondary"}`}>
                      <Star className={`h-4 w-4 ${shortlisted ? "fill-gold text-gold" : ""}`} /> {shortlisted ? "షార్ట్‌లిస్టెడ్" : "షార్ట్‌లిస్ట్"}
                    </button>
                    <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("లింక్ కాపీ అయింది"); }} className="py-2.5 rounded-full border border-border text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-secondary font-telugu">
                      <Share2 className="h-4 w-4" /> షేర్
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {simpleMatch && !isSelf && (
            <div className="royal-card p-5">
              <h3 className="font-display font-bold text-primary font-telugu flex items-center gap-2"><Sparkles className="h-4 w-4 text-gold" /> జాతక మ్యాచ్</h3>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold text-gold">{simpleMatch.score}</span>
                <span className="text-sm text-muted-foreground">/ 100</span>
              </div>
              <div className="h-2 mt-2 rounded-full bg-secondary overflow-hidden">
                <div className="h-full" style={{ width: `${simpleMatch.score}%`, background: "var(--gradient-gold)" }} />
              </div>
              <ul className="mt-3 space-y-1 text-xs font-telugu text-muted-foreground">
                {simpleMatch.notes.map((n, i) => <li key={i}>• {n}</li>)}
              </ul>
              {fullMatch && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="text-xs font-semibold font-telugu">అష్టకూట (36 గుణాలు)</div>
                  <div className="font-display text-2xl font-bold text-primary mt-1">{fullMatch.total} / 36 <span className="text-sm font-normal text-gold font-telugu">— {fullMatch.verdict}</span></div>
                  <Link to="/horoscope" search={{ a: user!.id, b: p.id }} className="text-xs text-primary hover:underline font-telugu mt-2 inline-block">పూర్తి వివరాలు →</Link>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-5">
          {p.about && (
            <Card title="నా గురించి" titleEn="About me">
              <p className="text-foreground/85 leading-relaxed font-telugu">{p.about}</p>
            </Card>
          )}

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

          <Card title="కుటుంబ వివరాలు" titleEn="Family">
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <Detail k="తండ్రి" v={p.father_name ?? "—"} />
              <Detail k="తల్లి" v={p.mother_name ?? "—"} />
              <Detail k="సోదరులు/సోదరిలు" v={p.siblings ?? "—"} />
              <Detail k="కుటుంబ విలువలు" v={p.family_status ?? "—"} />
              <Detail k="కుటుంబ రకం" v={p.family_type ?? "—"} />
              <Detail k="మాతృభాష" v={p.mother_tongue ?? "Telugu"} />
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
      <span className="font-semibold text-foreground text-right">{v}</span>
    </div>
  );
}
