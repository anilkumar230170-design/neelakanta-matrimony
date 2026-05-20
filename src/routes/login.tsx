import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Heart, Mail, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({ redirect: (s.redirect as string) || "/dashboard" }),
  head: () => ({ meta: [{ title: "లాగిన్ — Neelakanta Matrimony" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/login" });
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) navigate({ to: redirect }); }, [user, redirect, navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { toast.error(error.message === "Invalid login credentials" ? "ఇమెయిల్ లేదా పాస్‌వర్డ్ తప్పు" : error.message); return; }
    toast.success("స్వాగతం!");
    navigate({ to: redirect });
  };

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + redirect });
    if (result.error) toast.error("Google sign-in failed");
  };

  const handleReset = async () => {
    if (!email) { toast.error("ముందుగా ఇమెయిల్ నమోదు చేయండి"); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    if (error) toast.error(error.message); else toast.success("పాస్‌వర్డ్ రీసెట్ లింక్ పంపబడింది");
  };

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <div className="royal-card p-8">
        <div className="text-center">
          <div className="h-14 w-14 rounded-full btn-royal mx-auto flex items-center justify-center"><Heart className="h-6 w-6 fill-current" /></div>
          <h1 className="font-display text-2xl font-bold text-primary mt-4 font-telugu">తిరిగి స్వాగతం</h1>
          <p className="text-sm text-muted-foreground mt-1 font-telugu">మీ ఖాతాలోకి లాగిన్ అవ్వండి</p>
        </div>

        <form className="mt-7 space-y-4" onSubmit={handleEmailLogin}>
          <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ఇమెయిల్" className="input-royal pl-10 font-telugu" /></div>
          <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="పాస్‌వర్డ్" className="input-royal pl-10 font-telugu" /></div>
          <div className="flex items-center justify-end text-xs"><button type="button" onClick={handleReset} className="text-primary hover:underline font-telugu">పాస్‌వర్డ్ మర్చిపోయారా?</button></div>
          <button disabled={loading} className="btn-royal w-full py-3 rounded-full font-semibold font-telugu disabled:opacity-60">{loading ? "..." : "లాగిన్"}</button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><span className="flex-1 h-px bg-border" /> లేదా <span className="flex-1 h-px bg-border" /></div>

        <button onClick={handleGoogle} className="w-full py-3 rounded-full border border-border font-semibold text-sm hover:bg-secondary">Google తో కొనసాగండి</button>

        <p className="text-center text-sm text-muted-foreground mt-6 font-telugu">ఖాతా లేదా? <Link to="/register" className="text-primary font-semibold hover:underline">ఉచితంగా నమోదు చేసుకోండి</Link></p>
      </div>
    </div>
  );
}
