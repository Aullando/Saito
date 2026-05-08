// RGCC · Biblioteca — catálogo de ejercicios y rutinas del club.
// Identidad SAITO + branding RGCC. Datos desde seed RGCC.
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, PageHeader, Pill, EmptyState } from "@/components/ui-kit";
import { useClub } from "@/clubs/ClubProvider";
import {
  RGCC_EXERCISES, RGCC_ROUTINES,
  type RgccExercise,
} from "@/clubs/rgcc/seed";
import { getRgccExerciseImage } from "@/clubs/rgcc/exerciseImages";
import { BookOpen, Dumbbell, Search, Filter, ImageOff } from "lucide-react";

export const Route = createFileRoute("/rgcc/biblioteca")({
  component: () => (
    <AppLayout>
      <BibliotecaGate />
    </AppLayout>
  ),
});

function BibliotecaGate() {
  const { club } = useClub();
  if (club.id !== "rgcc") return <Navigate to="/dashboard" />;
  return <Biblioteca />;
}

function Biblioteca() {
  const [tab, setTab] = useState<"ejercicios" | "rutinas">("ejercicios");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("Todas");
  const [src, setSrc] = useState<"all" | "library" | "evidence">("all");

  const categories = useMemo(
    () => ["Todas", ...Array.from(new Set(RGCC_EXERCISES.map((e) => e.category)))],
    [],
  );

  const filtered = useMemo(() => {
    return RGCC_EXERCISES.filter((e) => {
      if (cat !== "Todas" && e.category !== cat) return false;
      if (src !== "all" && (e.source ?? "library") !== src) return false;
      if (!q.trim()) return true;
      const needle = q.toLowerCase();
      return (
        e.name.toLowerCase().includes(needle) ||
        e.group.toLowerCase().includes(needle) ||
        e.equipment.toLowerCase().includes(needle)
      );
    });
  }, [q, cat, src]);

  return (
    <>
      <PageHeader
        title="Biblioteca"
        subtitle="Catálogo de ejercicios y rutinas del Real Grupo de Cultura Covadonga."
        actions={
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            {RGCC_EXERCISES.length} ejercicios · {RGCC_ROUTINES.length} rutinas
          </div>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setTab("ejercicios")}
          className={`rounded-full px-3 py-1.5 text-sm ${tab === "ejercicios" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
        >
          Ejercicios
        </button>
        <button
          onClick={() => setTab("rutinas")}
          className={`rounded-full px-3 py-1.5 text-sm ${tab === "rutinas" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
        >
          Rutinas
        </button>
      </div>

      {tab === "ejercicios" ? (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar ejercicio…"
                className="w-72 rounded-full border border-border bg-background py-2 pl-9 pr-3 text-sm"
              />
            </div>
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="rounded-full border border-border bg-background px-3 py-2 text-sm"
            >
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Filter className="h-3 w-3" /> origen
            </div>
            {(["all", "library", "evidence"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSrc(s)}
                className={`rounded-full px-3 py-1 text-xs ${src === s ? "bg-primary/15 text-primary" : "bg-muted text-foreground"}`}
              >
                {s === "all" ? "Todos" : s === "library" ? "Catálogo" : "Evidencia"}
              </button>
            ))}
            <div className="ml-auto text-xs text-muted-foreground">{filtered.length} resultados</div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState>No hay ejercicios para ese filtro.</EmptyState>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((ex) => <ExerciseCard key={ex.id} ex={ex} />)}
            </div>
          )}
        </>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RGCC_ROUTINES.map((r) => (
            <Card key={r.id}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.level} · {r.durationMin} min</div>
                </div>
                <Pill tone="info">{r.exerciseIds.length} ej.</Pill>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{r.goal}</p>
              <ul className="mt-3 space-y-1 text-xs">
                {r.exerciseIds.map((id) => {
                  const ex = RGCC_EXERCISES.find((e) => e.id === id);
                  return (
                    <li key={id} className="flex items-center justify-between gap-2 rounded-md bg-muted/40 px-2 py-1">
                      <span className="truncate">{ex?.name ?? id}</span>
                      <span className="text-muted-foreground">{ex?.dose}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-3 flex justify-end">
                <Link
                  to="/rgcc/entrenamiento-personal"
                  className="text-xs text-primary hover:underline"
                >
                  Asignar a sesión EP →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

function ExerciseCard({ ex }: { ex: RgccExercise }) {
  const img = getRgccExerciseImage(ex.id);
  return (
    <Card className="p-0 overflow-hidden">
      <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
        {img ? (
          <img src={img} alt={ex.name} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ImageOff className="h-8 w-8" />
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="font-semibold leading-tight">{ex.name}</div>
          <Pill tone={ex.source === "evidence" ? "success" : "info"}>
            {ex.source === "evidence" ? "EV" : "Cat."}
          </Pill>
        </div>
        <div className="mt-1 text-xs text-muted-foreground">{ex.category} · {ex.group}</div>
        <div className="mt-2 flex flex-wrap gap-1 text-[11px]">
          <span className="rounded-full bg-muted px-2 py-0.5">{ex.equipment}</span>
          <span className="rounded-full bg-muted px-2 py-0.5">{ex.level}</span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">{ex.dose}</span>
        </div>
        {ex.cues && <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{ex.cues}</p>}
      </div>
    </Card>
  );
}
