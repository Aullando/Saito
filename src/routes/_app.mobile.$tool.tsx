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
import { useData, useCurrentUser } from "@/lib/store";
import { useSessionLocal } from "@/lib/sessionLocal";
import { useClub } from "@/clubs/ClubProvider";
import {
  GffMobileSession,
  GffMobileHealth,
  GffMobilePerformance,
} from "@/clubs/gff/GffMobileWorkspace";
import { useLang, useTr } from "@/lib/i18n";
import { useTd } from "@/lib/demoI18n";

const DEMO_SESSION_ID = "session-today";

export const Route = createFileRoute("/_app/mobile/$tool")({
  component: MobileToolRoute,
});

function MobileToolRoute() {
  const { tool } = Route.useParams();
  const { club } = useClub();
  if (club.id === "gff-demo") {
    if (tool === "session") return <GffMobileSession />;
    if (tool === "health") return <GffMobileHealth />;
    if (tool === "performance") return <GffMobilePerformance />;
    // Fallback: render the standard tool inside the workspace.
  }
  return <MobileTool />;
}

type Meta = { title: string; desc: string; icon: LucideIcon };

function useMeta(): Record<string, Meta> {
  const tr = useTr();
  return {
    session: { title: tr("Sesión de hoy", "Today's Session"), desc: tr("Estructura del entrenamiento", "Training structure"), icon: Dumbbell },
    attendance: { title: tr("Asistencia", "Attendance"), desc: tr("Pasa lista en un toque", "Take roll in one tap"), icon: ClipboardCheck },
    callup: { title: tr("Convocatoria", "Call-up"), desc: tr("Selecciona y envía", "Select and send"), icon: Users },
    notes: { title: tr("Notas", "Notes"), desc: tr("Apuntes de la sesión", "Session notes"), icon: StickyNote },
    ratings: { title: tr("Valoraciones", "Ratings"), desc: tr("Tras la sesión", "Post-session"), icon: Star },
    ai: { title: tr("IA de sesión", "Session AI"), desc: "Create with SAITO", icon: Sparkles },
    absence: { title: tr("Notificar ausencia", "Report Absence"), desc: tr("Avisa a tu entrenador", "Notify your coach"), icon: CalendarX },
    "session-info": { title: tr("Información de la sesión", "Session Information"), desc: tr("Qué haremos hoy", "What we'll do today"), icon: Info },
    feedback: { title: tr("Feedback post-entreno", "Post-training Feedback"), desc: tr("Cuéntanos cómo te fue", "Tell us how it went"), icon: MessageSquareHeart },
    health: { title: tr("Salud", "Health"), desc: tr("Tu estado y restricciones", "Your status and restrictions"), icon: HeartPulse },
    treatment: { title: tr("Plan de tratamiento", "Treatment Plan"), desc: tr("Indicaciones del staff médico", "Medical staff instructions"), icon: Stethoscope },
    "request-appointment": { title: tr("Solicitar cita médica", "Request Appointment"), desc: tr("Reserva con el staff médico", "Book with medical staff"), icon: CalendarPlus },
    performance: { title: tr("Mi rendimiento", "My Performance"), desc: tr("Métricas de la temporada", "Season metrics"), icon: LineChart },
    notifications: { title: tr("Notificaciones", "Notifications"), desc: tr("Avisos y novedades", "Alerts and updates"), icon: Bell },
  };
}

