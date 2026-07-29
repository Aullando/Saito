import { useCurrentUser } from "@/lib/store";
import { useTd, useTdField } from "@/lib/demoI18n";
import { useLang } from "@/lib/i18n";
import { Card, Grid } from "@/features/clubModule/helpers";
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

export function IncidenciasView() {
  const tdf = useTdField();
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
              <p className="mt-1 text-xs">{tdf(i, "description")}</p>
            )}
            {i.operationalRestriction && (
              <div className="mt-2 rounded-lg bg-primary/5 px-2 py-1.5 text-[11px] text-primary">
                <span className="font-semibold">Restricción operativa: </span>
                {tdf(i, "operationalRestriction")}
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
export function ModulePreview({ slug, fallback }: { slug: string; fallback: React.ReactNode }) {
  const td = useTd();
  const tdf = useTdField();
  const lang = useLang();
  switch (slug) {
    case "sedes":
      return (
        <Grid>
          {CNSO_VENUES.map((v) => (
            <Card key={v.id}>
              <div className="font-semibold">{v.name}</div>
              <div className="text-xs text-muted-foreground">{td(v.zone)}</div>
              <p className="mt-2 line-clamp-3 text-xs">{tdf(v, "description")}</p>
              <div className="mt-2 text-[11px] text-muted-foreground">{v.schedule}</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {v.services.slice(0, 4).map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
                  >
                    {td(s)}
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
                <span className="font-semibold">{td(r.name)}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] ${
                    r.status === "incident"
                      ? "bg-amber-500/15 text-amber-600"
                      : "bg-emerald-500/15 text-emerald-600"
                  }`}
                >
                  {td(r.status)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {td(r.type)} · aforo {r.capacity}
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
                  <div className="font-semibold truncate">{td(s.name)}</div>
                  <div className="text-xs text-muted-foreground">
                    {td(s.category)} · {s.venueLabel}
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  {s.membersCount}
                </span>
              </div>
              <p className="mt-2 text-xs">{tdf(s, "description")}</p>
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
              <div className="text-xs text-muted-foreground">{td(c.specialty)}</div>
              <div className="mt-1 text-xs">
                Contrato: {c.contractedHours}h · Total: {c.totalHours}h
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
          {CNSO_MEMBERS.map((m) => (
            <Card key={m.id}>
              <div className="font-semibold">
                {m.firstName} {m.lastName}
              </div>
              <div className="text-xs text-muted-foreground">
                {m.memberNumber} · {tdf(m, "activity")}
              </div>
              <div className="mt-1 text-xs">
                Entrenador: {m.coachName} · Nivel {td(m.level)}
              </div>
              {m.goal && (
                <div className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
                  {tdf(m, "goal")}
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
                    {s.time} · {tdf(s, "activity")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {td(s.roomLabel)} · {s.primaryCoach}
                  </div>
                  {s.changeNote && (
                    <div className="mt-1 text-[11px] text-amber-600">{tdf(s, "changeNote")}</div>
                  )}
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
              {a.detail && <p className="mt-1 text-xs">{tdf(a, "detail")}</p>}
              <div className="mt-1 text-[11px] uppercase text-primary">{td(a.status)}</div>
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
                  Entrenador: {s.coachName} · {td(s.status)}
                </div>
                {s.notes && <p className="mt-1 text-xs">{tdf(s, "notes")}</p>}
              </Card>
            ))}
          </div>
          <h3 className="mb-2 text-sm font-semibold">Planes asignados</h3>
          <div className="space-y-2">
            {CNSO_WORKOUTS.map((w) => (
              <Card key={w.id}>
                <div className="font-semibold">{tdf(w, "title")}</div>
                <div className="text-xs text-muted-foreground">
                  {w.memberNumber} · {w.coachName} · {td(w.status)}
                </div>
                <div className="mt-1 text-xs">
                  {w.blocks.length} bloques · origen {td(w.source)}
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
            {CNSO_SETS.map((s) => {
              const blocks =
                (lang !== "es" &&
                  (s as { blocks_en?: string[]; blocks_sr?: string[] })[
                    `blocks_${lang}` as "blocks_en" | "blocks_sr"
                  ]) ||
                s.blocks;
              return (
                <Card key={s.id}>
                  <div className="font-semibold">{tdf(s, "name")}</div>
                  <div className="text-xs text-muted-foreground">
                    {td(s.level)} · {s.totalMeters.toLocaleString("es-ES")} m
                  </div>
                  <p className="mt-1 text-xs">{tdf(s, "goal")}</p>
                  <ul className="mt-2 space-y-0.5 text-[11px] text-muted-foreground">
                    {blocks.slice(0, 3).map((b, i) => (
                      <li key={i}>· {b}</li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </Grid>
          <h3 className="mb-2 mt-6 text-sm font-semibold">
            Catálogo de drills técnicos ({CNSO_DRILLS.length})
          </h3>
          <Grid>
            {CNSO_DRILLS.map((d) => (
              <Card key={d.id}>
                <div className="font-semibold">{tdf(d, "name")}</div>
                <div className="text-xs text-muted-foreground">
                  {td(d.category)} · {tdf(d, "group")}
                </div>
                <div className="mt-1 text-xs">
                  {tdf(d, "equipment")} · {d.dose}
                </div>
                {d.cues && (
                  <div className="mt-1 text-[11px] text-muted-foreground">“{tdf(d, "cues")}”</div>
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
                    <div className="font-semibold truncate">{tdf(c, "name")}</div>
                    <div className="text-xs text-muted-foreground">
                      {c.date} · {tdf(c, "venue")} · {td(c.discipline)}
                    </div>
                    {c.highlight && (
                      <div className="mt-1 text-[11px] text-primary">{tdf(c, "highlight")}</div>
                    )}
                  </div>
                  <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    {td(c.category)}
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
                    <div className="font-semibold">{td(k.name)}</div>
                    <div className="text-xs text-muted-foreground">{td(k.category)}</div>
                  </div>
                  {k.mandatory && (
                    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
                      Obligatorio
                    </span>
                  )}
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  Tallas: {k.sizes.map((s) => td(s)).join(", ")}
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
                  <div className="font-semibold">{tdf(c, "name")}</div>
                  <div className="text-xs text-muted-foreground">
                    {c.date} · {tdf(c, "venue")} · {c.swimmersCount} nadadores
                  </div>
                  {c.highlight && (
                    <div className="mt-1 text-[11px] text-primary">{tdf(c, "highlight")}</div>
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
