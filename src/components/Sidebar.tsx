import { Link, useRouterState } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import {
  Building2,
  CalendarDays,
  Users,
  Wallet,
  Receipt,
  MessageSquare,
  Settings,
  LayoutGrid,
  Stethoscope,
  ChevronLeft,
  LogOut,
  X,
  ShieldCheck,
  Activity,
  BarChart3,
  UserPlus,
  Layers,
  Megaphone,
  CalendarClock,
  AlertTriangle,
  ClipboardList,
  CalendarPlus,
} from "lucide-react";

import { useCurrentUser, useAuth } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { useTd } from "@/lib/demoI18n";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useClub } from "@/clubs/ClubProvider";
import type { ClubModuleId, ClubNavItem } from "@/clubs/types";

type Item = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  indent?: boolean;
  module?: ClubModuleId;
  params?: Record<string, string>;
};

function buildItems(role: Role, tr: (k: keyof typeof import("@/lib/i18n").STR) => string): Item[] {
  switch (role) {
    case "sysadmin":
      return [{ to: "/organizations", label: tr("organizations"), icon: Building2 }];

    // Gestor / Dirección
    case "manager":
      return [
        { to: "/dashboard", label: tr("dashboard_nav"), icon: LayoutGrid },
        { to: "/club", label: tr("club_org"), icon: Building2 },
        { to: "/settings/team", label: tr("users_perms"), icon: Users },
        { to: "/calendar", label: tr("calendar"), icon: CalendarDays },
        { to: "/athletes", label: tr("athletes_nav"), icon: Users },
        { to: "/economic/fees", label: tr("payments_fees"), icon: Wallet },
        { to: "/communication", label: tr("communication"), icon: MessageSquare },
        { to: "/reports", label: tr("reports"), icon: BarChart3 },
        { to: "/profile", label: tr("notifications"), icon: Megaphone },
        { to: "/settings/privacy", label: tr("privacy_security"), icon: ShieldCheck },
      ];

    // Administración
    case "admin":
      return [
        { to: "/club", label: tr("organization"), icon: Building2 },
        { to: "/settings/team", label: tr("users"), icon: UserPlus },
        { to: "/tutela/formacion", label: "Tutela · Formación", icon: ShieldCheck, indent: true },
        { to: "/club", label: tr("sections_nav"), icon: Layers, indent: true },
        { to: "/club", label: tr("categories_nav"), icon: Layers, indent: true },
        { to: "/club", label: tr("groups_nav"), icon: Users, indent: true },
        { to: "/calendar", label: tr("schedules"), icon: CalendarClock, indent: true },
        { to: "/settings/team", label: tr("tutors"), icon: Users, indent: true },
        { to: "/economic/demo", label: tr("fees_and_rates"), icon: Receipt },
        { to: "/economic/demo", label: tr("apply_fee"), icon: Wallet, indent: true },
        { to: "/economic/payments", label: tr("payment_status_nav"), icon: Wallet },
        { to: "/calendar/demo", label: tr("club_calendar"), icon: CalendarDays },
        { to: "/communication/demo", label: tr("circulars"), icon: Megaphone },
      ];



    // Staff médico
    case "medical":
      return [
        { to: "/medical/panel", label: "Panel médico", icon: LayoutGrid },
        { to: "/medical/calendar", label: tr("medical_agenda"), icon: Stethoscope },
        { to: "/athletes", label: tr("athletes_nav"), icon: Users },
        { to: "/medical/restrictions", label: tr("restrictions"), icon: Activity },
        { to: "/medical/incidents", label: tr("incidents"), icon: AlertTriangle },
        { to: "/medical/treatments", label: tr("treatment_plans"), icon: ClipboardList },
        { to: "/medical/requests", label: tr("appointment_requests"), icon: CalendarPlus },
        { to: "/communication", label: tr("medical_comm"), icon: MessageSquare },
      ];

    case "technical":
    case "athlete":
      return []; // Mobile-only roles
  }
}

