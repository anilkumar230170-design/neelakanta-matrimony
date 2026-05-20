import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Mail, Lock } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "లాగిన్ — Neelakanta Matrimony" }] }),
  component: Login,
});

function Login() {
  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <div className="royal-card p-8">
        <div className="text-center">
          <div className="h-14 w-14 rounded-full btn-royal mx-auto flex items-center justify-center">
            <Heart className="h-6 w-6 fill-current" />
          </div>
          <h1 className="font-display text-2xl font-bold text-primary mt-4 font-telugu">తిరిగి స్వాగతం</h1>
          <p className="text-sm text-muted-foreground mt-1 font-telugu">మీ ఖాతాలోకి లాగిన్ అవ్వండి</p>
        </div>

        <form className="mt-7 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <Field icon={<Mail className="h-4 w-4" />} type="email" placeholder="ఇమెయిల్ లేదా ఫోన్ నంబర్" />
          <Field icon={<Lock className="h-4 w-4" />} type="password" placeholder="పాస్‌వర్డ్" />
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 font-telugu"><input type="checkbox" className="accent-primary" /> గుర్తుంచుకో</label>
            <a className="text-primary hover:underline font-telugu" href="#">పాస్‌వర్డ్ మర్చిపోయారా?</a>
          </div>
          <button className="btn-royal w-full py-3 rounded-full font-semibold font-telugu">లాగిన్</button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex-1 h-px bg-border" /> లేదా <span className="flex-1 h-px bg-border" />
        </div>

        <button className="w-full py-3 rounded-full border border-border font-semibold text-sm hover:bg-secondary">
          Google తో కొనసాగండి
        </button>

        <p className="text-center text-sm text-muted-foreground mt-6 font-telugu">
          ఖాతా లేదా? <Link to="/register" className="text-primary font-semibold hover:underline">ఉచితంగా నమోదు చేసుకోండి</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ icon, ...rest }: { icon: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
      <input {...rest} className="input-royal pl-10 font-telugu" />
    </div>
  );
}
