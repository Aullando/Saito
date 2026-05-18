import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ClipboardCheck,
  Users,
  StickyNote,
  Star,
  Sparkles,
  Dumbbell,
  CalendarX,
  Info,
  MessageSquareHeart,
  HeartPulse,
  Stethoscope,
  CalendarPlus,
  LineChart,
  Bell,
  Check,
  Lock,
  Send,
  Clock,
  MapPin,
  Paperclip,
  Loader2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useData } from "@/lib/store";

export const Route = createFileRoute("/_app/mobile/$tool")({
  component: MobileTool,
});

type Meta = { title: string; desc: string; icon: LucideIcon };

const META: Record<string, Meta> = {
  session: { title: "Sesión de hoy", desc: "Estructura del entrenamiento", icon: Dumbbell },
  attendance: { title: "Asistencia", desc: "Pasa lista en un toque", icon: ClipboardCheck },
  callup: { title: "Convocatoria", desc: "Selecciona y envía", icon: Users },
  notes: { title: "Notas", desc: "Apuntes de la sesión", icon: StickyNote },
  ratings: { title: "Valoraciones", desc: "Tras la sesión", icon: Star },
  ai: { title: "IA de sesión", desc: "Create with SAITO", icon: Sparkles },
  absence: { title: "Notificar ausencia", desc: "Avisa a tu entrenador", icon: CalendarX },
  "session-info": { title: "Información de la sesión", desc: "Qué haremos hoy", icon: Info },
  feedback: { title: "Feedback post-entreno", desc: "Cuéntanos cómo te fue", icon: MessageSquareHeart },
  health: { title: "Salud", desc: "Tu estado y restricciones", icon: HeartPulse },
  treatment: { title: "Plan de tratamiento", desc: "Indicaciones del staff médico", icon: Stethoscope },
  "request-appointment": { title: "Solicitar cita médica", desc: "Reserva con el staff médico", icon: CalendarPlus },
  performance: { title: "Mi rendimiento", desc: "Métricas de la temporada", icon: LineChart },
  notifications: { title: "Notificaciones", desc: "Avisos y novedades", icon: Bell },
};

function MobileTool() {
  const { tool } = Route.useParams();
  const meta = META[tool];
  if (!meta) {
    return (
      <div className="space-y-3">
        <BackLink />
        <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Sección no encontrada.
        </div>
      </div>
    );
  }
  const Icon = meta.icon;
  return (
    <div className="space-y-4 pb-2">
      <BackLink />
      <header className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">{meta.title}</h1>
          <p className="text-xs text-muted-foreground">{meta.desc}</p>
        </div>
      </header>
      <ToolBody tool={tool} />
    </div>
  );
}

function BackLink() {
  return (
    <Link to="/mobile" className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <ArrowLeft className="h-3 w-3" /> Volver
    </Link>
  );
}

function ToolBody({ tool }: { tool: string }) {
  switch (tool) {
    case "attendance":
      return <Attendance />;
    case "callup":
      return <CallUp />;
    case "notes":
      return <Notes />;
    case "ratings":
      return <Ratings />;
    case "ai":
      return <AISession />;
    case "absence":
      return <Absence />;
    case "request-appointment":
      return <RequestAppointment />;
    case "session-info":
    case "session":
      return <SessionInfo />;
    case "feedback":
      return <Feedback />;
    case "health":
      return <Health />;
    case "treatment":
      return <Treatment />;
    case "performance":
      return <Performance />;
    case "notifications":
      return <Notifications />;
    default:
      return null;
  }
}

// ───────── ATHLETES helper ─────────
function useDemoAthletes(limit = 12) {
  const athletes = useData((s) => s.athletes);
  return useMemo(() => athletes.slice(0, limit), [athletes, limit]);
}

