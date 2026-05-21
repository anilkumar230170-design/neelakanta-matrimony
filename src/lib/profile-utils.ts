import type { Tables } from "@/integrations/supabase/types";

export type DbProfile = Tables<"profiles">;

const colors = [
  "from-rose-400 to-rose-600",
  "from-amber-400 to-orange-600",
  "from-emerald-400 to-emerald-600",
  "from-violet-400 to-violet-600",
  "from-sky-400 to-sky-600",
  "from-pink-400 to-pink-600",
  "from-yellow-400 to-amber-600",
  "from-teal-400 to-teal-600",
];

export function colorFor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return colors[Math.abs(h) % colors.length];
}

export function initialsTelugu(name?: string | null) {
  if (!name) return "ప్ర";
  const t = name.trim();
  // first 2 telugu chars or 1 latin
  return t.slice(0, 2);
}

export function ageFromDob(dob?: string | null) {
  if (!dob) return null;
  const d = new Date(dob);
  if (isNaN(d.getTime())) return null;
  const diff = Date.now() - d.getTime();
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000));
}

export function heightLabel(cm?: number | null) {
  if (!cm) return "—";
  const feet = Math.floor(cm / 30.48);
  const inches = Math.round((cm / 2.54) % 12);
  return `${feet}'${inches}" (${cm}cm)`;
}

export function shortId(id: string) {
  return "NM" + id.slice(0, 6).toUpperCase();
}

export function isOnline(lastSeen?: string | null) {
  if (!lastSeen) return false;
  return Date.now() - new Date(lastSeen).getTime() < 5 * 60 * 1000;
}
