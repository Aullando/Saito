import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Logo } from "@/components/Logo";
import { useAuth as useLocalAuth } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { useActiveClubStore } from "@/clubs/activeClub";
import {
  Briefcase,
  Wallet,
  Stethoscope,
  Dumbbell,
  User,
  Monitor,
  Smartphone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — SAITO" }] }),
  component: LoginPage,
});

type ModuleKey = "admin" | "wellbeing" | "coaching" | "sportlife";

type DemoProfile = {
  id: string;
  userId: string;
  title: string;
  subtitle: string;
  surface: "desktop" | "mobile";
  module: ModuleKey;
  icon: LucideIcon;
};

/** Channel rule (Confluence):
 *   - WebApp escritorio: Gestor/Dirección, Administración, Staff médico
 *   - App móvil: Entrenador, Atleta
 * Module color (brand):
 *   admin=azul · wellbeing=amarillo · coaching=verde · sportlife=rojo
 */
const PROFILES: DemoProfile[] = [
  {
    id: "mgr",
    userId: "u-mgr",
    title: "Gestor / Dirección",
    subtitle: "Dashboard de club, KPIs, secciones y decisiones",
    surface: "desktop",
    module: "admin",
    icon: Briefcase,
  },
  {
    id: "adm",
    userId: "u-adm",
    title: "Administración",
    subtitle: "Usuarios, cuotas, pagos, calendario y circulares",
    surface: "desktop",
    module: "admin",
    icon: Wallet,
  },
  {
    id: "med",
    userId: "u-med",
    title: "Staff médico",
    subtitle: "Ficha de salud, incidencias, restricciones y citas",
    surface: "desktop",
    module: "wellbeing",
    icon: Stethoscope,
  },
  {
    id: "tec",
    userId: "u-tec",
    title: "Entrenador",
    subtitle: "Sesión, asistencia, convocatoria, notas e IA",
    surface: "mobile",
    module: "coaching",
    icon: Dumbbell,
  },
  {
    id: "ath",
    userId: "u-ath",
    title: "Atleta",
    subtitle: "Calendario, ausencias, feedback, salud y notis",
    surface: "mobile",
    module: "sportlife",
    icon: User,
  },
];

const MODULE_STYLES: Record<
  ModuleKey,
  { icon: string; ring: string; chip: string; label: string }
> = {
  admin: {
    icon: "bg-mod-admin text-mod-admin-foreground",
    ring: "group-hover:border-mod-admin",
    chip: "bg-mod-admin-soft text-mod-admin",
    label: "Administration",
  },
  wellbeing: {
    icon: "bg-mod-wellbeing text-mod-wellbeing-foreground",
    ring: "group-hover:border-mod-wellbeing",
    chip: "bg-mod-wellbeing-soft text-[color:var(--saito-navy)]",
    label: "Wellbeing",
  },
  coaching: {
    icon: "bg-mod-coaching text-mod-coaching-foreground",
    ring: "group-hover:border-mod-coaching",
    chip: "bg-mod-coaching-soft text-mod-coaching",
    label: "Coaching",
  },
  sportlife: {
    icon: "bg-mod-sportlife text-mod-sportlife-foreground",
    ring: "group-hover:border-mod-sportlife",
    chip: "bg-mod-sportlife-soft text-mod-sportlife",
    label: "Sport Life",
  },
};

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
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 flex flex-col items-center gap-1 text-center">
          <Logo size={44} />
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            powered by Gemini
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">Ver SAITO como…</h1>
          <p className="text-sm text-muted-foreground">
            Elige tu rol. Cada rol entra al canal correcto: escritorio o móvil.
          </p>
        </header>

        <ChannelSection
          icon={Monitor}
          title="WebApp · Escritorio"
          description="Gestión y operaciones del club. Sidebar + topbar."
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {desktop.map((p) => (
              <ProfileCard key={p.id} profile={p} onSelect={enter} />
            ))}
          </div>
        </ChannelSection>

        <ChannelSection
          icon={Smartphone}
          title="App móvil"
          description="Frame 390 px. Solo entrenador y atleta."
          className="mt-10"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {mobile.map((p) => (
              <ProfileCard key={p.id} profile={p} onSelect={enter} />
            ))}
          </div>
        </ChannelSection>

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

function ChannelSection({
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
  const s = MODULE_STYLES[profile.module];
  return (
    <button
      type="button"
      onClick={() => onSelect(profile)}
      className={`group flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left transition hover:shadow-md ${s.ring}`}
    >
      <div className="flex w-full items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.icon}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${s.chip}`}
        >
          {s.label}
        </span>
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
