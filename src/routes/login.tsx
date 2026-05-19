import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { useAuth as useLocalAuth } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { useActiveClubStore } from "@/clubs/activeClub";
import { CLUBS } from "@/clubs/registry";
import saitoMark from "@/assets/brand/saito-iso.svg";
import {
  Briefcase,
  Wallet,
  Stethoscope,
  Dumbbell,
  User,
  Monitor,
  Smartphone,
  Crown,
  ClipboardList,
  BarChart3,
  ChevronDown,
  Check,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — SAITO" }] }),
  component: LoginPage,
});

type ModuleKey = "admin" | "wellbeing" | "coaching" | "sportlife";
type ClubKey = "saito" | "rgcc" | "gff-demo";

type DemoProfile = {
  id: string;
  userId: string;
  title: string;
  subtitle: string;
  surface: "desktop" | "mobile";
  module: ModuleKey;
  icon: LucideIcon;
  /** Optional route override; otherwise dashboard/mobile by surface. */
  to?: string;
};

const SAITO_PROFILES: DemoProfile[] = [
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

const RGCC_PROFILES: DemoProfile[] = [
  {
    id: "rgcc-mgr",
    userId: "u-mgr",
    title: "Dirección RGCC",
    subtitle: "Dashboard de club, secciones polideportivas y socios",
    surface: "desktop",
    module: "admin",
    icon: Briefcase,
  },
  {
    id: "rgcc-adm",
    userId: "u-adm",
    title: "Administración",
    subtitle: "Cuotas, pagos, calendario y comunicaciones de socio",
    surface: "desktop",
    module: "admin",
    icon: Wallet,
  },
  {
    id: "rgcc-tec",
    userId: "u-tec",
    title: "Entrenador",
    subtitle: "Clases, asistencia y entrenamiento personal",
    surface: "mobile",
    module: "coaching",
    icon: Dumbbell,
    to: "/rgcc/mi-dia",
  },
  {
    id: "rgcc-ath",
    userId: "u-ath",
    title: "Socio / Atleta",
    subtitle: "Mi día, clases, reservas y comunicaciones",
    surface: "mobile",
    module: "sportlife",
    icon: User,
    to: "/rgcc/mi-dia",
  },
];

const GFF_PROFILES: DemoProfile[] = [
  {
    id: "gff-pres",
    userId: "u-mgr",
    title: "President · الرئيس",
    subtitle: "Federation overview, FIFA/AFC ranking and national teams",
    surface: "desktop",
    module: "admin",
    icon: Crown,
  },
  {
    id: "gff-sg",
    userId: "u-adm",
    title: "General Secretary · الأمين العام",
    subtitle: "Affiliated clubs, calendar windows and administration",
    surface: "desktop",
    module: "admin",
    icon: ClipboardList,
  },
  {
    id: "gff-tech",
    userId: "u-mgr",
    title: "Technical Director · المدير الفني",
    subtitle: "Squad, staff, matches and development pathways",
    surface: "desktop",
    module: "coaching",
    icon: BarChart3,
  },
  {
    id: "gff-coach",
    userId: "u-tec",
    title: "National Team Coach · مدرب المنتخب",
    subtitle: "Convocatoria, sesiones y notas del cuerpo técnico",
    surface: "mobile",
    module: "coaching",
    icon: Dumbbell,
  },
  {
    id: "gff-player",
    userId: "u-ath",
    title: "National Team Player · لاعب المنتخب",
    subtitle: "Calendario, convocatorias, feedback y comunicaciones",
    surface: "mobile",
    module: "sportlife",
    icon: User,
  },
];

const PROFILES_BY_CLUB: Record<ClubKey, DemoProfile[]> = {
  saito: SAITO_PROFILES,
  rgcc: RGCC_PROFILES,
  "gff-demo": GFF_PROFILES,
};

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

const CLUB_ORDER: ClubKey[] = ["saito", "rgcc", "gff-demo"];

function isClubKey(v: string | null | undefined): v is ClubKey {
  return v === "saito" || v === "rgcc" || v === "gff-demo";
}

const CLUB_META: Record<ClubKey, { tagline: string; subtitle: string }> = {
  saito: {
    tagline: "Plataforma deportiva SAITO",
    subtitle: "Elige tu rol. Cada rol entra al canal correcto: escritorio o móvil.",
  },
  rgcc: {
    tagline: "Real Grupo de Cultura Covadonga",
    subtitle: "Demo multi-sección polideportiva basada en SAITO.",
  },
  "gff-demo": {
    tagline: "Gulf Football Federation · Demo",
    subtitle: "Federación ficticia. Workspace internacional en árabe RTL.",
  },
};

function LoginPage() {
  const { session, roles } = useAuth();
  const navigate = useNavigate();
  const setUser = useLocalAuth((s) => s.setUser);
  const switchClub = useActiveClubStore((s) => s.switchClub);
  const activeClubId = useActiveClubStore((s) => s.overrideClubId);
  const [selectedClub, setSelectedClub] = useState<ClubKey>(
    isClubKey(activeClubId) ? activeClubId : "saito",
  );

  const idx = CLUB_ORDER.indexOf(selectedClub);
  const prevClub = idx > 0 ? CLUB_ORDER[idx - 1] : null;
  const nextClub = idx >= 0 && idx < CLUB_ORDER.length - 1 ? CLUB_ORDER[idx + 1] : null;

  useEffect(() => {
    if (session) {
      const r = roles[0];
      if (r === "technical" || r === "athlete") navigate({ to: "/mobile" });
      else navigate({ to: "/dashboard" });
    }
  }, [session, roles, navigate]);

  const enter = (p: DemoProfile) => {
    switchClub(selectedClub);
    setUser(p.userId);
    if (p.to) {
      navigate({ to: p.to });
      return;
    }
    if (p.surface === "mobile") navigate({ to: "/mobile" });
    else navigate({ to: "/dashboard" });
  };

  const profiles = PROFILES_BY_CLUB[selectedClub];
  const desktop = profiles.filter((p) => p.surface === "desktop");
  const mobile = profiles.filter((p) => p.surface === "mobile");
  const meta = CLUB_META[selectedClub];

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col items-center gap-1 text-center">
          <Logo size={44} />
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            powered by Gemini
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">Ver SAITO como…</h1>
          <p className="text-sm text-muted-foreground">{meta.subtitle}</p>
        </header>

        <div className="mb-8 flex justify-center">
          <ClubPicker value={selectedClub} onChange={setSelectedClub} tagline={meta.tagline} />
        </div>

        {desktop.length > 0 && (
          <ChannelSection
            icon={Monitor}
            title="WebApp · Escritorio"
            description="Gestión y operaciones. Sidebar + topbar."
          >
            <div
              className={
                desktop.length >= 3
                  ? "grid gap-3 sm:grid-cols-3"
                  : "grid gap-3 sm:grid-cols-2"
              }
            >
              {desktop.map((p) => (
                <ProfileCard key={p.id} profile={p} onSelect={enter} />
              ))}
            </div>
          </ChannelSection>
        )}

        {mobile.length > 0 && (
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
        )}
      </div>
    </div>
  );
}

