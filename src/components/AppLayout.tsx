import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { AIChat } from "./AIChat";
import { useCurrentUser } from "@/lib/store";
import { Navigate } from "@tanstack/react-router";

export function AppLayout({ children }: { children: ReactNode }) {
  const user = useCurrentUser();
  if (!user) return <Navigate to="/login" />;
  return (
    <div className="min-h-screen bg-background">
      <Topbar />
      <Sidebar />
      <div className="md:pl-[224px]">
        <main className="px-4 py-5 pt-[72px] md:px-10 md:py-8 md:pt-[88px]">{children}</main>
      </div>
      <AIChat />
    </div>
  );
}

