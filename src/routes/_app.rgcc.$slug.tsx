import { createFileRoute, Link } from "@tanstack/react-router";
import { Construction } from "lucide-react";
import { useClub } from "@/clubs/ClubProvider";
import { RgccGuard } from "@/clubs/rgcc/RgccGuard";
import { rgccNavItems } from "@/clubs/rgcc/modules";
import {
  RGCC_VENUES, RGCC_ROOMS, RGCC_SECTIONS, RGCC_COACHES, RGCC_MEMBERS,
  RGCC_SESSIONS, RGCC_INCIDENTS, RGCC_ABSENCES, RGCC_PT_SESSIONS,
  RGCC_EXERCISES, RGCC_ROUTINES, RGCC_WORKOUTS,
} from "@/clubs/rgcc/seed";
import { RGCC_SECTION_ICONS } from "@/clubs/rgcc/sectionIcons";

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
  const label = item?.label ?? slug;

  const preview = previewFor(slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{club.brand.name}</p>
        <h1 className="text-2xl font-bold">{label}</h1>
      </header>
      {preview ?? <ComingSoon label={label} clubName={club.brand.name} />}
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
        Este módulo de <span className="font-medium text-foreground">{clubName}</span> está en
        preparación. Pronto estará disponible aquí dentro de SAITO.
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

// ─── Per-module preview using RGCC seed data ────────────────────────────────

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-border bg-card p-4 text-sm shadow-sm">{children}</div>;
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

function previewFor(slug: string): React.ReactNode | null {
  switch (slug) {
    case "sedes":
      return (
        <Grid>
          {RGCC_VENUES.map((v) => (
            <Card key={v.id}>
              <div className="font-semibold">{v.name}</div>
              <div className="text-xs text-muted-foreground">{v.zone}</div>
              <p className="mt-2 line-clamp-3 text-xs">{v.description}</p>
              <div className="mt-2 text-[11px] text-muted-foreground">{v.schedule}</div>
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
                <span className={`rounded-full px-2 py-0.5 text-[10px] ${r.status === "incident" ? "bg-amber-500/15 text-amber-600" : "bg-emerald-500/15 text-emerald-600"}`}>{r.status}</span>
              </div>
              <div className="text-xs text-muted-foreground">{r.type} · aforo {r.capacity}</div>
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
                    <div className="font-semibold truncate">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.category} · {s.venueLabel}</div>
                    <div className="mt-1 text-xs">Resp.: {s.responsible}</div>
                    <div className="mt-1 text-xs text-primary">{s.membersCount} socios</div>
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
              <div className="mt-1 text-xs">Contrato: {c.contractedHours}h · Total: {c.totalHours}h</div>
              <div className="mt-1 text-[11px] uppercase tracking-wide text-primary">{c.status}</div>
            </Card>
          ))}
        </Grid>
      );
    case "socio":
      return (
        <Grid>
          {RGCC_MEMBERS.map((m) => (
            <Card key={m.id}>
              <div className="font-semibold">{m.firstName} {m.lastName}</div>
              <div className="text-xs text-muted-foreground">{m.memberNumber} · {m.activity}</div>
              <div className="mt-1 text-xs">Monitor: {m.coachName} · Nivel {m.level}</div>
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
                  <div className="font-semibold">{s.time} · {s.activity}</div>
                  <div className="text-xs text-muted-foreground">{s.roomLabel} · {s.primaryCoach}</div>
                </div>
                <div className="text-right text-xs">
                  <div>{s.bookings.length}/{s.capacity}</div>
                  <div className="text-[10px] uppercase tracking-wide text-primary">{s.status}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      );
    case "incidencias":
      return (
        <div className="space-y-2">
          {RGCC_INCIDENTS.map((i) => (
            <Card key={i.id}>
              <div className="font-semibold">{i.type} · {i.severity}</div>
              <div className="text-xs text-muted-foreground">Reportado por {i.reportedBy}</div>
              <p className="mt-1 text-xs">{i.description}</p>
            </Card>
          ))}
        </div>
      );
    case "vacaciones":
    case "sustituciones":
      return (
        <div className="space-y-2">
          {RGCC_ABSENCES.map((a) => (
            <Card key={a.id}>
              <div className="font-semibold">{a.coachName} — {a.reason}</div>
              <div className="text-xs text-muted-foreground">{a.from} → {a.to}</div>
              {a.detail && <p className="mt-1 text-xs">{a.detail}</p>}
              <div className="mt-1 text-[11px] uppercase text-primary">{a.status}</div>
            </Card>
          ))}
        </div>
      );
    case "entrenamiento-personal":
      return (
        <>
          <h3 className="mb-2 text-sm font-semibold">Sesiones de hoy</h3>
          <div className="mb-6 space-y-2">
            {RGCC_PT_SESSIONS.map((s) => (
              <Card key={s.id}>
                <div className="font-semibold">{s.time} · {s.memberName}</div>
                <div className="text-xs text-muted-foreground">Coach: {s.coachName} · {s.status}</div>
              </Card>
            ))}
          </div>
          <h3 className="mb-2 text-sm font-semibold">Asignaciones recientes</h3>
          <div className="space-y-2">
            {RGCC_WORKOUTS.map((w) => (
              <Card key={w.id}>
                <div className="font-semibold">{w.title}</div>
                <div className="text-xs text-muted-foreground">{w.memberNumber} · {w.coachName} · {w.status}</div>
                <div className="mt-1 text-xs">{w.blocks.length} bloques · origen {w.source}</div>
              </Card>
            ))}
          </div>
        </>
      );
    case "biblioteca":
      return (
        <>
          <h3 className="mb-2 text-sm font-semibold">Rutinas</h3>
          <Grid>
            {RGCC_ROUTINES.map((r) => (
              <Card key={r.id}>
                <div className="font-semibold">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.level} · {r.durationMin} min</div>
                <p className="mt-1 text-xs">{r.goal}</p>
              </Card>
            ))}
          </Grid>
          <h3 className="mb-2 mt-6 text-sm font-semibold">Ejercicios ({RGCC_EXERCISES.length})</h3>
          <Grid>
            {RGCC_EXERCISES.map((e) => (
              <Card key={e.id}>
                <div className="font-semibold">{e.name}</div>
                <div className="text-xs text-muted-foreground">{e.category} · {e.group}</div>
                <div className="mt-1 text-xs">{e.equipment} · {e.dose}</div>
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
            <div className="text-2xl font-bold">{RGCC_VENUES.filter((v) => v.status === "active").length}</div>
          </Card>
          <Card>
            <div className="text-xs text-muted-foreground">Salas</div>
            <div className="text-2xl font-bold">{RGCC_ROOMS.length}</div>
          </Card>
          <Card>
            <div className="text-xs text-muted-foreground">Secciones deportivas</div>
            <div className="text-2xl font-bold">{RGCC_SECTIONS.length}</div>
          </Card>
          <Card>
            <div className="text-xs text-muted-foreground">Monitores</div>
            <div className="text-2xl font-bold">{RGCC_COACHES.length}</div>
          </Card>
          <Card>
            <div className="text-xs text-muted-foreground">Clases hoy/mañana</div>
            <div className="text-2xl font-bold">{RGCC_SESSIONS.length}</div>
          </Card>
          <Card>
            <div className="text-xs text-muted-foreground">Socios totales (secciones)</div>
            <div className="text-2xl font-bold">
              {RGCC_SECTIONS.reduce((a, s) => a + s.membersCount, 0).toLocaleString("es-ES")}
            </div>
          </Card>
        </Grid>
      );
    default:
      return null;
  }
}
