import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import {
  Home,
  CalendarDays,
  MessageSquare,
  User as UserIcon,
  ClipboardCheck,
  HeartPulse,
  Bell,
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
        { id: "att", label: "Asistencia", icon: ClipboardCheck, to: "/mobile/attendance" },
        { id: "msg", label: "Comunicación", icon: MessageSquare, to: "/mobile/messages" },
        { id: "me", label: "Perfil", icon: UserIcon, to: "/mobile/profile" },
      ]
    : [
        { id: "home", label: "Hoy", icon: Home, to: "/mobile" },
        { id: "cal", label: "Calendario", icon: CalendarDays, to: "/mobile/calendar" },
        { id: "hea", label: "Salud", icon: HeartPulse, to: "/mobile/health" },
        { id: "not", label: "Avisos", icon: Bell, to: "/mobile/notifications" },
        { id: "me", label: "Perfil", icon: UserIcon, to: "/mobile/profile" },
      ];

  return (
    <MobileShell tabs={tabs} title={isCoach ? "Entrenador" : "Atleta"}>
      <Outlet />
    </MobileShell>
  );
}
