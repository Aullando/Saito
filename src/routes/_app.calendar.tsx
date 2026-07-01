import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { PageHeader, Pill } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useT, useTr, useLang } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useData } from "@/lib/store";
import { useCalendarLocal } from "@/lib/calendarLocal";
import { isDemoMode } from "@/lib/appMode";
import { supabase } from "@/integrations/supabase/client";
import {
  DEMO_CALENDAR_EVENTS_ROWS,
  DEMO_SECTIONS_ROWS,
  DEMO_CATEGORIES_ROWS,
  DEMO_GROUPS_ROWS,
} from "@/lib/demoFallbacks";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
  Ban,
  MapPin,
  Users,
  UserCog,
  CalendarDays,
  Clock,
  CircleSlash,
  ClipboardCheck,
  Send,
  StickyNote,
  Eye,
} from "lucide-react";
import { demoOrEmpty } from "@/lib/demoFallback";
import type { CalendarEventType } from "@/lib/types";
import {
  type DBEvent,
  type Occurrence,
  typeOptions,
  typeLabel,
  TYPE_STYLE,
  ROLE_TYPE_FILTER,
  roleOptions,
  TypeBadge,
  Row,
  StatusPill,
  buildMonthGrid,
} from "@/features/calendar/helpers";

export const Route = createFileRoute("/_app/calendar")({
  component: () => (
    <RoleGate roles={["admin", "manager", "technical"]}>
      <AppLayout>
        <CalendarPage />
      </AppLayout>
    </RoleGate>
  ),
});

