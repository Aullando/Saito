import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { AIChat } from "./AIChat";
import { DataSourceBadge } from "./DataSourceBadge";
import { WorkspaceFrame } from "./WorkspaceFrame";
import { useCurrentUser, useAuth } from "@/lib/store";
import { Navigate } from "@tanstack/react-router";

// Map each role to its brand accent (per SAITO brand manual).
// Desktop roles get the blue/yellow accents; mobile roles their own greens/reds.
const ROLE_ACCENT: Record<string, { primary: string; ring: string; soft: string; softText: string }> = {
  manager:   { primary: "#0067C9", ring: "#0067C9", soft: "#EAF4FF", softText: "#0054A4" },
  admin:     { primary: "#0067C9", ring: "#0067C9", soft: "#EAF4FF", softText: "#0054A4" },
  sysadmin:  { primary: "#0067C9", ring: "#0067C9", soft: "#EAF4FF", softText: "#0054A4" },
  medical:   { primary: "#FDB113", ring: "#FDB113", soft: "#FFF5DF", softText: "#B56F00" },
  technical: { primary: "#00A74D", ring: "#00A74D", soft: "#EAF8F0", softText: "#00843D" },
  athlete:   { primary: "#F12F4A", ring: "#F12F4A", soft: "#FFF0F3", softText: "#C71F36" },
};

export function AppLayout({ children }: { children: ReactNode }) {
  const user = useCurrentUser();
  const collapsed = useAuth((s) => s.sidebarCollapsed);
  if (!user) return <Navigate to="/login" />;
  const accent = ROLE_ACCENT[user.role] ?? ROLE_ACCENT.manager;
  const roleStyle = {
    ["--primary" as string]: accent.primary,
    ["--ring" as string]: accent.ring,
    ["--accent" as string]: accent.soft,
    ["--accent-foreground" as string]: accent.softText,
    ["--sidebar-ring" as string]: accent.ring,
  } as React.CSSProperties;
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      data-role={user.role}
      style={{ background: "#F7F9FC", ...roleStyle }}
    >
      <Topbar />
      <Sidebar />
      <div className="transition-[padding] duration-200">
        <div className="hidden md:block" style={{ paddingLeft: collapsed ? 72 : 264 }}>
          <main className="pt-[88px]" style={{ paddingInline: 32, paddingBottom: 32 }}>
            <div className="mx-auto w-full" style={{ maxWidth: 1440 }}>
              <WorkspaceFrame>{children}</WorkspaceFrame>
            </div>
          </main>
        </div>
        <div className="md:hidden">
          <main className="px-4 py-5 pt-[72px]">
            <WorkspaceFrame>{children}</WorkspaceFrame>
          </main>
        </div>
      </div>
      <AIChat />
      <DataSourceBadge variant="fixed" />
    </div>
  );
}
