// Unified GFF guard. Ensures the active club is the GFF demo before rendering
// any gff.* route. If not, redirects to the platform dashboard. Wraps children
// in AppLayout so individual routes don't repeat boilerplate.
import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useClub } from "@/clubs/ClubProvider";

export function GffGuard({ children }: { children: ReactNode }) {
  const { club } = useClub();
  if (club.id !== "gff-demo") return <Navigate to="/dashboard" />;
  return <AppLayout>{children}</AppLayout>;
}
