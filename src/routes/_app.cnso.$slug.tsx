// Catch-all route /cnso/$slug — renderiza la vista de cada módulo de CNSO
// con un patrón de tarjetas adaptado al perfil del club de natación.
import { createFileRoute } from "@tanstack/react-router";
import { useClub } from "@/clubs/ClubProvider";
import { CnsoGuard } from "@/clubs/cnso/CnsoGuard";
import { cnsoNavItems } from "@/clubs/cnso/modules";
import { ComingSoon } from "@/features/clubModule/helpers";
import { ModulePreview } from "@/features/cnso/ModulePreview";

export const Route = createFileRoute("/_app/cnso/$slug")({
  component: () => (
    <CnsoGuard>
      <CnsoModulePage />
    </CnsoGuard>
  ),
});

function CnsoModulePage() {
  const { slug } = Route.useParams();
  const { club } = useClub();
  const item = cnsoNavItems.find((i) => i.slug === slug);
  const label = item?.label ?? slug;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {club.brand.name}
        </p>
        <h1 className="text-2xl font-bold">{label}</h1>
      </header>
      <ModulePreview slug={slug} fallback={<ComingSoon label={label} clubName={club.brand.name} />} />
    </div>
  );
}
