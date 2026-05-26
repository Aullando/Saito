import { createFileRoute, Link } from "@tanstack/react-router";
import { Construction } from "lucide-react";
import { useClub } from "@/clubs/ClubProvider";
import { useCurrentUser } from "@/lib/store";
import { RgccGuard } from "@/clubs/rgcc/RgccGuard";
import { rgccNavItems } from "@/clubs/rgcc/modules";
import {
  RGCC_VENUES,
  RGCC_ROOMS,
  RGCC_SECTIONS,
  RGCC_COACHES,
  RGCC_MEMBERS,
  RGCC_SESSIONS,
  RGCC_INCIDENTS,
  RGCC_ABSENCES,
  RGCC_PT_SESSIONS,
  RGCC_EXERCISES,
  RGCC_ROUTINES,
  RGCC_WORKOUTS,
} from "@/clubs/rgcc/seed";
import { RGCC_SECTION_ICONS } from "@/clubs/rgcc/sectionIcons";

import { useTd, tdSchedule } from "@/lib/demoI18n";
import { useLang, useTr } from "@/lib/i18n";

export const Route = createFileRoute("/_app/rgcc/$slug")({
  component: () => (
    <RgccGuard>
      <RgccModulePage />
    </RgccGuard>
  ),
});

function RgccModulePage() {
  const { slug } = Route.useParams();
  const { club } = useClub();
  const item = rgccNavItems.find((i) => i.slug === slug);
  const tr = useTr();
  const td = useTd();
  const label = td(item?.label ?? slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{club.brand.name}</p>
        <h1 className="text-2xl font-bold">{label}</h1>
      </header>
      <ModulePreview slug={slug} fallback={<ComingSoon label={label} clubName={club.brand.name} tr={tr} />} />
    </div>
  );
}

