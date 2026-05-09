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
    <div className="min-h-screen bg-background">
      <Topbar />
      <Sidebar />
      <div className="transition-[padding] duration-200" style={{ paddingLeft: 0 }}>
        <div className="hidden md:block" style={{ paddingLeft: collapsed ? 72 : 224 }}>
          <main className="px-4 py-5 pt-[72px] md:px-8 md:py-8 md:pt-[88px] lg:px-10">
            {children}
          </main>
        </div>
        <div className="md:hidden">
          <main className="px-4 py-5 pt-[72px]">{children}</main>
        </div>
      </div>
      <AIChat />
    </div>
  );
}
