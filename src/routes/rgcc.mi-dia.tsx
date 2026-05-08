// RGCC · Mi Día — vista operativa del monitor actual (adaptada de Covadonga).
// Usa AppLayout y ui-kit de SAITO. Identifica al monitor por profile.full_name.
// Si el usuario es admin/manager: muestra resumen del día y enlace al cockpit.
// Si es socio (athlete): muestra su agenda personal.
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppLayout } from "@/components/AppLayout";
import { Card, PageHeader, Pill } from "@/components/ui-kit";
import { useAuth } from "@/lib/auth";
import { useClub } from "@/clubs/ClubProvider";
import { getRgccMiDiaView, isRgccAdmin } from "@/clubs/rgcc/permissions";
import {
  RGCC_SESSIONS, RGCC_PT_SESSIONS, RGCC_VENUES, RGCC_MEMBERS,
} from "@/clubs/rgcc/seed";
import { Clock, PlayCircle, Users, MapPin, AlertTriangle, CalendarOff, Check } from "lucide-react";

export const Route = createFileRoute("/rgcc/mi-dia")({
  component: () => (
    <AppLayout>
      <MiDiaGate />
    </AppLayout>
  ),
});

function MiDiaGate() {
  const { club } = useClub();
  const { profile, roles } = useAuth();
  if (club.id !== "rgcc") return <Navigate to="/dashboard" />;

  const me = profile?.full_name ?? "";
  const isAdmin = isRgccAdmin(roles);
  const view = getRgccMiDiaView(roles);
  if (view === "monitor") return <MiDiaMonitor monitorName={me} isAdmin={isAdmin} />;
  return <MiDiaSocio memberName={me} />;
}

// ─── Monitor ────────────────────────────────────────────────────────────────

