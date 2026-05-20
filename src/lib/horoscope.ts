// Ashtakoot (8-factor) Guna Milan — Vedic horoscope compatibility
// Max 36 points. >18 = good, >24 = very good, >28 = excellent.

export const NAKSHATRAS = [
  "Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha",
  "Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha",
  "Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishta","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati",
] as const;

export const NAKSHATRAS_TELUGU: Record<string, string> = {
  Ashwini: "అశ్విని", Bharani: "భరణి", Krittika: "కృత్తిక", Rohini: "రోహిణి",
  Mrigashira: "మృగశిర", Ardra: "ఆర్ద్ర", Punarvasu: "పునర్వసు", Pushya: "పుష్యమి",
  Ashlesha: "ఆశ్లేష", Magha: "మఘ", "Purva Phalguni": "పూర్వ ఫల్గుని", "Uttara Phalguni": "ఉత్తర ఫల్గుని",
  Hasta: "హస్త", Chitra: "చిత్ర", Swati: "స్వాతి", Vishakha: "విశాఖ",
  Anuradha: "అనురాధ", Jyeshtha: "జ్యేష్ఠ", Mula: "మూల", "Purva Ashadha": "పూర్వ ఆషాఢ",
  "Uttara Ashadha": "ఉత్తర ఆషాఢ", Shravana: "శ్రవణ", Dhanishta: "ధనిష్ఠ", Shatabhisha: "శతభిష",
  "Purva Bhadrapada": "పూర్వ భాద్ర", "Uttara Bhadrapada": "ఉత్తర భాద్ర", Revati: "రేవతి",
};

export const RASIS = ["Mesha","Vrishabha","Mithuna","Karka","Simha","Kanya","Tula","Vrischika","Dhanu","Makara","Kumbha","Meena"] as const;

export const RASIS_TELUGU: Record<string, string> = {
  Mesha: "మేషం", Vrishabha: "వృషభం", Mithuna: "మిథునం", Karka: "కర్కాటకం",
  Simha: "సింహం", Kanya: "కన్య", Tula: "తుల", Vrischika: "వృశ్చికం",
  Dhanu: "ధనుస్సు", Makara: "మకరం", Kumbha: "కుంభం", Meena: "మీనం",
};

// Nakshatra → Varna (Brahmin=4, Kshatriya=3, Vaishya=2, Shudra=1)
const VARNA: Record<string, number> = {
  Ashwini:1, Bharani:1, Krittika:2, Rohini:2, Mrigashira:3, Ardra:1, Punarvasu:4, Pushya:1, Ashlesha:1,
  Magha:1, "Purva Phalguni":2, "Uttara Phalguni":2, Hasta:3, Chitra:4, Swati:1, Vishakha:1, Anuradha:4,
  Jyeshtha:1, Mula:1, "Purva Ashadha":2, "Uttara Ashadha":2, Shravana:3, Dhanishta:4, Shatabhisha:1,
  "Purva Bhadrapada":2, "Uttara Bhadrapada":2, Revati:3,
};

// Nakshatra → Gana (Deva=1, Manushya=2, Rakshasa=3)
const GANA: Record<string, number> = {
  Ashwini:1, Bharani:2, Krittika:3, Rohini:2, Mrigashira:1, Ardra:3, Punarvasu:1, Pushya:1, Ashlesha:3,
  Magha:3, "Purva Phalguni":2, "Uttara Phalguni":2, Hasta:1, Chitra:3, Swati:1, Vishakha:3, Anuradha:1,
  Jyeshtha:3, Mula:3, "Purva Ashadha":2, "Uttara Ashadha":2, Shravana:1, Dhanishta:3, Shatabhisha:3,
  "Purva Bhadrapada":2, "Uttara Bhadrapada":2, Revati:1,
};

