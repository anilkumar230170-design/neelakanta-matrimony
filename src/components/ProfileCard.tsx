import { Link } from "@tanstack/react-router";
import { BadgeCheck, Crown, MapPin, GraduationCap, Briefcase, Heart } from "lucide-react";
import type { Profile } from "@/lib/mock-data";

export function ProfileCard({ p }: { p: Profile }) {
  return (
    <div className="royal-card overflow-hidden group hover:shadow-[var(--shadow-royal)] transition-all hover:-translate-y-1">
      <div className={`relative h-44 bg-gradient-to-br ${p.color} flex items-center justify-center`}>
        <span className="font-display text-6xl text-white/95 drop-shadow">{p.initials}</span>
        {p.premium && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-gold text-gold-foreground px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
            <Crown className="h-3 w-3" /> Premium
          </div>
        )}
        {p.online && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur px-2 py-1 rounded-full text-[10px] text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
          </div>
        )}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-2 left-3 text-white">
          <div className="text-[10px] opacity-80">ID: {p.id}</div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground leading-tight font-telugu">{p.nameTelugu}</h3>
            <p className="text-xs text-muted-foreground">{p.name}</p>
          </div>
          {p.verified && <BadgeCheck className="h-5 w-5 text-primary flex-shrink-0" />}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-foreground/80">
          <div>{p.age} yrs, {p.height}</div>
          <div className="text-right text-primary font-medium">{p.caste}</div>
          <div className="flex items-center gap-1 col-span-2"><MapPin className="h-3 w-3 text-gold" /> <span className="font-telugu">{p.locationTelugu}</span></div>
          <div className="flex items-center gap-1 col-span-2 truncate"><GraduationCap className="h-3 w-3 text-gold" /> {p.education}</div>
          <div className="flex items-center gap-1 col-span-2 truncate"><Briefcase className="h-3 w-3 text-gold" /> {p.profession}</div>
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
          <button className="btn-royal px-3 py-2 rounded-full text-xs font-semibold flex items-center gap-1 font-telugu">
            <Heart className="h-3.5 w-3.5" /> ఆసక్తి
          </button>
        </div>
      </div>
    </div>
  );
}
