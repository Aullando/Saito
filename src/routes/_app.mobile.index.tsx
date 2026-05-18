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

  const CARD_SHADOW = "0 4px 16px rgba(33, 50, 74, 0.06)";

  return (
    <>
      {/* Tarjeta principal — Próxima sesión */}
      <section
        style={{
          background: "#FFFFFF",
          border: "1px solid #AFE5C6",
          borderRadius: 24,
          padding: 20,
          boxShadow: CARD_SHADOW,
        }}
      >
        <span
          className="inline-flex items-center"
          style={{
            background: "#EAF8F0",
            color: "#00843D",
            borderRadius: 999,
            padding: "4px 10px",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Próxima sesión
        </span>
        <h2
          style={{
            color: "#21324A",
            fontSize: 22,
            fontWeight: 700,
            lineHeight: "28px",
            marginTop: 10,
          }}
        >
          {next?.title ?? "Entrenamiento"}
        </h2>
        <div
          className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1"
          style={{ color: "#66758A", fontSize: 13 }}
        >
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> {next?.startTime ?? "17:30 – 19:00"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4" /> {next?.location ?? "Pista de Atletismo"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-4 w-4" /> Infantil A
          </span>
        </div>

        <div className="mt-4 grid gap-2">
          <Link
            to="/mobile/session"
            className="flex w-full items-center justify-center active:scale-[0.98]"
            style={{
              height: 52,
              borderRadius: 999,
              background: "#00A74D",
              color: "#FFFFFF",
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            Ver sesión
          </Link>
          <Link
            to="/mobile/attendance"
            className="flex w-full items-center justify-center active:scale-[0.98]"
            style={{
              height: 52,
              borderRadius: 999,
              background: "#EEF3F8",
              color: "#21324A",
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            Registrar asistencia
          </Link>
          <Link
            to="/mobile/callup"
            className="flex w-full items-center justify-center active:scale-[0.98]"
            style={{
              height: 52,
              borderRadius: 999,
              background: "#EEF3F8",
              color: "#21324A",
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            Generar convocatoria
          </Link>
        </div>
      </section>

      {/* Bloque Ausencias notificadas */}
      <section
        style={{
          background: "#FFF5DF",
          border: "1px solid #FFE0A3",
          borderRadius: 24,
          padding: 18,
          boxShadow: CARD_SHADOW,
        }}
      >
        <div
          className="flex items-center gap-2"
          style={{
            color: "#B56F00",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          <CalendarX className="h-4 w-4" /> Ausencias notificadas
        </div>
        <ul className="mt-3 space-y-2">
          {absences.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between"
              style={{
                background: "#FFFFFF",
                border: "1px solid #FFE0A3",
                borderRadius: 16,
                padding: "10px 12px",
              }}
            >
              <span style={{ color: "#21324A", fontSize: 14, fontWeight: 600 }}>{a.name}</span>
              <span
                style={{
                  background: "#FFF5DF",
                  color: "#B56F00",
                  border: "1px solid #FFE0A3",
                  borderRadius: 999,
                  padding: "2px 10px",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {a.reason}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Bloque No aptos / En revisión */}
      <section
        style={{
          background: "#FFFFFF",
          border: "1px solid #DDE6F0",
          borderRadius: 24,
          padding: 18,
          boxShadow: CARD_SHADOW,
        }}
      >
        <div
          style={{
            color: "#66758A",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          No aptos / En revisión
        </div>
        <ul className="mt-3 space-y-2">
          {notFit.map((a) => {
            const danger = a.status === "No apto";
            return (
              <li
                key={a.id}
                className="flex items-center justify-between"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #DDE6F0",
                  borderRadius: 16,
                  padding: "10px 12px",
                }}
              >
                <span style={{ color: "#21324A", fontSize: 14, fontWeight: 600 }}>{a.name}</span>
                <span
                  style={{
                    background: danger ? "#FFF0F3" : "#FFF5DF",
                    color: danger ? "#C71F36" : "#B56F00",
                    border: `1px solid ${danger ? "#FFC9D1" : "#FFE0A3"}`,
                    borderRadius: 999,
                    padding: "2px 10px",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  {danger ? "No apto" : "En revisión"}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}


function AthleteHome({ todays }: { todays: ReturnType<typeof useData.getState>["events"] }) {
  const next = todays[0];
  const [absenceOpen, setAbsenceOpen] = useState(false);
  const [absenceNotified, setAbsenceNotified] = useState(false);

  const CARD_SHADOW = "0 4px 16px rgba(33, 50, 74, 0.06)";

  return (
    <>
      {/* Tarjeta principal — Hoy: Entrenamiento */}
      <section
        style={{
          background: "#FFFFFF",
          border: "1px solid #FFC9D1",
          borderRadius: 24,
          padding: 20,
          boxShadow: CARD_SHADOW,
        }}
      >
        <span
          className="inline-flex items-center"
          style={{
            background: "#FFF0F3",
            color: "#C71F36",
            borderRadius: 999,
            padding: "4px 10px",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Hoy
        </span>
        <h2
          style={{
            color: "#21324A",
            fontSize: 22,
            fontWeight: 700,
            lineHeight: "28px",
            marginTop: 10,
          }}
        >
          {next ? "Entrenamiento" : "Sin sesión hoy"}
        </h2>
        {next && (
          <div
            className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1"
            style={{ color: "#66758A", fontSize: 13 }}
          >
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {next.startTime}
            </span>
            {next.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {next.location}
              </span>
            )}
          </div>
        )}

        <div className="mt-4 grid gap-2">
          <Link
            to="/mobile/session-info"
            className="flex w-full items-center justify-center active:scale-[0.98]"
            style={{
              height: 52,
              borderRadius: 999,
              background: "#F12F4A",
              color: "#FFFFFF",
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            Información de la sesión
          </Link>
          {absenceNotified ? (
            <div
              className="flex w-full items-center justify-between px-4"
              style={{
                height: 52,
                borderRadius: 999,
                background: "#EAF8F0",
                color: "#00843D",
                border: "1px solid #AFE5C6",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              <span className="inline-flex items-center gap-2">
                <Check className="h-4 w-4" /> Ausencia notificada
              </span>
              <button
                onClick={() => setAbsenceNotified(false)}
                className="text-[12px] font-semibold underline"
              >
                Deshacer
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAbsenceOpen(true)}
              className="flex w-full items-center justify-center active:scale-[0.98]"
              style={{
                height: 52,
                borderRadius: 999,
                background: "#EEF3F8",
                color: "#21324A",
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              Notificar ausencia
            </button>
          )}
        </div>
      </section>

      {/* Bloque Salud (wellbeing) */}
      <section
        style={{
          background: "#FFF5DF",
          border: "1px solid #FFE0A3",
          borderRadius: 24,
          padding: 18,
          boxShadow: CARD_SHADOW,
        }}
      >
        <div
          className="flex items-center gap-2"
          style={{ color: "#B56F00", fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}
        >
          <HeartPulse className="h-4 w-4" /> Salud
        </div>
        <div className="mt-3 space-y-2">
          <WellRow
            to="/mobile/health"
            icon={HeartPulse}
            title="Estado"
            value="Apto"
          />
          <WellRow
            to="/mobile/treatment"
            icon={Stethoscope}
            title="Plan de tratamiento"
            value="Sin plan activo"
          />
          <WellRow
            to="/mobile/request-appointment"
            icon={CalendarPlus}
            title="Cita médica"
            value="Solicitar cita"
          />
        </div>
      </section>

      {/* Bloque Mi rendimiento */}
      <section
        style={{
          background: "#FFFFFF",
          border: "1px solid #DDE6F0",
          borderRadius: 24,
          padding: 18,
          boxShadow: CARD_SHADOW,
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{ color: "#66758A", fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}
        >
          <span className="inline-flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Mi rendimiento
          </span>
        </div>
        <Link to="/mobile/performance" className="mt-3 block">
          <div className="flex items-end justify-between">
            <div>
              <div style={{ color: "#8A98AA", fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Última valoración
              </div>
              <div style={{ color: "#21324A", fontSize: 22, fontWeight: 700, lineHeight: "28px" }}>
                8.2 <span style={{ color: "#8A98AA", fontSize: 13, fontWeight: 500 }}>/ 10</span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4" style={{ color: "#8A98AA" }} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Stat label="Esfuerzo percibido" value="7.0" />
            <Stat label="Recuperación" value="8.5" />
          </div>
          <div
            className="mt-3"
            style={{
              background: "#EEF3F8",
              borderRadius: 14,
              padding: "8px 10px",
            }}
          >
            <div
              className="flex items-center justify-between"
              style={{ color: "#66758A", fontSize: 10, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}
            >
              <span className="inline-flex items-center gap-1">
                <Activity className="h-3 w-3" /> Evolución 30 días
              </span>
              <span style={{ color: "#00843D" }}>+6%</span>
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

function WellRow({
  to,
  icon: Icon,
  title,
  value,
}: {
  to: string;
  icon: LucideIcon;
  title: string;
  value: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between active:scale-[0.99]"
      style={{
        background: "#FFFFFF",
        border: "1px solid #FFE0A3",
        borderRadius: 16,
        padding: "10px 12px",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center"
          style={{ width: 36, height: 36, borderRadius: 12, background: "#FFF5DF", color: "#B56F00" }}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <div style={{ color: "#B56F00", fontSize: 10, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            {title}
          </div>
          <div style={{ color: "#21324A", fontSize: 14, fontWeight: 700 }}>{value}</div>
        </div>
      </div>
      <ChevronRight className="h-4 w-4" style={{ color: "#B56F00" }} />
    </Link>
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
