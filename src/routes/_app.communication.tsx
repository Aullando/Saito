import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { PageHeader, Pill, EmptyState } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useData } from "@/lib/store";
import { useCommLocal, type CircularStatus, type LocalCircular } from "@/lib/commLocal";
import { formatDateTime } from "@/lib/format";
import { toast } from "sonner";
import {
  Archive,
  ArchiveRestore,
  CalendarPlus,
  CheckCircle2,
  Inbox,
  Megaphone,
  MoreVertical,
  Plus,
  Send,
  Stethoscope,
  Trash2,
  Undo2,
  Users,
} from "lucide-react";
import type { Conversation, Message } from "@/lib/types";

export const Route = createFileRoute("/_app/communication")({
  component: () => (
    <RoleGate roles={["admin", "manager", "technical", "medical"]}>
      <AppLayout>
        <CommunicationPage />
      </AppLayout>
    </RoleGate>
  ),
});

// ────── Helpers ──────

interface CircularItem {
  id: string;
  title: string;
  body: string;
  recipientsLabel: string;
  recipientsCount: number;
  reads: number;
  createdAt: string;
  status: CircularStatus;
  scheduledAt?: string;
  withdrawReason?: string;
  source: "seed" | "local";
}

const STATUS_LABELS: Record<CircularStatus, string> = {
  draft: "Borrador",
  scheduled: "Programada",
  published: "Publicada",
  archived: "Archivada",
  withdrawn: "Retirada",
};

const STATUS_STYLES: Record<CircularStatus, string> = {
  draft: "bg-amber-50 text-amber-700 border-amber-200",
  scheduled: "bg-sky-50 text-sky-700 border-sky-200",
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  archived: "bg-slate-100 text-slate-600 border-slate-200",
  withdrawn: "bg-rose-50 text-rose-700 border-rose-200",
};

const NON_MVP_STATUSES: CircularStatus[] = ["draft", "scheduled", "archived", "withdrawn"];

