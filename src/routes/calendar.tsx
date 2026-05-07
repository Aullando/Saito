import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { PageHeader, Pill } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useData } from "@/lib/store";
import { useT } from "@/lib/i18n";
import type { CalendarEvent } from "@/lib/types";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/calendar")({
  component: () => (
    <RoleGate roles={["admin", "manager", "technical"]}>
      <AppLayout>
        <CalendarPage />
      </AppLayout>
    </RoleGate>
  ),
});

interface Occurrence {
  event: CalendarEvent;
  date: string; // YYYY-MM-DD
}

function CalendarPage() {
  const t = useT();
  const events = useData((s) => s.events);
  const sections = useData((s) => s.sections);
  const categories = useData((s) => s.categories);
  const groups = useData((s) => s.groups);
  const addEvent = useData((s) => s.addEvent);
  const deleteEvent = useData((s) => s.deleteEvent);
  const addEventException = useData((s) => s.addEventException);

  const [cursor, setCursor] = useState(() => new Date());
  const [secF, setSecF] = useState("all");
  const [catF, setCatF] = useState("all");
  const [grpF, setGrpF] = useState("all");
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<Occurrence | null>(null);
  const [newEv, setNewEv] = useState({
    title: "", date: new Date().toISOString().slice(0, 10), startTime: "10:00",
    groupId: "", recurring: false, until: "",
  });

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const monthLabel = cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const grid = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const passes = (e: CalendarEvent) => {
    if (secF !== "all" && e.sectionId !== secF) return false;
    if (catF !== "all" && e.categoryId !== catF) return false;
    if (grpF !== "all" && e.groupId !== grpF) return false;
    return true;
  };

  const occurrencesForDay = (dayStr: string): Occurrence[] => {
    const out: Occurrence[] = [];
    for (const e of events) {
      if (!passes(e)) continue;
      if (e.date === dayStr) {
        out.push({ event: e, date: dayStr });
        continue;
      }
      if (e.recurrence?.freq === "weekly") {
        const start = new Date(e.date);
        const day = new Date(dayStr);
        if (day < start) continue;
        if (e.recurrence.until && dayStr > e.recurrence.until) continue;
        const diff = Math.round((day.getTime() - start.getTime()) / 86400000);
        if (diff > 0 && diff % 7 === 0) {
          if (e.exceptions?.includes(dayStr)) continue;
          out.push({ event: e, date: dayStr });
        }
      }
    }
    return out;
  };

  return (
    <>
      <PageHeader
        title={t("calendar")}
        actions={
          <>
            <Button variant="outline" size="sm" className="rounded-full" onClick={() => setCursor(new Date())}>{t("today")}</Button>
            <Button variant="ghost" size="icon" onClick={() => setCursor(new Date(year, month - 1, 1))}><ChevronLeft className="h-4 w-4" /></Button>
            <span className="min-w-[160px] text-center text-sm font-medium capitalize">{monthLabel}</span>
            <Button variant="ghost" size="icon" onClick={() => setCursor(new Date(year, month + 1, 1))}><ChevronRight className="h-4 w-4" /></Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="rounded-full"><Plus className="mr-1 h-4 w-4" />{t("add")}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>{t("add")}</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div><Label>{t("name")}</Label><Input value={newEv.title} onChange={(e) => setNewEv({ ...newEv, title: e.target.value })} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>{t("date")}</Label><Input type="date" value={newEv.date} onChange={(e) => setNewEv({ ...newEv, date: e.target.value })} /></div>
                    <div><Label>Hora</Label><Input type="time" value={newEv.startTime} onChange={(e) => setNewEv({ ...newEv, startTime: e.target.value })} /></div>
                  </div>
                  <div>
                    <Label>{t("group")}</Label>
                    <Select value={newEv.groupId} onValueChange={(v) => setNewEv({ ...newEv, groupId: v })}>
                      <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                      <SelectContent>{groups.map((g) => (<SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                    <Label className="text-sm">{t("recurring")}</Label>
                    <Switch checked={newEv.recurring} onCheckedChange={(v) => setNewEv({ ...newEv, recurring: v })} />
                  </div>
                  {newEv.recurring && (
                    <div><Label>{t("recur_until")}</Label><Input type="date" value={newEv.until} onChange={(e) => setNewEv({ ...newEv, until: e.target.value })} /></div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>{t("cancel")}</Button>
                  <Button onClick={() => {
                    if (!newEv.title) return;
                    const g = groups.find((g) => g.id === newEv.groupId);
                    addEvent({
                      title: newEv.title, date: newEv.date, startTime: newEv.startTime, type: "training",
                      groupId: newEv.groupId || undefined, sectionId: g?.sectionId, categoryId: g?.categoryId,
                      recurrence: newEv.recurring && newEv.until ? { freq: "weekly", until: newEv.until } : undefined,
                    });
                    setNewEv({ title: "", date: new Date().toISOString().slice(0, 10), startTime: "10:00", groupId: "", recurring: false, until: "" });
                    setOpen(false);
                  }}>{t("save")}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Select value={secF} onValueChange={(v) => { setSecF(v); setCatF("all"); setGrpF("all"); }}>
          <SelectTrigger className="w-44 rounded-full"><SelectValue placeholder={t("all_sections")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all_sections")}</SelectItem>
            {sections.map((s) => (<SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>))}
          </SelectContent>
        </Select>
        <Select value={catF} onValueChange={(v) => { setCatF(v); setGrpF("all"); }}>
          <SelectTrigger className="w-44 rounded-full"><SelectValue placeholder={t("all_categories")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all_categories")}</SelectItem>
            {categories.filter((c) => secF === "all" || c.sectionId === secF).map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
          </SelectContent>
        </Select>
        <Select value={grpF} onValueChange={setGrpF}>
          <SelectTrigger className="w-44 rounded-full"><SelectValue placeholder={t("all_groups")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all_groups")}</SelectItem>
            {groups.filter((g) => (secF === "all" || g.sectionId === secF) && (catF === "all" || g.categoryId === catF)).map((g) => (<SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>))}
          </SelectContent>
        </Select>
        <Button variant="ghost" size="sm" onClick={() => { setSecF("all"); setCatF("all"); setGrpF("all"); }}>{t("clear_filters")}</Button>
      </div>

      <div className="saito-card p-3">
        <div className="grid grid-cols-7 gap-1 px-1 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {["L", "M", "X", "J", "V", "S", "D"].map((d) => (<div key={d} className="px-2 py-1">{d}</div>))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {grid.map((d, i) => {
            const inMonth = d.getMonth() === month;
            const dayStr = d.toISOString().slice(0, 10);
            const dayOcc = occurrencesForDay(dayStr);
            const isToday = d.toDateString() === new Date().toDateString();
            return (
              <div key={i} className={`min-h-[110px] rounded-xl border p-2 ${inMonth ? "border-border bg-card" : "border-transparent bg-muted/30 text-muted-foreground"}`}>
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full font-semibold ${isToday ? "bg-primary text-primary-foreground" : ""}`}>{d.getDate()}</span>
                </div>
                <div className="space-y-1">
                  {dayOcc.slice(0, 3).map((o, idx) => (
                    <button key={o.event.id + idx} onClick={() => setDetail(o)} className="block w-full truncate rounded-md bg-primary/10 px-1.5 py-1 text-left text-[11px] font-medium text-primary hover:bg-primary/15">
                      {o.event.startTime} · {groups.find((g) => g.id === o.event.groupId)?.name ?? o.event.title}
                      {o.event.recurrence && <span className="ml-1 text-[10px] opacity-60">↻</span>}
                    </button>
                  ))}
                  {dayOcc.length > 3 && (
                    <div className="px-1.5 text-[11px] font-medium text-muted-foreground">+{dayOcc.length - 3} {t("more")}</div>
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
              <SheetHeader><SheetTitle>{detail.event.title}</SheetTitle></SheetHeader>
              <div className="mt-6 space-y-3 text-sm">
                <div><span className="text-muted-foreground">{t("date")}:</span> {detail.date} {detail.event.startTime}</div>
                <div><span className="text-muted-foreground">{t("group")}:</span> {groups.find((g) => g.id === detail.event.groupId)?.name ?? "—"}</div>
                {detail.event.roleInGroup && <div><Pill tone="info">{detail.event.roleInGroup}</Pill></div>}
                <div><span className="text-muted-foreground">Tipo:</span> {detail.event.type}</div>
                {detail.event.recurrence && (
                  <div><Pill tone="info">↻ Semanal hasta {detail.event.recurrence.until}</Pill></div>
                )}
                <div className="flex flex-col gap-2 pt-4">
                  {detail.event.recurrence ? (
                    <>
                      <Button variant="outline" size="sm" onClick={() => {
                        addEventException(detail.event.id, detail.date);
                        setDetail(null);
                      }}><Trash2 className="mr-1 h-4 w-4" />{t("delete_only_this")}</Button>
                      <Button variant="destructive" size="sm" onClick={() => {
                        if (!confirm(t("delete_confirm"))) return;
                        deleteEvent(detail.event.id);
                        setDetail(null);
                      }}><Trash2 className="mr-1 h-4 w-4" />{t("delete_series")}</Button>
                    </>
                  ) : (
                    <Button variant="destructive" size="sm" onClick={() => {
                      if (!confirm(t("delete_confirm"))) return;
                      deleteEvent(detail.event.id);
                      setDetail(null);
                    }}><Trash2 className="mr-1 h-4 w-4" />{t("delete")}</Button>
                  )}
                </div>
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