function CalendarPage() {
  const t = useT();
  const tr = useTr();
  const lang = useLang();
  const TYPE_OPTIONS = typeOptions(lang);
  const ROLE_OPTIONS = roleOptions(lang);
  const { profile, roles } = useAuth();
  const orgId = profile?.organization_id;
  // Permisos explícitos (no mezclar roles operativos con técnicos)
  const canManageCalendarEvents = roles.some((r) => ["admin", "manager"].includes(r));
  const canManageMedicalAppointments = roles.some((r) =>
    ["admin", "manager", "medical"].includes(r),
  );
  // canEditSessionContent existe para futuras acciones de sesión (notas, valoración…)
  // y aplica al entrenador. No habilita edición de eventos generales.
  const canEditSessionContent = roles.some((r) => ["technical", "admin", "manager"].includes(r));
  void canEditSessionContent;
  // Alias de compatibilidad para gates UI que no dependen del tipo de evento.
  const canEdit = canManageCalendarEvents;
  const qc = useQueryClient();
  const demoMode = isDemoMode();
  const demoEvents = useData((s) => s.events);
  const demoSections = useData((s) => s.sections);
  const demoCategories = useData((s) => s.categories);
  const demoGroups = useData((s) => s.groups);
  const demoAthletes = useData((s) => s.athletes);
  const demoUsers = useData((s) => s.users);
  const demoPayments = useData((s) => s.payments);
  const demoFacilities = useData((s) => s.facilities);
  const demoAddEvent = useData((s) => s.addEvent);
  const demoUpdateEvent = useData((s) => s.updateEvent);
  const demoDeleteEvent = useData((s) => s.deleteEvent);
  const demoAddEventException = useData((s) => s.addEventException);

  const {
    cancellations,
    notes,
    hasAttendance,
    hasCommunication,
    cancelEvent,
    uncancelEvent,
    setNote,
    markAttendance,
    markCommunication,
  } = useCalendarLocal();
  const navigate = useNavigate();

  const eventsQ = useQuery({
    queryKey: ["calendar_events", orgId],
    enabled: !!orgId && !demoMode,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("calendar_events")
        .select(
          "id, title, event_date, start_time, type, section_id, category_id, group_id, recurrence",
        )
        .order("event_date");
      if (error) throw error;
      return (data ?? []) as DBEvent[];
    },
  });

  const sectionsQ = useQuery({
    queryKey: ["sport_sections", orgId],
    enabled: !!orgId && !demoMode,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sport_sections")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const categoriesQ = useQuery({
    queryKey: ["categories", orgId],
    enabled: !!orgId && !demoMode,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, section_id")
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const groupsQ = useQuery({
    queryKey: ["groups", orgId],
    enabled: !!orgId && !demoMode,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("groups")
        .select("id, name, section_id, category_id")
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const events: DBEvent[] = demoMode
    ? demoEvents.map(
        (e): DBEvent => ({
          id: e.id,
          title: e.title,
          event_date: e.date,
          start_time: e.startTime,
          type: e.type,
          section_id: e.sectionId ?? null,
          category_id: e.categoryId ?? null,
          group_id: e.groupId ?? null,
          staff_id: e.staffId ?? null,
          location: e.location ?? null,
          recurrence: e.recurrence ? { ...e.recurrence, exceptions: e.exceptions ?? [] } : null,
        }),
      )
    : (demoOrEmpty(eventsQ.data, DEMO_CALENDAR_EVENTS_ROWS) as DBEvent[]);
  const sections = demoMode
    ? demoSections.map((s) => ({ id: s.id, name: s.name }))
    : demoOrEmpty(sectionsQ.data, DEMO_SECTIONS_ROWS);
  const categories = demoMode
    ? demoCategories.map((c) => ({ id: c.id, name: c.name, section_id: c.sectionId }))
    : demoOrEmpty(categoriesQ.data, DEMO_CATEGORIES_ROWS);
  const groups = demoMode
    ? demoGroups.map((g) => ({
        id: g.id,
        name: g.name,
        section_id: g.sectionId,
        category_id: g.categoryId,
      }))
    : demoOrEmpty(groupsQ.data, DEMO_GROUPS_ROWS);

  // ────── Mutations ──────
  type AddPayload = {
    title: string;
    event_date: string;
    start_time: string;
    type: CalendarEventType;
    group_id: string | null;
    section_id: string | null;
    category_id: string | null;
    staff_id: string | null;
    location: string | null;
    recurrence: DBEvent["recurrence"];
  };

  const addEvent = useMutation({
    mutationFn: async (e: AddPayload) => {
      if (demoMode) {
        demoAddEvent({
          title: e.title,
          date: e.event_date,
          startTime: e.start_time,
          type: e.type,
          groupId: e.group_id ?? undefined,
          sectionId: e.section_id ?? undefined,
          categoryId: e.category_id ?? undefined,
          staffId: e.staff_id ?? undefined,
          location: e.location ?? undefined,
          recurrence: e.recurrence ?? undefined,
        });
        return;
      }
      const { error } = await supabase.from("calendar_events").insert({
        organization_id: orgId!,
        title: e.title,
        event_date: e.event_date,
        start_time: e.start_time,
        type: e.type,
        group_id: e.group_id,
        section_id: e.section_id,
        category_id: e.category_id,
        recurrence: e.recurrence,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(tr("Evento creado", "Event created"));
      qc.invalidateQueries({ queryKey: ["calendar_events", orgId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const delEvent = useMutation({
    mutationFn: async (id: string) => {
      if (demoMode) {
        demoDeleteEvent(id);
        return;
      }
      const { error } = await supabase.from("calendar_events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(tr("Evento eliminado", "Event deleted"));
      qc.invalidateQueries({ queryKey: ["calendar_events", orgId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  type EditPayload = {
    id: string;
    title: string;
    event_date: string;
    start_time: string;
    type: CalendarEventType;
    group_id: string | null;
    section_id: string | null;
    category_id: string | null;
    staff_id: string | null;
    location: string | null;
  };

  const updateEvent = useMutation({
    mutationFn: async (e: EditPayload) => {
      if (demoMode) {
        demoUpdateEvent(e.id, {
          title: e.title,
          date: e.event_date,
          startTime: e.start_time,
          type: e.type,
          groupId: e.group_id ?? undefined,
          sectionId: e.section_id ?? undefined,
          categoryId: e.category_id ?? undefined,
          staffId: e.staff_id ?? undefined,
          location: e.location ?? undefined,
        });
        return;
      }
      const { error } = await supabase
        .from("calendar_events")
        .update({
          title: e.title,
          event_date: e.event_date,
          start_time: e.start_time,
          type: e.type,
          group_id: e.group_id,
          section_id: e.section_id,
          category_id: e.category_id,
        })
        .eq("id", e.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(tr("Evento actualizado", "Event updated"));
      qc.invalidateQueries({ queryKey: ["calendar_events", orgId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const addException = useMutation({
    mutationFn: async ({ ev, date }: { ev: DBEvent; date: string }) => {
      const rec = ev.recurrence;
      if (!rec) return;
      if (demoMode) {
        demoAddEventException(ev.id, date);
        return;
      }
      const newRec = { ...rec, exceptions: [...(rec.exceptions ?? []), date] };
      const { error } = await supabase
        .from("calendar_events")
        .update({ recurrence: newRec })
        .eq("id", ev.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["calendar_events", orgId] }),
    onError: (err: Error) => toast.error(err.message),
  });

  // ────── State ──────
  const [cursor, setCursor] = useState(() => new Date());
  const [secF, setSecF] = useState("all");
  const [catF, setCatF] = useState("all");
  const [grpF, setGrpF] = useState("all");
  const [typeF, setTypeF] = useState<string>("all");
  const [roleF, setRoleF] = useState<string>("all");
  const [view, setView] = useState<"month" | "day">("month");
  const [dayCursor, setDayCursor] = useState(() => new Date());
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<Occurrence | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [notesOpen, setNotesOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelNotify, setCancelNotify] = useState(true);

  const initialForm = () => ({
    title: "",
    date: new Date().toISOString().slice(0, 10),
    startTime: "10:00",
    type: "training" as CalendarEventType,
    groupId: "",
    staffId: "",
    location: "",
    recurring: false,
    until: "",
  });
  const [newEv, setNewEv] = useState(initialForm());

  const [editEv, setEditEv] = useState<{
    id: string;
    title: string;
    date: string;
    startTime: string;
    type: CalendarEventType;
    groupId: string;
    staffId: string;
    location: string;
    origDate: string;
    origStartTime: string;
    origLocation: string;
    notifyParticipants: boolean;
  } | null>(null);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const monthLabel = cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const grid = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const passes = (e: DBEvent) => {
    if (secF !== "all" && e.section_id !== secF) return false;
    if (catF !== "all" && e.category_id !== catF) return false;
    if (grpF !== "all" && e.group_id !== grpF) return false;
    if (typeF !== "all" && e.type !== typeF) return false;
    if (roleF !== "all") {
      const allowed = ROLE_TYPE_FILTER[roleF] ?? [];
      if (!allowed.includes(e.type as CalendarEventType)) return false;
    }
    return true;
  };

  const occurrencesForDay = (dayStr: string): Occurrence[] => {
    const out: Occurrence[] = [];
    for (const e of events) {
      if (!passes(e)) continue;
      if (e.event_date === dayStr) {
        out.push({ event: e, date: dayStr });
        continue;
      }
      if (e.recurrence?.freq === "weekly") {
        const start = new Date(e.event_date);
        const day = new Date(dayStr);
        if (day < start) continue;
        if (e.recurrence.until && dayStr > e.recurrence.until) continue;
        const diff = Math.round((day.getTime() - start.getTime()) / 86400000);
        if (diff > 0 && diff % 7 === 0) {
          if (e.recurrence.exceptions?.includes(dayStr)) continue;
          out.push({ event: e, date: dayStr });
        }
      }
    }
    return out;
  };

  const fmtTime = (t: string | null) => (t ? t.slice(0, 5) : "");

  // ────── Detail helpers ──────
  const todayStr = new Date().toISOString().slice(0, 10);

  const lookupGroup = (id: string | null | undefined) =>
    id ? groups.find((g) => g.id === id) : undefined;
  const lookupStaff = (id: string | null | undefined) =>
    id ? demoUsers.find((u) => u.id === id) : undefined;

  const participantsFor = (ev: DBEvent): { id: string; name: string }[] => {
    if (!ev.group_id) return [];
    return demoAthletes
      .filter((a) => a.groupIds.includes(ev.group_id!))
      .map((a) => ({ id: a.id, name: `${a.firstName} ${a.lastName}` }));
  };

  const facilityFor = (ev: DBEvent): string | null => {
    if (ev.location) return ev.location;
    if (ev.section_id) {
      const f = demoFacilities.find((f) => f.sportSections.includes(ev.section_id!));
      if (f) return f.name;
    }
    return null;
  };

  const associationsFor = (ev: DBEvent, dateStr: string) => {
    const isPast = dateStr < todayStr;
    const cancelled = !!cancellations[ev.id];
    const hasNotes = !!notes[ev.id];
    const hasAttn = !!hasAttendance[ev.id] || isPast;
    const hasComm = !!hasCommunication[ev.id] || cancellations[ev.id]?.notified;
    const hasPayment =
      ev.type === "payment" ||
      demoPayments.some(
        (p) => p.date === dateStr && (!ev.section_id || p.sectionId === ev.section_id),
      );
    const participants = participantsFor(ev);
    return {
      isPast,
      cancelled,
      hasNotes,
      hasAttn,
      hasComm,
      hasPayment,
      hasParticipants: participants.length > 0,
      participants,
    };
  };

  const computeStatus = (
    ev: DBEvent,
    dateStr: string,
  ): {
    label: string;
    tone: "muted" | "ok" | "warn" | "danger";
  } => {
    if (cancellations[ev.id]) return { label: tr("Cancelado", "Cancelled"), tone: "danger" };
    if (dateStr < todayStr) return { label: tr("Pasado", "Past"), tone: "muted" };
    if (dateStr === todayStr) return { label: tr("Hoy", "Today"), tone: "warn" };
    return { label: tr("Programado", "Scheduled"), tone: "ok" };
  };

  // ────── Render ──────
  return (
    <>
      <PageHeader
        title={t("calendar")}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => setCursor(new Date())}
            >
              {t("today")}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCursor(new Date(year, month - 1, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-[160px] text-center text-sm font-medium capitalize">
              {monthLabel}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCursor(new Date(year, month + 1, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            {canEdit && (
              <Dialog
                open={open}
                onOpenChange={(o) => {
                  setOpen(o);
                  if (!o) setNewEv(initialForm());
                }}
              >
                <DialogTrigger asChild>
                  <Button size="sm" className="rounded-full">
                    <Plus className="mr-1 h-4 w-4" />
                    {tr("Nuevo evento", "New event")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{tr("Nuevo evento", "New event")}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>{tr("Tipo", "Type")}</Label>
                        <Select
                          value={newEv.type}
                          onValueChange={(v) =>
                            setNewEv({ ...newEv, type: v as CalendarEventType })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TYPE_OPTIONS.map((o) => (
                              <SelectItem key={o.value} value={o.value}>
                                {o.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>{tr("Título", "Title")}</Label>
                        <Input
                          value={newEv.title}
                          onChange={(e) => setNewEv({ ...newEv, title: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>{tr("Fecha", "Date")}</Label>
                        <Input
                          type="date"
                          value={newEv.date}
                          onChange={(e) => setNewEv({ ...newEv, date: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>{tr("Hora", "Time")}</Label>
                        <Input
                          type="time"
                          value={newEv.startTime}
                          onChange={(e) => setNewEv({ ...newEv, startTime: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>{tr("Ubicación", "Location")}</Label>
                      <Input
                        value={newEv.location}
                        onChange={(e) => setNewEv({ ...newEv, location: e.target.value })}
                        placeholder={tr("Pista 1, Sala médica, …", "Court 1, Medical room, …")}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>{tr("Grupo", "Group")}</Label>
                        <Select
                          value={newEv.groupId}
                          onValueChange={(v) => setNewEv({ ...newEv, groupId: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="—" />
                          </SelectTrigger>
                          <SelectContent>
                            {groups.map((g) => (
                              <SelectItem key={g.id} value={g.id}>
                                {g.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>{tr("Staff responsable", "Responsible staff")}</Label>
                        <Select
                          value={newEv.staffId}
                          onValueChange={(v) => setNewEv({ ...newEv, staffId: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="—" />
                          </SelectTrigger>
                          <SelectContent>
                            {demoUsers
                              .filter((u) =>
                                ["technical", "medical", "manager", "admin"].includes(u.role),
                              )
                              .map((u) => (
                                <SelectItem key={u.id} value={u.id}>
                                  {u.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                      <Label className="text-sm">{tr("Recurrente (semanal)", "Recurring (weekly)")}</Label>
                      <Switch
                        checked={newEv.recurring}
                        onCheckedChange={(v) => setNewEv({ ...newEv, recurring: v })}
                      />
                    </div>
                    {newEv.recurring && (
                      <div>
                        <Label>{tr("Hasta", "Until")}</Label>
                        <Input
                          type="date"
                          value={newEv.until}
                          onChange={(e) => setNewEv({ ...newEv, until: e.target.value })}
                        />
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                      {t("cancel")}
                    </Button>
                    <Button
                      onClick={async () => {
                        if (!newEv.title) return;
                        const g = groups.find((g) => g.id === newEv.groupId);
                        await addEvent.mutateAsync({
                          title: newEv.title,
                          event_date: newEv.date,
                          start_time: newEv.startTime,
                          type: newEv.type,
                          group_id: newEv.groupId || null,
                          section_id: g?.section_id ?? null,
                          category_id: g?.category_id ?? null,
                          staff_id: newEv.staffId || null,
                          location: newEv.location || null,
                          recurrence:
                            newEv.recurring && newEv.until
                              ? { freq: "weekly", until: newEv.until }
                              : null,
                        });
                        setNewEv(initialForm());
                        setOpen(false);
                      }}
                    >
                      {tr("Crear", "Create")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Select
          value={secF}
          onValueChange={(v) => {
            setSecF(v);
            setCatF("all");
            setGrpF("all");
          }}
        >
          <SelectTrigger className="w-44 rounded-full">
            <SelectValue placeholder={t("all_sections")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all_sections")}</SelectItem>
            {sections.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={catF}
          onValueChange={(v) => {
            setCatF(v);
            setGrpF("all");
          }}
        >
          <SelectTrigger className="w-44 rounded-full">
            <SelectValue placeholder={t("all_categories")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all_categories")}</SelectItem>
            {categories
              .filter((c) => secF === "all" || c.section_id === secF)
              .map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Select value={grpF} onValueChange={setGrpF}>
          <SelectTrigger className="w-44 rounded-full">
            <SelectValue placeholder={t("all_groups")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all_groups")}</SelectItem>
            {groups
              .filter(
                (g) =>
                  (secF === "all" || g.section_id === secF) &&
                  (catF === "all" || g.category_id === catF),
              )
              .map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Select value={typeF} onValueChange={setTypeF}>
          <SelectTrigger className="w-44 rounded-full">
            <SelectValue placeholder={tr("Todos los tipos", "All types")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{tr("Todos los tipos", "All types")}</SelectItem>
            {TYPE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={roleF} onValueChange={setRoleF}>
          <SelectTrigger className="w-48 rounded-full">
            <SelectValue placeholder={tr("Todos los roles", "All roles")} />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSecF("all");
            setCatF("all");
            setGrpF("all");
            setTypeF("all");
            setRoleF("all");
          }}
        >
          {t("clear_filters")}
        </Button>
        <div className="ml-auto inline-flex rounded-full border border-border p-0.5">
          <button
            type="button"
            onClick={() => setView("month")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              view === "month"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tr("Mes", "Month")}
          </button>
          <button
            type="button"
            onClick={() => setView("day")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              view === "day"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tr("Día", "Day")}
          </button>
        </div>
      </div>

      {view === "day" && (
        <div className="mb-3 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const d = new Date(dayCursor);
              d.setDate(d.getDate() - 1);
              setDayCursor(d);
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[200px] text-center text-sm font-medium capitalize">
            {dayCursor.toLocaleDateString(undefined, {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const d = new Date(dayCursor);
              d.setDate(d.getDate() + 1);
              setDayCursor(d);
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => setDayCursor(new Date())}
          >
            {t("today")}
          </Button>
        </div>
      )}

      {view === "month" && (
        <div className="saito-card p-3">
          <div className="grid grid-cols-7 gap-1 px-1 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {(lang === "es" ? ["L", "M", "X", "J", "V", "S", "D"] : ["M", "T", "W", "T", "F", "S", "S"]).map((d, i) => (
              <div key={i} className="px-2 py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {grid.map((d, i) => {
              const inMonth = d.getMonth() === month;
              const dayStr = d.toISOString().slice(0, 10);
              const dayOcc = occurrencesForDay(dayStr);
              const isToday = d.toDateString() === new Date().toDateString();
              return (
                <div
                  key={i}
                  className={`min-h-[110px] rounded-xl border p-2 ${
                    inMonth
                      ? "border-border bg-card"
                      : "border-transparent bg-muted/30 text-muted-foreground"
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between text-[11px]">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full font-semibold ${
                        isToday ? "bg-primary text-primary-foreground" : ""
                      }`}
                    >
                      {d.getDate()}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {dayOcc.slice(0, 3).map((o, idx) => {
                      const isCancelled = !!cancellations[o.event.id];
                      return (
                        <button
                          key={o.event.id + idx}
                          onClick={() => setDetail(o)}
                          className={`block w-full truncate rounded-md border px-1.5 py-1 text-left text-[11px] font-medium transition hover:opacity-80 ${
                            TYPE_STYLE[o.event.type] ??
                            "bg-primary/10 text-primary border-primary/20"
                          } ${isCancelled ? "line-through opacity-60" : ""}`}
                        >
                          {fmtTime(o.event.start_time)} · {o.event.title}
                          {o.event.recurrence && (
                            <span className="ml-1 text-[10px] opacity-60">↻</span>
                          )}
                        </button>
                      );
                    })}
                    {dayOcc.length > 3 && (
                      <div className="px-1.5 text-[11px] font-medium text-muted-foreground">
                        +{dayOcc.length - 3} {t("more")}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === "day" &&
        (() => {
          const dayStr = dayCursor.toISOString().slice(0, 10);
          const dayOcc = occurrencesForDay(dayStr).sort((a, b) =>
            (a.event.start_time ?? "").localeCompare(b.event.start_time ?? ""),
          );
          return (
            <div className="saito-card p-4">
              {dayOcc.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  {tr("No hay eventos programados.", "No scheduled events.")}
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {dayOcc.map((o, idx) => {
                    const isCancelled = !!cancellations[o.event.id];
                    const group = lookupGroup(o.event.group_id);
                    return (
                      <li key={o.event.id + idx}>
                        <button
                          onClick={() => setDetail(o)}
                          className={`flex w-full items-center gap-4 px-2 py-3 text-left transition hover:bg-muted/40 ${
                            isCancelled ? "opacity-60" : ""
                          }`}
                        >
                          <div className="w-16 text-sm font-semibold tabular-nums text-foreground">
                            {fmtTime(o.event.start_time) || "—"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div
                              className={`truncate text-sm font-medium ${
                                isCancelled ? "line-through" : ""
                              }`}
                            >
                              {o.event.title}
                            </div>
                            <div className="mt-0.5 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                              <TypeBadge type={o.event.type} />
                              {group && <span>· {group.name}</span>}
                              {facilityFor(o.event) && <span>· {facilityFor(o.event)}</span>}
                            </div>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })()}

      {/* ────── Detail Sheet ────── */}
      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {detail &&
            (() => {
              const ev = detail.event;
              const a = associationsFor(ev, detail.date);
              const status = computeStatus(ev, detail.date);
              const cancelInfo = cancellations[ev.id];
              const isFuture = detail.date >= todayStr;
              // Permiso efectivo según tipo de evento
              const canEditThis =
                ev.type === "medical" ? canManageMedicalAppointments : canManageCalendarEvents;
              const canEditEvent = canEditThis && isFuture && !a.cancelled;
              const blockers = [
                a.hasAttn && tr("asistencia registrada", "attendance recorded"),
                a.hasNotes && tr("notas", "notes"),
                a.hasPayment && tr("pagos asociados", "associated payments"),
                a.hasComm && tr("comunicación enviada", "communication sent"),
                a.hasParticipants && a.isPast && tr("participantes históricos", "historical participants"),
              ].filter(Boolean) as string[];
              const canDelete = canEditThis && !a.cancelled && blockers.length === 0;
              const shouldCancel = canEditThis && !a.cancelled && !canDelete && isFuture;
              const group = lookupGroup(ev.group_id);
              const staff = lookupStaff(ev.staff_id ?? null);
              const facility = facilityFor(ev);
              return (
                <>
                  <SheetHeader>
                    <div className="flex items-center gap-2">
                      <TypeBadge type={ev.type} />
                      <StatusPill tone={status.tone}>{status.label}</StatusPill>
                    </div>
                    <SheetTitle className="mt-2">{ev.title}</SheetTitle>
                  </SheetHeader>

                  <div className="mt-5 space-y-4 text-sm">
                    <div className="grid grid-cols-1 gap-2">
                      <Row icon={<CalendarDays className="h-4 w-4" />} label={tr("Fecha", "Date")}>
                        {detail.date}
                      </Row>
                      <Row icon={<Clock className="h-4 w-4" />} label={tr("Hora", "Time")}>
                        {fmtTime(ev.start_time) || "—"}
                      </Row>
                      <Row icon={<MapPin className="h-4 w-4" />} label={tr("Ubicación", "Location")}>
                        {facility ?? "—"}
                      </Row>
                      <Row icon={<Users className="h-4 w-4" />} label={tr("Grupo", "Group")}>
                        {group?.name ?? "—"}
                      </Row>
                      <Row icon={<UserCog className="h-4 w-4" />} label={tr("Staff responsable", "Responsible staff")}>
                        {staff?.name ?? "—"}
                      </Row>
                    </div>

                    <div>
                      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {tr("Participantes", "Participants")} ({a.participants.length})
                      </div>
                      {a.participants.length === 0 ? (
                        <div className="text-xs text-muted-foreground">
                          {tr("Sin participantes asignados.", "No participants assigned.")}
                        </div>
                      ) : (
                        <div className="max-h-32 overflow-y-auto rounded-lg border border-border p-2">
                          <ul className="space-y-1 text-xs">
                            {a.participants.slice(0, 10).map((p) => (
                              <li key={p.id} className="truncate">
                                · {p.name}
                              </li>
                            ))}
                            {a.participants.length > 10 && (
                              <li className="text-muted-foreground">
                                + {a.participants.length - 10} {tr("más", "more")}
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>

                    {ev.recurrence && (
                      <div>
                        <Pill tone="info">↻ {tr("Semanal hasta", "Weekly until")} {ev.recurrence.until}</Pill>
                      </div>
                    )}

                    {cancelInfo && (
                      <div className="rounded-lg border border-rose-200 bg-rose-50/60 px-3 py-2 text-xs text-rose-700">
                        <div className="font-semibold">{tr("Motivo de cancelación", "Cancellation reason")}</div>
                        <div className="mt-0.5">{cancelInfo.reason}</div>
                        <div className="mt-1 text-[11px] opacity-80">
                          {tr("Cancelado el", "Cancelled on")} {new Date(cancelInfo.cancelledAt).toLocaleString()}
                          {cancelInfo.notified ? tr(" · participantes notificados", " · participants notified") : ""}
                        </div>
                      </div>
                    )}

                    {!a.cancelled && blockers.length > 0 && (
                      <div className="rounded-lg border border-amber-200 bg-amber-50/60 px-3 py-2 text-xs text-amber-800">
                        {tr("No se puede eliminar: el evento tiene", "Cannot delete: event has")} {blockers.join(", ")}.
                        {isFuture ? tr(" Usa Cancelar para mantener el historial.", " Use Cancel to keep the history.") : ""}
                      </div>
                    )}

                    {/* Session quick actions (training events) */}
                    {ev.type === "training" && !a.cancelled && (
                      <div>
                        <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {tr("Acciones de sesión", "Session actions")}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              toast.info(tr("Detalle de la sesión", "Session detail"));
                            }}
                          >
                            <Eye className="mr-1 h-4 w-4" />
                            {tr("Ver detalle", "View detail")}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              markCommunication(ev.id, true);
                              toast.success(tr("Convocatoria generada", "Call-up generated"));
                              navigate({ to: "/communication" });
                            }}
                          >
                            <Send className="mr-1 h-4 w-4" />
                            {tr("Convocatoria", "Call-up")}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              markAttendance(ev.id, true);
                              navigate({ to: "/attendance" });
                            }}
                          >
                            <ClipboardCheck className="mr-1 h-4 w-4" />
                            {tr("Asistencia", "Attendance")}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setNoteDraft(notes[ev.id] ?? "");
                              setNotesOpen(true);
                            }}
                          >
                            <StickyNote className="mr-1 h-4 w-4" />
                            {tr("Notas", "Notes")}
                          </Button>
                        </div>
                        {notes[ev.id] && (
                          <div className="mt-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                            <span className="font-semibold text-foreground">{tr("Nota: ", "Note: ")}</span>
                            {notes[ev.id]}
                          </div>
                        )}
                      </div>
                    )}

                    {canEditThis && (
                      <div className="flex flex-col gap-2 pt-2">
                        {canEditEvent && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditEv({
                                id: ev.id,
                                title: ev.title,
                                date: ev.event_date,
                                startTime: ev.start_time ?? "10:00",
                                type: (ev.type as CalendarEventType) || "training",
                                groupId: ev.group_id ?? "",
                                staffId: ev.staff_id ?? "",
                                location: ev.location ?? "",
                                origDate: ev.event_date,
                                origStartTime: ev.start_time ?? "10:00",
                                origLocation: ev.location ?? "",
                                notifyParticipants: true,
                              });
                              setDetail(null);
                            }}
                          >
                            <Pencil className="mr-1 h-4 w-4" />
                            {tr("Editar evento", "Edit event")}
                          </Button>
                        )}

                        {ev.recurrence && isFuture && !a.cancelled && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              await addException.mutateAsync({ ev, date: detail.date });
                              setDetail(null);
                            }}
                          >
                            <CircleSlash className="mr-1 h-4 w-4" />
                            {tr("Omitir solo esta ocurrencia", "Skip only this occurrence")}
                          </Button>
                        )}

                        {shouldCancel && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-rose-200 text-rose-700 hover:bg-rose-50"
                            onClick={() => {
                              setCancelReason("");
                              setCancelNotify(true);
                              setCancelOpen(true);
                            }}
                          >
                            <Ban className="mr-1 h-4 w-4" />
                            {tr("Cancelar evento", "Cancel event")}
                          </Button>
                        )}

                        {canDelete && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={async () => {
                              if (!confirm(tr("¿Eliminar este evento?", "Delete this event?"))) return;
                              await delEvent.mutateAsync(ev.id);
                              setDetail(null);
                            }}
                          >
                            <Trash2 className="mr-1 h-4 w-4" />
                            {tr("Eliminar evento", "Delete event")}
                          </Button>
                        )}

                        {a.cancelled && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              uncancelEvent(ev.id);
                              toast.success(tr("Cancelación revertida", "Cancellation reverted"));
                            }}
                          >
                            {tr("Revertir cancelación", "Revert cancellation")}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
        </SheetContent>
      </Sheet>

      {/* ────── Cancel dialog ────── */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{tr("Cancelar evento", "Cancel event")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              {tr(
                "El evento se mantendrá en el calendario marcado como cancelado, conservando asistencia, notas y comunicaciones existentes.",
                "The event will remain in the calendar marked as cancelled, keeping existing attendance, notes and communications.",
              )}
            </p>
            <div>
              <Label>{tr("Motivo de cancelación", "Cancellation reason")}</Label>
              <Textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                placeholder={tr("Ej: lluvia, instalación cerrada, lesión múltiple…", "E.g.: rain, facility closed, multiple injuries…")}
              />
            </div>
            <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
              <Checkbox checked={cancelNotify} onCheckedChange={(v) => setCancelNotify(!!v)} />
              <span>{tr("Notificar a participantes", "Notify participants")}</span>
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelOpen(false)}>
              {tr("Cerrar", "Close")}
            </Button>
            <Button
              variant="destructive"
              disabled={!cancelReason.trim() || !detail}
              onClick={() => {
                if (!detail) return;
                cancelEvent(detail.event.id, cancelReason.trim(), cancelNotify);
                toast.success(
                  cancelNotify
                    ? tr("Evento cancelado y participantes notificados", "Event cancelled and participants notified")
                    : tr("Evento cancelado", "Event cancelled"),
                );
                setCancelOpen(false);
                setDetail(null);
              }}
            >
              <Ban className="mr-1 h-4 w-4" />
              Cancelar evento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ────── Edit dialog ────── */}
      <Dialog open={!!editEv} onOpenChange={(o) => !o && setEditEv(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar evento</DialogTitle>
          </DialogHeader>
          {editEv && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Tipo</Label>
                  <Select
                    value={editEv.type}
                    onValueChange={(v) => setEditEv({ ...editEv, type: v as CalendarEventType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TYPE_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Título</Label>
                  <Input
                    value={editEv.title}
                    onChange={(e) => setEditEv({ ...editEv, title: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Fecha</Label>
                  <Input
                    type="date"
                    value={editEv.date}
                    onChange={(e) => setEditEv({ ...editEv, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Hora</Label>
                  <Input
                    type="time"
                    value={editEv.startTime}
                    onChange={(e) => setEditEv({ ...editEv, startTime: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Ubicación</Label>
                <Input
                  value={editEv.location}
                  onChange={(e) => setEditEv({ ...editEv, location: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Grupo</Label>
                  <Select
                    value={editEv.groupId}
                    onValueChange={(v) => setEditEv({ ...editEv, groupId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map((g) => (
                        <SelectItem key={g.id} value={g.id}>
                          {g.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Staff responsable</Label>
                  <Select
                    value={editEv.staffId}
                    onValueChange={(v) => setEditEv({ ...editEv, staffId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent>
                      {demoUsers
                        .filter((u) =>
                          ["technical", "medical", "manager", "admin"].includes(u.role),
                        )
                        .map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {(editEv.date !== editEv.origDate ||
                editEv.startTime !== editEv.origStartTime ||
                editEv.location !== editEv.origLocation) && (
                <label className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/60 px-3 py-2 text-sm text-amber-900">
                  <Checkbox
                    checked={editEv.notifyParticipants}
                    onCheckedChange={(v) => setEditEv({ ...editEv, notifyParticipants: !!v })}
                  />
                  <span>Has cambiado fecha, hora o ubicación. Notificar a participantes.</span>
                </label>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditEv(null)}>
              {t("cancel")}
            </Button>
            <Button
              onClick={async () => {
                if (!editEv || !editEv.title) return;
                const g = groups.find((g) => g.id === editEv.groupId);
                const changed =
                  editEv.date !== editEv.origDate ||
                  editEv.startTime !== editEv.origStartTime ||
                  editEv.location !== editEv.origLocation;
                await updateEvent.mutateAsync({
                  id: editEv.id,
                  title: editEv.title,
                  event_date: editEv.date,
                  start_time: editEv.startTime,
                  type: editEv.type,
                  group_id: editEv.groupId || null,
                  section_id: g?.section_id ?? null,
                  category_id: g?.category_id ?? null,
                  staff_id: editEv.staffId || null,
                  location: editEv.location || null,
                });
                if (changed && editEv.notifyParticipants) {
                  markCommunication(editEv.id, true);
                  toast.success("Participantes notificados del cambio");
                }
                setEditEv(null);
              }}
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ────── Notes dialog ────── */}
      <Dialog open={notesOpen} onOpenChange={setNotesOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notas de la sesión</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <Textarea
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              rows={5}
              placeholder="Observaciones, ajustes, incidencias…"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotesOpen(false)}>
              {t("cancel")}
            </Button>
            <Button
              onClick={() => {
                if (detail) {
                  setNote(detail.event.id, noteDraft);
                  toast.success("Nota guardada");
                }
                setNotesOpen(false);
              }}
            >
              Guardar nota
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div className="flex-1">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-sm text-foreground">{children}</div>
      </div>
    </div>
  );
}

function StatusPill({
  tone,
  children,
}: {
  tone: "muted" | "ok" | "warn" | "danger";
  children: React.ReactNode;
}) {
  const map: Record<typeof tone, string> = {
    muted: "bg-slate-100 text-slate-600 border-slate-200",
    ok: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warn: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${map[tone]}`}
    >
      {children}
    </span>
  );
}

function buildMonthGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  const dow = (first.getDay() + 6) % 7;
  start.setDate(first.getDate() - dow);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}