function StatusBadge({ status }: { status: CircularStatus }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span
        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[status]}`}
      >
        {STATUS_LABELS[status]}
      </span>
      {NON_MVP_STATUSES.includes(status) && <ProposalBadge />}
    </span>
  );
}

function ProposalBadge({ className = "" }: { className?: string }) {
  return (
    <span
      title="Mejora propuesta (no incluida en el MVP)"
      className={`inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-1.5 py-[1px] text-[9px] font-semibold uppercase tracking-wide text-violet-700 ${className}`}
    >
      Mejora propuesta
    </span>
  );
}

function isMedicalRequest(c: Conversation): boolean {
  return /solicitud de cita médica/i.test(c.title);
}

function CommunicationPage() {
  const {
    conversations,
    users,
    athletes,
    sendMessage,
    addAppointment,
  } = useData();
  const {
    archivedConvs,
    hiddenConvs,
    archiveConv,
    unarchiveConv,
    hideConv,
    localCirculars,
    circularStatus,
    withdrawReasons,
    addLocalCircular,
    updateLocalCircular,
    deleteLocalCircular,
    publishCircular,
    scheduleCircular,
    cancelScheduledCircular,
    archiveCircular,
    withdrawCircular,
    handledRequests,
    markRequestHandled,
  } = useCommLocal();

  const [tab, setTab] = useState<
    "circulars" | "direct" | "groups" | "medical" | "archived"
  >("circulars");
  const [openNew, setOpenNew] = useState(false);

  // ────── Circulares ──────
  // Derive seed circulars (flatten messages of type=circular convs)
  const seedCirculars: CircularItem[] = useMemo(() => {
    const items: CircularItem[] = [];
    for (const c of conversations) {
      if (c.type !== "circular") continue;
      for (const m of c.messages) {
        const recipientsCount = extractRecipientsCount(m.targetLabel) ?? c.participants.length;
        const overridden = circularStatus[m.id];
        items.push({
          id: m.id,
          title: m.content.slice(0, 80) + (m.content.length > 80 ? "…" : ""),
          body: m.content,
          recipientsLabel: m.targetLabel,
          recipientsCount,
          reads: Math.max(
            0,
            Math.min(
              recipientsCount,
              Math.round(recipientsCount * 0.78),
            ),
          ),
          createdAt: m.createdAt,
          status: overridden ?? "published",
          withdrawReason: withdrawReasons[m.id],
          source: "seed",
        });
      }
    }
    return items;
  }, [conversations, circularStatus, withdrawReasons]);

  const allCirculars: CircularItem[] = useMemo(() => {
    const localItems: CircularItem[] = localCirculars.map((c: LocalCircular) => ({
      id: c.id,
      title: c.title,
      body: c.body,
      recipientsLabel: c.recipientsLabel,
      recipientsCount: c.recipientsCount,
      reads: c.reads,
      createdAt: c.createdAt,
      status: c.status,
      scheduledAt: c.scheduledAt,
      withdrawReason: c.withdrawReason,
      source: "local",
    }));
    return [...localItems, ...seedCirculars].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }, [seedCirculars, localCirculars]);

  // ────── Conversations split ──────
  const visibleConvs = conversations.filter((c) => !hiddenConvs.includes(c.id));
  const directChats = visibleConvs.filter(
    (c) => c.type === "direct" && !isMedicalRequest(c) && !archivedConvs.includes(c.id),
  );
  const groupChats = visibleConvs.filter(
    (c) => c.type === "group" && !archivedConvs.includes(c.id),
  );
  const medicalRequests = visibleConvs.filter((c) => isMedicalRequest(c));
  const archivedList = visibleConvs.filter((c) => archivedConvs.includes(c.id));

  return (
    <>
      <PageHeader
        title="Comunicación"
        actions={
          <Dialog open={openNew} onOpenChange={setOpenNew}>
            <DialogTrigger asChild>
              <Button className="rounded-full">
                <Plus className="mr-1 h-4 w-4" />
                Nueva circular
              </Button>
            </DialogTrigger>
            <NewCircularDialog
              onClose={() => setOpenNew(false)}
              onSave={(payload, publish) => {
                const id = addLocalCircular(payload);
                if (publish) publishCircular(id);
                toast.success(publish ? "Circular publicada" : "Borrador guardado");
                setOpenNew(false);
                setTab("circulars");
              }}
            />
          </Dialog>
        }
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="space-y-4">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-muted/40 p-1">
          <TabsTrigger value="circulars" className="gap-1.5">
            <Megaphone className="h-4 w-4" /> Circulares
            <span className="ml-1 rounded-full bg-background px-1.5 text-[10px] tabular-nums">
              {allCirculars.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="direct" className="gap-1.5">
            <Inbox className="h-4 w-4" /> Chats directos
            <span className="ml-1 rounded-full bg-background px-1.5 text-[10px] tabular-nums">
              {directChats.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="groups" className="gap-1.5">
            <Users className="h-4 w-4" /> Grupos
            <span className="ml-1 rounded-full bg-background px-1.5 text-[10px] tabular-nums">
              {groupChats.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="medical" className="gap-1.5">
            <Stethoscope className="h-4 w-4" /> Solicitudes médicas
            <span className="ml-1 rounded-full bg-background px-1.5 text-[10px] tabular-nums">
              {medicalRequests.filter((r) => !handledRequests.includes(r.id)).length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="archived" className="gap-1.5">
            <Archive className="h-4 w-4" /> Archivados
            <ProposalBadge className="ml-1" />
            <span className="ml-1 rounded-full bg-background px-1.5 text-[10px] tabular-nums">
              {archivedList.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="circulars" className="m-0">
          <CircularsTab
            items={allCirculars}
            onDeleteDraft={(id) => {
              deleteLocalCircular(id);
              toast.success("Borrador eliminado");
            }}
            onPublish={(id) => {
              publishCircular(id);
              toast.success("Circular publicada");
            }}
            onSchedule={(id, when) => {
              scheduleCircular(id, when);
              toast.success("Circular programada");
            }}
            onCancelSchedule={(id) => {
              cancelScheduledCircular(id);
              toast.success("Programación cancelada");
            }}
            onUpdate={(id, patch) => {
              updateLocalCircular(id, patch);
              toast.success("Circular actualizada");
            }}
            onArchive={(id) => {
              archiveCircular(id);
              toast.success("Circular archivada");
            }}
            onWithdraw={(id, reason) => {
              withdrawCircular(id, reason);
              toast.success("Circular retirada");
            }}
          />
        </TabsContent>

        <TabsContent value="direct" className="m-0">
          <ConversationsTab
            conversations={directChats}
            users={users}
            onArchive={(id) => {
              archiveConv(id);
              toast.success("Conversación archivada");
            }}
            onHide={(id) => {
              hideConv(id);
              toast.success("Eliminada de tu bandeja");
            }}
            onSend={(id, content) =>
              sendMessage(id, {
                authorId: users[0]?.id ?? "u-adm",
                authorRole: "admin",
                targetLabel: "Conversación directa",
                content,
              })
            }
            emptyLabel="No hay chats directos."
          />
        </TabsContent>

        <TabsContent value="groups" className="m-0">
          <ConversationsTab
            conversations={groupChats}
            users={users}
            onArchive={(id) => {
              archiveConv(id);
              toast.success("Grupo archivado");
            }}
            onHide={(id) => {
              hideConv(id);
              toast.success("Eliminado de tu bandeja");
            }}
            onSend={(id, content) =>
              sendMessage(id, {
                authorId: users[0]?.id ?? "u-adm",
                authorRole: "admin",
                targetLabel: "Conversación de grupo",
                content,
              })
            }
            emptyLabel="No hay conversaciones de grupo."
          />
        </TabsContent>

        <TabsContent value="medical" className="m-0">
          <MedicalRequestsTab
            requests={medicalRequests}
            handled={handledRequests}
            athletes={athletes}
            users={users}
            onCreateAppointment={(req, payload) => {
              addAppointment(payload);
              markRequestHandled(req.id);
              toast.success("Cita médica creada");
            }}
            onArchive={(id) => {
              archiveConv(id);
              toast.success("Solicitud archivada");
            }}
          />
        </TabsContent>

        <TabsContent value="archived" className="m-0">
          <ArchivedTab
            conversations={archivedList}
            onUnarchive={(id) => {
              unarchiveConv(id);
              toast.success("Restaurada en tu bandeja");
            }}
            onHide={(id) => {
              hideConv(id);
              toast.success("Eliminada de tu bandeja");
            }}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}

// ────── Circulares Tab ──────

function CircularsTab({
  items,
  onDeleteDraft,
  onPublish,
  onSchedule,
  onCancelSchedule,
  onUpdate,
  onArchive,
  onWithdraw,
}: {
  items: CircularItem[];
  onDeleteDraft: (id: string) => void;
  onPublish: (id: string) => void;
  onSchedule: (id: string, when: string) => void;
  onCancelSchedule: (id: string) => void;
  onUpdate: (
    id: string,
    patch: Partial<{
      title: string;
      body: string;
      recipientsLabel: string;
      recipientsCount: number;
    }>,
  ) => void;
  onArchive: (id: string) => void;
  onWithdraw: (id: string, reason: string) => void;
}) {
  const [filter, setFilter] = useState<CircularStatus | "all">("all");
  const filtered = items.filter((c) => (filter === "all" ? true : c.status === filter));
  const counts: Record<CircularStatus | "all", number> = {
    all: items.length,
    draft: items.filter((c) => c.status === "draft").length,
    scheduled: items.filter((c) => c.status === "scheduled").length,
    published: items.filter((c) => c.status === "published").length,
    archived: items.filter((c) => c.status === "archived").length,
    withdrawn: items.filter((c) => c.status === "withdrawn").length,
  };

  const [withdrawTarget, setWithdrawTarget] = useState<CircularItem | null>(null);
  const [withdrawReason, setWithdrawReason] = useState("");
  const [editTarget, setEditTarget] = useState<CircularItem | null>(null);
  const [scheduleTarget, setScheduleTarget] = useState<CircularItem | null>(null);
  const [scheduleAt, setScheduleAt] = useState("");

  return (
    <div className="saito-card p-0">
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
        {(["all", "draft", "scheduled", "published", "archived", "withdrawn"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              filter === s
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background text-muted-foreground hover:bg-muted/40"
            }`}
          >
            {s === "all" ? "Todas" : STATUS_LABELS[s]}
            <span className="ml-1.5 tabular-nums opacity-70">{counts[s]}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState>No hay circulares en este estado.</EmptyState>
      ) : (
        <ul className="divide-y divide-border">
          {filtered.map((c) => {
            const pct = c.recipientsCount
              ? Math.round((c.reads / c.recipientsCount) * 100)
              : 0;
            return (
              <li key={c.id} className="px-4 py-4 hover:bg-muted/30">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={c.status} />
                      <span className="text-[11px] text-muted-foreground tabular-nums">
                        {formatDateTime(c.createdAt)}
                      </span>
                    </div>
                    <div className="mt-1 truncate text-sm font-semibold text-foreground">
                      {c.title}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {c.body}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3 w-3" /> {c.recipientsLabel}
                      </span>
                      <span className="tabular-nums">
                        {c.recipientsCount} destinatarios
                      </span>
                      {c.status !== "draft" && c.status !== "scheduled" && (
                        <span className="tabular-nums">
                          {c.reads} lecturas ({pct}%)
                        </span>
                      )}
                      {c.status === "scheduled" && c.scheduledAt && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 font-medium text-sky-700">
                          <CalendarPlus className="h-3 w-3" />
                          Envío: {formatDateTime(c.scheduledAt)}
                        </span>
                      )}
                    </div>
                    {c.status === "withdrawn" && c.withdrawReason && (
                      <div className="mt-2 rounded-md border border-rose-200 bg-rose-50/60 px-2 py-1 text-[11px] text-rose-700">
                        <strong>Motivo retirada:</strong> {c.withdrawReason}
                      </div>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      {c.status === "draft" && (
                        <>
                          {c.source === "local" && (
                            <DropdownMenuItem onClick={() => setEditTarget(c)}>
                              <MoreVertical className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => onPublish(c.id)}>
                            <Send className="mr-2 h-4 w-4" />
                            Publicar ahora
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setScheduleTarget(c);
                              setScheduleAt("");
                            }}
                          >
                            <CalendarPlus className="mr-2 h-4 w-4" />
                            Programar… <ProposalBadge className="ml-auto" />
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              if (!confirm("¿Eliminar este borrador?")) return;
                              onDeleteDraft(c.id);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </>
                      )}
                      {c.status === "scheduled" && (
                        <>
                          {c.source === "local" && (
                            <DropdownMenuItem onClick={() => setEditTarget(c)}>
                              <MoreVertical className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => onCancelSchedule(c.id)}>
                            <Undo2 className="mr-2 h-4 w-4" />
                            Cancelar programación <ProposalBadge className="ml-auto" />
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              if (!confirm("¿Eliminar esta circular programada?")) return;
                              onDeleteDraft(c.id);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </>
                      )}
                      {c.status === "published" && (
                        <>
                          <DropdownMenuItem onClick={() => onArchive(c.id)}>
                            <Archive className="mr-2 h-4 w-4" />
                            Archivar <ProposalBadge className="ml-auto" />
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-rose-600 focus:text-rose-600"
                            onClick={() => {
                              setWithdrawTarget(c);
                              setWithdrawReason("");
                            }}
                          >
                            <Undo2 className="mr-2 h-4 w-4" />
                            Retirar circular… <ProposalBadge className="ml-auto" />
                          </DropdownMenuItem>
                        </>
                      )}
                      {c.status === "archived" && (
                        <DropdownMenuItem disabled>
                          <Archive className="mr-2 h-4 w-4" />
                          Sólo consulta
                        </DropdownMenuItem>
                      )}
                      {c.status === "withdrawn" && (
                        <DropdownMenuItem disabled>
                          <Undo2 className="mr-2 h-4 w-4" />
                          Consultar motivo
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Dialog
        open={!!withdrawTarget}
        onOpenChange={(o) => {
          if (!o) setWithdrawTarget(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Retirar circular</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              La circular quedará marcada como retirada y dejará de ser visible para los
              destinatarios. Es obligatorio indicar el motivo.
            </p>
            <Label>Motivo de retirada</Label>
            <Textarea
              value={withdrawReason}
              onChange={(e) => setWithdrawReason(e.target.value)}
              placeholder="Ej: información errónea, cambio de fecha, etc."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWithdrawTarget(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={!withdrawReason.trim()}
              onClick={() => {
                if (withdrawTarget) onWithdraw(withdrawTarget.id, withdrawReason.trim());
                setWithdrawTarget(null);
              }}
            >
              <Undo2 className="mr-1 h-4 w-4" />
              Retirar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Editar borrador / programada */}
      <Dialog open={!!editTarget} onOpenChange={(o) => { if (!o) setEditTarget(null); }}>
        {editTarget && (
          <EditCircularDialog
            initial={editTarget}
            onClose={() => setEditTarget(null)}
            onSave={(patch) => {
              onUpdate(editTarget.id, patch);
              setEditTarget(null);
            }}
          />
        )}
      </Dialog>

      {/* Programar envío */}
      <Dialog open={!!scheduleTarget} onOpenChange={(o) => { if (!o) setScheduleTarget(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Programar circular</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Indica la fecha y hora de envío. Hasta entonces, la circular permanecerá como
              programada y podrás editarla o cancelar el envío.
            </p>
            <Label>Fecha y hora de envío</Label>
            <Input
              type="datetime-local"
              value={scheduleAt}
              onChange={(e) => setScheduleAt(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleTarget(null)}>
              Cancelar
            </Button>
            <Button
              disabled={!scheduleAt}
              onClick={() => {
                if (scheduleTarget && scheduleAt) {
                  onSchedule(scheduleTarget.id, new Date(scheduleAt).toISOString());
                }
                setScheduleTarget(null);
              }}
            >
              <CalendarPlus className="mr-1 h-4 w-4" />
              Programar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EditCircularDialog({
  initial,
  onClose,
  onSave,
}: {
  initial: CircularItem;
  onClose: () => void;
  onSave: (patch: {
    title: string;
    body: string;
    recipientsLabel: string;
    recipientsCount: number;
  }) => void;
}) {
  const [title, setTitle] = useState(initial.title);
  const [body, setBody] = useState(initial.body);
  const [recipients, setRecipients] = useState(initial.recipientsLabel);
  const [count, setCount] = useState(initial.recipientsCount);
  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>Editar circular</DialogTitle>
      </DialogHeader>
      <div className="space-y-3">
        <div>
          <Label>Título</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label>Mensaje</Label>
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Destinatarios</Label>
            <Input value={recipients} onChange={(e) => setRecipients(e.target.value)} />
          </div>
          <div>
            <Label>Nº destinatarios</Label>
            <Input
              type="number"
              value={count}
              onChange={(e) => setCount(Number(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button
          disabled={!title || !body}
          onClick={() =>
            onSave({ title, body, recipientsLabel: recipients, recipientsCount: count })
          }
        >
          Guardar cambios
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

// ────── New Circular Dialog ──────

function NewCircularDialog({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (
    payload: {
      title: string;
      body: string;
      recipientsLabel: string;
      recipientsCount: number;
    },
    publish: boolean,
  ) => void;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [recipients, setRecipients] = useState("Todo el club");
  const [count, setCount] = useState(32);

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>Nueva circular</DialogTitle>
      </DialogHeader>
      <div className="space-y-3">
        <div>
          <Label>Título</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Asunto" />
        </div>
        <div>
          <Label>Mensaje</Label>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Contenido de la circular"
            rows={5}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Destinatarios</Label>
            <Input value={recipients} onChange={(e) => setRecipients(e.target.value)} />
          </div>
          <div>
            <Label>Nº destinatarios</Label>
            <Input
              type="number"
              value={count}
              onChange={(e) => setCount(Number(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>
      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="secondary"
          disabled={!title || !body}
          onClick={() =>
            onSave(
              { title, body, recipientsLabel: recipients, recipientsCount: count },
              false,
            )
          }
        >
          Guardar borrador
        </Button>
        <Button
          disabled={!title || !body}
          onClick={() =>
            onSave(
              { title, body, recipientsLabel: recipients, recipientsCount: count },
              true,
            )
          }
        >
          <Send className="mr-1 h-4 w-4" />
          Publicar
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

// ────── Conversations Tab (chats / groups) ──────

function ConversationsTab({
  conversations,
  users,
  onArchive,
  onHide,
  onSend,
  emptyLabel,
}: {
  conversations: Conversation[];
  users: { id: string; name: string; initials: string }[];
  onArchive: (id: string) => void;
  onHide: (id: string) => void;
  onSend: (id: string, content: string) => void;
  emptyLabel: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(conversations[0]?.id ?? null);
  const active =
    conversations.find((c) => c.id === activeId) ?? conversations[0] ?? null;
  const [draft, setDraft] = useState("");

  const authorName = (id: string) => users.find((u) => u.id === id)?.name ?? id.slice(0, 6);
  const initials = (id: string) =>
    users.find((u) => u.id === id)?.initials ??
    authorName(id)
      .split(" ")
      .map((x) => x[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  if (conversations.length === 0) {
    return (
      <div className="saito-card p-0">
        <EmptyState>{emptyLabel}</EmptyState>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <div className="saito-card flex flex-col p-0">
        <ul className="flex-1 overflow-y-auto">
          {conversations.map((c) => {
            const isActive = c.id === active?.id;
            const last = c.messages[c.messages.length - 1];
            return (
              <li key={c.id} className="group/conv relative">
                <button
                  onClick={() => setActiveId(c.id)}
                  className={`flex w-full items-start gap-3 border-b border-border px-4 py-3 pr-10 text-left ${
                    isActive ? "bg-primary/5" : "hover:bg-muted/40"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium">{c.title}</span>
                      {c.unreadCount > 0 && (
                        <span className="rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground tabular-nums">
                          {c.unreadCount}
                        </span>
                      )}
                    </div>
                    {last && (
                      <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
                        {last.content}
                      </div>
                    )}
                    <div className="mt-0.5 text-[11px] text-muted-foreground tabular-nums">
                      {last ? formatDateTime(last.createdAt) : "—"}
                    </div>
                  </div>
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-7 w-7 opacity-60 hover:opacity-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onArchive(c.id)}>
                      <Archive className="mr-2 h-4 w-4" />
                      Archivar <ProposalBadge className="ml-auto" />
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onHide(c.id)}>
                      <Inbox className="mr-2 h-4 w-4" />
                      Eliminar de mi bandeja <ProposalBadge className="ml-auto" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="saito-card flex h-[600px] flex-col p-0">
        {active ? (
          <>
            <div className="flex items-start justify-between gap-2 border-b border-border px-5 py-4">
              <div>
                <div className="text-base font-semibold">{active.title}</div>
                <div className="text-xs text-muted-foreground">
                  <Pill>{active.type}</Pill>{" "}
                  <span className="ml-1">{active.participants.length} participantes</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button size="sm" variant="ghost" onClick={() => onArchive(active.id)}>
                  <Archive className="mr-1 h-4 w-4" />
                  Archivar
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onHide(active.id)}>
                  <Inbox className="mr-1 h-4 w-4" />
                  Quitar de mi bandeja
                </Button>
              </div>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {active.messages.map((m: Message) => (
                <div key={m.id} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {initials(m.authorId)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-medium text-foreground">
                        {authorName(m.authorId)}
                      </span>
                      <span className="text-muted-foreground tabular-nums">
                        · {formatDateTime(m.createdAt)}
                      </span>
                    </div>
                    <div className="mt-1 rounded-2xl bg-muted px-3 py-2 text-sm">
                      {m.content}
                    </div>
                  </div>
                </div>
              ))}
              {active.messages.length === 0 && (
                <div className="py-8 text-center text-xs text-muted-foreground">—</div>
              )}
            </div>
            <div className="flex items-center gap-2 border-t border-border px-4 py-3">
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && draft.trim()) {
                    onSend(active.id, draft.trim());
                    setDraft("");
                  }
                }}
                placeholder="Escribe un mensaje…"
                className="rounded-full"
              />
              <Button
                onClick={() => {
                  if (!draft.trim()) return;
                  onSend(active.id, draft.trim());
                  setDraft("");
                }}
                className="rounded-full"
              >
                <Send className="mr-1 h-4 w-4" />
                Enviar
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            Selecciona una conversación
          </div>
        )}
      </div>
    </div>
  );
}

// ────── Medical Requests Tab ──────

function MedicalRequestsTab({
  requests,
  handled,
  athletes,
  users,
  onCreateAppointment,
  onArchive,
}: {
  requests: Conversation[];
  handled: string[];
  athletes: { id: string; firstName: string; lastName: string }[];
  users: { id: string; name: string; role: string }[];
  onCreateAppointment: (
    req: Conversation,
    payload: {
      athleteId: string;
      staffId: string;
      date: string;
      time: string;
      reason: string;
      status: "Scheduled";
      notes: string;
    },
  ) => void;
  onArchive: (id: string) => void;
}) {
  const [target, setTarget] = useState<Conversation | null>(null);
  const medics = users.filter((u) => u.role === "medical");

  if (requests.length === 0) {
    return (
      <div className="saito-card p-0">
        <EmptyState>No hay solicitudes médicas pendientes.</EmptyState>
      </div>
    );
  }

  return (
    <div className="saito-card p-0">
      <ul className="divide-y divide-border">
        {requests.map((r) => {
          const isHandled = handled.includes(r.id);
          const athleteName = guessAthleteName(r.title);
          const last = r.messages[r.messages.length - 1];
          return (
            <li key={r.id} className="px-4 py-4 hover:bg-muted/30">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {isHandled ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" /> Cita creada
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                        Pendiente
                      </span>
                    )}
                    <span className="text-[11px] text-muted-foreground tabular-nums">
                      {last ? formatDateTime(last.createdAt) : ""}
                    </span>
                  </div>
                  <div className="mt-1 text-sm font-semibold text-foreground">
                    {r.title}
                  </div>
                  {last && (
                    <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {last.content}
                    </div>
                  )}
                  {athleteName && (
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      Atleta: <strong>{athleteName}</strong>
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    size="sm"
                    onClick={() => setTarget(r)}
                    disabled={isHandled}
                    className="rounded-full"
                  >
                    <CalendarPlus className="mr-1 h-4 w-4" />
                    Crear cita médica
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onArchive(r.id)}>
                    <Archive className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <CreateAppointmentDialog
        request={target}
        athletes={athletes}
        medics={medics}
        onClose={() => setTarget(null)}
        onCreate={(payload) => {
          if (target) onCreateAppointment(target, payload);
          setTarget(null);
        }}
      />
    </div>
  );
}

function CreateAppointmentDialog({
  request,
  athletes,
  medics,
  onClose,
  onCreate,
}: {
  request: Conversation | null;
  athletes: { id: string; firstName: string; lastName: string }[];
  medics: { id: string; name: string }[];
  onClose: () => void;
  onCreate: (payload: {
    athleteId: string;
    staffId: string;
    date: string;
    time: string;
    reason: string;
    status: "Scheduled";
    notes: string;
  }) => void;
}) {
  const guessed = request ? guessAthleteName(request.title) : "";
  const initialAthlete =
    athletes.find(
      (a) => `${a.firstName} ${a.lastName}`.toLowerCase() === (guessed || "").toLowerCase(),
    )?.id ?? athletes[0]?.id ?? "";

  const [athleteId, setAthleteId] = useState(initialAthlete);
  const [staffId, setStaffId] = useState(medics[0]?.id ?? "");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("10:00");
  const [reason, setReason] = useState(
    request?.messages[0]?.content?.slice(0, 80) ?? "Consulta inicial",
  );
  const [notes, setNotes] = useState("");

  return (
    <Dialog
      open={!!request}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Crear cita médica</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Atleta</Label>
              <Select value={athleteId} onValueChange={setAthleteId}>
                <SelectTrigger>
                  <SelectValue placeholder="Atleta" />
                </SelectTrigger>
                <SelectContent>
                  {athletes.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.firstName} {a.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Staff médico</Label>
              <Select value={staffId} onValueChange={setStaffId}>
                <SelectTrigger>
                  <SelectValue placeholder="Médico" />
                </SelectTrigger>
                <SelectContent>
                  {medics.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Fecha</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <Label>Hora</Label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Motivo</Label>
            <Input value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <div>
            <Label>Notas (opcional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Información adicional para la cita"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            disabled={!athleteId || !staffId || !date || !time || !reason}
            onClick={() =>
              onCreate({
                athleteId,
                staffId,
                date,
                time,
                reason,
                status: "Scheduled",
                notes,
              })
            }
          >
            <CalendarPlus className="mr-1 h-4 w-4" />
            Crear cita
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ────── Archived Tab ──────

function ArchivedTab({
  conversations,
  onUnarchive,
  onHide,
}: {
  conversations: Conversation[];
  onUnarchive: (id: string) => void;
  onHide: (id: string) => void;
}) {
  if (conversations.length === 0) {
    return (
      <div className="saito-card p-0">
        <EmptyState>No hay conversaciones archivadas.</EmptyState>
      </div>
    );
  }
  return (
    <div className="saito-card p-0">
      <ul className="divide-y divide-border">
        {conversations.map((c) => {
          const last = c.messages[c.messages.length - 1];
          return (
            <li key={c.id} className="flex items-start justify-between gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Pill>{c.type}</Pill>
                  <span className="truncate text-sm font-medium">{c.title}</span>
                </div>
                {last && (
                  <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
                    {last.content} · {formatDateTime(last.createdAt)}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button size="sm" variant="ghost" onClick={() => onUnarchive(c.id)}>
                  <ArchiveRestore className="mr-1 h-4 w-4" />
                  Restaurar
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onHide(c.id)}>
                  <Inbox className="mr-1 h-4 w-4" />
                  Quitar de mi bandeja
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ────── utils ──────

function extractRecipientsCount(label: string): number | null {
  const m = label.match(/(\d+)\s+destinatari/);
  return m ? Number(m[1]) : null;
}

function guessAthleteName(title: string): string | null {
  const m = title.match(/·\s*(.+)$/);
  return m ? m[1].trim() : null;
}
