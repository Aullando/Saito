import type { Role } from "@/lib/types";
import { useCurrentUser } from "@/lib/store";
import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function RoleGate({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const user = useCurrentUser();
  if (!user) return <Navigate to="/login" />;
  if (!roles.includes(user.role)) return <Navigate to="/" />;
  return <>{children}</>;
}
