import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { LogOut, Bell } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth as useLocalAuth } from "@/lib/store";
import { useClub } from "@/clubs/ClubProvider";


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
  const setUser = useLocalAuth((s) => s.setUser);
  const { club } = useClub();
  const isGff = club.id === "gff-demo";
  const notifAria = isGff ? "الإشعارات" : "Notificaciones";
  const exitAria = isGff ? "خروج" : "Salir";

  const path = useRouterState({ select: (s) => s.location.pathname });

  // Role-scoped accent: coach = green, athlete = red.
  const roleStyle =
    role === "athlete"
      ? ({ ["--primary" as string]: "#f12f4a", ["--ring" as string]: "#f12f4a" } as React.CSSProperties)
      : role === "coach"
        ? ({ ["--primary" as string]: "#00a74d", ["--ring" as string]: "#00a74d" } as React.CSSProperties)
        : undefined;

  const accent = role === "athlete" ? "#F12F4A" : role === "coach" ? "#00A74D" : "#0067C9";

  return (
    <div className="min-h-screen w-full bg-muted/40 px-2 py-4 sm:py-8" style={roleStyle}>
      <div className="mx-auto" style={{ width: "min(100%, 390px)" }}>
        <div
          className="relative overflow-hidden"
          style={{
            height: "min(calc(100vh - 32px), 844px)",
            borderRadius: 36,
            border: "1px solid #DDE6F0",
            background: "#F7F9FC",
            boxShadow: "0 24px 60px rgba(33, 50, 74, 0.18)",
          }}
        >
          {/* Top status bar */}
          <div className="flex h-11 items-center justify-between px-5 text-[11px] font-semibold text-foreground/70" style={{ background: "#F7F9FC" }}>
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <span>•••</span>
              <span>100%</span>
            </div>
          </div>

          {/* Header (64px) */}
          <div
            className="flex items-center justify-between"
            style={{ height: 64, paddingInline: 20, background: "#F7F9FC" }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Logo size={28} withText />
              {title && (
                <span className="ml-2 text-[11px] font-semibold uppercase tracking-wider truncate" style={{ color: "#66758A" }}>
                  {title}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/mobile/notifications"
                aria-label="Notificaciones"
                className="relative flex items-center justify-center"
                style={{
                  width: 40, height: 40, borderRadius: 9999,
                  background: "#FFFFFF", border: "1px solid #DDE6F0", color: "#21324A",
                }}
              >
                <Bell className="h-[18px] w-[18px]" />
                <span
                  className="absolute right-2 top-2 rounded-full"
                  style={{ width: 6, height: 6, background: accent }}
                />
              </Link>
              <button
                onClick={() => setUser(null)}
                aria-label="Salir"
                className="flex items-center justify-center"
                style={{
                  width: 40, height: 40, borderRadius: 9999,
                  background: "#FFFFFF", border: "1px solid #DDE6F0", color: "#66758A",
                }}
              >
                <LogOut className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>

          {/* Scrollable content */}
          <div
            className="overflow-y-auto"
            style={{
              height: "calc(100% - 44px - 64px - 72px)",
              paddingInline: 20,
              paddingTop: 8,
              paddingBottom: 16,
              background: "#F7F9FC",
            }}
          >
            {children}
          </div>

          {/* Bottom tab bar (72px) */}
          <nav
            className="absolute bottom-0 left-0 right-0 flex items-stretch justify-around"
            style={{
              height: 72,
              background: "#FFFFFF",
              borderTop: "1px solid #DDE6F0",
            }}
          >
            {tabs.map((t) => {
              const active = path === t.to || path.startsWith(t.to + "/");
              const Icon = t.icon;
              return (
                <Link
                  key={t.id}
                  to={t.to}
                  className="flex flex-1 flex-col items-center justify-center gap-1"
                  style={{
                    fontSize: 11,
                    fontWeight: active ? 700 : 500,
                    color: active ? accent : "#8A98AA",
                  }}
                >
                  <Icon className="h-[22px] w-[22px]" />
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
