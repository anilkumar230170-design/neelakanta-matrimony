import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/messages/$id")({
  component: Thread,
});

function Thread() {
  const { id: partnerId } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (!loading && !user) navigate({ to: "/login", search: { redirect: `/messages/${partnerId}` } }); }, [user, loading, navigate, partnerId]);

  const { data: partner } = useQuery({
    queryKey: ["profile", partnerId],
    enabled: !!user,
    queryFn: async () => (await supabase.from("profiles").select("id, full_name, full_name_telugu, photo_url").eq("id", partnerId).maybeSingle()).data,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["thread", user?.id, partnerId],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("messages").select("*")
        .or(`and(sender_id.eq.${user!.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user!.id})`)
        .order("created_at", { ascending: true });
      return data ?? [];
    },
  });

  // Realtime subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase.channel(`thread:${user.id}:${partnerId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const m = payload.new as any;
        const inThread = (m.sender_id === user.id && m.receiver_id === partnerId) || (m.sender_id === partnerId && m.receiver_id === user.id);
        if (inThread) qc.invalidateQueries({ queryKey: ["thread", user.id, partnerId] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, partnerId, qc]);

  // Mark received as read
  useEffect(() => {
    if (!user || !messages.length) return;
    const unread = messages.filter(m => m.receiver_id === user.id && !m.read_at).map(m => m.id);
    if (unread.length) {
      supabase.from("messages").update({ read_at: new Date().toISOString() }).in("id", unread).then(() => {});
    }
  }, [messages, user]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = text.trim();
    if (!content || !user) return;
    setText("");
    const { error } = await supabase.from("messages").insert({ sender_id: user.id, receiver_id: partnerId, content });
    if (error) { toast.error(error.message); setText(content); return; }
    qc.invalidateQueries({ queryKey: ["thread", user.id, partnerId] });
  };

  if (loading || !user) return <div className="py-24 text-center"><Loader2 className="h-8 w-8 text-gold animate-spin mx-auto" /></div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 flex flex-col h-[calc(100vh-8rem)]">
      <Link to="/messages" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mb-3 font-telugu">
        <ArrowLeft className="h-4 w-4" /> సందేశాలు
      </Link>

      <div className="royal-card flex flex-col flex-1 overflow-hidden">
        <Link to="/profile/$id" params={{ id: partnerId }} className="flex items-center gap-3 p-4 border-b border-border hover:bg-secondary/30">
          <div className="h-10 w-10 rounded-full btn-royal flex items-center justify-center text-sm font-bold font-telugu">{(partner?.full_name_telugu || partner?.full_name || "?").slice(0, 2)}</div>
          <div>
            <div className="font-semibold font-telugu">{partner?.full_name_telugu || partner?.full_name || "—"}</div>
            <div className="text-xs text-muted-foreground">{partner?.full_name}</div>
          </div>
        </Link>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-secondary/20 to-background">
          {messages.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-12 font-telugu">మొదటి సందేశం పంపండి</div>
          ) : messages.map(m => {
            const mine = m.sender_id === user.id;
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${mine ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card border border-border rounded-bl-sm"}`}>
                  <div className="font-telugu whitespace-pre-wrap break-words">{m.content}</div>
                  <div className={`text-[10px] mt-1 ${mine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={send} className="border-t border-border p-3 flex gap-2">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="మీ సందేశం రాయండి..." className="input-royal font-telugu flex-1" />
          <button type="submit" disabled={!text.trim()} className="btn-royal px-5 rounded-full font-semibold flex items-center gap-1.5 disabled:opacity-50">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