// ----- Club picker popover --------------------------------------------------

function ClubPicker({
  value,
  onChange,
  tagline,
}: {
  value: ClubKey;
  onChange: (id: ClubKey) => void;
  tagline: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const club = CLUBS[value];
  const logo = club.brand.logoMark ?? (value === "saito" ? saitoMark : undefined);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} dir="ltr" lang="en" className="relative w-full max-w-md">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left shadow-sm transition hover:shadow-md"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Seleccionar entidad demo"
      >
        {logo ? (
          <img
            src={logo}
            alt=""
            aria-hidden="true"
            className="h-10 w-10 rounded-lg bg-muted/40 object-contain p-1"
          />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            {club.brand.shortName.slice(0, 3)}
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Entidad demo
          </span>
          <span className="block truncate text-sm font-semibold">{club.brand.name}</span>
          <span className="block truncate text-[11px] text-muted-foreground">{tagline}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-border bg-popover shadow-xl"
        >
          <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Elige una entidad
          </div>
          <ul className="pb-1">
            {CLUB_ORDER.map((id) => {
              const c = CLUBS[id];
              const active = id === value;
              const src = c.brand.logoMark ?? (id === "saito" ? saitoMark : undefined);
              const subtitle =
                id === "gff-demo"
                  ? "Demo · Gulf federation"
                  : `${c.seed.live ? "Live" : "Demo"} · ${c.brand.defaultLanguage.toUpperCase()}`;
              return (
                <li key={id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      onChange(id);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-muted ${
                      active ? "bg-primary/10" : ""
                    }`}
                  >
                    {src ? (
                      <img
                        src={src}
                        alt=""
                        aria-hidden="true"
                        className="h-8 w-8 rounded-lg bg-muted/40 object-contain p-0.5"
                      />
                    ) : (
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-[10px] font-bold text-primary">
                        {c.brand.shortName.slice(0, 3)}
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{c.brand.name}</span>
                      <span className="block truncate text-[11px] text-muted-foreground">
                        {subtitle}
                      </span>
                    </span>
                    {active && <Check className="h-4 w-4 text-primary" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
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

