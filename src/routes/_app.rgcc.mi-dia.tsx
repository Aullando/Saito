// RGCC · Mi Día — vista operativa del monitor actual (adaptada de Covadonga).
// Usa AppLayout y ui-kit de SAITO. Identifica al monitor por profile.full_name.
// Si el usuario es admin/manager: muestra resumen del día y enlace al cockpit.
// Si es socio (athlete): muestra su agenda personal.
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Card, PageHeader, Pill } from "@/components/ui-kit";
import { useAuth } from "@/lib/auth";
import { getRgccMiDiaView, isRgccAdmin } from "@/clubs/rgcc/permissions";
import { resolveRgccIdentity } from "@/clubs/rgcc/identity";
import { RgccGuard } from "@/clubs/rgcc/RgccGuard";
import { RGCC_SESSIONS, RGCC_PT_SESSIONS, RGCC_VENUES, RGCC_MEMBERS } from "@/clubs/rgcc/seed";
import { Clock, PlayCircle, Users, MapPin, AlertTriangle, CalendarOff, Check } from "lucide-react";
import { useTr } from "@/lib/i18n";
import { useTd } from "@/lib/demoI18n";

export const Route = createFileRoute("/_app/rgcc/mi-dia")({
  component: () => (
    <RgccGuard>
      <MiDiaGate />
    </RgccGuard>
  ),
});

function MiDiaGate() {
  const { user, roles } = useAuth();
  const identity = resolveRgccIdentity(user, roles);
  const isAdmin = isRgccAdmin(roles);
  const view = getRgccMiDiaView(roles);
  if (view === "monitor") {
    const monitorName = identity.coachName ?? identity.displayName ?? "";
    return <MiDiaMonitor monitorName={monitorName} isAdmin={isAdmin} />;
  }
  return (
    <MiDiaSocio memberNumber={identity.memberNumber ?? ""} memberName={identity.memberName ?? ""} />
  );
}

// ─── Monitor ────────────────────────────────────────────────────────────────

