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
  MessageSquareHeart,
  HeartPulse,
  Stethoscope,
  CalendarPlus,
  LineChart,
  Bell,
  MessageSquare,
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

const ATHLETE_ACTIONS: Action[] = [
  { label: "Calendario", icon: CalendarDays, to: "/mobile/calendar" },
  { label: "Notificar ausencia", icon: CalendarX, to: "/mobile/absence" },
  { label: "Info de sesión", icon: Info, to: "/mobile/session-info" },
  { label: "Feedback", icon: MessageSquareHeart, to: "/mobile/feedback" },
  { label: "Salud", icon: HeartPulse, to: "/mobile/health" },
  { label: "Plan de tratamiento", icon: Stethoscope, to: "/mobile/treatment" },
  { label: "Solicitar cita", icon: CalendarPlus, to: "/mobile/request-appointment" },
  { label: "Rendimiento", icon: LineChart, to: "/mobile/performance" },
  { label: "Notificaciones", icon: Bell, to: "/mobile/notifications" },
];

function MobileHome() {
  const user = useCurrentUser();
  const events = useData((s) => s.events);
  const today = new Date().toISOString().slice(0, 10);
  const isCoach = user?.role === "technical";
  const actions = isCoach ? COACH_ACTIONS : ATHLETE_ACTIONS;

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
          {actions.map((a) => {
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
    </div>
  );
}
