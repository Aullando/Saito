import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import {
  Home,
  CalendarDays,
  MessageSquare,
  Dumbbell,
  Users,
  HeartPulse,
  TrendingUp,
} from "lucide-react";
import { MobileShell, type MobileTab } from "@/components/MobileShell";
import { useCurrentUser } from "@/lib/store";
import { useClub } from "@/clubs/ClubProvider";

export const Route = createFileRoute("/_app/mobile")({
  component: MobileLayout,
});

function MobileLayout() {
  const user = useCurrentUser();
  const { club } = useClub();
  if (!user) return <Navigate to="/login" />;

  const isCoach = user.role === "technical";
  const isGff = club.id === "gff-demo";

  // Tab labels — Arabic for GFF, Spanish otherwise. Tab routes stay the same.
  const L = isGff
    ? {
        home: "اليوم",
        cal: "التقويم",
        ses: "الحصة",
        team: "الفريق",
        msg: "الرسائل",
        hea: "الصحة",
        per: "الأداء",
      }
    : {
        home: "Hoy",
        cal: "Calendario",
        ses: "Sesión",
        team: "Equipo",
        msg: "Mensajes",
        hea: "Salud",
        per: "Rendimiento",
      };

  const tabs: MobileTab[] = isCoach
    ? [
        { id: "home", label: L.home, icon: Home, to: "/mobile" },
        { id: "cal", label: L.cal, icon: CalendarDays, to: "/mobile/calendar" },
        { id: "ses", label: L.ses, icon: Dumbbell, to: "/mobile/session" },
        { id: "team", label: L.team, icon: Users, to: "/mobile/team" },
        { id: "msg", label: L.msg, icon: MessageSquare, to: "/mobile/messages" },
      ]
    : [
        { id: "home", label: L.home, icon: Home, to: "/mobile" },
        { id: "cal", label: L.cal, icon: CalendarDays, to: "/mobile/calendar" },
        { id: "hea", label: L.hea, icon: HeartPulse, to: "/mobile/health" },
        { id: "per", label: L.per, icon: TrendingUp, to: "/mobile/performance" },
        { id: "msg", label: L.msg, icon: MessageSquare, to: "/mobile/messages" },
      ];

  const title = isGff
    ? isCoach
      ? "مدرب المنتخب"
      : "لاعب المنتخب"
    : isCoach
      ? "Entrenador"
      : "Atleta";

  return (
    <MobileShell
      tabs={tabs}
      title={title}
      role={isCoach ? "coach" : "athlete"}
    >
      <Outlet />
    </MobileShell>
  );
}
