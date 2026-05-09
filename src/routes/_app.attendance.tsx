import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { PageHeader, Card, Pill } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { ATHLETES, GROUPS, EVENTS, SECTIONS } from "@/lib/seed";
import { Check, X, Minus, CalendarCheck, Users, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/_app/attendance")({
  head: () => ({ meta: [{ title: "Asistencia y disponibilidad — SAITO" }] }),
  component: () => (
    <RoleGate roles={["admin", "manager", "technical"]}>
      <AppLayout>
        <AttendancePage />
      </AppLayout>
    </RoleGate>
  ),
});

type Status = "present" | "absent" | "doubt" | "injured";

const NEXT_TRAININGS = EVENTS.slice(0, 6).map((e) => ({
  id: e.id,
  date: e.date,
  startTime: e.startTime,
  title: e.title,
  groupId: e.groupId!,
}));

// Deterministic mock distribution per athlete+event
const seededStatus = (athleteId: string, eventId: string): Status => {
  const seed = (athleteId + eventId).split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  const r = seed % 10;
  if (r < 6) return "present";
  if (r < 8) return "doubt";
  if (r === 8) return "absent";
  return "injured";
};

const STATUS_META: Record<Status, { label: string; icon: typeof Check; cls: string; tone: "success" | "warning" | "danger" | "info" }> = {
  present: { label: "Presente", icon: Check, cls: "text-emerald-600", tone: "success" },
  doubt: { label: "Duda", icon: Minus, cls: "text-amber-600", tone: "warning" },
  absent: { label: "Ausente", icon: X, cls: "text-rose-600", tone: "danger" },
  injured: { label: "Lesión", icon: ShieldAlert, cls: "text-red-700", tone: "danger" },
};

function AttendancePage() {
  const { profile } = useAuth();
  const [eventId, setEventId] = useState(NEXT_TRAININGS[0]?.id ?? "");
  const [groupFilter, setGroupFilter] = useState<string>("all");

  const event = NEXT_TRAININGS.find((e) => e.id === eventId) ?? NEXT_TRAININGS[0];
  const group = GROUPS.find((g) => g.id === event?.groupId);

  const roster = useMemo(() => {
    const byGroup = ATHLETES.filter((a) =>
      groupFilter === "all"
        ? a.groupIds.includes(event?.groupId ?? "")
        : a.groupIds.includes(groupFilter),
    );
    // If empty (mock data), fall back to first 12 athletes so the screen never feels broken
    return byGroup.length ? byGroup : ATHLETES.slice(0, 12);
  }, [event, groupFilter]);

  const counts = roster.reduce<Record<Status, number>>(
    (acc, a) => {
      const s = seededStatus(a.id, event?.id ?? "");
      acc[s] = (acc[s] ?? 0) + 1;
      return acc;
    },
    { present: 0, doubt: 0, absent: 0, injured: 0 },
  );
  const rate = roster.length ? Math.round((counts.present / roster.length) * 100) : 0;

  return (
    <>
      <PageHeader
        title="Asistencia y disponibilidad"
        subtitle="Confirmaciones del próximo entrenamiento o partido por equipo. Datos demo."
      />

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="min-w-[260px] flex-1">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sesión</label>
          <Select value={eventId} onValueChange={setEventId}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {NEXT_TRAININGS.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.date} · {e.startTime} · {e.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-[200px]">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Equipo / grupo</label>
          <Select value={groupFilter} onValueChange={setGroupFilter}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Grupo de la sesión</SelectItem>
              {GROUPS.map((g) => (
                <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline">Enviar recordatorio al grupo</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={<Users className="h-4 w-4" />} label="Convocados" value={String(roster.length)} />
        <Kpi icon={<Check className="h-4 w-4 text-emerald-600" />} label="Confirmados" value={String(counts.present)} hint={`${rate}%`} />
        <Kpi icon={<Minus className="h-4 w-4 text-amber-600" />} label="Dudas" value={String(counts.doubt)} />
        <Kpi icon={<X className="h-4 w-4 text-rose-600" />} label="Ausencias" value={String(counts.absent + counts.injured)} hint={`${counts.injured} lesión`} />
      </div>

      <Card className="mt-6 p-0">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div>
            <div className="text-sm font-semibold">{event?.title} · {event?.date} {event?.startTime}</div>
            <div className="text-xs text-muted-foreground">{group?.name ?? "—"}</div>
          </div>
          <Pill tone="info"><CalendarCheck className="mr-1 inline h-3 w-3" />Asistencia mock</Pill>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-2 font-semibold">Deportista</th>
                <th className="px-3 py-2 font-semibold">Estado</th>
                <th className="px-3 py-2 font-semibold">Confirmado por</th>
                <th className="px-3 py-2 font-semibold">Notas</th>
              </tr>
            </thead>
            <tbody>
              {roster.map((a) => {
                const s = seededStatus(a.id, event?.id ?? "");
                const meta = STATUS_META[s];
                const Icon = meta.icon;
                return (
                  <tr key={a.id} className="border-t border-border">
                    <td className="px-5 py-2.5 font-medium">{a.firstName} {a.lastName}</td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-flex items-center gap-1.5 ${meta.cls}`}>
                        <Icon className="h-4 w-4" />
                        <span className="text-xs font-semibold">{meta.label}</span>
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground">
                      {s === "present" || s === "doubt" ? "Familia / jugador" : s === "injured" ? "Staff médico" : "—"}
                    </td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground">
                      {s === "doubt" ? "Pendiente confirmar" : s === "injured" ? "Restricción activa" : ""}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="mt-4 text-xs text-muted-foreground">
        {profile?.full_name ? `Vista para ${profile.full_name}.` : ""} La asistencia se sincroniza con el calendario y el módulo médico cuando un deportista está marcado como lesión activa.
      </p>
    </>
  );
}

function Kpi({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string; hint?: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
    </Card>
  );
}

// Suppress unused imports in some builds
void SECTIONS;
