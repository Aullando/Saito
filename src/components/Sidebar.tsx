import { Link, useRouterState } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import {
  Building2, CalendarDays, Users, Wallet, Receipt, MessageSquare,
  Settings, LayoutGrid, Stethoscope, ChevronLeft, LogOut, X,
} from "lucide-react";
import { useState } from "react";
import { useCurrentUser, useAuth } from "@/lib/store";
import { useT } from "@/lib/i18n";
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

function buildItems(role: Role, t: (k: any) => string): Item[] {
  switch (role) {
    case "sysadmin":
      return [{ to: "/organizations", label: t("organizations"), icon: Building2 }];
    case "admin":
    case "manager":
      return [
        { to: "/dashboard", label: t("dashboard") || "Dashboard", icon: LayoutGrid, module: "dashboard" },
        { to: "/club", label: t("club_organization"), icon: Building2, module: "club" },
        { to: "/calendar", label: t("calendar"), icon: CalendarDays, module: "calendar" },
        { to: "/athletes", label: t("athletes"), icon: Users, module: "athletes" },
        { to: "/economic/fees", label: t("economic_management"), icon: Wallet, module: "economic" },
        { to: "/economic/fees", label: t("fees_rates"), icon: Receipt, indent: true, module: "economic" },
        { to: "/economic/payments", label: t("payment_status"), icon: Receipt, indent: true, module: "economic" },
        { to: "/communication", label: t("communication"), icon: MessageSquare, module: "communication" },
        ...(role === "admin" ? [{ to: "/settings/team", label: t("users_permissions"), icon: Users, module: "settings" as ClubModuleId }] : []),
      ];
    case "technical":
      return [
        { to: "/calendar", label: t("calendar"), icon: CalendarDays, module: "calendar" },
        { to: "/athletes", label: t("athletes"), icon: Users, module: "athletes" },
        { to: "/communication", label: t("communication"), icon: MessageSquare, module: "communication" },
      ];
    case "medical":
      return [
        { to: "/medical/calendar", label: t("medical_calendar"), icon: Stethoscope, module: "medical" },
        { to: "/athletes", label: t("athletes"), icon: Users, module: "athletes" },
        { to: "/communication", label: t("communication"), icon: MessageSquare, module: "communication" },
      ];
  }
}

function navItemToItem(n: ClubNavItem): Item {
  const IconCmp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[n.icon] ?? LayoutGrid;
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
  const setUser = useAuth((s) => s.setUser);
  const mobileOpen = useAuth((s) => s.mobileNavOpen);
  const setMobileOpen = useAuth((s) => s.setMobileNavOpen);
  const [collapsed, setCollapsed] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { club, isModuleEnabled } = useClub();
  if (!user) return null;
  const items: Item[] = club.navItems
    ? club.navItems.filter((n) => isModuleEnabled(n.module)).map(navItemToItem)
    : buildItems(user.role, t).filter((i) => !i.module || isModuleEnabled(i.module));
  const width = collapsed ? 72 : 224;
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
          "fixed left-0 top-14 md:top-16 z-40 flex h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200",
          "md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
        style={{ width }}
      >
      <div className="flex h-12 items-center justify-between px-3">
        <button
          onClick={() => setMobileOpen(false)}
          className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-sidebar-accent md:hidden"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="ml-auto hidden h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-sidebar-accent md:flex"
          aria-label="Collapse"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      {!collapsed && (
        <div className="mx-3 mb-2 flex items-center gap-2 rounded-2xl bg-sidebar-accent px-3 py-2 text-xs">
          {notifCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
              {notifCount}
            </span>
          )}
          <span className="truncate font-semibold text-sidebar-foreground">{user.name}</span>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="space-y-1">
          {items.map((it, idx) => {
            // For Economic Management header link, mark active when on any economic route
            const economicHeader = it.label === t("economic_management");
            const active = economicHeader
              ? path.startsWith("/economic")
              : it.indent
                ? path === it.to
                : isActive(it.to);
            const Icon = it.icon;
            return (
              <li key={idx}>
                <Link
                  to={it.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent",
                    it.indent && !collapsed && "ml-4 text-[13px]",
                  )}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  {!collapsed && <span className="truncate">{it.label}</span>}
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

export const SIDEBAR_WIDTH = 224;
