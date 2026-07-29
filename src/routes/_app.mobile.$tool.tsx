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
import { useClub } from "@/clubs/ClubProvider";
import {
  GffMobileSession,
  GffMobileHealth,
  GffMobilePerformance,
} from "@/clubs/gff/GffMobileWorkspace";
import {
  CnsoMobileSession,
  CnsoMobileHealth,
  CnsoMobilePerformance,
} from "@/clubs/cnso/CnsoMobileWorkspace";
import { useTr } from "@/lib/i18n";
import {
  Attendance,
  CallUp,
  Notes,
  Ratings,
  AISession,
  Absence,
  RequestAppointment,
  SessionInfo,
  Feedback,
  Health,
  Treatment,
  Performance,
  Notifications,
} from "@/features/mobile/tools";

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
  }
  if (club.id === "cnso") {
    if (tool === "session") return <CnsoMobileSession />;
    if (tool === "health") return <CnsoMobileHealth />;
    if (tool === "performance") return <CnsoMobilePerformance />;
  }
  return <MobileTool />;
}

type Meta = { title: string; desc: string; icon: LucideIcon };

function useMeta(): Record<string, Meta> {
  const tr = useTr();
  return {
    session: { title: tr("Sesión de hoy", "Today's Session", "Današnja sesija"), desc: tr("Estructura del entrenamiento", "Training structure", "Struktura treninga"), icon: Dumbbell },
    attendance: { title: tr("Asistencia", "Attendance", "Prisustvo"), desc: tr("Pasa lista en un toque", "Take roll in one tap", "Prozivka jednim dodirom"), icon: ClipboardCheck },
    callup: { title: tr("Convocatoria", "Call-up", "Poziv"), desc: tr("Selecciona y envía", "Select and send", "Izaberi i pošalji"), icon: Users },
    notes: { title: tr("Notas", "Notes", "Beleške"), desc: tr("Apuntes de la sesión", "Session notes", "Beleške sesije"), icon: StickyNote },
    ratings: { title: tr("Valoraciones", "Ratings", "Ocene"), desc: tr("Tras la sesión", "Post-session", "Nakon sesije"), icon: Star },
    ai: { title: tr("IA de sesión", "Session AI", "AI sesije"), desc: "Create with SAITO", icon: Sparkles },
    absence: { title: tr("Notificar ausencia", "Report Absence", "Prijavi odsustvo"), desc: tr("Avisa a tu entrenador", "Notify your coach", "Obavesti svog trenera"), icon: CalendarX },
    "session-info": { title: tr("Información de la sesión", "Session Information", "Informacije o sesiji"), desc: tr("Qué haremos hoy", "What we'll do today", "Šta radimo danas"), icon: Info },
    feedback: { title: tr("Feedback post-entreno", "Post-training Feedback", "Povratne informacije nakon treninga"), desc: tr("Cuéntanos cómo te fue", "Tell us how it went", "Reci nam kako je prošlo"), icon: MessageSquareHeart },
    health: { title: tr("Salud", "Health", "Zdravlje"), desc: tr("Tu estado y restricciones", "Your status and restrictions", "Tvoj status i ograničenja"), icon: HeartPulse },
    treatment: { title: tr("Plan de tratamiento", "Treatment Plan", "Plan lečenja"), desc: tr("Indicaciones del staff médico", "Medical staff instructions", "Uputstva medicinskog osoblja"), icon: Stethoscope },
    "request-appointment": { title: tr("Solicitar cita médica", "Request Appointment", "Zatraži medicinski termin"), desc: tr("Reserva con el staff médico", "Book with medical staff", "Zakaži termin sa medicinskim osobljem"), icon: CalendarPlus },
    performance: { title: tr("Mi rendimiento", "My Performance", "Moj učinak"), desc: tr("Métricas de la temporada", "Season metrics", "Metrika sezone"), icon: LineChart },
    notifications: { title: tr("Notificaciones", "Notifications", "Obaveštenja"), desc: tr("Avisos y novedades", "Alerts and updates", "Obaveštenja i novosti"), icon: Bell },
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
          {tr("Sección no encontrada.", "Section not found.", "Sekcija nije pronađena.")}
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
      <ArrowLeft className="h-3 w-3" /> {tr("Volver", "Back", "Nazad")}
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
