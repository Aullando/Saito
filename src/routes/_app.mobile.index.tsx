import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Clock,
  MapPin,
  ArrowRight,
  TriangleAlert,
  Activity,
  CalendarPlus,
  ChevronDown,
  X,
  Check,
  Star,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useCurrentUser, useData } from "@/lib/store";
import { useSessionLocal } from "@/lib/sessionLocal";

const DEMO_SESSION_ID = "session-today";

export const Route = createFileRoute("/_app/mobile/")({
  component: MobileHome,
});

const INK = "#21324A";
const MUTED = "#66758A";
const SOFT_BG = "#EEF3F8";
const CARD_BORDER = "#DDE6F0";
const ATHL = "#F12F4A";
const COACH = "#00A74D";
const SHADOW = "0 4px 16px rgba(33, 50, 74, 0.06)";

function MobileHome() {
  const user = useCurrentUser();
  const events = useData((s) => s.events);
  const today = new Date().toISOString().slice(0, 10);
  const isCoach = user?.role === "technical";

  const todayEvent = useMemo(
    () => events.find((e) => e.date === today),
    [events, today],
  );

  return isCoach ? <CoachHome event={todayEvent} /> : <AthleteHome event={todayEvent} />;
}

type Ev = ReturnType<typeof useData.getState>["events"][number] | undefined;

/* ─────────────── Card de "Hoy" compartida ─────────────── */
function TodayCard({
  event,
  ctaLabel,
  ctaTo,
  accent,
}: {
  event: Ev;
  ctaLabel: string;
  ctaTo: string;
  accent: string;
}) {
  const title = event ? event.title || "Entrenamiento" : "Sin sesión hoy";
  return (
    <section
      style={{
        background: SOFT_BG,
        borderRadius: 18,
        padding: 18,
      }}
    >
      <h2 style={{ color: INK, fontSize: 20, fontWeight: 700 }}>
        Hoy: <span style={{ fontWeight: 700 }}>{title}</span>
      </h2>
      {event && (
        <div className="mt-1.5 space-y-1" style={{ color: MUTED, fontSize: 13 }}>
          <div className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {event.startTime}
          </div>
          {event.location && (
            <div className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> {event.location}
            </div>
          )}
        </div>
      )}
      <Link
        to={ctaTo}
        className="mt-4 flex items-center justify-between active:scale-[0.98]"
        style={{
          height: 52,
          borderRadius: 999,
          background: accent,
          color: "#FFFFFF",
          padding: "0 8px 0 22px",
          fontSize: 15,
          fontWeight: 700,
        }}
      >
        <span>{ctaLabel}</span>
        <span
          className="flex items-center justify-center"
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            background: "#FFFFFF",
            color: accent,
          }}
        >
          <ArrowRight className="h-4 w-4" />
        </span>
      </Link>
    </section>
  );
}

