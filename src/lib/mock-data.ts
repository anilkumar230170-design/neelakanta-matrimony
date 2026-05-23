export type Profile = {
  id: string;
  name: string;
  nameTelugu: string;
  age: number;
  height: string;
  caste: string;
  gotra: string;
  rasi: string;
  nakshatra: string;
  education: string;
  profession: string;
  income: string;
  location: string;
  locationTelugu: string;
  about: string;
  verified: boolean;
  premium: boolean;
  online: boolean;
  initials: string;
  color: string;
  gender: "M" | "F";
  manglik: boolean;
};

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

export const profiles: Profile[] = [
  { id: "NM1001", name: "Sravani Kondaveeti", nameTelugu: "శ్రావణి కొండవీటి", age: 26, height: "5'4\"", caste: "Kamma", gotra: "Bharadwaja", rasi: "Mesha", nakshatra: "Ashwini", education: "M.Tech, IIT Madras", profession: "Software Engineer", income: "₹18 LPA", location: "Hyderabad", locationTelugu: "హైదరాబాద్", about: "సాంప్రదాయ విలువలతో ఆధునిక ఆలోచనలు కలిగిన అమ్మాయి.", verified: true, premium: true, online: true, initials: "శ్రా", color: colors[0], gender: "F", manglik: false },
  { id: "NM1002", name: "Arjun Vempati", nameTelugu: "అర్జున్ వెంపటి", age: 29, height: "5'10\"", caste: "Reddy", gotra: "Kashyapa", rasi: "Vrishabha", nakshatra: "Rohini", education: "MBA, ISB", profession: "Product Manager", income: "₹35 LPA", location: "Bengaluru", locationTelugu: "బెంగళూరు", about: "కుటుంబ విలువలను గౌరవించే వ్యక్తి. యోగా, చదవడం ఇష్టం.", verified: true, premium: true, online: false, initials: "అర్", color: colors[1], gender: "M", manglik: false },
  { id: "NM1003", name: "Divya Sri Pothuri", nameTelugu: "దివ్య శ్రీ పోతూరి", age: 24, height: "5'3\"", caste: "Brahmin", gotra: "Vasishta", rasi: "Mithuna", nakshatra: "Mrigashira", education: "MBBS", profession: "Doctor", income: "₹12 LPA", location: "Vijayawada", locationTelugu: "విజయవాడ", about: "శాస్త్రీయ సంగీతం, భరతనాట్యం అభ్యాసం చేస్తున్నాను.", verified: true, premium: false, online: true, initials: "ది", color: colors[2], gender: "F", manglik: true },
  { id: "NM1004", name: "Kiran Teja Mandala", nameTelugu: "కిరణ్ తేజ మండల", age: 31, height: "5'11\"", caste: "Kapu", gotra: "Atreya", rasi: "Karka", nakshatra: "Pushya", education: "MS, Stanford", profession: "Tech Lead, Google", income: "$180K", location: "California, USA", locationTelugu: "కాలిఫోర్నియా", about: "ఆంధ్ర సంప్రదాయాన్ని ప్రేమించే NRI. తెలుగు పెళ్ళికి సిద్ధం.", verified: true, premium: true, online: true, initials: "కి", color: colors[3], gender: "M", manglik: false },
  { id: "NM1005", name: "Lakshmi Priya Atluri", nameTelugu: "లక్ష్మీ ప్రియ అట్లూరి", age: 27, height: "5'5\"", caste: "Kamma", gotra: "Srivatsa", rasi: "Simha", nakshatra: "Magha", education: "CA", profession: "Chartered Accountant", income: "₹22 LPA", location: "Chennai", locationTelugu: "చెన్నై", about: "ఆర్థిక స్వాతంత్ర్యం, కుటుంబ గౌరవం రెండూ నాకు ముఖ్యం.", verified: true, premium: false, online: false, initials: "ల", color: colors[4], gender: "F", manglik: false },
  { id: "NM1006", name: "Rohit Varma Penmetsa", nameTelugu: "రోహిత్ వర్మ పెన్మెట్స", age: 30, height: "6'0\"", caste: "Raju", gotra: "Vasishta", rasi: "Kanya", nakshatra: "Hasta", education: "B.Tech NIT", profession: "Civil Engineer", income: "₹14 LPA", location: "Visakhapatnam", locationTelugu: "విశాఖపట్నం", about: "సముద్ర తీరం, సంగీతం, కుటుంబంతో సమయం గడపడం ఇష్టం.", verified: true, premium: true, online: true, initials: "రో", color: colors[5], gender: "M", manglik: false },
  { id: "NM1007", name: "Anusha Chowdary", nameTelugu: "అనుష చౌదరి", age: 25, height: "5'4\"", caste: "Kamma", gotra: "Kaundinya", rasi: "Tula", nakshatra: "Chitra", education: "M.A. English Lit", profession: "Lecturer", income: "₹8 LPA", location: "Guntur", locationTelugu: "గుంటూరు", about: "సాహిత్యం, తెలుగు కవిత్వం పట్ల ప్రేమ.", verified: false, premium: false, online: true, initials: "అ", color: colors[6], gender: "F", manglik: false },
  { id: "NM1008", name: "Suresh Kumar Yadav", nameTelugu: "సురేష్ కుమార్ యాదవ్", age: 32, height: "5'9\"", caste: "Yadav", gotra: "Kashyapa", rasi: "Vrischika", nakshatra: "Anuradha", education: "MBA Marketing", profession: "Business Owner", income: "₹40 LPA", location: "Tirupati", locationTelugu: "తిరుపతి", about: "స్వంత వ్యాపారం. ధార్మిక భావాలు కలవారు.", verified: true, premium: true, online: false, initials: "సు", color: colors[7], gender: "M", manglik: true },
];

export const stats = {
  totalProfiles: "0",
  verified: "0",
  successStories: "0",
  newToday: "0",
};

export const successStories = [
  { id: 1, names: "రవి & స్వాతి", namesEn: "Ravi & Swathi", year: 2024, location: "హైదరాబాద్", quote: "నీలకంఠ మ్యాట్రిమొనీ ద్వారా మా జీవిత భాగస్వామిని కనుగొన్నాము. ధన్యవాదాలు!" },
  { id: 2, names: "ప్రకాష్ & లావణ్య", namesEn: "Prakash & Lavanya", year: 2024, location: "విజయవాడ", quote: "మా రెండు కుటుంబాలు సంతోషంగా ఉన్నాయి. చాలా నమ్మదగిన సేవ." },
  { id: 3, names: "చైతన్య & హరిత", namesEn: "Chaitanya & Haritha", year: 2023, location: "బెంగళూరు", quote: "NRI matches కోసం best platform. వెరిఫైడ్ ప్రొఫైల్స్ చాలా బాగున్నాయి." },
];

export const dashboardStats = {
  profileViews: 248,
  interestsReceived: 32,
  interestsSent: 18,
  shortlisted: 14,
  matchScore: 87,
};
