import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/demo/mobile/athlete")({
  component: RedirectAthlete,
});

function RedirectAthlete() {
  const { setActiveRole } = useAuth() as { setActiveRole?: (r: string) => void };
  useEffect(() => {
    try {
      localStorage.setItem("saito.activeRole", "athlete");
    } catch {
      /* ignore */
    }
    setActiveRole?.("athlete");
  }, [setActiveRole]);
  return <Navigate to="/mobile" replace />;
}
