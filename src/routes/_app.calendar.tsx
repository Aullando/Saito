import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { PageHeader, Pill } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { useT } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useData } from "@/lib/store";
import { isDemoMode } from "@/lib/appMode";
import { supabase } from "@/integrations/supabase/client";
import {
  DEMO_CALENDAR_EVENTS_ROWS,
  DEMO_SECTIONS_ROWS,
  DEMO_CATEGORIES_ROWS,
  DEMO_GROUPS_ROWS,
} from "@/lib/demoFallbacks";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { demoOrEmpty } from "@/lib/demoFallback";

export const Route = createFileRoute("/_app/calendar")({
  component: () => (
    <RoleGate roles={["admin", "manager", "technical"]}>
      <AppLayout>
        <CalendarPage />
      </AppLayout>
    </RoleGate>
  ),
});

interface DBEvent {
  id: string;
  title: string;
  event_date: string;
  start_time: string | null;
  type: string;
  section_id: string | null;
  category_id: string | null;
  group_id: string | null;
  recurrence: { freq: "weekly"; until: string; exceptions?: string[] } | null;
}

interface Occurrence {
  event: DBEvent;
  date: string;
}

function CalendarPage() {
  const t = useT();
  const { profile, roles } = useAuth();
  const orgId = profile?.organization_id;
  const canEdit = roles.some((r) => ["admin", "manager", "technical"].includes(r));
  const qc = useQueryClient();
  const demoMode = isDemoMode();
  const demoEvents = useData((s) => s.events);
  const demoSections = useData((s) => s.sections);
  const demoCategories = useData((s) => s.categories);
  const demoGroups = useData((s) => s.groups);
  const demoAddEvent = useData((s) => s.addEvent);
  const demoDeleteEvent = useData((s) => s.deleteEvent);
  const demoAddEventException = useData((s) => s.addEventException);

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

  const events = demoMode
    ? demoEvents.map((e) => ({
        id: e.id,
        title: e.title,
        event_date: e.date,
        start_time: e.startTime,
        type: e.type,
        section_id: e.sectionId ?? null,
        category_id: e.categoryId ?? null,
        group_id: e.groupId ?? null,
        recurrence: e.recurrence ?? null,
      }))
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

  const addEvent = useMutation({
    mutationFn: async (e: {
      title: string;
      event_date: string;
      start_time: string;
      group_id: string | null;
      section_id: string | null;
      category_id: string | null;
      recurrence: DBEvent["recurrence"];
    }) => {
      if (demoMode) {
        demoAddEvent({
          title: e.title,
          date: e.event_date,
          startTime: e.start_time,
          type: "training",
          groupId: e.group_id ?? undefined,
          sectionId: e.section_id ?? undefined,
          categoryId: e.category_id ?? undefined,
          recurrence: e.recurrence ?? undefined,
        });
        return;
      }
      const { error } = await supabase.from("calendar_events").insert({
        organization_id: orgId!,
        title: e.title,
        event_date: e.event_date,
        start_time: e.start_time,
        type: "training",
        group_id: e.group_id,
        section_id: e.section_id,
        category_id: e.category_id,
        recurrence: e.recurrence,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t("save"));
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

  const [cursor, setCursor] = useState(() => new Date());
  const [secF, setSecF] = useState("all");
  const [catF, setCatF] = useState("all");
  const [grpF, setGrpF] = useState("all");
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<Occurrence | null>(null);
  const [newEv, setNewEv] = useState({
    title: "",
    date: new Date().toISOString().slice(0, 10),
    startTime: "10:00",
    groupId: "",
    recurring: false,
    until: "",
  });

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const monthLabel = cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const grid = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const passes = (e: DBEvent) => {
    if (secF !== "all" && e.section_id !== secF) return false;
    if (catF !== "all" && e.category_id !== catF) return false;
    if (grpF !== "all" && e.group_id !== grpF) return false;
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
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="rounded-full">
                    <Plus className="mr-1 h-4 w-4" />
                    {t("add")}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("add")}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div>
                      <Label>{t("name")}</Label>
                      <Input
                        value={newEv.title}
                        onChange={(e) => setNewEv({ ...newEv, title: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>{t("date")}</Label>
                        <Input
                          type="date"
                          value={newEv.date}
                          onChange={(e) => setNewEv({ ...newEv, date: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Hora</Label>
                        <Input
                          type="time"
                          value={newEv.startTime}
                          onChange={(e) => setNewEv({ ...newEv, startTime: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>{t("group")}</Label>
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
                    <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                      <Label className="text-sm">{t("recurring")}</Label>
                      <Switch
                        checked={newEv.recurring}
                        onCheckedChange={(v) => setNewEv({ ...newEv, recurring: v })}
                      />
                    </div>
                    {newEv.recurring && (
                      <div>
                        <Label>{t("recur_until")}</Label>
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
                          group_id: newEv.groupId || null,
                          section_id: g?.section_id ?? null,
                          category_id: g?.category_id ?? null,
                          recurrence:
                            newEv.recurring && newEv.until
                              ? { freq: "weekly", until: newEv.until }
                              : null,
                        });
                        setNewEv({
                          title: "",
                          date: new Date().toISOString().slice(0, 10),
                          startTime: "10:00",
                          groupId: "",
                          recurring: false,
                          until: "",
                        });
                        setOpen(false);
                      }}
                    >
                      {t("save")}
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSecF("all");
            setCatF("all");
            setGrpF("all");
          }}
        >
          {t("clear_filters")}
        </Button>
      </div>

      <div className="saito-card p-3">
        <div className="grid grid-cols-7 gap-1 px-1 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
            <div key={d} className="px-2 py-1">
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
                className={`min-h-[110px] rounded-xl border p-2 ${inMonth ? "border-border bg-card" : "border-transparent bg-muted/30 text-muted-foreground"}`}
              >
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full font-semibold ${isToday ? "bg-primary text-primary-foreground" : ""}`}
                  >
                    {d.getDate()}
                  </span>
                </div>
                <div className="space-y-1">
                  {dayOcc.slice(0, 3).map((o, idx) => (
                    <button
                      key={o.event.id + idx}
                      onClick={() => setDetail(o)}
                      className="block w-full truncate rounded-md bg-primary/10 px-1.5 py-1 text-left text-[11px] font-medium text-primary hover:bg-primary/15"
                    >
                      {fmtTime(o.event.start_time)} ·{" "}
                      {groups.find((g) => g.id === o.event.group_id)?.name ?? o.event.title}
                      {o.event.recurrence && <span className="ml-1 text-[10px] opacity-60">↻</span>}
                    </button>
                  ))}
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

      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {detail && (
            <>
              <SheetHeader>
                <SheetTitle>{detail.event.title}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">{t("date")}:</span> {detail.date}{" "}
                  {fmtTime(detail.event.start_time)}
                </div>
                <div>
                  <span className="text-muted-foreground">{t("group")}:</span>{" "}
                  {groups.find((g) => g.id === detail.event.group_id)?.name ?? "—"}
                </div>
                <div>
                  <span className="text-muted-foreground">Tipo:</span> {detail.event.type}
                </div>
                {detail.event.recurrence && (
                  <div>
                    <Pill tone="info">↻ Semanal hasta {detail.event.recurrence.until}</Pill>
                  </div>
                )}
                {canEdit && (
                  <div className="flex flex-col gap-2 pt-4">
                    {detail.event.recurrence ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            await addException.mutateAsync({ ev: detail.event, date: detail.date });
                            setDetail(null);
                          }}
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          {t("delete_only_this")}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={async () => {
                            if (!confirm(t("delete_confirm"))) return;
                            await delEvent.mutateAsync(detail.event.id);
                            setDetail(null);
                          }}
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          {t("delete_series")}
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          if (!confirm(t("delete_confirm"))) return;
                          await delEvent.mutateAsync(detail.event.id);
                          setDetail(null);
                        }}
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        {t("delete")}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
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
