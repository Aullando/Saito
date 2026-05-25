// RGCC · Clases — vista operativa adaptada del módulo de Covadonga.
// Usa AppLayout y ui-kit de SAITO. Permisos:
//  - admin / manager → ven todas las clases (cockpit del coordinador).
//  - technical (coach) → solo ven sus clases (titular o sustituto).
//  - resto → vista de socio (sus reservas).
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, PageHeader, Pill } from "@/components/ui-kit";
import { useAuth } from "@/lib/auth";
import { getRgccView } from "@/clubs/rgcc/permissions";
import { resolveRgccIdentity } from "@/clubs/rgcc/identity";
import { RgccGuard } from "@/clubs/rgcc/RgccGuard";
import {
  RGCC_SESSIONS,
  RGCC_INCIDENTS,
  RGCC_ABSENCES,
  RGCC_VENUES,
  RGCC_ROOMS,
  RGCC_MEMBERS,
  type RgccSession,
} from "@/clubs/rgcc/seed";
import { AlertTriangle, Building2, Users, MapPin, Megaphone } from "lucide-react";
import { useTr } from "@/lib/i18n";
import { useTd } from "@/lib/demoI18n";

export const Route = createFileRoute("/_app/rgcc/clases")({
  component: () => (
    <RgccGuard>
      <RgccClasesGate />
    </RgccGuard>
  ),
});

function RgccClasesGate() {
  const { roles, user } = useAuth();
  const view = getRgccView(roles);
  const identity = resolveRgccIdentity(user, roles);
  if (view === "cockpit") return <ClasesCockpit />;
  if (view === "coach") return <ClasesCoach coachName={identity.coachName ?? ""} />;
  return (
    <ClasesSocio
      memberNumber={identity.memberNumber ?? ""}
      memberName={identity.memberName ?? ""}
    />
  );
}

// ─── Cockpit (admin/manager) ────────────────────────────────────────────────

