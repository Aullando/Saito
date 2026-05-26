// Catch-all route /cnso/$slug — renderiza la vista de cada módulo de CNSO
// con un patrón de tarjetas adaptado al perfil del club de natación.
import { createFileRoute, Link } from "@tanstack/react-router";
import { Construction } from "lucide-react";
import { useClub } from "@/clubs/ClubProvider";
import { useCurrentUser } from "@/lib/store";
import { CnsoGuard } from "@/clubs/cnso/CnsoGuard";
import { cnsoNavItems } from "@/clubs/cnso/modules";
import {
  CNSO_VENUES,
  CNSO_ROOMS,
  CNSO_SECTIONS,
  CNSO_COACHES,
  CNSO_MEMBERS,
  CNSO_SESSIONS,
  CNSO_INCIDENTS,
  CNSO_ABSENCES,
  CNSO_CLINIC_SESSIONS,
  CNSO_DRILLS,
  CNSO_SETS,
  CNSO_WORKOUTS,
  CNSO_KIT,
  CNSO_COMPETITIONS,
} from "@/clubs/cnso/seed";

export const Route = createFileRoute("/_app/cnso/$slug")({
  component: () => (
    <CnsoGuard>
      <CnsoModulePage />
    </CnsoGuard>
  ),
});

function CnsoModulePage() {
  const { slug } = Route.useParams();
  const { club } = useClub();
  const item = cnsoNavItems.find((i) => i.slug === slug);
  const label = item?.label ?? slug;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {club.brand.name}
        </p>
        <h1 className="text-2xl font-bold">{label}</h1>
      </header>
      <ModulePreview slug={slug} fallback={<ComingSoon label={label} clubName={club.brand.name} />} />
    </div>
  );
}

