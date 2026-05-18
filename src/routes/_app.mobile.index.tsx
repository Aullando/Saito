import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { X, Check, Stethoscope, CalendarPlus, Activity } from "lucide-react";
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
  const next = todays[0];
  const absences = [
    { id: "ab1", name: "Lucía García", reason: "Enfermedad" },
    { id: "ab2", name: "Mario Pérez", reason: "Estudios" },
  ];
  const notFit = [
    { id: "nf1", name: "Daniel Ruiz", status: "No apto" as const },
    { id: "nf2", name: "Sara López", status: "En revisión" as const },
  ];

  return (
    <>
      {/* Tarjeta Hoy: Entrenamiento */}
      <section
        className="rounded-2xl p-4 text-white shadow-md"
        style={{
          background:
            "linear-gradient(135deg, #064e3b 0%, #00a74d 100%)",
        }}
      >
        <div className="text-[11px] font-semibold uppercase tracking-wider text-white/70">
          Hoy · Entrenamiento
        </div>
        <div className="mt-1 text-lg font-bold leading-tight">
          {next?.title ?? "Tecnificación Infantil"}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/85">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {next?.startTime ?? "17:30 – 19:00"}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {next?.location ?? "Pista de Atletismo"}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            Infantil A
          </span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          <Link
            to="/mobile/session"
            className="flex items-center justify-center gap-1 rounded-lg bg-white px-2 py-2 text-[11px] font-semibold text-emerald-700 active:scale-95"
          >
            <Info className="h-3.5 w-3.5" /> Ver sesión
          </Link>
          <Link
            to="/mobile/attendance"
            className="flex items-center justify-center gap-1 rounded-lg bg-white/15 px-2 py-2 text-[11px] font-semibold text-white ring-1 ring-white/30 active:scale-95"
          >
            <ClipboardCheck className="h-3.5 w-3.5" /> Asistencia
          </Link>
          <Link
            to="/mobile/callup"
            className="flex items-center justify-center gap-1 rounded-lg bg-white/15 px-2 py-2 text-[11px] font-semibold text-white ring-1 ring-white/30 active:scale-95"
          >
            <Users className="h-3.5 w-3.5" /> Convocatoria
          </Link>
        </div>
      </section>

      {/* Ausencias notificadas */}
      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Ausencias notificadas
        </h2>
        <ul className="space-y-1.5">
          {absences.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2.5"
            >
              <div className="flex items-center gap-2">
                <CalendarX className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-foreground">{a.name}</span>
              </div>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                {a.reason}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* No aptos / en revisión */}
      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Deportistas no aptos o en revisión
        </h2>
        <ul className="space-y-1.5">
          {notFit.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2.5"
            >
              <div className="flex items-center gap-2">
                <HeartPulse className="h-4 w-4 text-rose-600" />
                <span className="text-sm font-medium text-foreground">{a.name}</span>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  a.status === "No apto"
                    ? "bg-rose-100 text-rose-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {a.status}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Accesos rápidos */}
      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Accesos
        </h2>
        <div className="grid grid-cols-4 gap-2">
          {COACH_ACTIONS.slice(4).map((a) => {
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
  const [absenceOpen, setAbsenceOpen] = useState(false);
  const [absenceNotified, setAbsenceNotified] = useState(false);

  return (
    <>
      {/* Tarjeta Hoy: Entrenamiento (rojo Sport Life) */}
      <section
        className="rounded-2xl p-4 text-white shadow-md"
        style={{
          background:
            "linear-gradient(135deg, #7f1020 0%, #f12f4a 100%)",
        }}
      >
        <div className="text-[11px] font-semibold uppercase tracking-wider text-white/75">
          {next ? "Hoy · Entrenamiento" : "Sin sesión hoy"}
        </div>
        <div className="mt-1 text-lg font-bold leading-tight">
          {next?.title ?? "Disfruta del descanso"}
        </div>
        {next && (
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/85">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {next.startTime}
            </span>
            {next.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {next.location}
              </span>
            )}
          </div>
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
        {absenceNotified ? (
          <div className="flex w-full items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4" /> Ausencia notificada
            </span>
            <button
              onClick={() => setAbsenceNotified(false)}
              className="text-[11px] font-medium text-emerald-700 underline"
            >
              Deshacer
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAbsenceOpen(true)}
            className="flex w-full items-center justify-between rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm font-semibold text-foreground shadow-sm active:scale-[0.98]"
          >
            <span className="flex items-center gap-2">
              <CalendarX className="h-4 w-4 text-muted-foreground" />
              Notificar ausencia
            </span>
            <ChevronRight className="h-4 w-4 opacity-50" />
          </button>
        )}
      </section>

      {/* Salud */}
      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Salud
        </h2>
        <div className="space-y-2">
          <Link
            to="/mobile/health"
            className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-3 active:scale-[0.98]"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <HeartPulse className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-800">
                  Estado
                </div>
                <div className="text-sm font-bold text-amber-900">Apto</div>
              </div>
            </div>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
              Apto · En revisión · No apto
            </span>
          </Link>
          <Link
            to="/mobile/treatment"
            className="flex items-center justify-between rounded-2xl border border-border bg-card p-3 active:scale-[0.98]"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Stethoscope className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Plan de tratamiento
                </div>
                <div className="text-sm font-bold text-foreground">Sin plan activo</div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          <Link
            to="/mobile/request-appointment"
            className="flex items-center justify-between rounded-2xl border border-border bg-card p-3 active:scale-[0.98]"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CalendarPlus className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Cita médica
                </div>
                <div className="text-sm font-bold text-foreground">Solicitar cita</div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Stat label="Esfuerzo percibido" value="7.0" />
            <Stat label="Recuperación" value="8.5" />
          </div>
          <div className="mt-3 rounded-lg bg-muted p-2">
            <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Activity className="h-3 w-3" /> Evolución 30 días
              </span>
              <span className="text-emerald-600">+6%</span>
            </div>
            <Sparkline values={[6.5, 7, 6.8, 7.4, 7.2, 7.8, 8.0, 7.9, 8.2, 8.4, 8.2, 8.6]} />
          </div>
        </Link>
      </section>

      {absenceOpen && (
        <AbsenceModal
          onClose={() => setAbsenceOpen(false)}
          onConfirm={() => {
            setAbsenceOpen(false);
            setAbsenceNotified(true);
            toast.success("Ausencia notificada al entrenador");
          }}
        />
      )}
    </>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 100;
  const h = 28;
  const step = w / (values.length - 1);
  const points = values
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-1 h-7 w-full" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-primary"
      />
    </svg>
  );
}

const ABSENCE_REASONS = ["Enfermedad", "Lesión", "Estudios", "Trabajo", "Personal", "Otro"];

function AbsenceModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  const [reason, setReason] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  return (
    <div
      className="absolute inset-0 z-30 flex items-end justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-2xl bg-background p-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold">Notificar ausencia</h3>
          <button onClick={onClose} className="text-muted-foreground" aria-label="Cerrar">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Motivo
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {ABSENCE_REASONS.map((r) => {
            const active = reason === r;
            return (
              <button
                key={r}
                onClick={() => setReason(r)}
                className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                  active
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card text-foreground"
                }`}
              >
                {r}
              </button>
            );
          })}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, 300))}
          rows={3}
          placeholder="Comentario opcional para el entrenador"
          className="mt-3 w-full resize-none rounded-xl border border-border bg-card p-2.5 text-sm outline-none focus:border-primary"
        />
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={onClose}
            className="rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-semibold text-foreground"
          >
            Cancelar
          </button>
          <button
            disabled={!reason}
            onClick={onConfirm}
            className="flex items-center justify-center gap-1 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            <Check className="h-4 w-4" /> Confirmar
          </button>
        </div>
      </div>
    </div>
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
