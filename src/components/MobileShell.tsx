import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { LogOut, Bell } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth as useLocalAuth, useCurrentUser } from "@/lib/store";
import { cn } from "@/lib/utils";

export interface MobileTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  to: string;
}

export function MobileShell({
  tabs,
  children,
  title,
  role,
}: {
  tabs: MobileTab[];
  children: ReactNode;
  title?: string;
  role?: "coach" | "athlete";
}) {
  const user = useCurrentUser();
  const setUser = useLocalAuth((s) => s.setUser);
  const path = useRouterState({ select: (s) => s.location.pathname });

  // Role-scoped accent: coach = green, athlete = red.
  const roleStyle =
    role === "athlete"
      ? ({ ["--primary" as string]: "#f12f4a", ["--ring" as string]: "#f12f4a" } as React.CSSProperties)
      : role === "coach"
        ? ({ ["--primary" as string]: "#00a74d", ["--ring" as string]: "#00a74d" } as React.CSSProperties)
        : undefined;

  return (
    <div className="min-h-screen w-full bg-muted/40 px-2 py-4 sm:py-8" style={roleStyle}>

      <div className="mx-auto" style={{ width: "min(100%, 390px)" }}>
        <div
          className="relative overflow-hidden rounded-[36px] border border-border bg-background shadow-xl"
          style={{ height: "min(calc(100vh - 64px), 780px)" }}
        >
          {/* Top status bar */}
          <div className="flex h-11 items-center justify-between bg-background px-5 text-[11px] font-semibold text-foreground/70">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <span>•••</span>
              <span>100%</span>
            </div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 pb-3 pt-1">
            <div className="flex items-center gap-2">
              <Logo size={22} />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {title ?? "SAITO"}
                </div>
                <div className="text-xs font-medium text-foreground">
                  {user?.name ?? ""}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Link
                to="/mobile/notifications"
                className="relative flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent"
                aria-label="Notificaciones"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[color:var(--primary)]" />
              </Link>
              <button
                onClick={() => setUser(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent"
                aria-label="Salir"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Scrollable content */}
          <div
            className="overflow-y-auto px-4 py-4"
            style={{ height: "calc(100% - 11rem)" }}
          >
            {children}
          </div>

          {/* Bottom tab bar */}
          <nav className="absolute bottom-0 left-0 right-0 flex h-20 items-start justify-around border-t border-border bg-background/95 pb-5 pt-2 backdrop-blur">
            {tabs.map((t) => {
              const active = path === t.to || path.startsWith(t.to + "/");
              const Icon = t.icon;
              return (
                <Link
                  key={t.id}
                  to={t.to}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-1 text-[10px] font-medium",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className={cn("h-5 w-5", active && "scale-110")} />
                  <span>{t.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