function ClasesCockpit() {
  const tr = useTr();
  const td = useTd();
  const today = new Date().toISOString().slice(0, 10);
  const sessionsToday = useMemo(
    () =>
      RGCC_SESSIONS.filter((c) => c.date === today).sort((a, b) => a.time.localeCompare(b.time)),
    [today],
  );

  const absencesPending = RGCC_ABSENCES.filter((a) => a.status === "requested");
  const incidentsOpen = RGCC_INCIDENTS.filter((i) => i.status !== "resolved");
  const absentToday = new Set(
    RGCC_ABSENCES.filter((a) => a.from <= today && a.to >= today && a.status !== "rejected").map(
      (a) => a.coachName,
    ),
  );
  const sinMonitor = sessionsToday.filter(
    (c) => absentToday.has(c.primaryCoach) && !c.substituteCoach,
  );

  const [venueFilter, setVenueFilter] = useState<string>("ALL");
  const visibles =
    venueFilter === "ALL" ? sessionsToday : sessionsToday.filter((c) => c.venueId === venueFilter);

  return (
    <>
      <PageHeader title={tr("Clases · Cockpit","Classes · Cockpit")} subtitle={tr(`Operativa del día · ${today}`, `Today's operations · ${today}`)} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label={tr("Clases hoy","Classes today")} value={String(sessionsToday.length)} />
        <Kpi
          label={tr("Sin monitor","No coach")}
          value={String(sinMonitor.length)}
          tone={sinMonitor.length ? "danger" : "success"}
        />
        <Kpi
          label={tr("Ausencias por aprobar","Absences to approve")}
          value={String(absencesPending.length)}
          tone={absencesPending.length ? "warning" : "success"}
        />
        <Kpi
          label={tr("Incidencias abiertas","Open incidents")}
          value={String(incidentsOpen.length)}
          tone={incidentsOpen.length ? "warning" : "success"}
        />
      </div>

      <div className="mt-6">
        <Card>
          <div className="mb-3">
            <h2 className="text-lg font-semibold">{tr("Operativa por sede","Operations by venue")}</h2>
            <p className="text-xs text-muted-foreground">{tr("Click para filtrar","Click to filter")}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {RGCC_VENUES.map((sede) => {
              const cs = sessionsToday.filter((c) => c.venueId === sede.id);
              const ocup = cs.reduce((a, c) => a + c.bookings.length, 0);
              const cap = cs.reduce((a, c) => a + c.capacity, 0);
              const salas = RGCC_ROOMS.filter((s) => s.venueId === sede.id);
              const isFilter = venueFilter === sede.id;
              return (
                <button
                  key={sede.id}
                  onClick={() => setVenueFilter(isFilter ? "ALL" : sede.id)}
                  className={`text-left rounded-lg border p-3 transition ${
                    isFilter
                      ? "border-primary bg-muted/50"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <div className="font-semibold text-sm truncate">{sede.name}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div>
                      <span className="text-muted-foreground">{tr("Clases","Classes")}</span>{" "}
                      <span className="font-bold tabular-nums">{cs.length}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{tr("Aforo","Capacity")}</span>{" "}
                      <span className="font-bold tabular-nums">
                        {cap ? Math.round((ocup / cap) * 100) : 0}%
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{tr("Salas","Rooms")}</span>{" "}
                      <span className="font-bold tabular-nums">{salas.length}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{tr("Clases programadas","Scheduled classes")}</h2>
            <p className="text-xs text-muted-foreground">
              {venueFilter === "ALL"
                ? tr("Todas las sedes","All venues")
                : RGCC_VENUES.find((v) => v.id === venueFilter)?.name}
            </p>
          </div>
          {venueFilter !== "ALL" && (
            <button
              onClick={() => setVenueFilter("ALL")}
              className="text-xs text-primary hover:underline"
            >
              {tr("Quitar filtro","Clear filter")}
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[860px]">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="px-3 py-2 w-20">{tr("Hora","Time")}</th>
                <th className="px-3 py-2">{tr("Actividad","Activity")}</th>
                <th className="px-3 py-2">{tr("Sede · Sala","Venue · Room")}</th>
                <th className="px-3 py-2">{tr("Monitor","Coach")}</th>
                <th className="px-3 py-2 w-28">{tr("Aforo","Capacity")}</th>
                <th className="px-3 py-2">{tr("Estado","Status")}</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((c) => {
                const sede = RGCC_VENUES.find((v) => v.id === c.venueId);
                const ocup = c.bookings.length;
                const lleno = ocup >= c.capacity;
                const ausente = absentToday.has(c.primaryCoach) && !c.substituteCoach;
                return (
                  <tr key={c.id} className="border-b border-border align-top hover:bg-muted/30">
                    <td className="px-3 py-2.5 font-bold tabular-nums">{c.time}</td>
                    <td className="px-3 py-2.5">
                      <div className="font-semibold">{td(c.activity)}</div>
                      {c.changeNote && (
                        <div className="text-[10.5px] text-warning mt-0.5">⚠ {c.changeNote}</div>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="font-medium text-xs truncate">{sede?.name}</div>
                      <div className="text-[10.5px] text-muted-foreground truncate">
                        {c.roomLabel}
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className={ausente ? "line-through text-destructive" : ""}>
                        {c.primaryCoach}
                      </div>
                      {c.substituteCoach && (
                        <div className="text-[10.5px] text-success font-bold">
                          → {c.substituteCoach}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-xs">
                      <span className={lleno ? "text-destructive font-bold" : ""}>{ocup}</span>/
                      {c.capacity}
                      {c.waitlist.length > 0 && (
                        <span className="ml-1 text-[10px] text-muted-foreground">
                          +{c.waitlist.length}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      {ausente ? (
                        <Pill tone="danger">{tr("Conflicto","Conflict")}</Pill>
                      ) : c.status === "confirmed" ? (
                        <Pill tone="success">{tr("Confirmada","Confirmed")}</Pill>
                      ) : (
                        <Pill tone="info">{td(c.status)}</Pill>
                      )}
                    </td>
                  </tr>
                );
              })}
              {visibles.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">
                    {tr("Sin clases.","No classes.")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-6">
        <Link to="/rgcc/mi-dia" className="text-sm text-primary hover:underline">
          → {tr("Vista del monitor (Mi Día)","Coach view (My Day)")}
        </Link>
      </div>
    </>
  );
}

// ─── Coach view ─────────────────────────────────────────────────────────────

function ClasesCoach({ coachName }: { coachName: string }) {
  const tr = useTr();
  const today = new Date().toISOString().slice(0, 10);
  const myClasses = RGCC_SESSIONS.filter(
    (c) => c.date >= today && (c.primaryCoach === coachName || c.substituteCoach === coachName),
  ).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  return (
    <>
      <PageHeader title={tr("Mis clases","My classes")} subtitle={coachName || tr("Monitor","Coach")} />
      {myClasses.length === 0 ? (
        <Card>
          <p className="text-sm text-muted-foreground">
            {tr("No tienes clases programadas próximamente.","You have no upcoming classes.")}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {myClasses.map((c) => (
            <SessionRow key={c.id} session={c} coachName={coachName} />
          ))}
        </div>
      )}
    </>
  );
}

function SessionRow({ session: c, coachName }: { session: RgccSession; coachName: string }) {
  const tr = useTr();
  const td = useTd();
  const sede = RGCC_VENUES.find((v) => v.id === c.venueId);
  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground font-bold">
            {c.date} · {c.time} · {sede?.name} · {c.roomLabel}
          </div>
          <div className="text-base font-bold truncate">{td(c.activity)}</div>
          {c.substituteCoach === coachName && <Pill tone="info">{tr("Sustitución","Substitution")}</Pill>}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-xs text-muted-foreground">
            <Users className="inline h-3 w-3" /> {c.bookings.length}/{c.capacity}
          </div>
          <Pill tone={c.status === "confirmed" ? "success" : "info"}>{td(c.status)}</Pill>
        </div>
      </div>
    </Card>
  );
}

// ─── Member view ────────────────────────────────────────────────────────────

function ClasesSocio({ memberNumber, memberName }: { memberNumber: string; memberName: string }) {
  const tr = useTr();
  const td = useTd();
  const me = RGCC_MEMBERS.find((m) => m.memberNumber === memberNumber);
  const fullName = me ? `${me.firstName} ${me.lastName}` : memberName;
  const myBookings = RGCC_SESSIONS.filter((s) => s.bookings.includes(memberNumber));
  return (
    <>
      <PageHeader
        title={tr("Mis reservas","My bookings")}
        subtitle={memberNumber ? `${fullName} · ${memberNumber}` : ""}
      />
      {myBookings.length === 0 ? (
        <Card>
          <p className="text-sm text-muted-foreground">{tr("No tienes reservas próximas.","No upcoming bookings.")}</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {myBookings.map((c) => {
            const sede = RGCC_VENUES.find((v) => v.id === c.venueId);
            return (
              <Card key={c.id}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">{td(c.activity)}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {sede?.name} · {c.roomLabel}
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="font-bold">
                      {c.date} · {c.time}
                    </div>
                    <div className="text-muted-foreground">{tr("Monitor","Coach")}: {c.primaryCoach}</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function Kpi({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "success" | "warning" | "danger";
}) {
  const c =
    tone === "danger"
      ? "text-destructive"
      : tone === "warning"
        ? "text-warning"
        : tone === "success"
          ? "text-success"
          : "text-foreground";
  return (
    <Card>
      <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground font-bold">
        {label}
      </div>
      <div className={`mt-2 text-3xl font-bold leading-none ${c}`}>{value}</div>
    </Card>
  );
}