// ───────── ASISTENCIA ─────────
type AttStatus = "present" | "absent" | "justified" | "injured";
const ATT_OPTIONS: { key: AttStatus; label: string; cls: string }[] = [
  { key: "present", label: "Presente", cls: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  { key: "absent", label: "Ausente", cls: "bg-rose-100 text-rose-800 border-rose-200" },
  { key: "justified", label: "Justif.", cls: "bg-amber-100 text-amber-800 border-amber-200" },
  { key: "injured", label: "Lesion.", cls: "bg-violet-100 text-violet-800 border-violet-200" },
];

function Attendance() {
  const athletes = useDemoAthletes();
  const [state, setState] = useState<Record<string, AttStatus>>({});
  const counts = useMemo(() => {
    const c = { present: 0, absent: 0, justified: 0, injured: 0 } as Record<AttStatus, number>;
    Object.values(state).forEach((s) => (c[s] += 1));
    return c;
  }, [state]);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5 text-[11px]">
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-800">
          Pres. {counts.present}
        </span>
        <span className="rounded-full bg-rose-100 px-2 py-0.5 font-semibold text-rose-800">
          Aus. {counts.absent}
        </span>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-800">
          Just. {counts.justified}
        </span>
        <span className="rounded-full bg-violet-100 px-2 py-0.5 font-semibold text-violet-800">
          Les. {counts.injured}
        </span>
      </div>
      <ul className="space-y-2">
        {athletes.map((a) => (
          <li
            key={a.id}
            className="rounded-2xl border border-border bg-card p-2.5"
          >
            <div className="mb-2 truncate text-sm font-semibold">
              {a.firstName} {a.lastName}
            </div>
            <div className="grid grid-cols-4 gap-1">
              {ATT_OPTIONS.map((o) => {
                const active = state[a.id] === o.key;
                return (
                  <button
                    key={o.key}
                    onClick={() => setState((s) => ({ ...s, [a.id]: o.key }))}
                    className={`rounded-lg border px-1 py-1.5 text-[10px] font-semibold transition ${
                      active ? o.cls : "border-border bg-muted text-muted-foreground"
                    }`}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={() => toast.success("Asistencia guardada")}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow"
      >
        <Check className="h-4 w-4" /> Guardar asistencia
      </button>
    </div>
  );
}

// ───────── CONVOCATORIA ─────────
function CallUp() {
  const athletes = useDemoAthletes(14);
  const [sel, setSel] = useState<Record<string, boolean>>({});
  const count = Object.values(sel).filter(Boolean).length;
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border bg-card p-3 text-xs">
        <div className="font-semibold text-foreground">Sábado · 18:00</div>
        <div className="mt-0.5 text-muted-foreground">Estadio Vallehermoso · Control 200 m</div>
      </div>
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{count} seleccionados</span>
        <button
          onClick={() =>
            setSel(Object.fromEntries(athletes.map((a) => [a.id, true])))
          }
          className="font-semibold text-primary"
        >
          Seleccionar todos
        </button>
      </div>
      <ul className="space-y-1.5">
        {athletes.map((a) => {
          const checked = !!sel[a.id];
          return (
            <li key={a.id}>
              <button
                onClick={() => setSel((s) => ({ ...s, [a.id]: !s[a.id] }))}
                className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                  checked
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card text-foreground"
                }`}
              >
                <span className="truncate">
                  {a.firstName} {a.lastName}
                </span>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                    checked
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background"
                  }`}
                >
                  {checked && <Check className="h-3.5 w-3.5" />}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <button
        disabled={count === 0}
        onClick={() => toast.success(`Convocatoria enviada a ${count} deportistas`)}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow disabled:opacity-50"
      >
        <Send className="h-4 w-4" /> Enviar convocatoria
      </button>
    </div>
  );
}

// ───────── NOTAS ─────────
function Notes() {
  const [text, setText] = useState("");
  const [priv, setPriv] = useState(true);
  return (
    <div className="space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, 1000))}
        rows={6}
        placeholder="Escribe tu nota sobre la sesión, observaciones tácticas, incidencias…"
        className="w-full resize-none rounded-2xl border border-border bg-card p-3 text-sm outline-none focus:border-primary"
      />
      <div className="text-right text-[10px] text-muted-foreground">{text.length}/1000</div>
      <button
        onClick={() => setPriv((v) => !v)}
        className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-sm ${
          priv ? "border-primary bg-primary/5" : "border-border bg-card"
        }`}
      >
        <span className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-muted-foreground" />
          Nota privada
        </span>
        <span
          className={`flex h-5 w-9 items-center rounded-full p-0.5 transition ${
            priv ? "bg-primary" : "bg-muted"
          }`}
        >
          <span
            className={`h-4 w-4 rounded-full bg-white shadow transition ${
              priv ? "translate-x-4" : ""
            }`}
          />
        </span>
      </button>
      <button
        disabled={!text.trim()}
        onClick={() => {
          toast.success("Nota guardada");
          setText("");
        }}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow disabled:opacity-50"
      >
        <Check className="h-4 w-4" /> Guardar nota
      </button>
    </div>
  );
}

// ───────── VALORACIONES ─────────
function Ratings() {
  const [rpe, setRpe] = useState(6);
  const [rec, setRec] = useState(7);
  const [comment, setComment] = useState("");
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-3">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>Esfuerzo percibido</span>
          <span className="text-primary">{rpe}/10</span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={rpe}
          onChange={(e) => setRpe(+e.target.value)}
          className="mt-2 w-full accent-[color:var(--primary)]"
        />
        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
          <span>Suave</span>
          <span>Máximo</span>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-3">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>Recuperación</span>
          <span className="text-primary">{rec}/10</span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={rec}
          onChange={(e) => setRec(+e.target.value)}
          className="mt-2 w-full accent-[color:var(--primary)]"
        />
        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
          <span>Mala</span>
          <span>Excelente</span>
        </div>
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value.slice(0, 500))}
        rows={4}
        placeholder="Comentario: sensaciones, molestias, observaciones…"
        className="w-full resize-none rounded-2xl border border-border bg-card p-3 text-sm outline-none focus:border-primary"
      />
      <button
        onClick={() => toast.success("Valoración enviada")}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow"
      >
        <Send className="h-4 w-4" /> Enviar valoración
      </button>
    </div>
  );
}

// ───────── IA SESIÓN ─────────
type AIBlock = { title: string; items: string[] };
function AISession() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [blocks, setBlocks] = useState<AIBlock[] | null>(null);

  const run = () => {
    if (!input.trim()) return;
    setLoading(true);
    setBlocks(null);
    setTimeout(() => {
      setBlocks([
        {
          title: "Calentamiento",
          items: [
            "10 min movilidad articular dinámica",
            "Activación glúteos y core (mini-band)",
            "3 series de skipping progresivo",
          ],
        },
        {
          title: "Bloque técnico",
          items: [
            "Técnica de carrera: A-skip, B-skip, talones",
            "Salidas reactivas 4×20 m al 80%",
          ],
        },
        {
          title: "Ejercicio principal",
          items: [
            "5×200 m al 90% RPE 7",
            "Recuperación 3 min entre series",
            "Mantener técnica en últimas dos series",
          ],
        },
        {
          title: "Variantes",
          items: [
            "Atletas en revisión: reducir a 3×200 m al 80%",
            "Si lluvia: sustituir por 5×30 s en cuesta",
          ],
        },
      ]);
      setLoading(false);
    }, 900);
  };

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Crear con SAITO
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          IA de sesión: estructura tu entrenamiento por bloques.
        </p>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value.slice(0, 300))}
        rows={3}
        placeholder="¿Por dónde empiezo? Escribe qué tipo de entrenamiento o tarea buscas realizar…"
        className="w-full resize-none rounded-2xl border border-border bg-card p-3 text-sm outline-none focus:border-primary"
      />

      <button
        onClick={run}
        disabled={!input.trim() || loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Generando…
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" /> Crear con SAITO
          </>
        )}
      </button>

      {blocks && (
        <div className="space-y-2">
          {blocks.map((b) => (
            <div key={b.title} className="rounded-2xl border border-primary/20 bg-primary/5 p-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-primary">
                {b.title}
              </div>
              <ul className="mt-1.5 space-y-1 text-sm text-foreground">
                {b.items.map((it) => (
                  <li key={it} className="flex gap-1.5">
                    <span className="text-primary">•</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <button
              onClick={run}
              className="rounded-xl border border-border bg-card px-2 py-2 text-[11px] font-semibold text-foreground active:scale-95"
            >
              Recrear
            </button>
            <button
              onClick={() => toast.message("Refinando propuesta…")}
              className="rounded-xl border border-border bg-card px-2 py-2 text-[11px] font-semibold text-foreground active:scale-95"
            >
              Refinar
            </button>
            <button
              onClick={() => toast.success("Incluido en la sesión")}
              className="rounded-xl bg-primary px-2 py-2 text-[11px] font-semibold text-primary-foreground active:scale-95"
            >
              Incluir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ───────── AUSENCIA ─────────
const ABSENCE_REASONS = ["Enfermedad", "Lesión", "Estudios", "Trabajo", "Personal", "Otro"];
function Absence() {
  const [reason, setReason] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  return (
    <div className="space-y-3">
      <div>
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Motivo
        </div>
        <div className="grid grid-cols-2 gap-2">
          {ABSENCE_REASONS.map((r) => {
            const active = reason === r;
            return (
              <button
                key={r}
                onClick={() => setReason(r)}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
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
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value.slice(0, 500))}
        rows={4}
        placeholder="Comentario para el entrenador (opcional)"
        className="w-full resize-none rounded-2xl border border-border bg-card p-3 text-sm outline-none focus:border-primary"
      />
      <button
        disabled={!reason}
        onClick={() => toast.success("Ausencia notificada al entrenador")}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow disabled:opacity-50"
      >
        <Check className="h-4 w-4" /> Confirmar ausencia
      </button>
    </div>
  );
}

// ───────── SOLICITAR CITA ─────────
const SPECIALTIES = ["Fisioterapia", "Medicina deportiva", "Nutrición", "Psicología"];
function RequestAppointment() {
  const [reason, setReason] = useState("");
  const [specialty, setSpecialty] = useState(SPECIALTIES[0]);
  const [date, setDate] = useState("");
  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Motivo de la cita
        </label>
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value.slice(0, 120))}
          placeholder="Ej: molestia en gemelo derecho"
          className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>
      <div>
        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Especialidad
        </label>
        <div className="grid grid-cols-2 gap-2">
          {SPECIALTIES.map((s) => {
            const active = specialty === s;
            return (
              <button
                key={s}
                onClick={() => setSpecialty(s)}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card text-foreground"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Fecha preferida
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>
      <button
        disabled={!reason.trim() || !date}
        onClick={() => toast.success("Solicitud enviada al staff médico")}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow disabled:opacity-50"
      >
        <Send className="h-4 w-4" /> Enviar solicitud
      </button>
    </div>
  );
}

// ───────── SESSION INFO / FEEDBACK / HEALTH / TREATMENT / PERFORMANCE / NOTIFICATIONS ─────────
function SessionInfo() {
  const athletes = useData((s) => s.athletes).slice(0, 8);
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="text-base font-bold leading-tight">
          Atletismo · Tecnificación Infantil
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" /> Infantil A · 14 atletas
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" /> 17:30 – 19:00
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> Pista de Atletismo · Sede principal
        </div>
      </div>

      <div>
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Objetivo de la sesión
        </div>
        <p className="rounded-2xl border border-border bg-card p-3 text-sm">
          Velocidad lactácida — series 5×200 m al 90% con recuperación amplia.
        </p>
      </div>

      <div>
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Atletas convocados ({athletes.length})
        </div>
        <ul className="space-y-1">
          {athletes.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2 text-sm"
            >
              <span className="truncate">{a.firstName} {a.lastName}</span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                Convocado
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Restricciones operativas
        </div>
        <ul className="space-y-1.5">
          <li className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span><b>Daniel Ruiz</b> — sin sprints máximos esta semana (molestia isquios).</span>
          </li>
          <li className="flex items-start gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-900">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span><b>Sara López</b> — carga reducida 50% (en revisión médica).</span>
          </li>
        </ul>
      </div>

      <div>
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Adjuntos
        </div>
        <ul className="space-y-1.5">
          {["Plan_velocidad_lactacida.pdf", "Calentamiento_dinamico.png"].map((f) => (
            <li
              key={f}
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm"
            >
              <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Acciones
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <Link to="/mobile/attendance" className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card px-2 py-2.5 text-[10px] font-semibold text-foreground active:scale-95">
            <ClipboardCheck className="h-4 w-4 text-primary" /> Asistencia
          </Link>
          <Link to="/mobile/notes" className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card px-2 py-2.5 text-[10px] font-semibold text-foreground active:scale-95">
            <StickyNote className="h-4 w-4 text-primary" /> Notas
          </Link>
          <Link to="/mobile/ratings" className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card px-2 py-2.5 text-[10px] font-semibold text-foreground active:scale-95">
            <Star className="h-4 w-4 text-primary" /> Valoración
          </Link>
          <Link to="/mobile/feedback" className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card px-2 py-2.5 text-[10px] font-semibold text-foreground active:scale-95">
            <MessageSquareHeart className="h-4 w-4 text-primary" /> Feedback
          </Link>
          <Link to="/mobile/ai" className="col-span-2 flex items-center justify-center gap-1.5 rounded-xl bg-primary px-2 py-2.5 text-[11px] font-semibold text-primary-foreground active:scale-95">
            <Sparkles className="h-4 w-4" /> IA de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

function Feedback() {
  const [rpe, setRpe] = useState(6);
  const [text, setText] = useState("");
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border bg-card p-3">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>¿Cómo te has sentido?</span>
          <span className="text-primary">{rpe}/10</span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={rpe}
          onChange={(e) => setRpe(+e.target.value)}
          className="mt-2 w-full accent-[color:var(--primary)]"
        />
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, 500))}
        rows={4}
        placeholder="Sensaciones, molestias, observaciones…"
        className="w-full resize-none rounded-2xl border border-border bg-card p-3 text-sm outline-none focus:border-primary"
      />
      <button
        onClick={() => toast.success("Feedback enviado al entrenador")}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow"
      >
        <Send className="h-4 w-4" /> Enviar feedback
      </button>
    </div>
  );
}

function Health() {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">
          Estado actual
        </div>
        <div className="mt-1 text-lg font-bold text-amber-900">Apto</div>
        <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
          <span className="rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-800">
            Apto
          </span>
          <span className="rounded-full bg-orange-100 px-2 py-0.5 font-semibold text-orange-800">
            En revisión
          </span>
          <span className="rounded-full bg-rose-100 px-2 py-0.5 font-semibold text-rose-800">
            No apto
          </span>
        </div>
      </div>
      <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-orange-700">
          Bienestar de hoy
        </div>
        <p className="mt-1 text-sm text-orange-900">
          Registra tu sueño, fatiga y dolor muscular para ajustar la carga.
        </p>
        <Link
          to="/mobile/feedback"
          className="mt-3 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-3 py-2 text-xs font-semibold text-white"
        >
          Registrar bienestar
        </Link>
      </div>
    </div>
  );
}

function Treatment() {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border bg-card p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Sin plan activo</span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
            —
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Aparecerá aquí si el staff médico te asigna un plan.
        </p>
      </div>
    </div>
  );
}

function Performance() {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Última valoración
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2 text-center">
          {[
            { l: "Técnica", v: "8.2" },
            { l: "Compromiso", v: "9.0" },
            { l: "Físico", v: "7.5" },
          ].map((s) => (
            <div key={s.l} className="rounded-lg bg-muted px-2 py-2">
              <div className="text-lg font-bold text-foreground">{s.v}</div>
              <div className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Temporada
        </div>
        <div className="mt-2 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Asistencia</span>
            <span className="font-semibold">92%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">RPE medio</span>
            <span className="font-semibold">6.8</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mejor marca 800 m</span>
            <span className="font-semibold">2:08</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Notifications() {
  const items = [
    { id: "n1", title: "Nuevo mensaje del entrenador", time: "hace 12 min" },
    { id: "n2", title: "Nueva valoración disponible", time: "hace 2 h" },
    { id: "n3", title: "Notas de la sesión del miércoles", time: "ayer" },
    { id: "n4", title: "Cambio de horario: viernes 18:00 → 17:30", time: "ayer" },
  ];
  return (
    <ul className="space-y-2">
      {items.map((n) => (
        <li key={n.id} className="rounded-2xl border border-border bg-card p-3">
          <div className="text-sm font-semibold text-foreground">{n.title}</div>
          <div className="text-[11px] text-muted-foreground">{n.time}</div>
        </li>
      ))}
    </ul>
  );
}
