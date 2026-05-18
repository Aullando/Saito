import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { AIChat } from "./AIChat";
import { DataSourceBadge } from "./DataSourceBadge";
import { useCurrentUser, useAuth } from "@/lib/store";
import { Navigate } from "@tanstack/react-router";

export function AppLayout({ children }: { children: ReactNode }) {
  const user = useCurrentUser();
  const collapsed = useAuth((s) => s.sidebarCollapsed);
  if (!user) return <Navigate to="/login" />;
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "#F7F9FC" }}>
      <Topbar />
      <Sidebar />
      <div className="transition-[padding] duration-200">
        <div className="hidden md:block" style={{ paddingLeft: collapsed ? 72 : 264 }}>
          <main className="pt-[88px]" style={{ paddingInline: 32, paddingBottom: 32 }}>
            <div className="mx-auto w-full" style={{ maxWidth: 1440 }}>
              {children}
            </div>
          </main>
        </div>
        <div className="md:hidden">
          <main className="px-4 py-5 pt-[72px]">{children}</main>
        </div>
      </div>
      <AIChat />
      <DataSourceBadge variant="fixed" />
    </div>
  );
}