// Nakshatra → Yoni animal index (1-14)
const YONI: Record<string, number> = {
  Ashwini:1, Bharani:2, Krittika:3, Rohini:3, Mrigashira:4, Ardra:5, Punarvasu:5, Pushya:6, Ashlesha:7,
  Magha:7, "Purva Phalguni":8, "Uttara Phalguni":8, Hasta:9, Chitra:10, Swati:10, Vishakha:11, Anuradha:11,
  Jyeshtha:12, Mula:13, "Purva Ashadha":12, "Uttara Ashadha":2, Shravana:13, Dhanishta:14, Shatabhisha:1,
  "Purva Bhadrapada":4, "Uttara Bhadrapada":14, Revati:6,
};

const rasiIdx = (r: string) => RASIS.indexOf(r as typeof RASIS[number]);
const nakIdx = (n: string) => NAKSHATRAS.indexOf(n as typeof NAKSHATRAS[number]);

// 1. Varna (1 pt) — boy's varna >= girl's varna
function varna(boyN: string, girlN: string) {
  const b = VARNA[boyN] ?? 0, g = VARNA[girlN] ?? 0;
  return b >= g ? 1 : 0;
}

// 2. Vashya (2 pts) — simplified rasi compatibility
function vashya(boyR: string, girlR: string) {
  const groups = [
    [0,4,7], // quadruped
    [1,5,9], // jalachara
    [2,8,10], // human
    [3,6,11], // wild
  ];
  const bi = rasiIdx(boyR), gi = rasiIdx(girlR);
  if (bi === gi) return 2;
  for (const g of groups) if (g.includes(bi) && g.includes(gi)) return 2;
  return 1;
}

// 3. Tara (3 pts) — based on nakshatra distance / 9
function tara(boyN: string, girlN: string) {
  const b = nakIdx(boyN), g = nakIdx(girlN);
  if (b < 0 || g < 0) return 0;
  const fromBoy = ((g - b + 27) % 27) % 9 + 1;
  const fromGirl = ((b - g + 27) % 27) % 9 + 1;
  const good = [2,4,6,8,9];
  const bScore = good.includes(fromBoy) ? 1.5 : 0;
  const gScore = good.includes(fromGirl) ? 1.5 : 0;
  return bScore + gScore;
}

// 4. Yoni (4 pts) — nakshatra animal compatibility
function yoni(boyN: string, girlN: string) {
  const b = YONI[boyN], g = YONI[girlN];
  if (!b || !g) return 0;
  if (b === g) return 4;
  return Math.abs(b - g) % 7 === 0 ? 0 : 2;
}

// 5. Graha Maitri (5 pts) — rasi lord friendship (simplified)
function grahaMaitri(boyR: string, girlR: string) {
  const lords: Record<number, string> = {
    0:"Mars",1:"Venus",2:"Mercury",3:"Moon",4:"Sun",5:"Mercury",6:"Venus",7:"Mars",8:"Jupiter",9:"Saturn",10:"Saturn",11:"Jupiter"
  };
  const bL = lords[rasiIdx(boyR)], gL = lords[rasiIdx(girlR)];
  if (bL === gL) return 5;
  const friends: Record<string, string[]> = {
    Sun:["Moon","Mars","Jupiter"], Moon:["Sun","Mercury"], Mars:["Sun","Moon","Jupiter"],
    Mercury:["Sun","Venus"], Jupiter:["Sun","Moon","Mars"], Venus:["Mercury","Saturn"],
    Saturn:["Mercury","Venus"]
  };
  if (friends[bL]?.includes(gL) && friends[gL]?.includes(bL)) return 5;
  if (friends[bL]?.includes(gL) || friends[gL]?.includes(bL)) return 4;
  return 1;
}

// 6. Gana (6 pts) — Deva/Manushya/Rakshasa
function gana(boyN: string, girlN: string) {
  const b = GANA[boyN], g = GANA[girlN];
  if (!b || !g) return 0;
  if (b === g) return 6;
  if ((b === 1 && g === 2) || (b === 2 && g === 1)) return 5;
  if ((b === 2 && g === 3) || (b === 3 && g === 2)) return 1;
  return 0; // Deva-Rakshasa
}

