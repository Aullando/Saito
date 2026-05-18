import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, Trash2 } from "lucide-react";
import { useData, useUI } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/mobile/messages")({
  component: MobileMessages,
});

function MobileMessages() {
  const conversations = useData((s) => s.conversations);
  const users = useData((s) => s.users);
  const currentUserId = useUI((s) => s.currentUserId);
  const sendMessage = useData((s) => s.sendMessage);
  const markRead = useData((s) => s.markConversationRead);
  const deleteConversation = useData((s) => s.deleteConversation);

  const list = useMemo(() => conversations.slice(0, 8), [conversations]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = useMemo(
    () => conversations.find((c) => c.id === openId) ?? null,
    [conversations, openId]
  );
  const currentUser = users.find((u) => u.id === currentUserId);

  useEffect(() => {
    if (openId) markRead(openId);
  }, [openId, markRead]);

  useEffect(() => {
    if (active && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [active?.messages.length, openId]);

  const handleSend = () => {
    if (!active || !draft.trim() || !currentUser) return;
    sendMessage(active.id, {
      authorId: currentUser.id,
      authorRole: currentUser.role,
      targetLabel: active.title,
      content: draft.trim(),
    });
    setDraft("");
  };

  const handleDelete = (id: string, title: string) => {
    deleteConversation(id);
    setOpenId(null);
    toast.success(`Conversación "${title}" eliminada`);
  };

  if (active) {
    return (
      <div className="flex h-[calc(100vh-8rem)] flex-col">
        <header className="flex items-center gap-2 border-b border-border pb-3">
          <Button variant="ghost" size="icon" onClick={() => setOpenId(null)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-bold">{active.title}</h1>
            <p className="text-[11px] text-muted-foreground">
              {active.participants.length} participantes · {active.type}
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-5 w-5 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Eliminar conversación</AlertDialogTitle>
                <AlertDialogDescription>
                  Se eliminará "{active.title}" de tu bandeja en esta demo.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete(active.id, active.title)}>
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </header>

        <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto py-3">
          {active.messages.map((m) => {
            const mine = m.authorId === currentUserId;
            const author = users.find((u) => u.id === m.authorId);
            return (
              <div
                key={m.id}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    mine
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border"
                  }`}
                >
                  {!mine && (
                    <div className="mb-1 text-[10px] font-semibold opacity-70">
                      {author?.name ?? "Usuario"}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap break-words">{m.content}</div>
                  <div className="mt-1 text-[10px] opacity-60">
                    {new Date(m.createdAt).toLocaleString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })}
          {active.messages.length === 0 && (
            <p className="py-8 text-center text-xs text-muted-foreground">
              Sin mensajes todavía
            </p>
          )}
        </div>

        <div className="flex items-end gap-2 border-t border-border pt-3">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Escribe un mensaje…"
            rows={1}
            className="min-h-[40px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button size="icon" onClick={handleSend} disabled={!draft.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <header>
        <h1 className="text-xl font-bold tracking-tight">Mensajes</h1>
        <p className="text-xs text-muted-foreground">
          Toca una conversación para abrirla
        </p>
      </header>

      <ul className="space-y-2">
        {list.map((c) => {
          const last = c.messages[c.messages.length - 1];
          return (
            <li key={c.id}>
              <button
                onClick={() => setOpenId(c.id)}
                className="flex w-full items-start gap-3 rounded-2xl border border-border bg-card p-3 text-left transition-colors hover:bg-accent"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {c.title.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-sm font-semibold">{c.title}</div>
                    {c.unreadCount > 0 && (
                      <span className="rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                  {last && (
                    <div className="truncate text-[11px] text-muted-foreground">
                      {last.content}
                    </div>
                  )}
                </div>
              </button>
            </li>
          );
        })}
        {list.length === 0 && (
          <p className="py-8 text-center text-xs text-muted-foreground">
            No hay conversaciones
          </p>
        )}
      </ul>
    </div>
  );
}