/* ─────────────── ATHLETE HOME ─────────────── */
function AthleteHome({ event }: { event: Ev }) {
  const [absenceOpen, setAbsenceOpen] = useState(false);
  const [absenceNotified, setAbsenceNotified] = useState(false);
  const [improveOpen, setImproveOpen] = useState(false);

  return (
    <div className="space-y-4">
      <TodayCard
        event={event}
        ctaLabel="Información de la sesión"
        ctaTo="/mobile/session-info"
        accent={ATHL}
      />

      {/* Notificar ausencia */}
      {absenceNotified ? (
        <div
          className="flex w-full items-center justify-between px-5"
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
          className="flex w-full items-center justify-center gap-2 active:scale-[0.98]"
          style={{
            height: 52,
            borderRadius: 999,
            background: "#8A98AA",
            color: "#FFFFFF",
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          <TriangleAlert className="h-4 w-4" /> Notificar ausencia
        </button>
      )}

      {/* Salud */}
      <section className="space-y-2">
        <div className="flex items-center gap-2" style={{ color: MUTED, fontSize: 14, fontWeight: 600 }}>
          <Activity className="h-4 w-4" /> Salud
        </div>
        <div
          style={{
            background: SOFT_BG,
            borderRadius: 18,
            padding: 14,
          }}
          className="space-y-2"
        >
          <Link
            to="/mobile/treatment"
            className="flex items-center justify-between"
            style={{
              background: "#FFFFFF",
              border: `1px solid ${CARD_BORDER}`,
              borderRadius: 14,
              padding: "12px 16px",
              color: INK,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Plan de tratamiento
            <span
              className="flex items-center justify-center"
              style={{ width: 28, height: 28, borderRadius: 999, background: SOFT_BG, color: MUTED }}
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
          <Link
            to="/mobile/request-appointment"
            className="flex w-full items-center justify-center gap-2 active:scale-[0.98]"
            style={{
              height: 48,
              borderRadius: 999,
              background: "#8A98AA",
              color: "#FFFFFF",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <CalendarPlus className="h-4 w-4" /> Solicitar cita médica
          </Link>
        </div>
      </section>

      {/* Mi rendimiento */}
      <section className="space-y-2">
        <div className="flex items-center gap-2" style={{ color: MUTED, fontSize: 14, fontWeight: 600 }}>
          <Trophy className="h-4 w-4" /> Mi rendimiento
        </div>

        <div
          style={{
            background: "#FFFFFF",
            border: `1px solid ${CARD_BORDER}`,
            borderRadius: 16,
            padding: 14,
            boxShadow: SHADOW,
          }}
        >
          <button
            className="flex w-full items-center gap-2"
            onClick={() => setImproveOpen((v) => !v)}
          >
            <Sparkles className="h-4 w-4" style={{ color: ATHL }} />
            <span style={{ color: ATHL, fontSize: 14, fontWeight: 700 }}>
              Mejora tu rendimiento:
            </span>
          </button>
          <p className="mt-2" style={{ color: INK, fontSize: 13, lineHeight: "20px" }}>
            Trabaja la transición tras pérdida. Reduces 0,8 s de reacción defensiva si activas
            presión inmediata los primeros 6 segundos.
            {improveOpen && (
              <>
                {" "}Suma 2 sprints cortos al calentamiento y termina con 5 min de respiración 4-7-8.
              </>
            )}
          </p>
          <div
            className="mt-3 flex items-center justify-center"
            style={{
              background: "#FFE7EC",
              borderRadius: 999,
              height: 28,
              color: ATHL,
            }}
          >
            <button onClick={() => setImproveOpen((v) => !v)} aria-label="Toggle">
              <ChevronDown
                className="h-4 w-4"
                style={{ transform: improveOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
              />
            </button>
          </div>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            border: `1px solid ${CARD_BORDER}`,
            borderRadius: 16,
            padding: 14,
            boxShadow: SHADOW,
          }}
        >
          <div className="flex items-center justify-between">
            <span style={{ color: MUTED, fontSize: 13 }}>Última valoración</span>
            <span style={{ color: MUTED, fontSize: 12 }}>22/10/25</span>
          </div>
          <div className="mt-1.5">
            <Stars value={3} color={ATHL} />
          </div>
          <p className="mt-2" style={{ color: INK, fontSize: 13, lineHeight: "19px" }}>
            Están funcionando muy bien los pases largos cruzados. Aunque puedes mejorar las
            combinaciones rápidas con el extremo.
          </p>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            border: `1px solid ${CARD_BORDER}`,
            borderRadius: 16,
            padding: 14,
            boxShadow: SHADOW,
          }}
        >
          <div className="flex items-center justify-between">
            <span style={{ color: MUTED, fontSize: 13 }}>Valoración media</span>
            <span style={{ color: MUTED, fontSize: 12 }}>(últimos 30 días)</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Star className="h-5 w-5" style={{ color: ATHL, fill: ATHL }} />
            <span style={{ color: INK, fontSize: 22, fontWeight: 700 }}>3,45</span>
          </div>
        </div>
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
    </div>
  );
}

/* ─────────────── COACH HOME ─────────────── */
function CoachHome({ event }: { event: Ev }) {
  const [group, setGroup] = useState("Cadete - Grupo A");
  const [absencesOpen, setAbsencesOpen] = useState(true);
  const storeAbsences = useSessionLocal((s) => s.absences);
  const saveRating = useSessionLocal((s) => s.saveRating);

  const seedAbsences = [
    { id: "ab1", name: "Lucía García", reason: "Enfermedad" },
    { id: "ab2", name: "Mario Pérez", reason: "Estudios" },
  ];
  const liveAbsences = storeAbsences
    .filter((a) => a.sessionId === DEMO_SESSION_ID)
    .map((a) => ({ id: a.id, name: a.athleteName, reason: a.reason }));
  const absences = [...liveAbsences, ...seedAbsences];

  const notFit = [
    { id: "nf1", name: "Pablo Torres Domínguez" },
    { id: "nf2", name: "Héctor Navarro Gómez" },
  ];

  const ratingAthletes = [
    { id: "r1", name: "Alejandro Ruiz Fernández" },
    { id: "r2", name: "Andrés Vega Romero" },
    { id: "r3", name: "Luca Hernández Soto" },
  ];

  return (
    <div className="space-y-4">
      {/* Selector de grupo */}
      <GroupSelector value={group} onChange={setGroup} />

      <TodayCard
        event={event}
        ctaLabel="Información de la sesión"
        ctaTo="/mobile/session"
        accent={COACH}
      />

      {/* Ausencias notificadas */}
      <section>
        <button
          onClick={() => setAbsencesOpen((v) => !v)}
          className="flex w-full items-center justify-between"
          style={{
            background: SOFT_BG,
            borderRadius: 14,
            padding: "12px 16px",
            color: INK,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <span className="inline-flex items-center gap-2">
            <TriangleAlert className="h-4 w-4" style={{ color: MUTED }} />
            Ausencias notificadas
            {absences.length > 0 && (
              <span
                style={{
                  background: COACH,
                  color: "#FFFFFF",
                  borderRadius: 999,
                  padding: "1px 8px",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {absences.length}
              </span>
            )}
          </span>
          <ChevronDown
            className="h-4 w-4"
            style={{
              color: MUTED,
              transform: absencesOpen ? "rotate(180deg)" : "none",
              transition: "transform 0.2s",
            }}
          />
        </button>
        {absencesOpen && (
          <ul className="mt-2 space-y-1.5">
            {absences.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between"
                style={{
                  background: "#FFFFFF",
                  border: `1px solid ${CARD_BORDER}`,
                  borderRadius: 12,
                  padding: "10px 14px",
                  fontSize: 13,
                  color: INK,
                }}
              >
                <span className="font-medium">{a.name}</span>
                <span style={{ color: MUTED, fontSize: 12 }}>{a.reason}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* No aptos */}
      <section
        style={{
          background: "#FFFFFF",
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 14,
          padding: "12px 16px",
        }}
      >
        <div className="flex items-center gap-2" style={{ color: INK, fontSize: 14, fontWeight: 700 }}>
          <X className="h-4 w-4" /> No aptos
        </div>
        <ul className="mt-2 space-y-0.5">
          {notFit.map((a) => (
            <li key={a.id} style={{ color: INK, fontSize: 14 }}>
              {a.name}
            </li>
          ))}
        </ul>
      </section>

      {/* Valoración de rendimiento */}
      <section className="space-y-2">
        <div className="flex items-center gap-2" style={{ color: MUTED, fontSize: 14, fontWeight: 600 }}>
          <Star className="h-4 w-4" /> Valoración de rendimiento
        </div>
        <div
          className="flex gap-3 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", marginInline: -4 }}
        >
          {ratingAthletes.map((a) => (
            <RatingCard
              key={a.id}
              athleteName={a.name}
              onSubmit={(value, text) => {
                saveRating(DEMO_SESSION_ID, value * 2, 7, text || undefined);
                toast.success(`Valoración enviada a ${a.name.split(" ")[0]}`);
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

/* ─────────────── Helpers ─────────────── */

function Stars({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= value;
        return (
          <Star
            key={i}
            className="h-5 w-5"
            style={{
              color,
              fill: filled ? color : "transparent",
            }}
          />
        );
      })}
    </div>
  );
}

function RatingCard({
  athleteName,
  onSubmit,
}: {
  athleteName: string;
  onSubmit: (value: number, text: string) => void;
}) {
  const [value, setValue] = useState(3);
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: 16,
        padding: 14,
        minWidth: 270,
        flexShrink: 0,
        boxShadow: SHADOW,
      }}
    >
      <div style={{ color: INK, fontSize: 14, fontWeight: 700 }}>{athleteName}</div>
      <div className="mt-2 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => {
          const filled = i <= value;
          return (
            <button key={i} onClick={() => setValue(i)} aria-label={`${i} estrellas`}>
              <Star
                className="h-6 w-6"
                style={{
                  color: COACH,
                  fill: filled ? COACH : "transparent",
                }}
              />
            </button>
          );
        })}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, 240))}
        rows={2}
        placeholder={`Escribe feedback sobre el rendimiento de ${athleteName.split(" ")[0]}...`}
        className="mt-3 w-full resize-none outline-none"
        style={{
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 12,
          padding: "10px 12px",
          fontSize: 13,
          color: INK,
        }}
      />
      <button
        disabled={sent}
        onClick={() => {
          onSubmit(value, text);
          setSent(true);
          setTimeout(() => setSent(false), 1800);
          setText("");
        }}
        className="mt-2 w-full active:scale-[0.98]"
        style={{
          background: COACH,
          color: "#FFFFFF",
          height: 40,
          borderRadius: 999,
          fontSize: 13,
          fontWeight: 700,
          opacity: sent ? 0.7 : 1,
        }}
      >
        {sent ? "Enviada ✓" : "Enviar valoración"}
      </button>
    </div>
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

function GroupSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const options = ["Cadete - Grupo A", "Cadete - Grupo B", "Juvenil A", "Infantil A"];
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between"
        style={{
          background: "#FFFFFF",
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 14,
          padding: "12px 16px",
          color: INK,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {value}
        <ChevronDown
          className="h-4 w-4"
          style={{
            color: MUTED,
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        />
      </button>
      {open && (
        <ul
          className="absolute left-0 right-0 z-20 mt-1 overflow-hidden"
          style={{
            background: "#FFFFFF",
            border: `1px solid ${CARD_BORDER}`,
            borderRadius: 14,
            boxShadow: SHADOW,
          }}
        >
          {options.map((opt) => (
            <li key={opt}>
              <button
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left"
                style={{
                  fontSize: 13,
                  color: opt === value ? COACH : INK,
                  fontWeight: opt === value ? 700 : 500,
                  background: opt === value ? "#EAF8F0" : "transparent",
                }}
              >
                {opt}
                {opt === value && <Check className="h-3.5 w-3.5" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
