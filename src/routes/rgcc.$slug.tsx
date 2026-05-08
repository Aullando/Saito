import { createFileRoute, Link } from "@tanstack/react-router";
import { Construction } from "lucide-react";
import { useClub } from "@/clubs/ClubProvider";
import { rgccNavItems } from "@/clubs/rgcc/modules";

export const Route = createFileRoute("/rgcc/$slug")({
  component: RgccComingSoon,
});

function RgccComingSoon() {
  const { slug } = Route.useParams();
  const { club } = useClub();
  const item = rgccNavItems.find((i) => i.slug === slug);
  const label = item?.label ?? slug;

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Construction className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-bold">{label}</h1>
      <p className="text-sm text-muted-foreground">
        Este módulo de <span className="font-medium text-foreground">{club.brand.name}</span> está
        en preparación. Pronto estará disponible aquí dentro de SAITO.
      </p>
      <Link
        to="/dashboard"
        className="mt-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Volver al Dashboard
      </Link>
    </div>
  );
}
