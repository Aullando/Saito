import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useCurrentUser } from "@/lib/store";

export const Route = createFileRoute("/")({
  component: IndexRedirect,
});

function IndexRedirect() {
  const user = useCurrentUser();
  if (!user) return <Navigate to="/login" />;
  switch (user.role) {
    case "sysadmin":
      return <Navigate to="/organizations" />;
    case "admin":
    case "manager":
      return <Navigate to="/club" />;
    case "technical":
      return <Navigate to="/calendar" />;
    case "medical":
      return <Navigate to="/medical/calendar" />;
  }
}
