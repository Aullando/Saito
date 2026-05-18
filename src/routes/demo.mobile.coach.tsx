import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Home,
  CalendarDays,
  ClipboardList,
  Users,
  StickyNote,
  Sparkles,
  MapPin,
  Clock,
  ChevronRight,
  ChevronLeft,
  Paperclip,
  Megaphone,
  Send,
  LogOut,
} from "lucide-react";

export const Route = createFileRoute("/demo/mobile/coach")({
  component: CoachMobileApp,
});

type Screen = "home" | "calendar" | "session" | "attendance" | "notes" | "ai";

// ─────────── Datos demo (sin gestión económica/club) ───────────
const TODAY_SESSION = {
  title: "Atletismo · Tecnificación Infantil",
  time: "17:30 – 19:00",
  location: "Pista de Atletismo · Sede principal",
  group: "Tecnificación Infantil",
  objective: "Velocidad lactácida — series 5×200 m al 90%",
  attachments: ["Plan_velocidad_lactacida.pdf", "Calentamiento_dinamico.png"],
};

const ROSTER = [
  "Lucía Martín García",
  "Mateo Álvarez Soler",
  "Emma Domínguez Crespo",
  "Daniela Ferrer Bosch",
  "Julia Pastor León",
  "Hugo Sánchez Ortega",
  "Adrián Reyes Núñez",
  "Carla Vidal Lago",
  "Pablo Iglesias Mora",
  "Noa Castaño Vives",
];

const WEEK = [
  { day: "Lun 18", events: [{ t: "17:30", title: "Tecnificación Infantil", type: "training" as const }] },
  { day: "Mar 19", events: [{ t: "18:00", title: "Velocidad Cadete", type: "training" as const }] },
  { day: "Mié 20", events: [{ t: "17:30", title: "Tecnificación Infantil", type: "training" as const }] },
  { day: "Jue 21", events: [{ t: "18:00", title: "Resistencia Juvenil", type: "training" as const }] },
  { day: "Vie 22", events: [{ t: "17:30", title: "Tecnificación Infantil", type: "training" as const }] },
  { day: "Sáb 23", events: [{ t: "11:00", title: "Control 200 m", type: "match" as const }] },
  { day: "Dom 24", events: [] },
];

// ─────────── App ───────────
function CoachMobileApp() {
  const [screen, setScreen] = useState<Screen>("home");

  return (
    <div className="min-h-screen w-full bg-slate-100 px-2 py-4 sm:py-8">
      <div className="mx-auto" style={{ width: "min(100%, 390px)" }}>
        <div
          className="relative overflow-hidden rounded-[36px] border border-slate-300 bg-white shadow-2xl"
          style={{ height: "min(calc(100vh - 64px), 780px)" }}
        >
          {/* Status bar */}
          <div className="flex h-11 items-center justify-between bg-white px-5 text-[11px] font-semibold text-slate-500">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <span>•••</span>
              <span>100%</span>
            </div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-4 pb-3 pt-1">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                SAITO · Entrenador
              </div>
              <div className="text-sm font-semibold text-slate-900">Carlos Romero</div>
            </div>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
              aria-label="Salir"
              onClick={() => toast.info("Demo: sesión cerrada")}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto px-4 py-4" style={{ height: "calc(100% - 11rem)" }}>
            {screen === "home" && <HomeScreen onGo={setScreen} />}
            {screen === "calendar" && <CalendarScreen onBack={() => setScreen("home")} />}
            {screen === "session" && <SessionScreen onBack={() => setScreen("home")} onGo={setScreen} />}
            {screen === "attendance" && <AttendanceScreen onBack={() => setScreen("home")} />}
            {screen === "notes" && <NotesScreen onBack={() => setScreen("home")} />}
            {screen === "ai" && <AiScreen onBack={() => setScreen("home")} />}
          </div>

          {/* Bottom tabs */}
          <nav className="absolute bottom-0 left-0 right-0 flex h-20 items-start justify-around border-t border-slate-200 bg-white/95 pb-5 pt-2 backdrop-blur">
            <TabBtn icon={Home} label="Hoy" active={screen === "home"} onClick={() => setScreen("home")} />
            <TabBtn icon={CalendarDays} label="Calendario" active={screen === "calendar"} onClick={() => setScreen("calendar")} />
            <TabBtn icon={ClipboardList} label="Sesión" active={screen === "session"} onClick={() => setScreen("session")} />
            <TabBtn icon={StickyNote} label="Notas" active={screen === "notes"} onClick={() => setScreen("notes")} />
            <TabBtn icon={Sparkles} label="IA" active={screen === "ai"} onClick={() => setScreen("ai")} />
          </nav>
        </div>
        <p className="mt-3 text-center text-xs text-slate-500">
          Vista demo · App móvil del entrenador (390 px)
        </p>
      </div>
    </div>
  );
}

