import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCurrentUser, useData } from "@/lib/store";
import { useT } from "@/lib/i18n";
import type { MedicalAppointment } from "@/lib/types";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

export const Route = createFileRoute("/medical/calendar")({
  component: () => (
    <RoleGate roles={["medical"]}>
      <AppLayout>
        <MedicalCalendarPage />
      </AppLayout>
    </RoleGate>
  ),
});

function MedicalCalendarPage() {
  const t = useT();
  const u = useCurrentUser()!;
  const athletes = useData((s) => s.athletes);
  const appointments = useData((s) => s.appointments);
  const addAppointment = useData((s) => s.addAppointment);

  const [cursor, setCursor] = useState(() => new Date());
  const [athF, setAthF] = useState("all");
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<MedicalAppointment | null>(null);
  const [form, setForm] = useState({ athleteId: "", date: new Date().toISOString().slice(0, 10), time: "09:00", reason: "" });

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const monthLabel = cursor.toLocaleDateString("es", { month: "long", year: "numeric" });
  const grid = useMemo(() => buildMonthGrid(year, month), [year, month]);
  const filtered = appointments.filter((a) => athF === "all" || a.athleteId === athF);

  return (
    <>
      <PageHeader
        title={t("medical_calendar")}
        actions={
          <>
            <Select value={athF} onValueChange={setAthF}>
              <SelectTrigger className="w-56 rounded-full"><SelectValue placeholder={t("select_athlete")} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("select_athlete")}</SelectItem>
                {athletes.map((a) => (<SelectItem key={a.id} value={a.id}>{a.firstName} {a.lastName}</SelectItem>))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" onClick={() => setCursor(new Date(year, month - 1, 1))}><ChevronLeft className="h-4 w-4" /></Button>
            <span className="min-w-[160px] text-center text-sm font-medium capitalize">{monthLabel}</span>
            <Button variant="ghost" size="icon" onClick={() => setCursor(new Date(year, month + 1, 1))}><ChevronRight className="h-4 w-4" /></Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="rounded-full"><Plus className="mr-1 h-4 w-4" />{t("add_appointment")}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>{t("add_appointment")}</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label>{t("select_athlete")}</Label>
                    <Select value={form.athleteId} onValueChange={(v) => setForm({ ...form, athleteId: v })}>
                      <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                      <SelectContent>{athletes.map((a) => (<SelectItem key={a.id} value={a.id}>{a.firstName} {a.lastName}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Fecha</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
                    <div><Label>Hora</Label><Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></div>
                  </div>
                  <div><Label>Motivo</Label><Input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>{t("cancel")}</Button>
                  <Button onClick={() => {
                    if (!form.athleteId) return;
                    addAppointment({ athleteId: form.athleteId, staffId: u.id, date: form.date, time: form.time, reason: form.reason || "Cita médica", status: "Scheduled", notes: "" });
                    setOpen(false);
                  }}>{t("save")}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <div className="saito-card p-3">
        <div className="grid grid-cols-7 gap-1 px-1 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {["L", "M", "X", "J", "V", "S", "D"].map((d) => (<div key={d} className="px-2 py-1">{d}</div>))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {grid.map((d, i) => {
            const inMonth = d.getMonth() === month;
            const dayStr = d.toISOString().slice(0, 10);
            const dayAppts = filtered.filter((a) => a.date === dayStr);
            const isToday = d.toDateString() === new Date().toDateString();
            return (
              <div key={i} className={`min-h-[110px] rounded-xl border p-2 ${inMonth ? "border-border bg-card" : "border-transparent bg-muted/30 text-muted-foreground"}`}>
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full font-semibold ${isToday ? "bg-primary text-primary-foreground" : ""}`}>{d.getDate()}</span>
                </div>
                <div className="space-y-1">
                  {dayAppts.slice(0, 3).map((a) => {
                    const ath = athletes.find((x) => x.id === a.athleteId);
                    return (
                      <button key={a.id} onClick={() => setDetail(a)} className="block w-full truncate rounded-md bg-info/15 px-1.5 py-1 text-left text-[11px] font-medium text-info-foreground hover:bg-info/20">
                        <span className="text-primary">{a.time}</span> · {ath?.firstName} {ath?.lastName}
                      </button>
                    );
                  })}
                  {dayAppts.length > 3 && <div className="px-1.5 text-[11px] font-medium text-muted-foreground">+{dayAppts.length - 3} {t("more")}</div>}
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
              <SheetHeader><SheetTitle>Cita médica</SheetTitle></SheetHeader>
              <div className="mt-6 space-y-3 text-sm">
                <div><span className="text-muted-foreground">Atleta:</span> {(() => { const a = athletes.find((x) => x.id === detail.athleteId); return a ? `${a.firstName} ${a.lastName}` : "—"; })()}</div>
                <div><span className="text-muted-foreground">Fecha:</span> {detail.date} {detail.time}</div>
                <div><span className="text-muted-foreground">Motivo:</span> {detail.reason}</div>
                <div className="flex items-center gap-2"><span className="text-muted-foreground">Estado:</span> <Pill tone="info">{detail.status}</Pill></div>
                {detail.notes && <div><span className="text-muted-foreground">Notas:</span><div className="mt-1 whitespace-pre-wrap rounded-lg bg-muted p-3 text-xs">{detail.notes}</div></div>}
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
