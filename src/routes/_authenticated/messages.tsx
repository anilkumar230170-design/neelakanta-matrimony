import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/messages")({
  head: () => ({ meta: [{ title: "Messages — Neelakanta Matrimony" }] }),
  component: Messages,
});

function Messages() {
  const { t, lang } = useLang();
  const { user } = useAuth();

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["conversations", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data: msgs } = await supabase.from("messages")
        .select("*").or(`sender_id.eq.${user!.id},receiver_id.eq.${user!.id}`)
        .order("created_at", { ascending: false }).limit(200);
      if (!msgs) return [];
      const partners = new Map<string, any>();
      for (const m of msgs) {
        const partner = m.sender_id === user!.id ? m.receiver_id : m.sender_id;
        if (!partners.has(partner)) partners.set(partner, { partner_id: partner, last: m, unread: 0 });
        if (m.receiver_id === user!.id && !m.read_at) partners.get(partner)!.unread++;
      }
      const partnerIds = Array.from(partners.keys());
      if (!partnerIds.length) return [];
      const { data: profs } = await supabase.from("profiles").select("id, full_name, full_name_telugu, photo_url").in("id", partnerIds);
      return partnerIds.map(id => ({ ...partners.get(id)!, profile: profs?.find(p => p.id === id) }));
    },
  });

  if (!user) return <div className="py-24 text-center"><Loader2 className="h-8 w-8 text-gold animate-spin mx-auto" /></div>;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="font-display text-3xl font-bold text-primary mb-6">{t("సందేశాలు", "Messages")}</h1>

      {isLoading ? (
        <div className="royal-card p-12 text-center"><Loader2 className="h-6 w-6 text-gold animate-spin mx-auto" /></div>
      ) : conversations.length === 0 ? (
        <div className="royal-card p-12 text-center">
          <MessageCircle className="h-10 w-10 text-gold mx-auto mb-3" />
          <p className="text-muted-foreground">{t("ఇంకా సంభాషణలు లేవు", "No conversations yet")}</p>
          <Link to="/browse" className="btn-royal inline-block mt-5 px-6 py-2.5 rounded-full text-sm">{t("ప్రొఫైల్స్ చూడండి", "Browse Profiles")}</Link>
        </div>
      ) : (
        <ul className="royal-card divide-y divide-border">
          {conversations.map((c: any) => {
            const name = lang === "te" ? (c.profile?.full_name_telugu || c.profile?.full_name) : (c.profile?.full_name || c.profile?.full_name_telugu);
            return (
              <li key={c.partner_id}>
                <Link to="/messages/$id" params={{ id: c.partner_id }} className="flex items-center gap-3 p-4 hover:bg-secondary/50">
                  <div className="h-12 w-12 rounded-full btn-royal flex items-center justify-center font-bold">{(name || "?").slice(0, 2)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-semibold truncate">{name || "—"}</div>
                      <div className="text-[10px] text-muted-foreground flex-shrink-0">{new Date(c.last.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="text-sm text-muted-foreground truncate">{c.last.content}</div>
                  </div>
                  {c.unread > 0 && <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full h-6 min-w-6 px-1.5 flex items-center justify-center">{c.unread}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