// ─────────── Screens ───────────
function HomeScreen({ onGo }: { onGo: (s: Screen) => void }) {
  return (
    <div className="space-y-4 pb-4">
      <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 p-4 text-white shadow-md">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-100">
          Hoy · Entrenamiento
        </div>
        <div className="mt-1 text-lg font-bold leading-tight">{TODAY_SESSION.title}</div>
        <div className="mt-2 flex items-center gap-1 text-xs text-indigo-100">
          <Clock className="h-3.5 w-3.5" /> {TODAY_SESSION.time}
        </div>
        <div className="mt-1 flex items-center gap-1 text-xs text-indigo-100">
          <MapPin className="h-3.5 w-3.5" /> {TODAY_SESSION.location}
        </div>
        <div className="mt-1 flex items-center gap-1 text-xs text-indigo-100">
          <Users className="h-3.5 w-3.5" /> {TODAY_SESSION.group}
        </div>
      </div>

      <div className="grid gap-2">
        <ActionBtn icon={ClipboardList} label="Ver sesión" onClick={() => onGo("session")} primary />
        <ActionBtn icon={Users} label="Registrar asistencia" onClick={() => onGo("attendance")} />
        <ActionBtn
          icon={Megaphone}
          label="Generar convocatoria"
          onClick={() => toast.success("Convocatoria enviada a 10 atletas")}
        />
      </div>

      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Accesos rápidos
        </div>
        <div className="grid grid-cols-3 gap-2">
          <QuickTile icon={CalendarDays} label="Calendario" onClick={() => onGo("calendar")} />
          <QuickTile icon={StickyNote} label="Notas" onClick={() => onGo("notes")} />
          <QuickTile icon={Sparkles} label="IA sesión" onClick={() => onGo("ai")} />
        </div>
      </div>
    </div>
  );
}

