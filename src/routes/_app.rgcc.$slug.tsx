import { createFileRoute } from "@tanstack/react-router";
import { useClub } from "@/clubs/ClubProvider";
import { RgccGuard } from "@/clubs/rgcc/RgccGuard";
import { rgccNavItems } from "@/clubs/rgcc/modules";
import { useTd } from "@/lib/demoI18n";
import { useTr } from "@/lib/i18n";
import { ComingSoon } from "@/features/clubModule/helpers";
import { ModulePreview } from "@/features/rgcc/ModulePreview";

export const Route = createFileRoute("/_app/rgcc/$slug")({
  component: () => (
    <RgccGuard>
      <RgccModulePage />
    </RgccGuard>
  ),
});

function RgccModulePage() {
  const { slug } = Route.useParams();
  const { club } = useClub();
  const item = rgccNavItems.find((i) => i.slug === slug);
  const tr = useTr();
  const td = useTd();
  const label = td(item?.label ?? slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{club.brand.name}</p>
        <h1 className="text-2xl font-bold">{label}</h1>
      </header>
      <ModulePreview
        slug={slug}
        fallback={
          <ComingSoon
            label={label}
            clubName={club.brand.name}
            message={tr(
              `Este módulo de ${club.brand.name} está en preparación. Pronto estará disponible aquí dentro de SAITO.`,
              `This ${club.brand.name} module is in preparation. It will be available here inside SAITO soon.`,
            )}
            backLabel={tr("Volver al Dashboard", "Back to Dashboard")}
          />
        }
      />
    </div>
  );
}