function MobileTool() {
  const { tool } = Route.useParams();
  const tr = useTr();
  const META = useMeta();
  const meta = META[tool];
  if (!meta) {
    return (
      <div className="space-y-3">
        <BackLink />
        <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          {tr("Sección no encontrada.", "Section not found.")}
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
  const tr = useTr();
  return (
    <Link to="/mobile" className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <ArrowLeft className="h-3 w-3" /> {tr("Volver", "Back")}
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

const getAttOptions = (tr: (es: string, en: string) => string) => [
  { key: "present" as AttStatus, label: tr("Presente", "Present"), cls: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  { key: "absent" as AttStatus, label: tr("Ausente", "Absent"), cls: "bg-rose-100 text-rose-800 border-rose-200" },
  { key: "justified" as AttStatus, label: tr("Justif.", "Excused"), cls: "bg-amber-100 text-amber-800 border-amber-200" },
  { key: "injured" as AttStatus, label: tr("Lesion.", "Injured"), cls: "bg-violet-100 text-violet-800 border-violet-200" },
];

function Attendance() {
  const tr = useTr();
  const ATT_OPTIONS = getAttOptions(tr);
  const athletes = useDemoAthletes();
  const saved = useSessionLocal((s) => s.attendance[DEMO_SESSION_ID]);
  const saveAttendance = useSessionLocal((s) => s.saveAttendance);
  const [state, setState] = useState<Record<string, AttStatus>>(() => {
    if (!saved) return {};
    const m: Record<string, AttStatus> = {};
    Object.entries(saved).forEach(([k, v]) => {
      m[k] = v === "present" ? "present" : v === "late" ? "justified" : "absent";
    });
    return m;
  });
  const counts = useMemo(() => {
    const c = { present: 0, absent: 0, justified: 0, injured: 0 } as Record<AttStatus, number>;
    Object.values(state).forEach((s) => (c[s] += 1));
    return c;
  }, [state]);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5 text-[11px]">
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-800">
          {tr("Pres.", "Pres.")} {counts.present}
        </span>
        <span className="rounded-full bg-rose-100 px-2 py-0.5 font-semibold text-rose-800">
          {tr("Aus.", "Abs.")} {counts.absent}
        </span>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-800">
          {tr("Just.", "Exc.")} {counts.justified}
        </span>
        <span className="rounded-full bg-violet-100 px-2 py-0.5 font-semibold text-violet-800">
          {tr("Les.", "Inj.")} {counts.injured}
        </span>
      </div>
      <ul className="space-y-2">
        {athletes.map((a) => (
          <li key={a.id} className="rounded-2xl border border-border bg-card p-2.5">
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
        onClick={() => {
          const mapped: Record<string, "present" | "late" | "absent"> = {};
          Object.entries(state).forEach(([k, v]) => {
            mapped[k] = v === "present" ? "present" : v === "justified" ? "late" : "absent";
          });
          saveAttendance(DEMO_SESSION_ID, mapped);
          toast.success(tr("Asistencia guardada", "Attendance saved"));
        }}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow"
      >
        <Check className="h-4 w-4" /> {tr("Guardar asistencia", "Save attendance")}
      </button>
    </div>
  );
}

// ───────── CONVOCATORIA ─────────
function CallUp() {
  const tr = useTr();
  const athletes = useDemoAthletes(14);
  const saveCallup = useSessionLocal((s) => s.saveCallup);
  const [sel, setSel] = useState<Record<string, boolean>>({});
  const count = Object.values(sel).filter(Boolean).length;
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border bg-card p-3 text-xs">
        <div className="font-semibold text-foreground">{tr("Sábado · 18:00", "Saturday · 18:00")}</div>
        <div className="mt-0.5 text-muted-foreground">
          {tr("Estadio Vallehermoso · Control 200 m", "Vallehermoso Stadium · 200 m Control")}
        </div>
      </div>
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{tr(`${count} seleccionados`, `${count} selected`)}</span>
        <button
          onClick={() => setSel(Object.fromEntries(athletes.map((a) => [a.id, true])))}
          className="font-semibold text-primary"
        >
          {tr("Seleccionar todos", "Select all")}
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
        onClick={() => {
          const ids = Object.entries(sel)
            .filter(([, v]) => v)
            .map(([k]) => k);
          saveCallup(DEMO_SESSION_ID, ids);
          toast.success(tr(`Convocatoria enviada a ${count} deportistas`, `Call-up sent to ${count} athletes`));
        }}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow disabled:opacity-50"
      >
        <Send className="h-4 w-4" /> {tr("Enviar convocatoria", "Send call-up")}
      </button>
    </div>
  );
}

// ───────── NOTAS ─────────
function Notes() {
  const tr = useTr();
  const lang = useLang();
  const addNote = useSessionLocal((s) => s.addNote);
  const allNotes = useSessionLocal((s) => s.notes);
  const notes = useMemo(() => allNotes.filter((n) => n.sessionId === DEMO_SESSION_ID), [allNotes]);
  const [text, setText] = useState("");
  const [priv, setPriv] = useState(true);
  return (
    <div className="space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, 1000))}
        rows={6}
        placeholder={tr(
          "Escribe tu nota sobre la sesión, observaciones tácticas, incidencias…",
          "Write your session note, tactical observations, incidents…",
        )}
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
          {tr("Nota privada", "Private note")}
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
          addNote(DEMO_SESSION_ID, text.trim(), priv);
          toast.success(tr("Nota guardada", "Note saved"));
          setText("");
        }}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow disabled:opacity-50"
      >
        <Check className="h-4 w-4" /> {tr("Guardar nota", "Save note")}
      </button>
      {notes.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {tr("Notas guardadas", "Saved notes")}
          </div>
          {notes.map((n) => (
            <div key={n.id} className="rounded-2xl border border-border bg-card p-3 text-sm">
              <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {n.privateNote && <Lock className="h-3 w-3" />}
                {new Date(n.createdAt).toLocaleString(lang === "es" ? "es" : "en-US", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div>{n.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ───────── VALORACIONES ─────────
function Ratings() {
  const tr = useTr();
  const saveRating = useSessionLocal((s) => s.saveRating);
  const [rpe, setRpe] = useState(6);
  const [rec, setRec] = useState(7);
  const [comment, setComment] = useState("");
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-3">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>{tr("Esfuerzo percibido", "Perceived effort")}</span>
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
          <span>{tr("Suave", "Easy")}</span>
          <span>{tr("Máximo", "Max")}</span>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-3">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>{tr("Recuperación", "Recovery")}</span>
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
          <span>{tr("Mala", "Poor")}</span>
          <span>{tr("Excelente", "Excellent")}</span>
        </div>
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value.slice(0, 500))}
        rows={4}
        placeholder={tr("Comentario: sensaciones, molestias, observaciones…", "Comment: sensations, discomfort, observations…")}
        className="w-full resize-none rounded-2xl border border-border bg-card p-3 text-sm outline-none focus:border-primary"
      />
      <button
        onClick={() => {
          saveRating(DEMO_SESSION_ID, rpe, rec, comment.trim() || undefined);
          toast.success(tr("Valoración enviada", "Rating sent"));
        }}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow"
      >
        <Send className="h-4 w-4" /> {tr("Enviar valoración", "Send rating")}
      </button>
    </div>
  );
}

// ───────── IA SESIÓN ─────────
type AIBlock = { title: string; items: string[] };
function AISession() {
  const tr = useTr();
  const td = useTd();
  const acceptAIBlock = useSessionLocal((s) => s.acceptAIBlock);
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
          items: ["Técnica de carrera: A-skip, B-skip, talones", "Salidas reactivas 4×20 m al 80%"],
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
          <Sparkles className="h-3.5 w-3.5" /> Create with SAITO
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {tr(
            "IA de sesión: estructura tu entrenamiento por bloques.",
            "Session AI: structure your training by blocks.",
          )}
        </p>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value.slice(0, 300))}
        rows={3}
        placeholder={tr(
          "¿Por dónde empiezo? Escribe qué tipo de entrenamiento o tarea buscas realizar…",
          "Where do I start? Write what type of training or task you want to do…",
        )}
        className="w-full resize-none rounded-2xl border border-border bg-card p-3 text-sm outline-none focus:border-primary"
      />

      <button
        onClick={run}
        disabled={!input.trim() || loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> {tr("Generando…", "Generating…")}
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" /> Create with SAITO
          </>
        )}
      </button>

      {blocks && (
        <div className="space-y-2">
          {blocks.map((b) => (
            <div key={b.title} className="rounded-2xl border border-primary/20 bg-primary/5 p-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-primary">
                {td(b.title)}
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
              {tr("Recrear", "Recreate")}
            </button>
            <button
              onClick={() => toast.message(tr("Refinando propuesta…", "Refining proposal…"))}
              className="rounded-xl border border-border bg-card px-2 py-2 text-[11px] font-semibold text-foreground active:scale-95"
            >
              {tr("Refinar", "Refine")}
            </button>
            <button
              onClick={() => {
                blocks?.forEach((b) =>
                  acceptAIBlock(DEMO_SESSION_ID, b.title, b.items.join(" · ")),
                );
                toast.success(tr("Incluido en la sesión", "Added to session"));
              }}
              className="rounded-xl bg-primary px-2 py-2 text-[11px] font-semibold text-primary-foreground active:scale-95"
            >
              {tr("Incluir", "Include")}
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
  const tr = useTr();
  const td = useTd();
  const user = useCurrentUser();
  const notifyAbsence = useSessionLocal((s) => s.notifyAbsence);
  const [reason, setReason] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  return (
    <div className="space-y-3">
      <div>
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {tr("Motivo", "Reason")}
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
                {td(r)}
              </button>
            );
          })}
        </div>
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value.slice(0, 500))}
        rows={4}
        placeholder={tr("Comentario para el entrenador (opcional)", "Comment for the coach (optional)")}
        className="w-full resize-none rounded-2xl border border-border bg-card p-3 text-sm outline-none focus:border-primary"
      />
      <button
        disabled={!reason}
        onClick={() => {
          if (!reason) return;
          notifyAbsence({
            sessionId: DEMO_SESSION_ID,
            athleteId: user?.id ?? "u-ath",
            athleteName: user?.name ?? "Atleta",
            reason,
            comment: comment.trim() || undefined,
          });
          toast.success(tr("Ausencia notificada al entrenador", "Absence notified to coach"));
        }}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow disabled:opacity-50"
      >
        <Check className="h-4 w-4" /> {tr("Confirmar ausencia", "Confirm absence")}
      </button>
    </div>
  );
}

// ───────── SOLICITAR CITA ─────────
const SPECIALTIES = ["Fisioterapia", "Medicina deportiva", "Nutrición", "Psicología"];
function RequestAppointment() {
  const tr = useTr();
  const td = useTd();
  const user = useCurrentUser();
  const requestAppointment = useSessionLocal((s) => s.requestAppointment);
  const [reason, setReason] = useState("");
  const [specialty, setSpecialty] = useState(SPECIALTIES[0]);
  const [date, setDate] = useState("");
  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {tr("Motivo de la cita", "Appointment reason")}
        </label>
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value.slice(0, 120))}
          placeholder={tr("Ej: molestia en gemelo derecho", "E.g.: discomfort in right calf")}
          className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>
      <div>
        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {tr("Especialidad", "Specialty")}
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
                {td(s)}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {tr("Fecha preferida", "Preferred date")}
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
        onClick={() => {
          requestAppointment({
            athleteId: user?.id ?? "u-ath",
            athleteName: user?.name ?? "Atleta",
            specialty,
            reason: reason.trim(),
            preferredDate: date || undefined,
          });
          toast.success(tr("Solicitud enviada al staff médico", "Request sent to medical staff"));
        }}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow disabled:opacity-50"
      >
        <Send className="h-4 w-4" /> {tr("Enviar solicitud", "Send request")}
      </button>
    </div>
  );
}

// ───────── SESSION INFO / FEEDBACK / HEALTH / TREATMENT / PERFORMANCE / NOTIFICATIONS ─────────
function SessionInfo() {
  const tr = useTr();
  const td = useTd();
  const athletes = useData((s) => s.athletes).slice(0, 8);
  const allAiBlocks = useSessionLocal((s) => s.aiBlocks);
  const allFeedbacks = useSessionLocal((s) => s.feedbacks);
  const aiBlocks = useMemo(
    () => allAiBlocks.filter((b) => b.sessionId === DEMO_SESSION_ID),
    [allAiBlocks],
  );
  const feedbacks = useMemo(
    () => allFeedbacks.filter((f) => f.sessionId === DEMO_SESSION_ID),
    [allFeedbacks],
  );
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="text-base font-bold leading-tight">
          {tr("Atletismo · Tecnificación Infantil", "Athletics · Youth Technical Development")}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" /> {tr("Infantil A · 14 atletas", "Youth A · 14 athletes")}
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" /> 17:30 – 19:00
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> {tr("Pista de Atletismo · Sede principal", "Athletics Track · Main Venue")}
        </div>
      </div>

      <div>
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {tr("Objetivo de la sesión", "Session objective")}
        </div>
        <p className="rounded-2xl border border-border bg-card p-3 text-sm">
          {tr(
            "Velocidad lactácida — series 5×200 m al 90% con recuperación amplia.",
            "Lactic speed — 5×200 m series at 90% with extended recovery.",
          )}
        </p>
      </div>

      <div>
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {tr(`Atletas convocados (${athletes.length})`, `Athletes called up (${athletes.length})`)}
        </div>
        <ul className="space-y-1">
          {athletes.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2 text-sm"
            >
              <span className="truncate">
                {a.firstName} {a.lastName}
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                {td("Convocado")}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {tr("Restricciones operativas", "Operational restrictions")}
        </div>
        <ul className="space-y-1.5">
          <li className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              <b>Daniel Ruiz</b> — {tr("sin sprints máximos esta semana (molestia isquios).", "no max sprints this week (hamstring discomfort).")}
            </span>
          </li>
          <li className="flex items-start gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-900">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              <b>Sara López</b> — {tr("carga reducida 50% (en revisión médica).", "load reduced 50% (under medical review).")}
            </span>
          </li>
        </ul>
      </div>

      <div>
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {tr("Adjuntos", "Attachments")}
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

      {aiBlocks.length > 0 && (
        <div>
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
            {tr(`Bloques añadidos con IA (${aiBlocks.length})`, `AI-added blocks (${aiBlocks.length})`)}
          </div>
          <ul className="space-y-1.5">
            {aiBlocks.map((b) => (
              <li key={b.id} className="rounded-xl border border-primary/20 bg-primary/5 p-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> {td(b.title)}
                </div>
                {b.detail && <div className="mt-1 text-xs text-foreground">{b.detail}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {feedbacks.length > 0 && (
        <div>
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {tr(`Feedback recibido (${feedbacks.length})`, `Feedback received (${feedbacks.length})`)}
          </div>
          <ul className="space-y-1.5">
            {feedbacks.map((f) => (
              <li key={f.id} className="rounded-xl border border-border bg-card px-3 py-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{f.athleteName}</span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    RPE {f.rpe}/10
                  </span>
                </div>
                {f.text && <div className="mt-1 text-xs text-muted-foreground">{f.text}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {tr("Acciones", "Actions")}
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <Link
            to="/mobile/attendance"
            className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card px-2 py-2.5 text-[10px] font-semibold text-foreground active:scale-95"
          >
            <ClipboardCheck className="h-4 w-4 text-primary" /> {tr("Asistencia", "Attendance")}
          </Link>
          <Link
            to="/mobile/notes"
            className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card px-2 py-2.5 text-[10px] font-semibold text-foreground active:scale-95"
          >
            <StickyNote className="h-4 w-4 text-primary" /> {tr("Notas", "Notes")}
          </Link>
          <Link
            to="/mobile/ratings"
            className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card px-2 py-2.5 text-[10px] font-semibold text-foreground active:scale-95"
          >
            <Star className="h-4 w-4 text-primary" /> {tr("Valoración", "Rating")}
          </Link>
          <Link
            to="/mobile/feedback"
            className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card px-2 py-2.5 text-[10px] font-semibold text-foreground active:scale-95"
          >
            <MessageSquareHeart className="h-4 w-4 text-primary" /> Feedback
          </Link>
          <Link
            to="/mobile/ai"
            className="col-span-2 flex items-center justify-center gap-1.5 rounded-xl bg-primary px-2 py-2.5 text-[11px] font-semibold text-primary-foreground active:scale-95"
          >
            <Sparkles className="h-4 w-4" /> {tr("IA de sesión", "Session AI")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function Feedback() {
  const tr = useTr();
  const user = useCurrentUser();
  const sendFeedback = useSessionLocal((s) => s.sendFeedback);
  const [rpe, setRpe] = useState(6);
  const [text, setText] = useState("");
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border bg-card p-3">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>{tr("¿Cómo te has sentido?", "How did you feel?")}</span>
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
        placeholder={tr("Sensaciones, molestias, observaciones…", "Sensations, discomfort, observations…")}
        className="w-full resize-none rounded-2xl border border-border bg-card p-3 text-sm outline-none focus:border-primary"
      />
      <button
        onClick={() => {
          sendFeedback({
            sessionId: DEMO_SESSION_ID,
            athleteId: user?.id ?? "u-ath",
            athleteName: user?.name ?? "Atleta",
            rpe,
            text: text.trim() || undefined,
          });
          toast.success(tr("Feedback enviado al entrenador", "Feedback sent to coach"));
        }}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow"
      >
        <Send className="h-4 w-4" /> {tr("Enviar feedback", "Send feedback")}
      </button>
    </div>
  );
}

function Health() {
  const tr = useTr();
  const td = useTd();
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">
          {tr("Estado actual", "Current status")}
        </div>
        <div className="mt-1 text-lg font-bold text-amber-900">{td("Apto")}</div>
        <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
          <span className="rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-800">
            {td("Apto")}
          </span>
          <span className="rounded-full bg-orange-100 px-2 py-0.5 font-semibold text-orange-800">
            {td("En revisión")}
          </span>
          <span className="rounded-full bg-rose-100 px-2 py-0.5 font-semibold text-rose-800">
            {td("No apto")}
          </span>
        </div>
      </div>
      <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-orange-700">
          {tr("Bienestar de hoy", "Today's wellbeing")}
        </div>
        <p className="mt-1 text-sm text-orange-900">
          {tr(
            "Registra tu sueño, fatiga y dolor muscular para ajustar la carga.",
            "Log your sleep, fatigue and muscle soreness to adjust the load.",
          )}
        </p>
        <Link
          to="/mobile/feedback"
          className="mt-3 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-3 py-2 text-xs font-semibold text-white"
        >
          {tr("Registrar bienestar", "Log wellbeing")}
        </Link>
      </div>
    </div>
  );
}

function Treatment() {
  const tr = useTr();
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border bg-card p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">{tr("Sin plan activo", "No active plan")}</span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
            —
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {tr(
            "Aparecerá aquí si el staff médico te asigna un plan.",
            "It will appear here if the medical staff assigns you a plan.",
          )}
        </p>
      </div>
    </div>
  );
}

function Performance() {
  const tr = useTr();
  const td = useTd();
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {tr("Última valoración", "Last assessment")}
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
                {td(s.l)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {tr("Temporada", "Season")}
        </div>
        <div className="mt-2 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{tr("Asistencia", "Attendance")}</span>
            <span className="font-semibold">92%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{tr("RPE medio", "Average RPE")}</span>
            <span className="font-semibold">6.8</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{tr("Mejor marca 800 m", "Best 800 m time")}</span>
            <span className="font-semibold">2:08</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Notifications() {
  const td = useTd();
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
          <div className="text-sm font-semibold text-foreground">{td(n.title)}</div>
          <div className="text-[11px] text-muted-foreground">{td(n.time)}</div>
        </li>
      ))}
    </ul>
  );
}
