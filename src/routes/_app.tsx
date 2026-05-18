import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_app")({
  component: AppGuard,
});

function AppGuard() {
  const { session, loading, roles } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/login" });
  }, [loading, session, navigate]);

  // Mobile-only roles: redirect to mobile shell if outside it.
  useEffect(() => {
    if (!session || loading) return;
    const role = roles[0];
    const isMobileOnly = role === "technical" || role === "athlete";
    const inMobile = path === "/mobile" || path.startsWith("/mobile/");
    const inProfile = path === "/profile";
    if (isMobileOnly && !inMobile && !inProfile) {
      navigate({ to: "/mobile" });
    }
  }, [session, loading, roles, path, navigate]);

  if (loading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return <Outlet />;
}
