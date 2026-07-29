import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuth } from "@/lib/store";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    // Si el gate ya está desbloqueado y hay usuario, entra directo al dashboard.
    // Evita el flash /→/login→/dashboard.
    const hasUser = typeof window !== "undefined" && !!useAuth.getState().currentUserId;
    throw redirect({ to: hasUser ? "/dashboard" : "/login" });
  },
});
