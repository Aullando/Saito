import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { GffGuard } from "@/clubs/gff/GffGuard";
import { GffWorkspace } from "@/clubs/gff/GffWorkspace";

export const Route = createFileRoute("/_app/gff/$slug")({
  component: () => (
    <RoleGate roles={["sysadmin", "admin", "manager", "technical", "medical"]}>
      <AppLayout>
        <GffGuard>
          <GffSlugPage />
        </GffGuard>
      </AppLayout>
    </RoleGate>
  ),
});

function GffSlugPage() {
  const { slug } = Route.useParams();
  return <GffWorkspace view={slug} />;
}
