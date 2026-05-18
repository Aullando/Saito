import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Home,
  CalendarDays,
  HeartPulse,
  TrendingUp,
  Bell,
  MapPin,
  Clock,
  ChevronRight,
  ChevronLeft,
  Paperclip,
  Send,
  BellOff,
  Info,
  Stethoscope,
  CheckCircle2,
  Activity,
  Megaphone,
  StickyNote,
  LogOut,
} from "lucide-react";

export const Route = createFileRoute("/demo/mobile/athlete")({
  component: AthleteMobileApp,
});

type Screen = "home" | "calendar" | "health" | "performance" | "notifications" | "session";

// ─────────── Datos demo ───────────
const TODAY = {
  title: "Atletismo · Tecnificación Infantil",
  time: "17:30 – 19:00",
  location: "Pista de Atletismo · Sede principal",
  objective: "Velocidad lactácida — series 5×200 m al 90%",
  description:
    "Sesión orientada a mejora de tolerancia al lactato. Series controladas con recuperación amplia. Calienta bien antes de empezar.",
  attachments: ["Plan_velocidad_lactacida.pdf", "Calentamiento_dinamico.png"],
};

const WEEK = [
  { day: "Lun 18", events: [{ t: "17:30", title: "Tecnificación Infantil", type: "training" as const }] },
  { day: "Mar 19", events: [] },
  { day: "Mié 20", events: [{ t: "17:30", title: "Tecnificación Infantil", type: "training" as const }] },
  { day: "Jue 21", events: [{ t: "12:00", title: "Cita fisio · readaptación", type: "medical" as const }] },
  { day: "Vie 22", events: [{ t: "17:30", title: "Tecnificación Infantil", type: "training" as const }] },
  { day: "Sáb 23", events: [{ t: "11:00", title: "Control 200 m", type: "match" as const }] },
  { day: "Dom 24", events: [] },
];

const NOTIFICATIONS = [
  { id: "n1", icon: Megaphone, title: "Nuevo mensaje del entrenador", time: "hace 12 min", tone: "indigo" },
  { id: "n2", icon: TrendingUp, title: "Nueva valoración disponible", time: "hace 2 h", tone: "emerald" },
  { id: "n3", icon: StickyNote, title: "Notas de la sesión del miércoles", time: "ayer", tone: "amber" },
  { id: "n4", icon: CalendarDays, title: "Cambio de horario: viernes 18:00 → 17:30", time: "ayer", tone: "rose" },
] as const;

const RPE_HISTORY = [5, 6, 7, 6, 8, 7, 6, 7, 8, 7, 6, 7, 6, 7, 8, 7, 6, 7, 7, 6, 7, 8, 7, 6, 7, 6, 7, 8, 7, 6];

// ─────────── App ───────────
function AthleteMobileApp() {
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
                SAITO · Atleta
              </div>
              <div className="text-sm font-semibold text-slate-900">Lucía Martín</div>
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
            {screen === "health" && <HealthScreen onBack={() => setScreen("home")} />}
            {screen === "performance" && <PerformanceScreen onBack={() => setScreen("home")} />}
            {screen === "notifications" && <NotificationsScreen onBack={() => setScreen("home")} />}
            {screen === "session" && <SessionScreen onBack={() => setScreen("home")} />}
          </div>

          {/* Bottom tabs */}
          <nav className="absolute bottom-0 left-0 right-0 flex h-20 items-start justify-around border-t border-slate-200 bg-white/95 pb-5 pt-2 backdrop-blur">
            <TabBtn icon={Home} label="Hoy" active={screen === "home"} onClick={() => setScreen("home")} />
            <TabBtn icon={CalendarDays} label="Calendario" active={screen === "calendar"} onClick={() => setScreen("calendar")} />
            <TabBtn icon={HeartPulse} label="Salud" active={screen === "health"} onClick={() => setScreen("health")} />
            <TabBtn icon={TrendingUp} label="Rendimiento" active={screen === "performance"} onClick={() => setScreen("performance")} />
            <TabBtn icon={Bell} label="Avisos" active={screen === "notifications"} onClick={() => setScreen("notifications")} />
          </nav>
        </div>
        <p className="mt-3 text-center text-xs text-slate-500">
          Vista demo · App móvil del atleta (390 px)
        </p>
      </div>
    </div>
  );
}