function CalendarScreen({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState<"week" | "month">("week");
  return (
    <div className="space-y-3 pb-4">
      <ScreenHeader title="Calendario" onBack={onBack} />
      <div className="inline-flex rounded-full bg-slate-100 p-0.5 text-xs">
        <button
          onClick={() => setView("week")}
          className={`rounded-full px-3 py-1.5 font-medium ${view === "week" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
        >
          Semana
        </button>
        <button
          onClick={() => setView("month")}
          className={`rounded-full px-3 py-1.5 font-medium ${view === "month" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
        >
          Mes
        </button>
      </div>

      {view === "week" ? (
        <ul className="space-y-2">
          {WEEK.map((d) => (
            <li key={d.day} className="rounded-xl border border-slate-200 p-3">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">{d.day}</span>
                <span className="text-[11px] text-slate-400">
                  {d.events.length} {d.events.length === 1 ? "evento" : "eventos"}
                </span>
              </div>
              {d.events.length === 0 ? (
                <div className="text-xs text-slate-400">Descanso</div>
              ) : (
                <div className="space-y-1.5">
                  {d.events.map((e, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between rounded-lg p-2 text-xs ${
                        e.type === "match" ? "bg-rose-50 text-rose-800" : "bg-indigo-50 text-indigo-800"
                      }`}
                    >
                      <span className="font-medium">{e.title}</span>
                      <span>{e.t}</span>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <MonthGrid />
      )}
    </div>
  );
}

function MonthGrid() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const trainings = new Set([2, 4, 6, 9, 11, 13, 16, 18, 20, 23, 25, 27, 30]);
  const matches = new Set([7, 14, 21, 28]);
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase text-slate-400">
        {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => {
          const isM = matches.has(d);
          const isT = trainings.has(d);
          return (
            <div
              key={d}
              className={`aspect-square rounded-lg text-[11px] font-medium flex flex-col items-center justify-center ${
                isM ? "bg-rose-100 text-rose-800" : isT ? "bg-indigo-100 text-indigo-800" : "bg-slate-50 text-slate-600"
              }`}
            >
              <span>{d}</span>
              {(isM || isT) && <span className="mt-0.5 h-1 w-1 rounded-full bg-current" />}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-indigo-400" /> Entreno</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-400" /> Partido</span>
      </div>
    </div>
  );
}

function SessionScreen({ onBack, onGo }: { onBack: () => void; onGo: (s: Screen) => void }) {
  return (
    <div className="space-y-3 pb-4">
      <ScreenHeader title="Detalle de sesión" onBack={onBack} />
      <div className="rounded-2xl border border-slate-200 p-4">
        <div className="text-sm font-bold text-slate-900">{TODAY_SESSION.title}</div>
        <div className="mt-1 text-xs text-slate-500">{TODAY_SESSION.time}</div>
      </div>

      <Block label="Objetivo">
        <p className="text-sm text-slate-700">{TODAY_SESSION.objective}</p>
      </Block>

      <Block label="Lugar">
        <div className="flex items-center gap-1.5 text-sm text-slate-700">
          <MapPin className="h-4 w-4 text-slate-400" /> {TODAY_SESSION.location}
        </div>
      </Block>

      <Block label={`Atletas convocados (${ROSTER.length})`}>
        <div className="flex flex-wrap gap-1.5">
          {ROSTER.map((n) => (
            <span key={n} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
              {n.split(" ")[0]}
            </span>
          ))}
        </div>
      </Block>

      <Block label="Asistencia">
        <button
          onClick={() => onGo("attendance")}
          className="flex w-full items-center justify-between rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700"
        >
          Pasar lista
          <ChevronRight className="h-4 w-4" />
        </button>
      </Block>

      <Block label="Notas">
        <button
          onClick={() => onGo("notes")}
          className="flex w-full items-center justify-between rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700"
        >
          Añadir nota y valoración
          <ChevronRight className="h-4 w-4" />
        </button>
      </Block>

      <Block label="Adjuntos">
        <ul className="space-y-1.5">
          {TODAY_SESSION.attachments.map((f) => (
            <li
              key={f}
              className="flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-1.5 text-xs text-slate-700"
            >
              <Paperclip className="h-3.5 w-3.5 text-slate-400" />
              {f}
            </li>
          ))}
        </ul>
      </Block>
    </div>
  );
}

type AttStatus = "present" | "absent" | "justified" | "injured";
const STATUS_META: Record<AttStatus, { label: string; cls: string }> = {
  present: { label: "Presente", cls: "bg-emerald-100 text-emerald-700" },
  absent: { label: "Ausente", cls: "bg-rose-100 text-rose-700" },
  justified: { label: "Justificado", cls: "bg-amber-100 text-amber-700" },
  injured: { label: "Lesionado", cls: "bg-violet-100 text-violet-700" },
};

function AttendanceScreen({ onBack }: { onBack: () => void }) {
  const [att, setAtt] = useState<Record<string, AttStatus>>(
    Object.fromEntries(ROSTER.map((n) => [n, "present" as AttStatus])),
  );

  const counts = (Object.keys(STATUS_META) as AttStatus[]).reduce(
    (acc, k) => {
      acc[k] = Object.values(att).filter((v) => v === k).length;
      return acc;
    },
    {} as Record<AttStatus, number>,
  );

  return (
    <div className="space-y-3 pb-4">
      <ScreenHeader title="Asistencia" onBack={onBack} />

      <div className="grid grid-cols-4 gap-1.5">
        {(Object.keys(STATUS_META) as AttStatus[]).map((k) => (
          <div key={k} className={`rounded-lg p-2 text-center ${STATUS_META[k].cls}`}>
            <div className="text-lg font-bold leading-none">{counts[k]}</div>
            <div className="mt-0.5 text-[10px] font-medium">{STATUS_META[k].label}</div>
          </div>
        ))}
      </div>

      <ul className="space-y-2">
        {ROSTER.map((name) => (
          <li key={name} className="rounded-xl border border-slate-200 p-2.5">
            <div className="mb-2 text-sm font-medium text-slate-900">{name}</div>
            <div className="grid grid-cols-4 gap-1">
              {(Object.keys(STATUS_META) as AttStatus[]).map((k) => {
                const active = att[name] === k;
                return (
                  <button
                    key={k}
                    onClick={() => setAtt({ ...att, [name]: k })}
                    className={`rounded-md px-1 py-1.5 text-[10px] font-semibold ${
                      active ? STATUS_META[k].cls : "bg-slate-50 text-slate-500"
                    }`}
                  >
                    {STATUS_META[k].label}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ul>

      <button
        onClick={() => toast.success("Asistencia guardada")}
        className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md"
      >
        Guardar asistencia
      </button>
    </div>
  );
}

function NotesScreen({ onBack }: { onBack: () => void }) {
  const [rpe, setRpe] = useState(6);
  const [recovery, setRecovery] = useState(7);
  const [privateNote, setPrivateNote] = useState("");
  const [publicNote, setPublicNote] = useState("");

  return (
    <div className="space-y-3 pb-4">
      <ScreenHeader title="Notas y valoración" onBack={onBack} />

      <Block label={`Esfuerzo percibido (RPE) · ${rpe}/10`}>
        <input
          type="range"
          min={1}
          max={10}
          value={rpe}
          onChange={(e) => setRpe(+e.target.value)}
          className="w-full accent-indigo-600"
        />
      </Block>

      <Block label={`Recuperación · ${recovery}/10`}>
        <input
          type="range"
          min={1}
          max={10}
          value={recovery}
          onChange={(e) => setRecovery(+e.target.value)}
          className="w-full accent-emerald-600"
        />
      </Block>

      <Block label="Nota privada (solo entrenador)">
        <textarea
          value={privateNote}
          onChange={(e) => setPrivateNote(e.target.value)}
          rows={3}
          placeholder="Observaciones tácticas, individuales, recordatorios…"
          className="w-full resize-none rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-indigo-500"
        />
      </Block>

      <Block label="Nota visible para el atleta">
        <textarea
          value={publicNote}
          onChange={(e) => setPublicNote(e.target.value)}
          rows={3}
          placeholder="Buen ritmo en series, mantener la postura en la salida…"
          className="w-full resize-none rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-indigo-500"
        />
      </Block>

      <button
        onClick={() => toast.success("Valoración guardada")}
        className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md"
      >
        Guardar valoración
      </button>
    </div>
  );
}

function AiScreen({ onBack }: { onBack: () => void }) {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setReply(null);
    setTimeout(() => {
      setReply(buildDemoReply(prompt));
      setLoading(false);
    }, 700);
  };

  return (
    <div className="space-y-3 pb-4">
      <ScreenHeader title="IA de sesión" onBack={onBack} />

      <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 p-4 text-white shadow-md">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-100">
            Asistente de planificación
          </span>
        </div>
        <p className="mt-2 text-sm leading-snug text-violet-50">
          Describe qué sesión quieres preparar y te propongo una estructura deportiva.
          No incluye recomendaciones clínicas.
        </p>
      </div>

      <Block label="¿Qué sesión quieres preparar?">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          placeholder="Ej: sesión de velocidad para grupo infantil, 75 min, pista exterior"
          className="w-full resize-none rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-indigo-500"
        />
        <button
          onClick={submit}
          disabled={loading || !prompt.trim()}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {loading ? "Generando…" : "Generar propuesta"}
        </button>
      </Block>

      {reply && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Propuesta
          </div>
          <pre className="whitespace-pre-wrap text-xs leading-relaxed text-slate-700 font-sans">
            {reply}
          </pre>
          <div className="mt-2 text-[10px] italic text-slate-400">
            Información deportiva no clínica. Ante molestias, deriva al staff médico.
          </div>
        </div>
      )}
    </div>
  );
}

function buildDemoReply(prompt: string) {
  return `Propuesta basada en: "${prompt.trim()}"

1. Calentamiento (15')
   · Movilidad articular dinámica
   · 2×80 m progresivos + técnica de carrera

2. Parte principal (40')
   · 5×200 m al 90% recuperación 3'
   · Foco: postura erguida, frecuencia de zancada

3. Vuelta a la calma (15')
   · 10' carrera continua suave
   · Estiramientos generales

Material: conos, cronómetro.
Carga prevista: alta. Ajusta volumen si el grupo viene fatigado.`;
}

// ─────────── Helpers UI ───────────
function TabBtn({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof Home;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-1 ${active ? "text-indigo-600" : "text-slate-400"}`}
    >
      <Icon className="h-5 w-5" />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

function ActionBtn({
  icon: Icon,
  label,
  onClick,
  primary,
}: {
  icon: typeof Home;
  label: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold shadow-sm ${
        primary
          ? "bg-indigo-600 text-white"
          : "bg-white text-slate-800 border border-slate-200"
      }`}
    >
      <span className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      <ChevronRight className="h-4 w-4 opacity-60" />
    </button>
  );
}

function QuickTile({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Home;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-3 text-slate-700 hover:bg-slate-50"
    >
      <Icon className="h-5 w-5 text-indigo-600" />
      <span className="text-[11px] font-medium">{label}</span>
    </button>
  );
}

function ScreenHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onBack}
        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
        aria-label="Volver"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <h2 className="text-base font-bold text-slate-900">{title}</h2>
    </div>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </div>
      {children}
    </div>
  );
}