// 7. Bhakoot (7 pts) — rasi distance
function bhakoot(boyR: string, girlR: string) {
  const diff = Math.abs(rasiIdx(boyR) - rasiIdx(girlR));
  const bad = [1, 4, 6]; // 2/12, 5/9, 6/8
  if (bad.includes(diff) || bad.includes(12 - diff)) return 0;
  return 7;
}

// 8. Nadi (8 pts) — Aadi/Madhya/Antya (nakshatra group)
function nadi(boyN: string, girlN: string) {
  const ADI = ["Ashwini","Ardra","Punarvasu","Uttara Phalguni","Hasta","Jyeshtha","Mula","Shatabhisha","Purva Bhadrapada"];
  const MADHYA = ["Bharani","Mrigashira","Pushya","Purva Phalguni","Chitra","Anuradha","Purva Ashadha","Dhanishta","Uttara Bhadrapada"];
  const ANTYA = ["Krittika","Rohini","Ashlesha","Magha","Swati","Vishakha","Uttara Ashadha","Shravana","Revati"];
  const groupOf = (n: string) =>
    ADI.includes(n) ? "A" : MADHYA.includes(n) ? "M" : ANTYA.includes(n) ? "Y" : null;
  const b = groupOf(boyN), g = groupOf(girlN);
  if (!b || !g) return 0;
  return b === g ? 0 : 8; // same nadi = dosha
}

export type GunaResult = {
  varna: number;
  vashya: number;
  tara: number;
  yoni: number;
  grahaMaitri: number;
  gana: number;
  bhakoot: number;
  nadi: number;
  total: number;
  max: number;
  verdict: string;
};

export function calculateAshtakoot(
  boy: { rasi: string; nakshatra: string },
  girl: { rasi: string; nakshatra: string }
): GunaResult {
  const r = {
    varna: varna(boy.nakshatra, girl.nakshatra),
    vashya: vashya(boy.rasi, girl.rasi),
    tara: tara(boy.nakshatra, girl.nakshatra),
    yoni: yoni(boy.nakshatra, girl.nakshatra),
    grahaMaitri: grahaMaitri(boy.rasi, girl.rasi),
    gana: gana(boy.nakshatra, girl.nakshatra),
    bhakoot: bhakoot(boy.rasi, girl.rasi),
    nadi: nadi(boy.nakshatra, girl.nakshatra),
  };
  const total = r.varna + r.vashya + r.tara + r.yoni + r.grahaMaitri + r.gana + r.bhakoot + r.nadi;
  let verdict = "సరిపోదు";
  if (total >= 28) verdict = "అత్యుత్తమం";
  else if (total >= 24) verdict = "చాలా బాగుంది";
  else if (total >= 18) verdict = "మంచిది";
  else if (total >= 12) verdict = "మధ్యమం";
  return { ...r, total, max: 36, verdict };
}

export type SimpleMatch = {
  score: number; // 0-100
  rasiMatch: boolean;
  nakshatraMatch: boolean;
  manglikCompatible: boolean;
  notes: string[];
};

export function calculateSimpleMatch(
  a: { rasi?: string | null; nakshatra?: string | null; manglik?: boolean | null },
  b: { rasi?: string | null; nakshatra?: string | null; manglik?: boolean | null }
): SimpleMatch {
  const notes: string[] = [];
  let score = 50;
  const rasiMatch = !!(a.rasi && b.rasi && a.rasi !== b.rasi);
  const nakshatraMatch = !!(a.nakshatra && b.nakshatra && a.nakshatra !== b.nakshatra);
  if (rasiMatch) { score += 15; notes.push("రాశి అనుకూలం"); } else notes.push("ఒకే రాశి");
  if (nakshatraMatch) { score += 15; notes.push("నక్షత్రం అనుకూలం"); }
  const manglikCompatible = a.manglik === b.manglik;
  if (manglikCompatible) { score += 20; notes.push(a.manglik ? "ఇద్దరూ మాంగల్యం" : "ఇద్దరికీ మాంగల్యం లేదు"); }
  else { score -= 10; notes.push("మాంగల్య అసమతుల్యత"); }
  return { score: Math.max(0, Math.min(100, score)), rasiMatch, nakshatraMatch, manglikCompatible, notes };
}