function navItemToItem(n: ClubNavItem): Item {
  const IconCmp =
    (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[n.icon] ??
    LayoutGrid;
  return {
    to: n.to,
    label: n.label,
    icon: IconCmp,
    module: n.module,
    indent: n.indent,
    params: n.slug ? { slug: n.slug } : undefined,
  };
}

export function Sidebar() {
  const user = useCurrentUser();
  const t = useT();
  const td = useTd();
  const setUser = useAuth((s) => s.setUser);
  const mobileOpen = useAuth((s) => s.mobileNavOpen);
  const setMobileOpen = useAuth((s) => s.setMobileNavOpen);
  const collapsed = useAuth((s) => s.sidebarCollapsed);
  const toggleCollapsed = useAuth((s) => s.toggleSidebarCollapsed);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { club, isModuleEnabled } = useClub();
  if (!user) return null;
  const items: Item[] = club.navItems
    ? club.navItems
        .filter((n) => isModuleEnabled(n.module))
        .filter((n) => !n.allowedRoles || n.allowedRoles.includes(user.role))
        .map(navItemToItem)
    : buildItems(user.role, t);
  const width = collapsed ? 72 : 264;
  const notifCount = user.role === "sysadmin" ? 25 : user.role === "medical" ? 13 : 0;

  const isActive = (to: string) => path === to || path.startsWith(to + "/");

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed left-0 z-40 flex flex-col transition-transform duration-200 top-14 md:top-[72px]",
          "md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
        style={{
          width,
          background: "#FFFFFF",
          borderRight: "1px solid #DDE6F0",
          top: "calc(var(--topbar-base, 3.5rem) + var(--demo-bar-h, 0px))",
          height: "calc(100vh - var(--topbar-base, 3.5rem) - var(--demo-bar-h, 0px))",
        }}
      >
        <div className="flex h-12 items-center justify-between px-4">
          {!collapsed && (
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              {t("navigation")}
            </span>
          )}
          <button
            onClick={() => setMobileOpen(false)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-sidebar-accent md:hidden"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            onClick={toggleCollapsed}
            className="ml-auto hidden h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-sidebar-accent md:flex"
            aria-label="Collapse"
          >
            <ChevronLeft
              className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")}
            />
          </button>
        </div>

        {!collapsed && (
          <div className="mx-3 mb-3 flex items-center gap-2 rounded-2xl bg-sidebar-accent/60 px-3 py-2 text-xs">
            {notifCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                {notifCount}
              </span>
            )}
            <span className="truncate font-semibold text-sidebar-foreground">{user.name}</span>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-2 py-1">
          <ul className="space-y-0.5">
            {items.map((it, idx) => {
              const resolvedPath = it.params
                ? Object.entries(it.params).reduce((acc, [k, v]) => acc.replace(`$${k}`, v), it.to)
                : it.to;
              const active = it.indent
                ? path === resolvedPath
                : path === resolvedPath || path.startsWith(resolvedPath + "/");
              const Icon = it.icon;
              return (
                <li key={idx}>
                  <Link
                    to={it.to}
                    params={it.params as never}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 text-[13px] font-medium transition-colors",
                      active ? "shadow-sm" : "hover:bg-[#EEF3F8]",
                      it.indent && !collapsed && "ml-4 text-[12px]",
                    )}
                    style={{
                      height: 44,
                      borderRadius: 999,
                      background: active ? "var(--primary, #0067C9)" : undefined,
                      color: active ? "#FFFFFF" : "#66758A",
                    }}
                  >
                    <Icon className="shrink-0 h-5 w-5" />
                    {!collapsed && <span className="truncate">{td(it.label)}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <Link
            to="/profile"
            className={cn(
              "flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-medium",
              isActive("/profile")
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent",
            )}
          >
            <Settings className="h-[18px] w-[18px]" />
            {!collapsed && <span>{t("profile_settings")}</span>}
          </Link>
          <button
            onClick={() => setUser(null)}
            className="mt-1 flex w-full items-center gap-3 rounded-full px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="h-[18px] w-[18px]" />
            {!collapsed && <span>{t("logout")}</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

export const SIDEBAR_WIDTH = 240;
