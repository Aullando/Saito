import { createFileRoute } from "@tanstack/react-router";
import { useCurrentUser } from "@/lib/store";
import { Mail, Globe, Shield } from "lucide-react";
import { useClub } from "@/clubs/ClubProvider";
import { GffMobileProfile } from "@/clubs/gff/GffMobileWorkspace";

export const Route = createFileRoute("/_app/mobile/profile")({
  component: MobileProfileRoute,
});

function MobileProfileRoute() {
  const { club } = useClub();
  if (club.id === "gff-demo") return <GffMobileProfile />;
  return <MobileProfile />;
}

function MobileProfile() {
  const user = useCurrentUser();
  if (!user) return null;

  const roleLabel =
    user.role === "technical" ? "Entrenador" : user.role === "athlete" ? "Atleta" : user.role;

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-2 pt-2 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
          {user.initials}
        </div>
        <div>
          <div className="text-base font-bold">{user.name}</div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            {roleLabel}
          </div>
        </div>
      </div>

      <ul className="space-y-2">
        <Row icon={Mail} label="Email" value={user.email} />
        <Row icon={Globe} label="Idioma" value={user.language.toUpperCase()} />
        <Row icon={Shield} label="Privacidad" value="Datos cifrados" />
      </ul>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className="truncate text-sm font-medium">{value}</div>
      </div>
    </li>
  );
}
