import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "ఉచిత నమోదు — Neelakanta Matrimony" }] }),
  component: Register,
});

const steps = ["ప్రాథమిక", "వ్యక్తిగత", "జాతక", "కుటుంబ"];

function Register() {
  const [step, setStep] = useState(0);

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="text-center">
        <div className="h-14 w-14 rounded-full btn-royal mx-auto flex items-center justify-center">
          <Heart className="h-6 w-6 fill-current" />
        </div>
        <h1 className="font-display text-3xl font-bold text-primary mt-4 font-telugu">ఉచిత నమోదు</h1>
        <p className="text-sm text-muted-foreground mt-1 font-telugu">5 నిమిషాల్లో మీ ప్రొఫైల్ సృష్టించండి</p>
      </div>

      {/* Stepper */}
      <div className="mt-8 flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={s} className="flex-1 flex items-center">
            <div className={`flex flex-col items-center ${i <= step ? "" : "opacity-40"}`}>
              <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold ${i < step ? "bg-gold text-gold-foreground" : i === step ? "btn-royal" : "bg-secondary text-muted-foreground"}`}>
                {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className="text-[10px] mt-1 font-telugu">{s}</span>
            </div>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? "bg-gold" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <div className="royal-card p-7 mt-8">
        {step === 0 && <BasicStep />}
        {step === 1 && <PersonalStep />}
        {step === 2 && <HoroscopeStep />}
        {step === 3 && <FamilyStep />}

        <div className="mt-7 flex justify-between gap-3">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="px-5 py-2.5 rounded-full border border-border font-semibold text-sm disabled:opacity-40 font-telugu"
          >
            వెనుకకు
          </button>
          {step < steps.length - 1 ? (
            <button onClick={() => setStep(step + 1)} className="btn-royal px-7 py-2.5 rounded-full font-semibold text-sm font-telugu">
              తదుపరి
            </button>
          ) : (
            <Link to="/dashboard" className="btn-gold px-7 py-2.5 rounded-full font-semibold text-sm font-telugu">
              పూర్తి చేయండి
            </Link>
          )}
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-6 font-telugu">
        ఇప్పటికే ఖాతా ఉందా? <Link to="/login" className="text-primary font-semibold hover:underline">లాగిన్</Link>
      </p>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-4">{children}</div>;
}
function Lbl({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-xs font-semibold font-telugu">{label}</span><div className="mt-1.5">{children}</div></label>;
}

function BasicStep() {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold text-primary font-telugu">ప్రాథమిక సమాచారం</h2>
      <Row>
        <Lbl label="నేను"><select className="input-royal font-telugu"><option>వధువు</option><option>వరుడు</option><option>తల్లి/తండ్రి</option></select></Lbl>
        <Lbl label="పూర్తి పేరు"><input className="input-royal" placeholder="మీ పేరు" /></Lbl>
      </Row>
      <Row>
        <Lbl label="ఇమెయిల్"><input type="email" className="input-royal" placeholder="email@example.com" /></Lbl>
        <Lbl label="ఫోన్"><input className="input-royal" placeholder="+91" /></Lbl>
      </Row>
      <Lbl label="పాస్‌వర్డ్"><input type="password" className="input-royal" placeholder="••••••••" /></Lbl>
    </div>
  );
}
function PersonalStep() {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold text-primary font-telugu">వ్యక్తిగత వివరాలు</h2>
      <Row>
        <Lbl label="పుట్టిన తేదీ"><input type="date" className="input-royal" /></Lbl>
        <Lbl label="ఎత్తు"><select className="input-royal"><option>5'0"</option><option>5'4"</option><option>5'8"</option><option>6'0"</option></select></Lbl>
      </Row>
      <Row>
        <Lbl label="మతం"><select className="input-royal font-telugu"><option>హిందూ</option><option>క్రిస్టియన్</option><option>ముస్లిం</option></select></Lbl>
        <Lbl label="కులం"><select className="input-royal font-telugu"><option>కమ్మ</option><option>రెడ్డి</option><option>బ్రాహ్మణ</option><option>కాపు</option><option>రాజు</option><option>యాదవ</option></select></Lbl>
      </Row>
      <Lbl label="నివాస ప్రదేశం"><input className="input-royal font-telugu" placeholder="హైదరాబాద్" /></Lbl>
    </div>
  );
}
function HoroscopeStep() {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold text-primary font-telugu">జాతక వివరాలు</h2>
      <Row>
        <Lbl label="రాశి"><select className="input-royal font-telugu"><option>మేషం</option><option>వృషభం</option><option>మిథునం</option><option>కర్కాటకం</option><option>సింహం</option><option>కన్య</option><option>తుల</option><option>వృశ్చికం</option></select></Lbl>
        <Lbl label="నక్షత్రం"><select className="input-royal font-telugu"><option>అశ్విని</option><option>భరణి</option><option>రోహిణి</option><option>మృగశిర</option><option>పుష్యమి</option><option>మఘ</option></select></Lbl>
      </Row>
      <Row>
        <Lbl label="గోత్రం"><input className="input-royal" placeholder="Bharadwaja" /></Lbl>
        <Lbl label="మాంగల్యం"><select className="input-royal font-telugu"><option>కాదు</option><option>అవును</option><option>తెలియదు</option></select></Lbl>
      </Row>
      <Row>
        <Lbl label="జన్మ సమయం"><input type="time" className="input-royal" /></Lbl>
        <Lbl label="జన్మ స్థలం"><input className="input-royal" /></Lbl>
      </Row>
    </div>
  );
}
function FamilyStep() {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold text-primary font-telugu">కుటుంబ & వృత్తి</h2>
      <Row>
        <Lbl label="చదువు"><input className="input-royal" placeholder="B.Tech, MBA..." /></Lbl>
        <Lbl label="వృత్తి"><input className="input-royal" placeholder="Software Engineer" /></Lbl>
      </Row>
      <Row>
        <Lbl label="వార్షిక ఆదాయం"><select className="input-royal"><option>₹5 - 10 LPA</option><option>₹10 - 20 LPA</option><option>₹20 - 50 LPA</option></select></Lbl>
        <Lbl label="తండ్రి వృత్తి"><input className="input-royal" /></Lbl>
      </Row>
      <Lbl label="మీ గురించి (క్లుప్తంగా)"><textarea rows={4} className="input-royal font-telugu" placeholder="మీ గురించి, మీ ఆశలు..." /></Lbl>
    </div>
  );
}
