// Guard CNSO — asegura que el club activo es CNSO antes de renderizar rutas /cnso/*.
import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useClub } from "@/clubs/ClubProvider";

export function CnsoGuard({ children }: { children: ReactNode }) {
  const { club } = useClub();
  if (club.id !== "cnso") return <Navigate to="/dashboard" />;
  return <AppLayout>{children}</AppLayout>;
}
