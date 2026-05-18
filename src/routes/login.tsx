import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Logo } from "@/components/Logo";
import { useAuth as useLocalAuth } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { useActiveClubStore } from "@/clubs/activeClub";
import { Briefcase, Wallet, Stethoscope, Whistle, User, Monitor, Smartphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — SAITO" }] }),
  component: LoginPage,
});

type DemoProfile = {
  id: string;
  userId: string;
  title: string;
  subtitle: string;
  surface: "desktop" | "mobile";
  icon: LucideIcon;
};

const PROFILES: DemoProfile[] = [
  {
    id: "mgr",
    userId: "u-mgr",
    title: "Gestor / Dirección",
    subtitle: "Visión global del club, KPIs y decisiones",
    surface: "desktop",
    icon: Briefcase,
  },
  {
    id: "adm",
    userId: "u-adm",
    title: "Administración",
    subtitle: "Cuotas, pagos y gestión económica",
    surface: "desktop",
    icon: Wallet,
  },
  {
    id: "med",
    userId: "u-med",
    title: "Staff médico",
    subtitle: "Lesiones, restricciones y agenda clínica",
    surface: "desktop",
    icon: Stethoscope,
  },
  {
    id: "tec",
    userId: "u-tec",
    title: "Entrenador",
    subtitle: "Tu día, asistencia y comunicación",
    surface: "mobile",
    icon: Whistle,
  },
  {
    id: "ath",
    userId: "u-ath",
    title: "Atleta",
    subtitle: "Calendario personal, avisos y perfil",
    surface: "mobile",
    icon: User,
  },
];

function LoginPage() {
  const { session, roles } = useAuth();
  const navigate = useNavigate();
  const setUser = useLocalAuth((s) => s.setUser);
  const switchClub = useActiveClubStore((s) => s.switchClub);

  useEffect(() => {
    if (session) {
      const r = roles[0];
      if (r === "technical" || r === "athlete") navigate({ to: "/mobile" });
      else navigate({ to: "/dashboard" });
    }
  }, [session, roles, navigate]);

  const enter = (p: DemoProfile) => {
    switchClub("saito");
    setUser(p.userId);
    if (p.surface === "mobile") navigate({ to: "/mobile" });
    else navigate({ to: "/dashboard" });
  };

  const desktop = PROFILES.filter((p) => p.surface === "desktop");
  const mobile = PROFILES.filter((p) => p.surface === "mobile");

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 flex flex-col items-center gap-1 text-center">
          <Logo size={44} />
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            powered by Gemini
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">Demo SAITO</h1>
          <p className="text-sm text-muted-foreground">
            Elige cómo quieres explorar la plataforma.
          </p>
        </div>

        <Section
          icon={Monitor}
          title="WebApp — Escritorio"
          description="Roles de gestión con panel completo."
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {desktop.map((p) => (
              <ProfileCard key={p.id} profile={p} onSelect={enter} />
            ))}
          </div>
        </Section>

        <Section
          icon={Smartphone}
          title="App móvil"
          description="Pensada para entrenadores y atletas."
          className="mt-8"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {mobile.map((p) => (
              <ProfileCard key={p.id} profile={p} onSelect={enter} />
            ))}
          </div>
        </Section>

        <div className="mt-10 text-center text-xs text-muted-foreground">
          ¿Buscas la demo del Real Grupo Covadonga?{" "}
          <button
            type="button"
            className="font-semibold text-primary underline-offset-2 hover:underline"
            onClick={() => {
              switchClub("rgcc");
              setUser("u-mgr");
              navigate({ to: "/rgcc/mi-dia" });
            }}
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  description,
  children,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-bold uppercase tracking-wider">{title}</div>
          <div className="text-xs text-muted-foreground">{description}</div>
        </div>
      </div>
      {children}
    </section>
  );
}

function ProfileCard({
  profile,
  onSelect,
}: {
  profile: DemoProfile;
  onSelect: (p: DemoProfile) => void;
}) {
  const Icon = profile.icon;
  return (
    <button
      type="button"
      onClick={() => onSelect(profile)}
      className="group flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left transition hover:border-primary hover:shadow-md"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="text-base font-semibold">{profile.title}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">{profile.subtitle}</div>
      </div>
      <span className="text-xs font-semibold text-primary opacity-0 transition group-hover:opacity-100">
        Entrar →
      </span>
    </button>
  );
}
