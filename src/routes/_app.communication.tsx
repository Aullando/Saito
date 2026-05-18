import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { PageHeader, Pill } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import {
  DEMO_CONVERSATIONS_ROWS,
  DEMO_PROFILES_MIN_ROWS,
  demoMessagesFor,
} from "@/lib/demoFallbacks";
import { toast } from "sonner";
import { Plus, Send, Trash2, Archive, ArchiveRestore, MoreVertical } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import { demoOrEmpty } from "@/lib/demoFallback";
import { useCommLocal } from "@/lib/commLocal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/_app/communication")({
  component: () => (
    <RoleGate roles={["admin", "manager", "technical", "medical"]}>
      <AppLayout>
        <CommunicationPage />
      </AppLayout>
    </RoleGate>
  ),
});

interface DBConv {
  id: string;
  title: string;
  type: string;
  created_at: string;
}

interface DBMsg {
  id: string;
  author_id: string;
  conversation_id: string;
  content: string;
  created_at: string;
}

function CommunicationPage() {
  const t = useT();
  const { user, profile } = useAuth();
  const orgId = profile?.organization_id;
  const qc = useQueryClient();

  const convsQ = useQuery({
    queryKey: ["conversations", orgId, user?.id],
    enabled: !!orgId && !!user,
    queryFn: async () => {
      const { data: parts, error: pe } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .eq("user_id", user!.id);
      if (pe) throw pe;
      const ids = (parts ?? []).map((p) => p.conversation_id);
      if (ids.length === 0) return [] as DBConv[];
      const { data, error } = await supabase
        .from("conversations")
        .select("id, title, type, created_at")
        .in("id", ids)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as DBConv[];
    },
  });

  const conversations = demoOrEmpty(convsQ.data, DEMO_CONVERSATIONS_ROWS) as DBConv[];
  const [activeId, setActiveId] = useState<string | null>(null);
  useEffect(() => {
    if (!activeId && conversations.length) setActiveId(conversations[0].id);
  }, [conversations, activeId]);

  const msgsQ = useQuery({
    queryKey: ["messages", activeId],
    enabled: !!activeId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("id, author_id, conversation_id, content, created_at")
        .eq("conversation_id", activeId!)
        .order("created_at");
      if (error) throw error;
      return (data ?? []) as DBMsg[];
    },
  });

  const profilesQ = useQuery({
    queryKey: ["profiles_min", orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("id, full_name, email");
      if (error) throw error;
      return data ?? [];
    },
  });

  const profiles = demoOrEmpty(profilesQ.data, DEMO_PROFILES_MIN_ROWS);
  const messages = (msgsQ.data ?? (activeId ? demoMessagesFor(activeId) : [])) as DBMsg[];

  const sendMsg = useMutation({
    mutationFn: async (content: string) => {
      const { error } = await supabase.from("messages").insert({
        conversation_id: activeId!,
        organization_id: orgId!,
        author_id: user!.id,
        content,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messages", activeId] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const newConv = useMutation({
    mutationFn: async (data: { title: string; body: string }) => {
      const { data: conv, error } = await supabase
        .from("conversations")
        .insert({
          organization_id: orgId!,
          title: data.title,
          type: "circular",
          created_by: user!.id,
        })
        .select("id")
        .single();
      if (error) throw error;
      const cid = conv.id as string;
      const { error: pe } = await supabase
        .from("conversation_participants")
        .insert({ organization_id: orgId!, conversation_id: cid, user_id: user!.id });
      if (pe) throw pe;
      const { error: me } = await supabase.from("messages").insert({
        conversation_id: cid,
        organization_id: orgId!,
        author_id: user!.id,
        content: data.body,
      });
      if (me) throw me;
      return cid;
    },
    onSuccess: (cid) => {
      toast.success(t("send"));
      setActiveId(cid);
      qc.invalidateQueries({ queryKey: ["conversations", orgId, user?.id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delConv = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("conversations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      setActiveId(null);
      qc.invalidateQueries({ queryKey: ["conversations", orgId, user?.id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);
  const [newC, setNewC] = useState({ title: "", body: "" });

  const active = conversations.find((c) => c.id === activeId) ?? null;
  const authorName = (id: string) => {
    const p = profiles.find((x) => x.id === id);
    return p?.full_name ?? p?.email ?? id.slice(0, 6);
  };
  const initialsOf = (id: string) => {
    const n = authorName(id);
    return n
      .split(" ")
      .map((x) => x[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const send = async () => {
    if (!draft.trim() || !active) return;
    await sendMsg.mutateAsync(draft);
    setDraft("");
  };

  return (
    <>
      <PageHeader
        title={t("communication")}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full">
                <Plus className="mr-1 h-4 w-4" />
                {t("new_circular")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{t("new_circular")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Título</Label>
                  <Input
                    value={newC.title}
                    onChange={(e) => setNewC({ ...newC, title: e.target.value })}
                    placeholder="Asunto"
                  />
                </div>
                <div>
                  <Label>Mensaje</Label>
                  <Input
                    value={newC.body}
                    onChange={(e) => setNewC({ ...newC, body: e.target.value })}
                    placeholder="Contenido"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  {t("cancel")}
                </Button>
                <Button
                  onClick={async () => {
                    if (!newC.title || !newC.body) return;
                    await newConv.mutateAsync(newC);
                    setNewC({ title: "", body: "" });
                    setOpen(false);
                  }}
                >
                  {t("send")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="saito-card flex flex-col p-0">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-semibold">{t("inbox")}</span>
          </div>
          <ul className="flex-1 overflow-y-auto">
            {conversations.map((c) => {
              const isActive = c.id === activeId;
              return (
                <li key={c.id}>
                  <button
                    onClick={() => setActiveId(c.id)}
                    className={`flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left ${isActive ? "bg-primary/5" : "hover:bg-muted/40"}`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{c.title}</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">
                        <Pill>{c.type}</Pill>
                      </div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground tabular-nums">
                        {formatDateTime(c.created_at)}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
            {conversations.length === 0 && (
              <li className="px-4 py-6 text-center text-xs text-muted-foreground">—</li>
            )}
          </ul>
        </div>

        <div className="saito-card flex h-[600px] flex-col p-0">
          {active ? (
            <>
              <div className="flex items-start justify-between gap-2 border-b border-border px-5 py-4">
                <div>
                  <div className="text-base font-semibold">{active.title}</div>
                  <div className="text-xs text-muted-foreground">{active.type}</div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => {
                    if (!confirm(t("delete_confirm"))) return;
                    delConv.mutate(active.id);
                  }}
                >
                  {t("delete")}
                </Button>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                {messages.map((m) => (
                  <div key={m.id} className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {initialsOf(m.author_id)}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-medium text-foreground">
                          {authorName(m.author_id)}
                        </span>
                        <span className="text-muted-foreground tabular-nums">
                          · {formatDateTime(m.created_at)}
                        </span>
                      </div>
                      <div className="mt-1 rounded-2xl bg-muted px-3 py-2 text-sm">{m.content}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 border-t border-border px-4 py-3">
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") send();
                  }}
                  placeholder={t("type_message")}
                  className="rounded-full"
                />
                <Button onClick={send} className="rounded-full">
                  <Send className="mr-1 h-4 w-4" />
                  {t("send")}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
              —
            </div>
          )}
        </div>
      </div>
    </>
  );
}