// ─────────── Screens ───────────
function HomeScreen({ onGo }: { onGo: (s: Screen) => void }) {
  return (
    <div className="space-y-4 pb-4">
      <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-4 text-white shadow-md">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-100">
          Hoy · Entrenamiento
        </div>
        <div className="mt-1 text-lg font-bold leading-tight">{TODAY.title}</div>
        <div className="mt-2 flex items-center gap-1 text-xs text-emerald-100">
          <Clock className="h-3.5 w-3.5" /> {TODAY.time}
        </div>
        <div className="mt-1 flex items-center gap-1 text-xs text-emerald-100">
          <MapPin className="h-3.5 w-3.5" /> {TODAY.location}
        </div>
      </div>

      <div className="grid gap-2">
        <ActionBtn icon={Info} label="Información de la sesión" onClick={() => onGo("session")} primary />
        <ActionBtn
          icon={BellOff}
          label="Notificar ausencia"
          onClick={() => toast.success("Ausencia notificada al entrenador")}
        />
      </div>

      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Accesos rápidos
        </div>
        <div className="grid grid-cols-3 gap-2">
          <QuickTile icon={CalendarDays} label="Calendario" onClick={() => onGo("calendar")} />
          <QuickTile icon={HeartPulse} label="Salud" onClick={() => onGo("health")} />
          <QuickTile icon={TrendingUp} label="Rendimiento" onClick={() => onGo("performance")} />
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800">
          <Bell className="h-3.5 w-3.5" /> 2 notificaciones sin leer
        </div>
        <button
          onClick={() => onGo("notifications")}
          className="mt-1 text-xs font-medium text-amber-900 underline"
        >
          Ver avisos
        </button>
      </div>
    </div>
  );
}

function CalendarScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-3 pb-4">
      <ScreenHeader title="Calendario" onBack={onBack} />
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
                {d.events.map((e, i) => {
                  const cls =
                    e.type === "match"
                      ? "bg-rose-50 text-rose-800"
                      : e.type === "medical"
                        ? "bg-violet-50 text-violet-800"
                        : "bg-emerald-50 text-emerald-800";
                  return (
                    <div key={i} className={`flex items-center justify-between rounded-lg p-2 text-xs ${cls}`}>
                      <span className="font-medium">{e.title}</span>
                      <span>{e.t}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Entreno</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-400" /> Partido</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-violet-400" /> Cita</span>
      </div>
    </div>
  );
}

function HealthScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-3 pb-4">
      <ScreenHeader title="Salud" onBack={onBack} />

      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-700" />
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
              Estado actual
            </div>
            <div className="text-lg font-bold text-emerald-900">Apto</div>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-700">Apto</span>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-700">En revisión</span>
          <span className="rounded-full bg-rose-100 px-2 py-0.5 font-semibold text-rose-700">No apto</span>
        </div>
      </div>

      <Block label="Plan de tratamiento activo">
        <div className="rounded-xl bg-violet-50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-violet-900">Readaptación aductor</span>
            <span className="rounded-full bg-violet-200 px-2 py-0.5 text-[10px] font-bold text-violet-800">
              Fase 2
            </span>
          </div>
          <p className="mt-1 text-xs text-violet-800">
            3 sesiones/semana · responsable: J. Romero (fisio).
          </p>
          <p className="mt-2 text-xs text-violet-700">
            Próxima sesión: <strong>jueves 12:00</strong>
          </p>
        </div>
      </Block>

      <Block label="Citas médicas">
        <button
          onClick={() => toast.success("Solicitud enviada al staff médico")}
          className="flex w-full items-center justify-between rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md"
        >
          <span className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Solicitar cita médica
          </span>
          <ChevronRight className="h-4 w-4 opacity-70" />
        </button>
      </Block>

      <p className="text-[10px] italic text-slate-400">
        Esta vista solo muestra información dirigida a ti. El detalle clínico lo gestiona el staff
        médico.
      </p>
    </div>
  );
}

