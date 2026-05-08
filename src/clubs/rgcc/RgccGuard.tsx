// Unified RGCC guard. Ensures the active club is RGCC before rendering any
// rgcc.* route. If not, redirects to the platform dashboard. Wraps children
// in AppLayout so individual routes don't repeat boilerplate.
import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useClub } from "@/clubs/ClubProvider";

export function RgccGuard({ children }: { children: ReactNode }) {
  const { club } = useClub();
  if (club.id !== "rgcc") return <Navigate to="/dashboard" />;
  return <AppLayout>{children}</AppLayout>;
}
