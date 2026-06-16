import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BadgeCheck, Crown, Heart, MessageCircle, Star, Share2, ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { CASTES_TELUGU, PUBLIC_PROFILE_COLS } from "@/lib/constants";
import { NAKSHATRAS_TELUGU, RASIS_TELUGU, calculateSimpleMatch, calculateAshtakoot } from "@/lib/horoscope";
import { ageFromDob, colorFor, heightLabel, initialsTelugu, shortId } from "@/lib/profile-utils";
import { resolvePhotoUrl } from "@/lib/photo";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/profile/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Profile ${shortId(params.id)} — Neelakanta Matrimony` },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { t, lang } = useLang();
  const { id } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: p, isLoading } = useQuery({
    queryKey: ["profile", id],
    queryFn: async () => {
      if (user && user.id === id) {
        const { data, error } = await supabase.rpc("get_my_profile");
        if (error) throw error;
        return data;
      }
      const { data, error } = await supabase.from("profiles_public").select(PUBLIC_PROFILE_COLS).eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: me } = useQuery({
    queryKey: ["profile-me", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.rpc("get_my_profile")).data,
  });

  const { data: shortlisted } = useQuery({
    queryKey: ["shortlist", user?.id, id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("shortlists").select("id").eq("user_id", user!.id).eq("profile_id", id).maybeSingle();
      return !!data;
    },
  });

  useEffect(() => {
    if (user && p && user.id !== p.id) {
      supabase.from("profile_views").insert({ viewer_id: user.id, profile_id: p.id }).then(() => {});
    }
  }, [user, p]);

  const [busy, setBusy] = useState(false);

  if (isLoading) return <div className="py-24 text-center"><Loader2 className="h-8 w-8 text-gold animate-spin mx-auto" /></div>;
  if (!p) return (
    <div className="mx-auto max-w-2xl text-center py-24 px-6">
      <h1 className="font-display text-3xl text-primary">{t("ప్రొఫైల్ కనుగొనబడలేదు", "Profile not found")}</h1>
      <Link to="/browse" className="btn-royal inline-block mt-6 px-6 py-3 rounded-full">{t("తిరిగి వెళ్ళండి", "Go back")}</Link>
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
      if (error.code === "23505") toast.info(t("ఇప్పటికే పంపబడింది", "Already sent"));
      else toast.error(error.message);
      return;
    }
    toast.success(t("ఆసక్తి పంపబడింది", "Interest sent"));
  };

  const toggleShortlist = async () => {
    if (!user) { navigate({ to: "/login" }); return; }
    if (shortlisted) {
      await supabase.from("shortlists").delete().eq("user_id", user.id).eq("profile_id", p.id);
      toast.success(t("షార్ట్‌లిస్ట్ నుండి తీసివేయబడింది", "Removed from shortlist"));
    } else {
      await supabase.from("shortlists").insert({ user_id: user.id, profile_id: p.id });
      toast.success(t("షార్ట్‌లిస్ట్‌కి జోడించబడింది ⭐", "Added to shortlist ⭐"));
    }
    qc.invalidateQueries({ queryKey: ["shortlist", user.id, p.id] });
  };

  const startChat = () => {
    if (!user) { navigate({ to: "/login" }); return; }
    navigate({ to: "/messages/$id", params: { id: p.id } });
  };

  const casteLabel = p.caste ? (lang === "te" ? (CASTES_TELUGU[p.caste] ?? p.caste) : p.caste) : "—";
  const rasiLabel = p.rasi ? (lang === "te" ? (RASIS_TELUGU[p.rasi] ?? p.rasi) : p.rasi) : "—";
  const nakLabel = p.nakshatra ? (lang === "te" ? (NAKSHATRAS_TELUGU[p.nakshatra] ?? p.nakshatra) : p.nakshatra) : "—";

  const details: [string, string][] = [
    [t("వయస్సు", "Age"), age ? `${age} ${t("సంవత్సరాలు", "years")}` : "—"],
    [t("ఎత్తు", "Height"), heightLabel(p.height_cm)],
    [t("కులం", "Caste"), casteLabel],
    [t("ఉప కులం", "Sub-caste"), p.sub_caste ?? "—"],
    [t("గోత్రం", "Gotra"), p.gotra ?? "—"],
    [t("రాశి", "Rasi"), rasiLabel],
    [t("నక్షత్రం", "Nakshatra"), nakLabel],
    [t("మాంగల్యం", "Manglik"), p.manglik ? t("అవును", "Yes") : t("కాదు", "No")],
    [t("చదువు", "Education"), p.education ?? "—"],
    [t("వృత్తి", "Profession"), p.profession ?? "—"],
    [t("ఆదాయం", "Income"), p.annual_income ?? "—"],
    [t("నివాసం", "Location"), [p.city, p.state].filter(Boolean).join(", ") || "—"],
  ];

  const displayName = lang === "te" ? (p.full_name_telugu ?? p.full_name) : (p.full_name ?? p.full_name_telugu);
  const altName = lang === "te" ? p.full_name : p.full_name_telugu;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <Link to="/browse" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mb-6">
        <ArrowLeft className="h-4 w-4" /> {t("ప్రొఫైల్స్", "Profiles")}
      </Link>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-8">
        <div className="space-y-5">
          <div className="royal-card overflow-hidden">
            <div className={`relative h-72 bg-gradient-to-br ${color} flex items-center justify-center`}>
              <PhotoFrame value={p.photo_url} fallback={initialsTelugu(p.full_name_telugu ?? p.full_name)} alt={p.full_name} />
              {premium && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-gold text-gold-foreground px-3 py-1 rounded-full text-xs font-bold z-10">
                  <Crown className="h-3.5 w-3.5" /> PREMIUM
                </div>
              )}
            </div>
            <div className="p-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <h1 className="font-display text-2xl font-bold text-primary">{displayName}</h1>
                {p.verified && <BadgeCheck className="h-5 w-5 text-primary" />}
              </div>
              {altName && <p className="text-sm text-muted-foreground">{altName}</p>}
              <p className="text-xs text-gold font-mono mt-1">ID: {shortId(p.id)}</p>

              <div className="divider-gold my-4" />

              {!isSelf && (
                <div className="space-y-2.5">
                  <button onClick={sendInterest} disabled={busy} className="btn-royal w-full py-3 rounded-full font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
                    <Heart className="h-4 w-4 fill-current" /> {t("ఆసక్తి పంపండి", "Send Interest")}
                  </button>
                  <button onClick={startChat} className="btn-gold w-full py-3 rounded-full font-semibold flex items-center justify-center gap-2">
                    <MessageCircle className="h-4 w-4" /> {t("సందేశం పంపండి", "Send Message")}
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={toggleShortlist} className={`py-2.5 rounded-full border text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors ${shortlisted ? "bg-gold/20 border-gold text-primary" : "border-border hover:bg-secondary"}`}>
                      <Star className={`h-4 w-4 ${shortlisted ? "fill-gold text-gold" : ""}`} /> {shortlisted ? t("షార్ట్‌లిస్టెడ్", "Shortlisted") : t("షార్ట్‌లిస్ట్", "Shortlist")}
                    </button>
                    <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success(t("లింక్ కాపీ అయింది", "Link copied")); }} className="py-2.5 rounded-full border border-border text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-secondary">
                      <Share2 className="h-4 w-4" /> {t("షేర్", "Share")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {simpleMatch && !isSelf && (
            <div className="royal-card p-5">
              <h3 className="font-display font-bold text-primary flex items-center gap-2"><Sparkles className="h-4 w-4 text-gold" /> {t("జాతక మ్యాచ్", "Horoscope Match")}</h3>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold text-gold">{simpleMatch.score}</span>
                <span className="text-sm text-muted-foreground">/ 100</span>
              </div>
              <div className="h-2 mt-2 rounded-full bg-secondary overflow-hidden">
                <div className="h-full" style={{ width: `${simpleMatch.score}%`, background: "var(--gradient-gold)" }} />
              </div>
              <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                {simpleMatch.notes.map((n, i) => <li key={i}>• {n}</li>)}
              </ul>
              {fullMatch && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="text-xs font-semibold">{t("అష్టకూట (36 గుణాలు)", "Ashtakoot (36 gunas)")}</div>
                  <div className="font-display text-2xl font-bold text-primary mt-1">{fullMatch.total} / 36 <span className="text-sm font-normal text-gold">— {fullMatch.verdict}</span></div>
                  <Link to="/horoscope" search={{ a: user!.id, b: p.id }} className="text-xs text-primary hover:underline mt-2 inline-block">{t("పూర్తి వివరాలు →", "Full details →")}</Link>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-5">
          {p.about && (
            <Card title={t("నా గురించి", "About me")}>
              <p className="text-foreground/85 leading-relaxed">{p.about}</p>
            </Card>
          )}

          <Card title={t("వ్యక్తిగత వివరాలు", "Personal Details")}>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
              {details.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between border-b border-border/60 pb-2.5">
                  <div className="text-sm font-medium">{k}</div>
                  <div className="text-sm font-semibold text-primary text-right">{v}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card title={t("కుటుంబ వివరాలు", "Family")}>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <Detail k={t("తండ్రి", "Father")} v={(p as any).father_name ?? "—"} />
              <Detail k={t("తల్లి", "Mother")} v={(p as any).mother_name ?? "—"} />
              <Detail k={t("సోదరులు/సోదరిలు", "Siblings")} v={p.siblings ?? "—"} />
              <Detail k={t("కుటుంబ విలువలు", "Family values")} v={p.family_status ?? "—"} />
              <Detail k={t("కుటుంబ రకం", "Family type")} v={p.family_type ?? "—"} />
              <Detail k={t("మాతృభాష", "Mother tongue")} v={p.mother_tongue ?? "Telugu"} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="royal-card p-6">
      <div className="mb-4">
        <h3 className="font-display text-lg font-bold text-primary">{title}</h3>
        <div className="divider-gold w-20 mt-2" />
      </div>
      {children}
    </div>
  );
}

function Detail({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-border/60 pb-2">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-semibold text-foreground text-right">{v}</span>
    </div>
  );
}

function PhotoFrame({ value, fallback, alt }: { value?: string | null; fallback: string; alt: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => { resolvePhotoUrl(value).then(setUrl); }, [value]);
  if (url) return <img src={url} alt={alt} className="absolute inset-0 h-full w-full object-cover" />;
  return <span className="font-display text-9xl text-white/95 drop-shadow-lg">{fallback}</span>;
}
