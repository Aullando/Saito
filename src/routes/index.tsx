import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  component: IndexRedirect,
});

function IndexRedirect() {
  const { session, loading, profile, roles } = useAuth();
  if (loading) return null;
  if (!session) return <Navigate to="/login" />;
  if (!profile?.organization_id && !roles.includes("sysadmin")) {
    return <Navigate to="/onboarding" />;
  }

  if (roles.includes("sysadmin")) return <Navigate to="/organizations" />;
  if (roles.includes("admin") || roles.includes("manager")) return <Navigate to="/dashboard" />;
  if (roles.includes("technical")) return <Navigate to="/calendar" />;
  if (roles.includes("medical")) return <Navigate to="/medical/calendar" />;
  return <Navigate to="/club" />;
}
