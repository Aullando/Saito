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
      <Sidebar />
      <div className="md:pl-[224px]">
        <Topbar />
        <main className="px-6 py-6 md:px-10 md:py-8">{children}</main>
      </div>
      <AIChat />
    </div>
  );
}

