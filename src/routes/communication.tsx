import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { PageHeader, Pill } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useCurrentUser, useData } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { Plus, Send } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import { roleLabel } from "@/lib/labels";

export const Route = createFileRoute("/communication")({
  component: () => (
    <RoleGate roles={["admin", "manager", "technical", "medical"]}>
      <AppLayout>
        <CommunicationPage />
      </AppLayout>
    </RoleGate>
  ),
});

function CommunicationPage() {
  const t = useT();
  const u = useCurrentUser()!;
  const conversations = useData((s) => s.conversations);
  const users = useData((s) => s.users);
  const sendMessage = useData((s) => s.sendMessage);
  const markRead = useData((s) => s.markConversationRead);
  const addConversation = useData((s) => s.addConversation);

  const [activeId, setActiveId] = useState<string | null>(conversations[0]?.id ?? null);
  const active = conversations.find((c) => c.id === activeId) ?? null;
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);
  const [newC, setNewC] = useState({ title: "", target: "Whole club", body: "" });
  const totalUnread = conversations.reduce((s, c) => s + c.unreadCount, 0);

  const select = (id: string) => {
    setActiveId(id);
    markRead(id);
  };

  const send = () => {
    if (!draft.trim() || !active) return;
    sendMessage(active.id, { authorId: u.id, authorRole: u.role, targetLabel: active.title, content: draft });
    setDraft("");
  };

  return (
    <>
      <PageHeader
        title={t("communication")}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full"><Plus className="mr-1 h-4 w-4" />{t("new_circular")}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t("new_circular")}</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>{t("name")}</Label><Input value={newC.title} onChange={(e) => setNewC({ ...newC, title: e.target.value })} /></div>
                <div>
                  <Label>Destinatario</Label>
                  <Select value={newC.target} onValueChange={(v) => setNewC({ ...newC, target: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Whole club", "Section", "Category", "Group", "Athlete"].map((x) => (<SelectItem key={x} value={x}>{x}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Mensaje</Label><Input value={newC.body} onChange={(e) => setNewC({ ...newC, body: e.target.value })} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>{t("cancel")}</Button>
                <Button onClick={() => {
                  if (!newC.title || !newC.body) return;
                  const id = addConversation({
                    title: newC.title, type: "circular", participants: [u.id], unreadCount: 0,
                    messages: [{ id: "m-" + Date.now(), authorId: u.id, authorRole: u.role, targetLabel: newC.target, content: newC.body, createdAt: new Date().toISOString() }],
                  });
                  setActiveId(id);
                  setNewC({ title: "", target: "Whole club", body: "" });
                  setOpen(false);
                }}>{t("send")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="saito-card flex flex-col p-0">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-semibold">{t("inbox")}</span>
            {totalUnread > 0 && <Pill tone="info">{totalUnread}</Pill>}
          </div>
          <ul className="flex-1 overflow-y-auto">
            {conversations.map((c) => {
              const isActive = c.id === activeId;
              const lastAuthor = users.find((x) => x.id === c.messages[c.messages.length - 1]?.authorId);
              const initials = lastAuthor?.initials ?? "?";
              const last = c.messages[c.messages.length - 1];
              return (
                <li key={c.id}>
                  <button onClick={() => select(c.id)} className={`flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left ${isActive ? "bg-primary/5" : "hover:bg-muted/40"}`}>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{initials}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium">{c.title}</span>
                        {c.unreadCount > 0 && <Pill tone="info">{c.unreadCount}</Pill>}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        {lastAuthor && <Pill>{roleLabel(lastAuthor.role, u.language)}</Pill>}
                        <span>· {c.participants.length} {t("participants")}</span>
                      </div>
                      <div className="mt-1 truncate text-xs text-muted-foreground">{last?.content}</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground tabular-nums">{last && formatDateTime(last.createdAt)}</div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="saito-card flex h-[600px] flex-col p-0">
          {active ? (
            <>
              <div className="border-b border-border px-5 py-4">
                <div className="text-base font-semibold">{active.title}</div>
                <div className="text-xs text-muted-foreground">{active.type} · {active.participants.length} {t("participants")}</div>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                {active.messages.map((m) => {
                  const author = users.find((x) => x.id === m.authorId);
                  return (
                    <div key={m.id} className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{author?.initials ?? "?"}</div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-medium text-foreground">{author?.name ?? m.authorId}</span>
                          <Pill>{roleLabel(m.authorRole, u.language)}</Pill>
                          <span className="text-muted-foreground">→ {m.targetLabel}</span>
                          <span className="text-muted-foreground tabular-nums">· {formatDateTime(m.createdAt)}</span>
                        </div>
                        <div className="mt-1 rounded-2xl bg-muted px-3 py-2 text-sm">{m.content}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 border-t border-border px-4 py-3">
                <Input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }} placeholder={t("type_message")} className="rounded-full" />
                <Button onClick={send} className="rounded-full"><Send className="mr-1 h-4 w-4" />{t("send")}</Button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">—</div>
          )}
        </div>
      </div>
    </>
  );
}
