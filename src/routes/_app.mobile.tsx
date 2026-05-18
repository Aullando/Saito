import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import {
  Home,
  CalendarDays,
  MessageSquare,
  Dumbbell,
  Users,
  HeartPulse,
  Bell,
  User as UserIcon,
} from "lucide-react";
import { MobileShell, type MobileTab } from "@/components/MobileShell";
import { useCurrentUser } from "@/lib/store";

export const Route = createFileRoute("/_app/mobile")({
  component: MobileLayout,
});

function MobileLayout() {
  const user = useCurrentUser();
  if (!user) return <Navigate to="/login" />;

  const isCoach = user.role === "technical";
  const tabs: MobileTab[] = isCoach
    ? [
        { id: "home", label: "Hoy", icon: Home, to: "/mobile" },
        { id: "cal", label: "Calendario", icon: CalendarDays, to: "/mobile/calendar" },
        { id: "ses", label: "Sesión", icon: Dumbbell, to: "/mobile/session" },
        { id: "team", label: "Equipo", icon: Users, to: "/mobile/team" },
        { id: "msg", label: "Mensajes", icon: MessageSquare, to: "/mobile/messages" },
      ]
    : [
        { id: "home", label: "Hoy", icon: Home, to: "/mobile" },
        { id: "cal", label: "Calendario", icon: CalendarDays, to: "/mobile/calendar" },
        { id: "hea", label: "Salud", icon: HeartPulse, to: "/mobile/health" },
        { id: "per", label: "Rendimiento", icon: TrendingUp, to: "/mobile/performance" },
        { id: "msg", label: "Mensajes", icon: MessageSquare, to: "/mobile/messages" },
      ];

  return (
    <MobileShell
      tabs={tabs}
      title={isCoach ? "Entrenador" : "Atleta"}
      role={isCoach ? "coach" : "athlete"}
    >
      <Outlet />
    </MobileShell>
  );
}