function PerformanceScreen({ onBack }: { onBack: () => void }) {
  const avg = (RPE_HISTORY.reduce((a, b) => a + b, 0) / RPE_HISTORY.length).toFixed(1);
  const max = Math.max(...RPE_HISTORY);

  return (
    <div className="space-y-3 pb-4">
      <ScreenHeader title="Mi rendimiento" onBack={onBack} />

      <div className="rounded-2xl border border-slate-200 p-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Última valoración del entrenador
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2 text-center">
          <Stat label="Técnica" value="8.2" tone="text-indigo-700" />
          <Stat label="Compromiso" value="9.0" tone="text-emerald-700" />
          <Stat label="Físico" value="7.5" tone="text-amber-700" />
        </div>
        <p className="mt-3 rounded-lg bg-slate-50 p-2 text-xs italic text-slate-600">
          "Buen ritmo en series, mantén la postura en la salida."
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <BigStat label="Esfuerzo percibido" value="7 / 10" tone="bg-indigo-50 text-indigo-700" />
        <BigStat label="Recuperación" value="6 / 10" tone="bg-emerald-50 text-emerald-700" />
      </div>

      <Block label="Evolución últimos 30 días (RPE)">
        <div className="rounded-xl border border-slate-200 p-3">
          <div className="flex h-24 items-end gap-[3px]">
            {RPE_HISTORY.map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-gradient-to-t from-indigo-500 to-violet-500"
                style={{ height: `${(v / 10) * 100}%` }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-slate-500">
            <span>Hace 30 días</span>
            <span>Hoy</span>
          </div>
          <div className="mt-2 flex justify-between text-[11px] font-medium">
            <span className="text-slate-600">Media: <strong>{avg}</strong></span>
            <span className="text-slate-600">Máx: <strong>{max}</strong></span>
          </div>
        </div>
      </Block>
    </div>
  );
}

function NotificationsScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-3 pb-4">
      <ScreenHeader title="Notificaciones" onBack={onBack} />
      <ul className="space-y-2">
        {NOTIFICATIONS.map((n) => {
          const Icon = n.icon;
          const tone =
            n.tone === "indigo"
              ? "bg-indigo-100 text-indigo-700"
              : n.tone === "emerald"
                ? "bg-emerald-100 text-emerald-700"
                : n.tone === "amber"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-rose-100 text-rose-700";
          return (
            <li
              key={n.id}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3"
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${tone}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-slate-900">{n.title}</div>
                <div className="text-[11px] text-slate-500">{n.time}</div>
              </div>
              <ChevronRight className="mt-2 h-4 w-4 text-slate-300" />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SessionScreen({ onBack }: { onBack: () => void }) {
  const [rpe, setRpe] = useState(6);
  const [feedback, setFeedback] = useState("");

  return (
    <div className="space-y-3 pb-4">
      <ScreenHeader title="Detalle de sesión" onBack={onBack} />

      <div className="rounded-2xl border border-slate-200 p-4">
        <div className="text-sm font-bold text-slate-900">{TODAY.title}</div>
        <div className="mt-1 text-xs text-slate-500">{TODAY.time}</div>
        <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5" /> {TODAY.location}
        </div>
      </div>

      <Block label="Descripción">
        <p className="text-sm leading-relaxed text-slate-700">{TODAY.description}</p>
        <p className="mt-2 text-xs italic text-slate-500">Objetivo: {TODAY.objective}</p>
      </Block>

      <Block label="Adjuntos">
        <ul className="space-y-1.5">
          {TODAY.attachments.map((f) => (
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

      <Block label="Feedback post-entreno">
        <div className="rounded-xl border border-slate-200 p-3">
          <div className="text-xs font-medium text-slate-600">¿Cómo te has sentido? · {rpe}/10</div>
          <input
            type="range"
            min={1}
            max={10}
            value={rpe}
            onChange={(e) => setRpe(+e.target.value)}
            className="mt-2 w-full accent-emerald-600"
          />
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
            placeholder="Comenta cómo te has sentido, molestias, sensaciones…"
            className="mt-3 w-full resize-none rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => toast.success("Feedback enviado al entrenador")}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md"
          >
            <Send className="h-4 w-4" />
            Enviar feedback
          </button>
        </div>
      </Block>
    </div>
  );
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
      className={`flex flex-col items-center gap-0.5 px-1 ${active ? "text-emerald-600" : "text-slate-400"}`}
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
          ? "bg-emerald-600 text-white"
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
      <Icon className="h-5 w-5 text-emerald-600" />
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

function Stat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-2 py-2">
      <div className={`text-lg font-bold leading-none ${tone}`}>{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
    </div>
  );
}

function BigStat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className={`rounded-xl p-3 ${tone}`}>
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider opacity-80">
        <Activity className="h-3 w-3" />
        {label}
      </div>
      <div className="mt-1 text-lg font-bold">{value}</div>
    </div>
  );
}
