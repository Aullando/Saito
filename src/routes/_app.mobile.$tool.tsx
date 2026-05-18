import { createFileRoute, Link } from "@tanstack/react-router";
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
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/_app/mobile/$tool")({
  component: MobileTool,
});

type ToolInfo = {
  title: string;
  desc: string;
  icon: LucideIcon;
  body: string[];
};

const TOOLS: Record<string, ToolInfo> = {
  session: {
    title: "Sesión de hoy",
    desc: "Estructura del entrenamiento",
    icon: Dumbbell,
    body: [
      "Calentamiento — 15 min",
      "Bloque técnico — 25 min",
      "Series 6×400 m R:90s",
      "Vuelta a la calma + estiramientos",
    ],
  },
  attendance: {
    title: "Asistencia",
    desc: "Pasa lista en un toque",
    icon: ClipboardCheck,
    body: ["12 confirmados · 2 ausentes · 1 pendiente", "Marca presencia al inicio de la sesión."],
  },
  callup: {
    title: "Convocatoria",
    desc: "Crea la convocatoria del próximo evento",
    icon: Users,
    body: [
      "Sábado 18:00 · Estadio Vallehermoso",
      "Selecciona deportistas y envía notificación push.",
    ],
  },
  notes: {
    title: "Notas",
    desc: "Apuntes de sesión y observaciones",
    icon: StickyNote,
    body: ["Sin notas hoy. Pulsa + para añadir una."],
  },
  ratings: {
    title: "Valoraciones",
    desc: "Evalúa técnica, esfuerzo y actitud",
    icon: Star,
    body: ["Valora a tus deportistas tras la sesión.", "Las valoraciones se comparten con el club."],
  },
  ai: {
    title: "IA de sesión",
    desc: "Asistente para diseñar entrenamientos",
    icon: Sparkles,
    body: [
      "Pídeme un microciclo para tu grupo.",
      "Ejemplo: ‘sesión de fuerza 60 min para juveniles’.",
    ],
  },
  absence: {
    title: "Notificar ausencia",
    desc: "Avisa a tu entrenador",
    icon: CalendarX,
    body: ["Elige el día y el motivo.", "Tu entrenador recibirá una notificación inmediata."],
  },
  "session-info": {
    title: "Información de sesión",
    desc: "Qué haremos hoy",
    icon: Info,
    body: ["Pista cubierta · 18:00", "Calentamiento, técnica de carrera y series."],
  },
  feedback: {
    title: "Feedback post-entreno",
    desc: "Cuéntanos cómo te fue",
    icon: MessageSquareHeart,
    body: ["RPE de 1 a 10 · Sensaciones · Molestias.", "Tu feedback ayuda al staff a ajustar cargas."],
  },
  health: {
    title: "Salud",
    desc: "Tu estado y restricciones",
    icon: HeartPulse,
    body: ["Estado actual: Apto", "Sin restricciones activas."],
  },
  treatment: {
    title: "Plan de tratamiento",
    desc: "Indicaciones del staff médico",
    icon: Stethoscope,
    body: ["No tienes plan activo.", "Aparecerá aquí si el médico te asigna uno."],
  },
  "request-appointment": {
    title: "Solicitar cita médica",
    desc: "Reserva con el staff médico",
    icon: CalendarPlus,
    body: ["Elige día, franja y motivo.", "Recibirás confirmación en cuanto se valide."],
  },
  performance: {
    title: "Rendimiento",
    desc: "Tus métricas de la temporada",
    icon: LineChart,
    body: ["Asistencia: 92%", "Mejor marca personal: 2:08 (800 m)"],
  },
  notifications: {
    title: "Notificaciones",
    desc: "Avisos y novedades",
    icon: Bell,
    body: ["Sin notificaciones nuevas."],
  },
};

function MobileTool() {
  const { tool } = Route.useParams();
  const info = TOOLS[tool];
  if (!info) {
    return (
      <div className="space-y-3">
        <Link to="/mobile" className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <ArrowLeft className="h-3 w-3" /> Volver
        </Link>
        <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Sección no encontrada.
        </div>
      </div>
    );
  }
  const Icon = info.icon;
  return (
    <div className="space-y-4">
      <Link to="/mobile" className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <ArrowLeft className="h-3 w-3" /> Volver
      </Link>
      <header className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">{info.title}</h1>
          <p className="text-xs text-muted-foreground">{info.desc}</p>
        </div>
      </header>
      <ul className="space-y-2">
        {info.body.map((line, i) => (
          <li
            key={i}
            className="rounded-2xl border border-border bg-card p-3 text-sm text-foreground"
          >
            {line}
          </li>
        ))}
      </ul>
      <div className="rounded-2xl border border-dashed border-border p-4 text-center text-[11px] text-muted-foreground">
        Demo — vista funcional próximamente.
      </div>
    </div>
  );
}