function ComingSoon({ label, clubName, tr }: { label: string; clubName: string; tr: (es: string, en: string) => string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Construction className="h-8 w-8" />
      </div>
      <h2 className="text-lg font-semibold">{label}</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        {tr(
          `Este módulo de ${clubName} está en preparación. Pronto estará disponible aquí dentro de SAITO.`,
          `This ${clubName} module is in preparation. It will be available here inside SAITO soon.`,
        )}
      </p>
      <Link
        to="/dashboard"
        className="mt-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        {tr("Volver al Dashboard", "Back to Dashboard")}
      </Link>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 text-sm shadow-sm">{children}</div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

/**
 * Incidencias filtradas por rol (mismo patrón que CNSO):
 *  · medical → sólo Salud con diagnóstico completo.
 *  · technical → sólo Salud con restricción operativa (sin diagnóstico).
 *  · admin / manager → sólo incidencias operativas (Sala, Material, Clase…).
 *  · sysadmin → todo.
 */
function RgccIncidenciasView() {
  const tr = useTr();
  const td = useTd();
  const user = useCurrentUser();
  const role = user?.role ?? "manager";
  const list = RGCC_INCIDENTS.filter((i) => {
    const isHealth = i.type === "Salud";
    if (role === "medical" || role === "technical") return isHealth;
    if (role === "admin" || role === "manager") return !isHealth;
    return true;
  });
  if (list.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/40 p-6 text-center text-sm text-muted-foreground">
        {tr(
          "No hay incidencias relevantes para tu rol en este momento.",
          "No incidents relevant to your role right now.",
        )}
      </div>
    );
  }
  const showDiagnosis = role === "medical" || role === "sysadmin";
  return (
    <div className="space-y-2">
      {list.map((i) => {
        const isHealth = i.type === "Salud";
        const sevClass =
          i.severity === "high"
            ? "bg-rose-500/15 text-rose-600"
            : i.severity === "medium"
              ? "bg-amber-500/15 text-amber-600"
              : "bg-emerald-500/15 text-emerald-600";
        return (
          <Card key={i.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-semibold">
                  {td(i.type)}
                  {isHealth && i.athleteName ? ` · ${i.athleteName}` : ""}
                </div>
                <div className="text-xs text-muted-foreground">
                  {tr("Reportado por", "Reported by")} {i.reportedBy}
                  {i.athleteNumber ? ` · ${i.athleteNumber}` : ""}
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${sevClass}`}
              >
                {td(i.severity)}
              </span>
            </div>
            {isHealth && !showDiagnosis ? (
              <p className="mt-1 text-xs italic text-muted-foreground">
                {tr(
                  "Diagnóstico reservado al staff médico.",
                  "Diagnosis restricted to medical staff.",
                )}
              </p>
            ) : (
              <p className="mt-1 text-xs">{td(i.description)}</p>
            )}
            {i.operationalRestriction && (
              <div className="mt-2 rounded-lg bg-primary/5 px-2 py-1.5 text-[11px] text-primary">
                <span className="font-semibold">
                  {tr("Restricción operativa: ", "Operational restriction: ")}
                </span>
                {td(i.operationalRestriction)}
              </div>
            )}
            <div className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
              {td(i.status)}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function ModulePreview({ slug, fallback }: { slug: string; fallback: React.ReactNode }) {
  const td = useTd();
  const tr = useTr();
  const lang = useLang();

  switch (slug) {
    case "sedes":
      return (
        <Grid>
          {RGCC_VENUES.map((v) => (
            <Card key={v.id}>
              <div className="font-semibold">{v.name}</div>
              <div className="text-xs text-muted-foreground">{td(v.zone)}</div>
              <p className="mt-2 line-clamp-3 text-xs">{td(v.description)}</p>
              <div className="mt-2 text-[11px] text-muted-foreground">{tdSchedule(v.schedule, lang)}</div>
            </Card>
          ))}
        </Grid>
      );
    case "salas":
      return (
        <Grid>
          {RGCC_ROOMS.map((r) => (
            <Card key={r.id}>
              <div className="flex items-center justify-between">
                <span className="font-semibold">{r.name}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] ${r.status === "incident" ? "bg-amber-500/15 text-amber-600" : "bg-emerald-500/15 text-emerald-600"}`}
                >
                  {td(r.status)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {td(r.type)} · {tr("aforo", "capacity")} {r.capacity}
              </div>
            </Card>
          ))}
        </Grid>
      );
    case "secciones":
      return (
        <Grid>
          {RGCC_SECTIONS.map((s) => {
            const icon = RGCC_SECTION_ICONS[s.id];
            return (
              <Card key={s.id}>
                <div className="flex items-start gap-3">
                  {icon && (
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-muted">
                      <img src={icon} alt="" className="h-9 w-9 object-contain" loading="lazy" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{td(s.name)}</div>
                    <div className="text-xs text-muted-foreground">
                      {td(s.category)} · {s.venueLabel}
                    </div>
                    <div className="mt-1 text-xs">{tr("Resp.", "Lead")}: {s.responsible}</div>
                    <div className="mt-1 text-xs text-primary">{s.membersCount} {tr("socios", "members")}</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </Grid>
      );
    case "monitores":
      return (
        <Grid>
          {RGCC_COACHES.slice(0, 18).map((c) => (
            <Card key={c.id}>
              <div className="font-semibold">{c.name}</div>
              <div className="text-xs text-muted-foreground">{c.specialty}</div>
              <div className="mt-1 text-xs">
                {tr("Contrato", "Contract")}: {c.contractedHours}h · {tr("Total", "Total")}: {c.totalHours}h
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-wide text-primary">
                {td(c.status)}
              </div>
            </Card>
          ))}
        </Grid>
      );
    case "socio":
      return (
        <Grid>
          {RGCC_MEMBERS.map((m) => (
            <Card key={m.id}>
              <div className="font-semibold">
                {m.firstName} {m.lastName}
              </div>
              <div className="text-xs text-muted-foreground">
                {m.memberNumber} · {td(m.activity)}
              </div>
              <div className="mt-1 text-xs">
                {tr("Monitor", "Coach")}: {m.coachName} · {tr("Nivel", "Level")} {m.level}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground line-clamp-2">{m.goal}</div>
            </Card>
          ))}
        </Grid>
      );
    case "clases":
    case "mi-dia":
      return (
        <div className="space-y-2">
          {RGCC_SESSIONS.map((s) => (
            <Card key={s.id}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold">
                    {s.time} · {td(s.activity)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {s.roomLabel} · {s.primaryCoach}
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div>
                    {s.bookings.length}/{s.capacity}
                  </div>
                  <div className="text-[10px] uppercase tracking-wide text-primary">{td(s.status)}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      );
    case "incidencias":
      return <RgccIncidenciasView />;
    case "vacaciones":
    case "sustituciones":
      return (
        <div className="space-y-2">
          {RGCC_ABSENCES.map((a) => (
            <Card key={a.id}>
              <div className="font-semibold">
                {a.coachName} — {td(a.reason)}
              </div>
              <div className="text-xs text-muted-foreground">
                {a.from} → {a.to}
              </div>
              {a.detail && <p className="mt-1 text-xs">{td(a.detail)}</p>}
              <div className="mt-1 text-[11px] uppercase text-primary">{td(a.status)}</div>
            </Card>
          ))}
        </div>
      );
    case "entrenamiento-personal":
      return (
        <>
          <h3 className="mb-2 text-sm font-semibold">{tr("Sesiones de hoy", "Today's sessions")}</h3>
          <div className="mb-6 space-y-2">
            {RGCC_PT_SESSIONS.map((s) => (
              <Card key={s.id}>
                <div className="font-semibold">
                  {s.time} · {s.memberName}
                </div>
                <div className="text-xs text-muted-foreground">
                  {tr("Monitor", "Coach")}: {s.coachName} · {td(s.status)}
                </div>
              </Card>
            ))}
          </div>
          <h3 className="mb-2 text-sm font-semibold">{tr("Asignaciones recientes", "Recent assignments")}</h3>
          <div className="space-y-2">
            {RGCC_WORKOUTS.map((w) => (
              <Card key={w.id}>
                <div className="font-semibold">{w.title}</div>
                <div className="text-xs text-muted-foreground">
                  {w.memberNumber} · {w.coachName} · {td(w.status)}
                </div>
                <div className="mt-1 text-xs">
                  {w.blocks.length} {tr("bloques", "blocks")} · {tr("origen", "source")} {w.source}
                </div>
              </Card>
            ))}
          </div>
        </>
      );
    case "biblioteca":
      return (
        <>
          <h3 className="mb-2 text-sm font-semibold">{tr("Rutinas", "Routines")}</h3>
          <Grid>
            {RGCC_ROUTINES.map((r) => (
              <Card key={r.id}>
                <div className="font-semibold">{r.name}</div>
                <div className="text-xs text-muted-foreground">
                  {r.level} · {r.durationMin} min
                </div>
                <p className="mt-1 text-xs">{r.goal}</p>
              </Card>
            ))}
          </Grid>
          <h3 className="mb-2 mt-6 text-sm font-semibold">{tr("Ejercicios", "Exercises")} ({RGCC_EXERCISES.length})</h3>
          <Grid>
            {RGCC_EXERCISES.map((e) => (
              <Card key={e.id}>
                <div className="font-semibold">{e.name}</div>
                <div className="text-xs text-muted-foreground">
                  {td(e.category)} · {e.group}
                </div>
                <div className="mt-1 text-xs">
                  {e.equipment} · {e.dose}
                </div>
              </Card>
            ))}
          </Grid>
        </>
      );
    case "resumen":
    case "centro-datos":
      return (
        <Grid>
          <Card>
            <div className="text-xs text-muted-foreground">{tr("Sedes operativas", "Active venues")}</div>
            <div className="text-2xl font-bold">
              {RGCC_VENUES.filter((v) => v.status === "active").length}
            </div>
          </Card>
          <Card>
            <div className="text-xs text-muted-foreground">{tr("Salas", "Rooms")}</div>
            <div className="text-2xl font-bold">{RGCC_ROOMS.length}</div>
          </Card>
          <Card>
            <div className="text-xs text-muted-foreground">{tr("Secciones deportivas", "Sport sections")}</div>
            <div className="text-2xl font-bold">{RGCC_SECTIONS.length}</div>
          </Card>
          <Card>
            <div className="text-xs text-muted-foreground">{tr("Monitores", "Coaches")}</div>
            <div className="text-2xl font-bold">{RGCC_COACHES.length}</div>
          </Card>
          <Card>
            <div className="text-xs text-muted-foreground">{tr("Clases hoy/mañana", "Classes today/tomorrow")}</div>
            <div className="text-2xl font-bold">{RGCC_SESSIONS.length}</div>
          </Card>
          <Card>
            <div className="text-xs text-muted-foreground">{tr("Socios totales (secciones)", "Total members (sections)")}</div>
            <div className="text-2xl font-bold">
              {RGCC_SECTIONS.reduce((a, s) => a + s.membersCount, 0).toLocaleString(lang === "es" ? "es-ES" : "en-US")}
            </div>
          </Card>
        </Grid>
      );
    default:
      return <>{fallback}</>;
  }
}
