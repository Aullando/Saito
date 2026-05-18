import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/demo/mobile/coach")({
  component: RedirectCoach,
});

function RedirectCoach() {
  const { setActiveRole } = useAuth() as { setActiveRole?: (r: string) => void };
  useEffect(() => {
    try {
      localStorage.setItem("saito.activeRole", "technical");
    } catch {
      /* ignore */
    }
    setActiveRole?.("technical");
  }, [setActiveRole]);
  return <Navigate to="/mobile" replace />;
}
