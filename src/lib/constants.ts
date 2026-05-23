export const CASTES = ["Kamma", "Reddy", "Brahmin", "Kapu", "Raju", "Yadav", "Velama", "Naidu", "Vysya", "Other"];
export const CASTES_TELUGU: Record<string, string> = {
  Kamma: "కమ్మ", Reddy: "రెడ్డి", Brahmin: "బ్రాహ్మణ", Kapu: "కాపు", Raju: "రాజు",
  Yadav: "యాదవ", Velama: "వెలమ", Naidu: "నాయుడు", Vysya: "వైశ్య", Other: "ఇతర",
};
export const RELIGIONS = ["Hindu"];
export const MARITAL = [
  { v: "never_married", l: "ఎప్పుడూ వివాహం కాలేదు" },
  { v: "divorced", l: "విడాకులు" },
  { v: "widowed", l: "విధవరాలు/విధురుడు" },
  { v: "awaiting_divorce", l: "విడాకుల కోసం వేచి" },
];
export const INCOME_RANGES = ["₹0-3 LPA","₹3-5 LPA","₹5-10 LPA","₹10-20 LPA","₹20-50 LPA","₹50 LPA+","$100K+ (NRI)"];
export const HEIGHTS = Array.from({ length: 36 }, (_, i) => {
  const cm = 140 + i * 2;
  const feet = Math.floor(cm / 30.48);
  const inches = Math.round((cm / 2.54) % 12);
  return { cm, label: `${feet}'${inches}" (${cm} cm)` };
});