function MiDiaMonitor({ monitorName, isAdmin }: { monitorName: string; isAdmin: boolean }) {
  const today = new Date().toISOString().slice(0, 10);
  const ahora = new Date().toTimeString().slice(0, 5);

  const misClases = useMemo(
    () =>
      RGCC_SESSIONS.filter(
        (c) => c.date === today && (c.primaryCoach === monitorName || c.substituteCoach === monitorName),
      ).sort((a, b) => a.time.localeCompare(b.time)),
    [today, monitorName],
  );

  const misEp = useMemo(
    () => RGCC_PT_SESSIONS.filter((e) => e.coachName === monitorName),
    [monitorName],
  );

  const horas = +(misClases.reduce((a, c) => a + c.durationMin / 60, 0)).toFixed(1);
  const proxima = misClases.find((c) => c.time >= ahora) ?? misClases[0];

  const [checkedIn, setCheckedIn] = useState<Record<string, boolean>>({});
  const doCheckIn = (id: string) => {
    setCheckedIn((p) => ({ ...p, [id]: true }));
    toast.success("Check-in registrado");
  };

  return (
    <>
      <PageHeader title="Mi Día" subtitle={`${monitorName || "Monitor"} · ${today}`} />

      {/* Hero */}
      <Card className="bg-foreground text-background">
        <div className="text-[10.5px] uppercase tracking-[0.2em] opacity-60 font-bold">
          Hola {monitorName || "monitor"}
        </div>
        <div className="mt-1 text-xl font-bold">
          Tienes {misClases.length} clase{misClases.length === 1 ? "" : "s"} hoy · {horas}h producción
        </div>
        <div className="text-sm opacity-70 mt-1">
          {misEp.length} sesión EP asignada{misEp.length === 1 ? "" : "s"}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => toast.success("Solicitud de ausencia enviada (demo)")}
            className="h-8 px-3 rounded-md bg-background/10 text-background text-xs font-bold flex items-center gap-1.5 hover:bg-background/20"
          >
            <CalendarOff className="h-3.5 w-3.5" /> Solicitar ausencia
          </button>
          <button
            onClick={() => toast.success("Incidencia registrada (demo)")}
            className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 hover:opacity-90"
          >
            <AlertTriangle className="h-3.5 w-3.5" /> Reportar incidencia
          </button>
          {isAdmin && (
            <Link
              to="/rgcc/clases"
              className="h-8 px-3 rounded-md bg-background text-foreground text-xs font-bold flex items-center gap-1.5 hover:opacity-90"
            >
              Ir al cockpit
            </Link>
          )}
        </div>
      </Card>

      {/* Próxima clase */}
      {proxima && (
        <Card className="mt-6 border-l-4 border-l-primary">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold flex items-center gap-1.5">
                <Clock className="h-3 w-3" /> Próxima clase · ahora {ahora}
              </div>
              <div className="mt-1 text-xl font-bold leading-tight truncate">{proxima.activity}</div>
              <div className="text-sm text-muted-foreground mt-1">
                <span className="font-bold tabular-nums">{proxima.time}</span> ·{" "}
                {RGCC_VENUES.find((v) => v.id === proxima.venueId)?.name} · {proxima.roomLabel}
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" /> {proxima.bookings.length}/{proxima.capacity}
                </span>
                <span>·</span>
                <span>{proxima.durationMin} min</span>
                {proxima.substituteCoach === monitorName && <Pill tone="info">Sustitución</Pill>}
              </div>
            </div>
            <div className="flex md:flex-col gap-2 md:justify-center">
              {checkedIn[proxima.id] ? (
                <div className="text-xs uppercase tracking-wider font-bold text-success flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" /> Check-in OK
                </div>
              ) : (
                <button
                  onClick={() => doCheckIn(proxima.id)}
                  className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <PlayCircle className="h-4 w-4" /> Check-in
                </button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Listado clases */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {misClases.map((c) => {
            const sede = RGCC_VENUES.find((v) => v.id === c.venueId);
            return (
              <Card key={c.id}>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground font-bold truncate">
                      {c.time} · {sede?.name} · {c.roomLabel}
                    </div>
                    <div className="text-base font-bold truncate">{c.activity}</div>
                    {c.substituteCoach === monitorName && <Pill tone="info">Sustitución</Pill>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {c.bookings.length}/{c.capacity}
                    </span>
                    <Pill tone={c.status === "confirmed" ? "success" : "info"}>{c.status}</Pill>
                  </div>
                </div>
              </Card>
            );
          })}
          {misClases.length === 0 && (
            <Card>
              <p className="text-sm text-muted-foreground text-center py-6">No tienes clases hoy.</p>
            </Card>
          )}
        </div>

        <Card>
          <div className="mb-3">
            <h2 className="text-lg font-semibold">Mis sesiones EP</h2>
            <p className="text-xs text-muted-foreground">{misEp.length} programada(s)</p>
          </div>
          <ul className="space-y-2">
            {misEp.length === 0 && (
              <li className="text-sm text-muted-foreground">Sin sesiones EP asignadas.</li>
            )}
            {misEp.map((e) => (
              <li key={e.id} className="flex items-center gap-2 text-sm">
                <span className="font-bold tabular-nums w-12">{e.time}</span>
                <span className="flex-1 truncate">{e.memberName}</span>
                <Pill tone={e.status === "done" ? "success" : "info"}>{e.status}</Pill>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}

// ─── Socio ──────────────────────────────────────────────────────────────────

function MiDiaSocio({ memberName }: { memberName: string }) {
  const today = new Date().toISOString().slice(0, 10);
  const me = RGCC_MEMBERS.find((m) => `${m.firstName} ${m.lastName}` === memberName) ?? RGCC_MEMBERS[0];
  const mias = RGCC_SESSIONS.filter(
    (c) => c.date >= today && c.bookings.includes(me?.memberNumber ?? ""),
  ).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  return (
    <>
      <PageHeader title="Mi Día" subtitle={me ? `${me.firstName} ${me.lastName} · ${me.memberNumber}` : ""} />
      <div className="space-y-2">
        {mias.length === 0 && (
          <Card>
            <p className="text-sm text-muted-foreground">No tienes reservas próximas.</p>
          </Card>
        )}
        {mias.map((c) => {
          const sede = RGCC_VENUES.find((v) => v.id === c.venueId);
          return (
            <Card key={c.id}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{c.activity}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {sede?.name} · {c.roomLabel}
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div className="font-bold">{c.date} · {c.time}</div>
                  <div className="text-muted-foreground">Monitor: {c.primaryCoach}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