function ComingSoon({ label, clubName }: { label: string; clubName: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Construction className="h-8 w-8" />
      </div>
      <h2 className="text-lg font-semibold">{label}</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        Este módulo de {clubName} está en preparación. Pronto estará disponible aquí dentro de SAITO.
      </p>
      <Link
        to="/dashboard"
        className="mt-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Volver al Dashboard
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
 * Vista de incidencias filtrada por rol:
 *  · medical → sólo Salud (con diagnóstico clínico completo).
 *  · technical → sólo Salud con restricción operativa (sin diagnóstico).
 *  · admin / manager → sólo incidencias operativas (Calle, Material, Clima…).
 *  · sysadmin → todo.
 */
function IncidenciasView() {
  const user = useCurrentUser();
  const role = user?.role ?? "manager";
  const list = CNSO_INCIDENTS.filter((i) => {
    const isHealth = i.type === "Salud";
    if (role === "medical" || role === "technical") return isHealth;
    if (role === "admin" || role === "manager") return !isHealth;
    return true;
  });
  if (list.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/40 p-6 text-center text-sm text-muted-foreground">
        No hay incidencias relevantes para tu rol en este momento.
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
                  {i.type}
                  {isHealth && i.athleteName ? ` · ${i.athleteName}` : ""}
                </div>
                <div className="text-xs text-muted-foreground">
                  Reportado por {i.reportedBy}
                  {i.athleteNumber ? ` · ${i.athleteNumber}` : ""}
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${sevClass}`}
              >
                {i.severity}
              </span>
            </div>
            {isHealth && !showDiagnosis ? (
              <p className="mt-1 text-xs italic text-muted-foreground">
                Diagnóstico reservado al staff médico.
              </p>
            ) : (
              <p className="mt-1 text-xs">{i.description}</p>
            )}
            {i.operationalRestriction && (
              <div className="mt-2 rounded-lg bg-primary/5 px-2 py-1.5 text-[11px] text-primary">
                <span className="font-semibold">Restricción operativa: </span>
                {i.operationalRestriction}
              </div>
            )}
            <div className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
              {i.status}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function ModulePreview({ slug, fallback }: { slug: string; fallback: React.ReactNode }) {
  switch (slug) {
    case "sedes":
      return (
        <Grid>
          {CNSO_VENUES.map((v) => (
            <Card key={v.id}>
              <div className="font-semibold">{v.name}</div>
              <div className="text-xs text-muted-foreground">{v.zone}</div>
              <p className="mt-2 line-clamp-3 text-xs">{v.description}</p>
              <div className="mt-2 text-[11px] text-muted-foreground">{v.schedule}</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {v.services.slice(0, 4).map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </Grid>
      );

    case "calles":
      return (
        <Grid>
          {CNSO_ROOMS.map((r) => (
            <Card key={r.id}>
              <div className="flex items-center justify-between">
                <span className="font-semibold">{r.name}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] ${
                    r.status === "incident"
                      ? "bg-amber-500/15 text-amber-600"
                      : "bg-emerald-500/15 text-emerald-600"
                  }`}
                >
                  {r.status}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {r.type} · aforo {r.capacity}
              </div>
            </Card>
          ))}
        </Grid>
      );

    case "secciones":
      return (
        <Grid>
          {CNSO_SECTIONS.map((s) => (
            <Card key={s.id}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-semibold truncate">{s.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {s.category} · {s.venueLabel}
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  {s.membersCount}
                </span>
              </div>
              <p className="mt-2 text-xs">{s.description}</p>
              <div className="mt-2 text-[11px] text-muted-foreground">Resp.: {s.responsible}</div>
            </Card>
          ))}
        </Grid>
      );

    case "tecnicos":
      return (
        <Grid>
          {CNSO_COACHES.map((c) => (
            <Card key={c.id}>
              <div className="font-semibold">{c.name}</div>
              <div className="text-xs text-muted-foreground">{c.specialty}</div>
              <div className="mt-1 text-xs">
                Contrato: {c.contractedHours}h · Total: {c.totalHours}h
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-wide text-primary">
                {c.status}
              </div>
            </Card>
          ))}
        </Grid>
      );

    case "socio":
      return (
        <Grid>
          {CNSO_MEMBERS.map((m) => (
            <Card key={m.id}>
              <div className="font-semibold">
                {m.firstName} {m.lastName}
              </div>
              <div className="text-xs text-muted-foreground">
                {m.memberNumber} · {m.activity}
              </div>
              <div className="mt-1 text-xs">
                Entrenador: {m.coachName} · Nivel {m.level}
              </div>
              {m.goal && (
                <div className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
                  {m.goal}
                </div>
              )}
              {m.bestTimes[0] && (
                <div className="mt-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                  PB: {m.bestTimes[0].event} · {m.bestTimes[0].time}
                </div>
              )}
            </Card>
          ))}
        </Grid>
      );

    case "calle-de-agua":
    case "mi-dia":
      return (
        <div className="space-y-2">
          {CNSO_SESSIONS.map((s) => (
            <Card key={s.id}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold">
                    {s.time} · {s.activity}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {s.roomLabel} · {s.primaryCoach}
                  </div>
                  {s.changeNote && (
                    <div className="mt-1 text-[11px] text-amber-600">{s.changeNote}</div>
                  )}
                </div>
                <div className="text-right text-xs">
                  <div>
                    {s.bookings.length}/{s.capacity}
                  </div>
                  <div className="text-[10px] uppercase tracking-wide text-primary">{s.status}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      );

    case "incidencias":
      return <IncidenciasView />;

    case "vacaciones":
    case "sustituciones":
      return (
        <div className="space-y-2">
          {CNSO_ABSENCES.map((a) => (
            <Card key={a.id}>
              <div className="font-semibold">
                {a.coachName} — {a.reason}
              </div>
              <div className="text-xs text-muted-foreground">
                {a.from} → {a.to}
              </div>
              {a.detail && <p className="mt-1 text-xs">{a.detail}</p>}
              <div className="mt-1 text-[11px] uppercase text-primary">{a.status}</div>
            </Card>
          ))}
        </div>
      );

    case "tecnificacion":
      return (
        <>
          <h3 className="mb-2 text-sm font-semibold">Sesiones individualizadas de hoy</h3>
          <div className="mb-6 space-y-2">
            {CNSO_CLINIC_SESSIONS.map((s) => (
              <Card key={s.id}>
                <div className="font-semibold">
                  {s.time} · {s.memberName}
                </div>
                <div className="text-xs text-muted-foreground">
                  Entrenador: {s.coachName} · {s.status}
                </div>
                {s.notes && <p className="mt-1 text-xs">{s.notes}</p>}
              </Card>
            ))}
          </div>
          <h3 className="mb-2 text-sm font-semibold">Planes asignados</h3>
          <div className="space-y-2">
            {CNSO_WORKOUTS.map((w) => (
              <Card key={w.id}>
                <div className="font-semibold">{w.title}</div>
                <div className="text-xs text-muted-foreground">
                  {w.memberNumber} · {w.coachName} · {w.status}
                </div>
                <div className="mt-1 text-xs">
                  {w.blocks.length} bloques · origen {w.source}
                </div>
              </Card>
            ))}
          </div>
        </>
      );

    case "formacion":
      return (
        <>
          <h3 className="mb-2 text-sm font-semibold">Sets tipo</h3>
          <Grid>
            {CNSO_SETS.map((s) => (
              <Card key={s.id}>
                <div className="font-semibold">{s.name}</div>
                <div className="text-xs text-muted-foreground">
                  {s.level} · {s.totalMeters.toLocaleString("es-ES")} m
                </div>
                <p className="mt-1 text-xs">{s.goal}</p>
                <ul className="mt-2 space-y-0.5 text-[11px] text-muted-foreground">
                  {s.blocks.slice(0, 3).map((b) => (
                    <li key={b}>· {b}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </Grid>
          <h3 className="mb-2 mt-6 text-sm font-semibold">
            Catálogo de drills técnicos ({CNSO_DRILLS.length})
          </h3>
          <Grid>
            {CNSO_DRILLS.map((d) => (
              <Card key={d.id}>
                <div className="font-semibold">{d.name}</div>
                <div className="text-xs text-muted-foreground">
                  {d.category} · {d.group}
                </div>
                <div className="mt-1 text-xs">
                  {d.equipment} · {d.dose}
                </div>
                {d.cues && (
                  <div className="mt-1 text-[11px] text-muted-foreground">“{d.cues}”</div>
                )}
              </Card>
            ))}
          </Grid>
        </>
      );

    case "competiciones":
      return (
        <div className="space-y-2">
          {[...CNSO_COMPETITIONS]
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((c) => (
              <Card key={c.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{c.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {c.date} · {c.venue} · {c.discipline}
                    </div>
                    {c.highlight && (
                      <div className="mt-1 text-[11px] text-primary">{c.highlight}</div>
                    )}
                  </div>
                  <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    {c.category}
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  {c.swimmersCount} convocados CNSO
                </div>
              </Card>
            ))}
        </div>
      );

    case "plus":
      return (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            Ventajas y equipación oficial CNSO Plus para socios.
          </p>
          <Grid>
            {CNSO_KIT.map((k) => (
              <Card key={k.id}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold">{k.name}</div>
                    <div className="text-xs text-muted-foreground">{k.category}</div>
                  </div>
                  {k.mandatory && (
                    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
                      Obligatorio
                    </span>
                  )}
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  Tallas: {k.sizes.join(", ")}
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
            <div className="text-xs text-muted-foreground">Sedes operativas</div>
            <div className="text-2xl font-bold">
              {CNSO_VENUES.filter((v) => v.status === "active").length}
            </div>
          </Card>
          <Card>
            <div className="text-xs text-muted-foreground">Calles y salas</div>
            <div className="text-2xl font-bold">{CNSO_ROOMS.length}</div>
          </Card>
          <Card>
            <div className="text-xs text-muted-foreground">Secciones deportivas</div>
            <div className="text-2xl font-bold">{CNSO_SECTIONS.length}</div>
          </Card>
          <Card>
            <div className="text-xs text-muted-foreground">Entrenadores</div>
            <div className="text-2xl font-bold">{CNSO_COACHES.length}</div>
          </Card>
          <Card>
            <div className="text-xs text-muted-foreground">Sesiones hoy/mañana</div>
            <div className="text-2xl font-bold">{CNSO_SESSIONS.length}</div>
          </Card>
          <Card>
            <div className="text-xs text-muted-foreground">Nadadores totales</div>
            <div className="text-2xl font-bold">
              {CNSO_SECTIONS.reduce((a, s) => a + s.membersCount, 0).toLocaleString("es-ES")}
            </div>
          </Card>
          <Card>
            <div className="text-xs text-muted-foreground">Competiciones programadas</div>
            <div className="text-2xl font-bold">{CNSO_COMPETITIONS.length}</div>
          </Card>
          <Card>
            <div className="text-xs text-muted-foreground">Drills en biblioteca</div>
            <div className="text-2xl font-bold">{CNSO_DRILLS.length}</div>
          </Card>
        </Grid>
      );

    case "direccion":
      return (
        <>
          <Grid>
            <Card>
              <div className="text-xs text-muted-foreground">Sedes activas</div>
              <div className="text-2xl font-bold">
                {CNSO_VENUES.filter((v) => v.status === "active").length}
              </div>
            </Card>
            <Card>
              <div className="text-xs text-muted-foreground">Secciones acuáticas</div>
              <div className="text-2xl font-bold">{CNSO_SECTIONS.length}</div>
            </Card>
            <Card>
              <div className="text-xs text-muted-foreground">Nadadores federados</div>
              <div className="text-2xl font-bold">
                {CNSO_SECTIONS.reduce((a, s) => a + s.membersCount, 0).toLocaleString("es-ES")}
              </div>
            </Card>
            <Card>
              <div className="text-xs text-muted-foreground">Plantilla técnica</div>
              <div className="text-2xl font-bold">{CNSO_COACHES.length}</div>
            </Card>
            <Card>
              <div className="text-xs text-muted-foreground">Incidencias abiertas</div>
              <div className="text-2xl font-bold">{CNSO_INCIDENTS.length}</div>
            </Card>
            <Card>
              <div className="text-xs text-muted-foreground">Próximas competiciones</div>
              <div className="text-2xl font-bold">{CNSO_COMPETITIONS.length}</div>
            </Card>
          </Grid>
          <h3 className="mb-2 mt-6 text-sm font-semibold">Foco de la semana</h3>
          <div className="space-y-2">
            {[...CNSO_COMPETITIONS]
              .sort((a, b) => a.date.localeCompare(b.date))
              .slice(0, 3)
              .map((c) => (
                <Card key={c.id}>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {c.date} · {c.venue} · {c.swimmersCount} nadadores
                  </div>
                  {c.highlight && (
                    <div className="mt-1 text-[11px] text-primary">{c.highlight}</div>
                  )}
                </Card>
              ))}
          </div>
        </>
      );

    case "copiloto":
      return (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            Copiloto operativo CNSO: sugerencias rápidas sobre calle de agua, asistencia y plan
            semanal. Habla con el asistente desde la cabecera para profundizar.
          </p>
          <Grid>
            <Card>
              <div className="font-semibold">Asistencia de hoy</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {CNSO_SESSIONS.reduce((a, s) => a + s.bookings.length, 0)} /{" "}
                {CNSO_SESSIONS.reduce((a, s) => a + s.capacity, 0)} plazas reservadas
              </div>
              <p className="mt-2 text-xs">
                Revisa las calles con baja ocupación y reasigna grupos antes del próximo turno.
              </p>
            </Card>
            <Card>
              <div className="font-semibold">Bajas técnicas</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {CNSO_ABSENCES.length} ausencias activas
              </div>
              <p className="mt-2 text-xs">
                Propón sustituciones automáticas según especialidad (natación, waterpolo, sincro).
              </p>
            </Card>
            <Card>
              <div className="font-semibold">Incidencias abiertas</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {CNSO_INCIDENTS.length} en seguimiento
              </div>
              <p className="mt-2 text-xs">
                Prioriza las de severidad alta y notifica al staff médico de guardia.
              </p>
            </Card>
            <Card>
              <div className="font-semibold">Plan semanal</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {CNSO_WORKOUTS.length} workouts asignados
              </div>
              <p className="mt-2 text-xs">
                Genera sets de {CNSO_DRILLS.length} drills disponibles según objetivo del grupo.
              </p>
            </Card>
          </Grid>
        </>
      );

    default:
      return <>{fallback}</>;
  }
}
