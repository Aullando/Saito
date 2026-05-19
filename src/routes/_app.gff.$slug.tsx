import { createFileRoute } from "@tanstack/react-router";
import { RoleGate } from "@/components/RoleGate";
import { GffGuard } from "@/clubs/gff/GffGuard";
import { GffWorkspace } from "@/clubs/gff/GffWorkspace";

// GffGuard already wraps children in <AppLayout>. Mirrors the RGCC pattern.
export const Route = createFileRoute("/_app/gff/$slug")({
  component: () => (
    <RoleGate roles={["sysadmin", "admin", "manager", "technical", "medical"]}>
      <GffGuard>
        <GffSlugPage />
      </GffGuard>
    </RoleGate>
  ),
});

function GffSlugPage() {
  const { slug } = Route.useParams();
  return <GffWorkspace view={slug} />;
}