function MiDiaMonitor({ monitorName, isAdmin }: { monitorName: string; isAdmin: boolean }) {
  const tr = useTr();
  const td = useTd();
  const today = new Date().toISOString().slice(0, 10);
  const ahora = new Date().toTimeString().slice(0, 5);

  const misClases = useMemo(
    () =>
      RGCC_SESSIONS.filter(
        (c) =>
          c.date === today && (c.primaryCoach === monitorName || c.substituteCoach === monitorName),
      ).sort((a, b) => a.time.localeCompare(b.time)),
    [today, monitorName],
  );

  const misEp = useMemo(
    () => RGCC_PT_SESSIONS.filter((e) => e.coachName === monitorName),
    [monitorName],
  );

  const horas = +misClases.reduce((a, c) => a + c.durationMin / 60, 0).toFixed(1);
  const proxima = misClases.find((c) => c.time >= ahora) ?? misClases[0];

  const [checkedIn, setCheckedIn] = useState<Record<string, boolean>>({});
  const doCheckIn = (id: string) => {
    setCheckedIn((p) => ({ ...p, [id]: true }));
    toast.success(tr("Check-in registrado", "Check-in registered", "Check-in zabeležen"));
  };

  return (
    <>
      <PageHeader title={tr("Mi Día", "My Day", "Moj dan")} subtitle={`${monitorName || tr("Monitor", "Coach", "Trener")} · ${today}`} />

      {/* Hero */}
      <Card className="bg-foreground text-background">
        <div className="text-[10.5px] uppercase tracking-[0.2em] opacity-60 font-bold">
          {tr(`Hola ${monitorName || "monitor"}`, `Hello ${monitorName || "coach"}`, `Zdravo ${monitorName || "treneru"}`)}
        </div>
        <div className="mt-1 text-xl font-bold">
          {tr(
            `Tienes ${misClases.length} clase${misClases.length === 1 ? "" : "s"} hoy · ${horas}h producción`,
            `You have ${misClases.length} class${misClases.length === 1 ? "" : "es"} today · ${horas}h production`,
            `Imate ${misClases.length} časova danas · ${horas}h produkcije`,
          )}
        </div>
        <div className="text-sm opacity-70 mt-1">
          {tr(
            `${misEp.length} sesión EP asignada${misEp.length === 1 ? "" : "s"}`,
            `${misEp.length} PT session${misEp.length === 1 ? "" : "s"} assigned`,
            `${misEp.length} PT sesija dodeljeno`,
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => toast.success(tr("Solicitud de ausencia enviada (demo)", "Absence request sent (demo)", "Zahtev za odsustvo poslat (demo)"))}
            className="h-8 px-3 rounded-md bg-background/10 text-background text-xs font-bold flex items-center gap-1.5 hover:bg-background/20"
          >
            <CalendarOff className="h-3.5 w-3.5" /> {tr("Solicitar ausencia", "Request absence", "Zatraži odsustvo")}
          </button>
          <button
            onClick={() => toast.success(tr("Incidencia registrada (demo)", "Incident logged (demo)", "Incident zabeležen (demo)"))}
            className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 hover:opacity-90"
          >
            <AlertTriangle className="h-3.5 w-3.5" /> {tr("Reportar incidencia", "Report incident", "Prijavi incident")}
          </button>
          {isAdmin && (
            <Link
              to="/rgcc/clases"
              className="h-8 px-3 rounded-md bg-background text-foreground text-xs font-bold flex items-center gap-1.5 hover:opacity-90"
            >
              {tr("Ir al cockpit", "Go to cockpit", "Idi u kokpit")}
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
                <Clock className="h-3 w-3" /> {tr("Próxima clase · ahora", "Next class · now", "Sledeći čas · sada")} {ahora}
              </div>
              <div className="mt-1 text-xl font-bold leading-tight truncate">
                {td(proxima.activity)}
              </div>
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
                {proxima.substituteCoach === monitorName && <Pill tone="info">{tr("Sustitución", "Substitution", "Zamena")}</Pill>}
              </div>
            </div>
            <div className="flex md:flex-col gap-2 md:justify-center">
              {checkedIn[proxima.id] ? (
                <div className="text-xs uppercase tracking-wider font-bold text-success flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" /> {tr("Check-in OK", "Check-in OK", "Check-in OK")}
                </div>
              ) : (
                <button
                  onClick={() => doCheckIn(proxima.id)}
                  className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <PlayCircle className="h-4 w-4" /> {tr("Check-in", "Check-in", "Check-in")}
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
                    <div className="text-base font-bold truncate">{td(c.activity)}</div>
                    {c.substituteCoach === monitorName && <Pill tone="info">{tr("Sustitución", "Substitution", "Zamena")}</Pill>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {c.bookings.length}/{c.capacity}
                    </span>
                    <Pill tone={c.status === "confirmed" ? "success" : "info"}>{td(c.status)}</Pill>
                  </div>
                </div>
              </Card>
            );
          })}
          {misClases.length === 0 && (
            <Card>
              <p className="text-sm text-muted-foreground text-center py-6">
                {tr("No tienes clases hoy.", "No classes today.", "Nema časova danas.")}
              </p>
            </Card>
          )}
        </div>

        <Card>
          <div className="mb-3">
            <h2 className="text-lg font-semibold">{tr("Mis sesiones EP", "My PT sessions", "Moje PT sesije")}</h2>
            <p className="text-xs text-muted-foreground">{misEp.length} {tr("programada(s)", "scheduled", "zakazano")}</p>
          </div>
          <ul className="space-y-2">
            {misEp.length === 0 && (
              <li className="text-sm text-muted-foreground">{tr("Sin sesiones EP asignadas.", "No PT sessions assigned.", "Nema dodeljenih PT sesija.")}</li>
            )}
            {misEp.map((e) => (
              <li key={e.id} className="flex items-center gap-2 text-sm">
                <span className="font-bold tabular-nums w-12">{e.time}</span>
                <span className="flex-1 truncate">{e.memberName}</span>
                <Pill tone={e.status === "done" ? "success" : "info"}>{td(e.status)}</Pill>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}

// ─── Socio ──────────────────────────────────────────────────────────────────


function MiDiaSocio({ memberNumber, memberName }: { memberNumber: string; memberName: string }) {
  const tr = useTr();
  const td = useTd();
  const today = new Date().toISOString().slice(0, 10);
  const me = RGCC_MEMBERS.find((m) => m.memberNumber === memberNumber);
  const fullName = me ? `${me.firstName} ${me.lastName}` : memberName;
  const mias = RGCC_SESSIONS.filter(
    (c) => c.date >= today && c.bookings.includes(memberNumber),
  ).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  return (
    <>
      <PageHeader title={tr("Mi Día", "My Day", "Moj dan")} subtitle={memberNumber ? `${fullName} · ${memberNumber}` : ""} />
      <div className="space-y-2">
        {mias.length === 0 && (
          <Card>
            <p className="text-sm text-muted-foreground">{tr("No tienes reservas próximas.", "No upcoming bookings.", "Nema predstojećih rezervacija.")}</p>
          </Card>
        )}
        {mias.map((c) => {
          const sede = RGCC_VENUES.find((v) => v.id === c.venueId);
          return (
            <Card key={c.id}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{td(c.activity)}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {sede?.name} · {c.roomLabel}
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div className="font-bold">
                    {c.date} · {c.time}
                  </div>
                  <div className="text-muted-foreground">{tr("Monitor", "Coach", "Trener")}: {c.primaryCoach}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );

}
