import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Clock,
  Users,
  CalendarDays,
  Dumbbell,
  ClipboardCheck,
  StickyNote,
  Star,
  Sparkles,
  CalendarX,
  Info,
  HeartPulse,
  TrendingUp,
  Bell,
  MessageSquare,
  MapPin,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCurrentUser, useData } from "@/lib/store";

export const Route = createFileRoute("/_app/mobile/")({
  component: MobileHome,
});

type Action = { label: string; icon: LucideIcon; to: string };

const COACH_ACTIONS: Action[] = [
  { label: "Calendario", icon: CalendarDays, to: "/mobile/calendar" },
  { label: "Sesión", icon: Dumbbell, to: "/mobile/session" },
  { label: "Asistencia", icon: ClipboardCheck, to: "/mobile/attendance" },
  { label: "Convocatoria", icon: Users, to: "/mobile/callup" },
  { label: "Notas", icon: StickyNote, to: "/mobile/notes" },
  { label: "Valoraciones", icon: Star, to: "/mobile/ratings" },
  { label: "Comunicación", icon: MessageSquare, to: "/mobile/messages" },
  { label: "IA de sesión", icon: Sparkles, to: "/mobile/ai" },
];

function MobileHome() {
  const user = useCurrentUser();
  const events = useData((s) => s.events);
  const today = new Date().toISOString().slice(0, 10);
  const isCoach = user?.role === "technical";

  const todays = useMemo(
    () => events.filter((e) => e.date === today).slice(0, 3),
    [events, today],
  );

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-xl font-bold tracking-tight">
          Hola, {user?.name.split(" ")[0]}
        </h1>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
      </header>

      {isCoach ? (
        <CoachHome todays={todays} />
      ) : (
        <AthleteHome todays={todays} />
      )}
    </div>
  );
}

function CoachHome({ todays }: { todays: ReturnType<typeof useData.getState>["events"] }) {
  return (
    <>
      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Hoy
        </h2>
        {todays.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
            Sin actividades programadas.
          </div>
        ) : (
          <ul className="space-y-2">
            {todays.map((e) => (
              <li
                key={e.id}
                className="rounded-2xl border border-border bg-card p-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{e.title}</div>
                    <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {e.startTime}
                      </span>
                      {e.groupId && (
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          Grupo
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase text-primary">
                    {e.type}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Accesos rápidos
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {COACH_ACTIONS.map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.to}
                to={a.to}
                className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-card p-3 text-center transition active:scale-95"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-medium leading-tight text-foreground">
                  {a.label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}

function AthleteHome({ todays }: { todays: ReturnType<typeof useData.getState>["events"] }) {
  const next = todays[0];

  return (
    <>
      {/* Hero — próxima sesión */}
      <section
        className="rounded-2xl p-4 text-white shadow-md"
        style={{
          background:
            "linear-gradient(135deg, #21324a 0%, #0067c9 100%)",
        }}
      >
        <div className="text-[11px] font-semibold uppercase tracking-wider text-white/70">
          {next ? "Hoy · Entrenamiento" : "Sin sesión hoy"}
        </div>
        <div className="mt-1 text-lg font-bold leading-tight">
          {next?.title ?? "Disfruta del descanso"}
        </div>
        {next && (
          <>
            <div className="mt-2 flex items-center gap-1 text-xs text-white/80">
              <Clock className="h-3.5 w-3.5" /> {next.startTime}
            </div>

            {next.location && (
              <div className="mt-1 flex items-center gap-1 text-xs text-white/80">
                <MapPin className="h-3.5 w-3.5" /> {next.location}
              </div>
            )}
          </>
        )}
      </section>

      {/* CTA principal y secundario */}
      <section className="grid gap-2">
        <Link
          to="/mobile/session-info"
          className="flex w-full items-center justify-between rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-md active:scale-[0.98]"
        >
          <span className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Información de la sesión
          </span>
          <ChevronRight className="h-4 w-4 opacity-70" />
        </Link>
        <Link
          to="/mobile/absence"
          className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-sm active:scale-[0.98]"
        >
          <span className="flex items-center gap-2">
            <CalendarX className="h-4 w-4 text-muted-foreground" />
            Notificar ausencia
          </span>
          <ChevronRight className="h-4 w-4 opacity-50" />
        </Link>
      </section>

      {/* Salud — tonos cálidos amarillo/naranja */}
      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Salud
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <Link
            to="/mobile/health"
            className="rounded-2xl border border-amber-200 bg-amber-50 p-3 active:scale-[0.98]"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <HeartPulse className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-800">
                  Estado
                </div>
                <div className="text-sm font-bold text-amber-900">Apto</div>
              </div>
            </div>
          </Link>
          <Link
            to="/mobile/health"
            className="rounded-2xl border border-orange-200 bg-orange-50 p-3 active:scale-[0.98]"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                <Bell className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-orange-800">
                  Bienestar
                </div>
                <div className="truncate text-sm font-bold text-orange-900">
                  Registrar
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Mi rendimiento */}
      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Mi rendimiento
        </h2>
        <Link
          to="/mobile/performance"
          className="block rounded-2xl border border-border bg-card p-4 active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Última valoración
                </div>
                <div className="text-sm font-bold text-foreground">8.2 / 10</div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <Stat label="Técnica" value="8.2" />
            <Stat label="Compromiso" value="9.0" />
            <Stat label="Físico" value="7.5" />
          </div>
        </Link>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted px-2 py-2">
      <div className="text-base font-bold leading-none text-foreground">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
