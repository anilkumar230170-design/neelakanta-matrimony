import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset Password — Neelakanta Matrimony" }] }),
  component: ResetPassword,
});

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error("కనీసం 8 అక్షరాలు"); return; }
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <div className="royal-card p-8">
        <h1 className="font-display text-2xl font-bold text-primary text-center font-telugu">కొత్త పాస్‌వర్డ్</h1>
        <form className="mt-7 space-y-4" onSubmit={submit}>
          <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="కొత్త పాస్‌వర్డ్" className="input-royal pl-10 font-telugu" /></div>
          <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="మళ్ళీ నమోదు" className="input-royal pl-10 font-telugu" /></div>
          <button disabled={loading} className="btn-royal w-full py-3 rounded-full font-semibold font-telugu disabled:opacity-60">{loading ? "..." : "నవీకరించు"}</button>
        </form>
      </div>
    </div>
  );
}
