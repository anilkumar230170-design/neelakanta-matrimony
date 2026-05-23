import { Link } from "@tanstack/react-router";
import { BadgeCheck, Crown, MapPin, GraduationCap, Briefcase, Heart } from "lucide-react";
import type { DbProfile } from "@/lib/profile-utils";
import { ageFromDob, colorFor, heightLabel, initialsTelugu, isOnline, shortId } from "@/lib/profile-utils";
import { CASTES_TELUGU } from "@/lib/constants";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { resolvePhotoUrl } from "@/lib/photo";

export function ProfileCard({ p }: { p: Partial<DbProfile> & Pick<DbProfile, "id"> }) {
  const { user } = useAuth();
  const [sending, setSending] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  useEffect(() => { resolvePhotoUrl(p.photo_url).then(setPhoto); }, [p.photo_url]);
  const age = ageFromDob(p.date_of_birth);
  const color = colorFor(p.id);
  const online = isOnline(p.last_seen);
  const premium = p.plan && p.plan !== "free";
  const casteTe = p.caste ? (CASTES_TELUGU[p.caste] ?? p.caste) : "—";

  const sendInterest = async () => {
    if (!user) { toast.error("ముందుగా లాగిన్ అవ్వండి"); return; }
    if (user.id === p.id) return;
    setSending(true);
    const { error } = await supabase.from("interests").insert({ sender_id: user.id, receiver_id: p.id });
    setSending(false);
    if (error) {
      if (error.code === "23505") toast.info("ఆసక్తి ఇప్పటికే పంపబడింది");
      else toast.error(error.message);
      return;
    }
    toast.success("ఆసక్తి పంపబడింది ❤");
  };

  return (
    <div className="royal-card overflow-hidden group hover:shadow-[var(--shadow-royal)] transition-all hover:-translate-y-1">
      <div className={`relative h-44 bg-gradient-to-br ${color} flex items-center justify-center`}>
        {photo ? (
          <img src={photo} alt={p.full_name} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <span className="font-display text-6xl text-white/95 drop-shadow font-telugu">{initialsTelugu(p.full_name_telugu ?? p.full_name)}</span>
        )}
        {premium && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-gold text-gold-foreground px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide z-10">
            <Crown className="h-3 w-3" /> Premium
          </div>
        )}
        {online && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur px-2 py-1 rounded-full text-[10px] text-white z-10">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
          </div>
        )}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-2 left-3 text-white z-10">
          <div className="text-[10px] opacity-80">ID: {shortId(p.id)}</div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-display text-lg font-bold text-foreground leading-tight font-telugu truncate">{p.full_name_telugu ?? p.full_name}</h3>
            <p className="text-xs text-muted-foreground truncate">{p.full_name}</p>
          </div>
          {p.verified && <BadgeCheck className="h-5 w-5 text-primary flex-shrink-0" />}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-foreground/80">
          <div>{age ? `${age} yrs` : "—"}, {heightLabel(p.height_cm).split(" ")[0]}</div>
          <div className="text-right text-primary font-medium font-telugu">{casteTe}</div>
          <div className="flex items-center gap-1 col-span-2 font-telugu"><MapPin className="h-3 w-3 text-gold" /> {p.city ?? "—"}{p.state ? `, ${p.state}` : ""}</div>
          <div className="flex items-center gap-1 col-span-2 truncate"><GraduationCap className="h-3 w-3 text-gold flex-shrink-0" /> <span className="truncate">{p.education ?? "—"}</span></div>
          <div className="flex items-center gap-1 col-span-2 truncate"><Briefcase className="h-3 w-3 text-gold flex-shrink-0" /> <span className="truncate">{p.profession ?? "—"}</span></div>
        </div>

        <div className="divider-gold my-4" />

        <div className="flex gap-2">
          <Link
            to="/profile/$id"
            params={{ id: p.id }}
            className="flex-1 text-center px-3 py-2 rounded-full border border-primary text-primary text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-colors font-telugu"
          >
            ప్రొఫైల్ చూడండి
          </Link>
          <button onClick={sendInterest} disabled={sending} className="btn-royal px-3 py-2 rounded-full text-xs font-semibold flex items-center gap-1 font-telugu disabled:opacity-60">
            <Heart className="h-3.5 w-3.5" /> ఆసక్తి
          </button>
        </div>
      </div>
    </div>
  );
}
