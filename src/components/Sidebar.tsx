import { Link, useRouterState } from "@tanstack/react-router";
import {
  Building2, CalendarDays, Users, Wallet, Receipt, MessageSquare,
  Settings, LayoutGrid, Stethoscope, ChevronLeft, LogOut,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { useCurrentUser, useAuth } from "@/lib/store";
import { useT } from "@/lib/i18n";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

type Item = { to: string; label: string; icon: typeof Building2; indent?: boolean };

function buildItems(role: Role, t: (k: any) => string): Item[] {
  switch (role) {
    case "sysadmin":
      return [{ to: "/organizations", label: t("organizations"), icon: Building2 }];
    case "admin":
    case "manager":
      return [
        { to: "/club", label: t("club_organization"), icon: LayoutGrid },
        { to: "/calendar", label: t("calendar"), icon: CalendarDays },
        { to: "/athletes", label: t("athletes"), icon: Users },
        { to: "/economic/fees", label: t("economic_management"), icon: Wallet },
        { to: "/economic/fees", label: t("fees_rates"), icon: Receipt, indent: true },
        { to: "/economic/payments", label: t("payment_status"), icon: Receipt, indent: true },
        { to: "/communication", label: t("communication"), icon: MessageSquare },
      ];
    case "technical":
      return [
        { to: "/calendar", label: t("calendar"), icon: CalendarDays },
        { to: "/athletes", label: t("athletes"), icon: Users },
        { to: "/communication", label: t("communication"), icon: MessageSquare },
      ];
    case "medical":
      return [
        { to: "/medical/calendar", label: t("medical_calendar"), icon: Stethoscope },
        { to: "/athletes", label: t("athletes"), icon: Users },
        { to: "/communication", label: t("communication"), icon: MessageSquare },
      ];
  }
}

export function Sidebar() {
  const user = useCurrentUser();
  const t = useT();
  const setUser = useAuth((s) => s.setUser);
  const [collapsed, setCollapsed] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (!user) return null;
  const items = buildItems(user.role, t);
  const width = collapsed ? 72 : 224;
  const notifCount = user.role === "sysadmin" ? 25 : user.role === "medical" ? 13 : 0;

  const isActive = (to: string) => path === to || path.startsWith(to + "/");

  return (
    <aside
      className="fixed left-0 top-16 z-20 flex h-[calc(100vh-4rem)] flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200"
      style={{ width }}
    >
      <div className="flex h-12 items-center justify-end px-3">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="hidden h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-sidebar-accent md:flex"
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
  );
}

export const SIDEBAR_WIDTH = 224;
