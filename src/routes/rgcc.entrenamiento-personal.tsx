// RGCC · Entrenamiento Personal — sesiones EP y workouts asignados.
// Permisos:
//  - admin / manager → cockpit completo del día.
//  - technical (coach) → solo sus sesiones.
//  - athlete / socio → sus workouts asignados.
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, PageHeader, Pill, EmptyState } from "@/components/ui-kit";
import { useAuth } from "@/lib/auth";
import { useClub } from "@/clubs/ClubProvider";
import {
  RGCC_PT_SESSIONS, RGCC_WORKOUTS, RGCC_ROUTINES, RGCC_EXERCISES,
  type RgccPtSession, type RgccWorkout,
} from "@/clubs/rgcc/seed";
import { getRgccExerciseImage } from "@/clubs/rgcc/exerciseImages";
import { Clock, Dumbbell, User, Sparkles, ListChecks } from "lucide-react";

export const Route = createFileRoute("/rgcc/entrenamiento-personal")({
  component: () => (
    <AppLayout>
      <PtGate />
    </AppLayout>
  ),
});

function PtGate() {
  const { club } = useClub();
  const { roles, profile } = useAuth();
  if (club.id !== "rgcc") return <Navigate to="/dashboard" />;

  const view = getRgccView(roles);
  if (view === "cockpit") return <PtCockpit />;
  if (view === "coach") return <PtCoach name={profile?.full_name ?? ""} />;
  return <PtMember name={profile?.full_name ?? ""} />;
}

// ─── Admin / Manager ────────────────────────────────────────────────────────
function PtCockpit() {
  return (
    <>
      <PageHeader
        title="Entrenamiento Personal"
        subtitle="Sesiones del día y entrenamientos asignados a socios."
        actions={
          <Link to="/rgcc/biblioteca" className="rounded-full bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:opacity-90">
            <Dumbbell className="mr-1 inline h-4 w-4" />
            Abrir Biblioteca
          </Link>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-4">
        <KpiCard label="Sesiones hoy" value={RGCC_PT_SESSIONS.length} />
        <KpiCard label="Confirmadas" value={RGCC_PT_SESSIONS.filter((s) => s.status === "confirmed").length} />
        <KpiCard label="Pendientes" value={RGCC_PT_SESSIONS.filter((s) => s.status === "pending").length} />
        <KpiCard label="Asignaciones activas" value={RGCC_WORKOUTS.length} />
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Agenda EP</h2>
      <div className="mb-8 grid gap-3 lg:grid-cols-2">
        {RGCC_PT_SESSIONS.map((s) => <PtSessionCard key={s.id} session={s} />)}
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Asignaciones recientes</h2>
      <div className="grid gap-3 lg:grid-cols-2">
        {RGCC_WORKOUTS.map((w) => <WorkoutCard key={w.id} workout={w} />)}
      </div>
    </>
  );
}

// ─── Coach view ─────────────────────────────────────────────────────────────
function PtCoach({ name }: { name: string }) {
  const mine = useMemo(
    () => RGCC_PT_SESSIONS.filter((s) => name && s.coachName.toLowerCase().includes(name.split(" ")[0]?.toLowerCase() ?? "")),
    [name],
  );
  const list = mine.length > 0 ? mine : RGCC_PT_SESSIONS;
  return (
    <>
      <PageHeader
        title="Mis sesiones EP"
        subtitle={`Hola ${name || "monitor"}, este es tu programa de entrenamiento personal.`}
      />
      {list.length === 0 ? (
        <EmptyState>No tienes sesiones EP programadas.</EmptyState>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {list.map((s) => <PtSessionCard key={s.id} session={s} />)}
        </div>
      )}
    </>
  );
}

// ─── Member view ────────────────────────────────────────────────────────────
function PtMember({ name }: { name: string }) {
  return (
    <>
      <PageHeader
        title="Mi entrenamiento"
        subtitle={`Hola ${name || "socio"}, aquí tienes tus rutinas asignadas.`}
      />
      {RGCC_WORKOUTS.length === 0 ? (
        <EmptyState>No tienes entrenamientos asignados.</EmptyState>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {RGCC_WORKOUTS.map((w) => <WorkoutCard key={w.id} workout={w} showAthleteView />)}
        </div>
      )}
    </>
  );
}

// ─── Building blocks ────────────────────────────────────────────────────────
function KpiCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </Card>
  );
}

function PtSessionCard({ session: s }: { session: RgccPtSession }) {
  const routine = RGCC_ROUTINES.find((r) => r.id === s.routineId);
  const tone =
    s.status === "confirmed" ? "success" :
    s.status === "ready" ? "info" :
    s.status === "done" ? "default" : "warning";
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Clock className="h-4 w-4 text-primary" />
            {s.time} · {s.memberName}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            <User className="mr-1 inline h-3 w-3" /> {s.coachName}
          </div>
        </div>
        <Pill tone={tone as never}>{s.status}</Pill>
      </div>
      {routine && (
        <div className="mt-3 rounded-lg bg-muted/40 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium">{routine.name}</span>
            <span className="text-muted-foreground">{routine.durationMin} min · {routine.level}</span>
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">{routine.goal}</div>
        </div>
      )}
      {s.notes && <p className="mt-2 text-xs italic text-muted-foreground">"{s.notes}"</p>}
    </Card>
  );
}

function WorkoutCard({ workout: w, showAthleteView }: { workout: RgccWorkout; showAthleteView?: boolean }) {
  const tone =
    w.status === "completed" ? "success" :
    w.status === "in_progress" ? "info" : "warning";
  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-semibold leading-tight">{w.title}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {showAthleteView ? `Coach ${w.coachName}` : `${w.memberNumber} · ${w.coachName}`}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Pill tone={tone as never}>{w.status}</Pill>
          {w.source === "ai" && (
            <Pill tone="info"><Sparkles className="mr-1 inline h-3 w-3" />IA</Pill>
          )}
        </div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{w.goal}</p>
      <ul className="mt-3 space-y-1.5">
        {w.blocks.map((b, i) => {
          const ex = b.exerciseId ? RGCC_EXERCISES.find((e) => e.id === b.exerciseId) : undefined;
          const img = b.exerciseId ? getRgccExerciseImage(b.exerciseId) : undefined;
          return (
            <li key={i} className="flex items-center gap-3 rounded-lg bg-muted/40 p-2">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                {img ? (
                  <img src={img} alt={b.name} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <ListChecks className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium">{b.name}</div>
                <div className="text-[10px] text-muted-foreground">
                  {b.dose}{b.rest ? ` · descanso ${b.rest}` : ""}
                  {ex?.category ? ` · ${ex.category}` : ""}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {w.notes && <p className="mt-2 text-xs italic text-muted-foreground">"{w.notes}"</p>}
    </Card>
  );
}
