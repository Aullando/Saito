import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import saitoFullLogo from "@/assets/brand/saito-logo-frase.png";
import { useAuth as useLocalAuth } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { useActiveClubStore } from "@/clubs/activeClub";
import { CLUBS } from "@/clubs/registry";
import { useTr, useLang } from "@/lib/i18n";
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
type ClubKey = "saito" | "rgcc" | "gff-demo" | "cnso";

type DemoProfile = {
  id: string;
  userId: string;
  title: string;
  subtitle: string;
  title_en?: string;
  subtitle_en?: string;
  title_sr?: string;
  subtitle_sr?: string;
  surface: "desktop" | "mobile";
  module: ModuleKey;
  icon: LucideIcon;
  /** Optional route override; otherwise dashboard/mobile by surface. */
  to?: string;
};

function pickProfile(p: DemoProfile, lang: "es" | "en" | "sr"): DemoProfile {
  if (lang === "en") return { ...p, title: p.title_en ?? p.title, subtitle: p.subtitle_en ?? p.subtitle };
  if (lang === "sr") return { ...p, title: p.title_sr ?? p.title_en ?? p.title, subtitle: p.subtitle_sr ?? p.subtitle_en ?? p.subtitle };
  return p;
}

const SAITO_PROFILES: DemoProfile[] = [
  {
    id: "mgr", userId: "u-mgr",
    title: "Gestor / Dirección", subtitle: "Dashboard de club, KPIs, secciones y decisiones",
    title_en: "Management", subtitle_en: "Club dashboard, KPIs, sections and decisions",
    title_sr: "Uprava", subtitle_sr: "Kontrolna tabla kluba, KPI, sekcije i odluke",
    surface: "desktop", module: "admin", icon: Briefcase,
  },
  {
    id: "adm", userId: "u-adm",
    title: "Administración", subtitle: "Usuarios, cuotas, pagos, calendario y circulares",
    title_en: "Administration", subtitle_en: "Users, fees, payments, calendar and circulars",
    title_sr: "Administracija", subtitle_sr: "Korisnici, članarine, plaćanja, kalendar i obaveštenja",
    surface: "desktop", module: "admin", icon: Wallet,
  },
  {
    id: "med", userId: "u-med",
    title: "Staff médico", subtitle: "Ficha de salud, incidencias, restricciones y citas",
    title_en: "Medical staff", subtitle_en: "Health record, incidents, restrictions and appointments",
    title_sr: "Medicinsko osoblje", subtitle_sr: "Zdravstveni karton, incidenti, ograničenja i termini",
    surface: "desktop", module: "wellbeing", icon: Stethoscope,
  },
  {
    id: "tec", userId: "u-tec",
    title: "Entrenador", subtitle: "Sesión, asistencia, convocatoria, notas e IA",
    title_en: "Coach", subtitle_en: "Session, attendance, call-up, notes and AI",
    title_sr: "Trener", subtitle_sr: "Sesija, prisustvo, poziv, beleške i AI",
    surface: "mobile", module: "coaching", icon: Dumbbell,
  },
  {
    id: "ath", userId: "u-ath",
    title: "Atleta", subtitle: "Calendario, ausencias, feedback, salud y notis",
    title_en: "Athlete", subtitle_en: "Calendar, absences, feedback, health and notifications",
    title_sr: "Sportista", subtitle_sr: "Kalendar, odsustva, povratna informacija, zdravlje i obaveštenja",
    surface: "mobile", module: "sportlife", icon: User,
  },
];

const RGCC_PROFILES: DemoProfile[] = [
  {
    id: "rgcc-mgr", userId: "u-mgr",
    title: "Dirección RGCC", subtitle: "Dashboard de club, secciones polideportivas y socios",
    title_en: "RGCC Management", subtitle_en: "Club dashboard, multi-sport sections and members",
    title_sr: "Uprava RGCC", subtitle_sr: "Kontrolna tabla kluba, višesportske sekcije i članovi",
    surface: "desktop", module: "admin", icon: Briefcase,
  },
  {
    id: "rgcc-adm", userId: "u-adm",
    title: "Administración", subtitle: "Cuotas, pagos, calendario y comunicaciones de socio",
    title_en: "Administration", subtitle_en: "Fees, payments, calendar and member communications",
    title_sr: "Administracija", subtitle_sr: "Članarine, plaćanja, kalendar i komunikacija sa članovima",
    surface: "desktop", module: "admin", icon: Wallet,
  },
  {
    id: "rgcc-tec", userId: "u-tec",
    title: "Entrenador", subtitle: "Clases, asistencia y entrenamiento personal",
    title_en: "Coach", subtitle_en: "Classes, attendance and personal training",
    title_sr: "Trener", subtitle_sr: "Časovi, prisustvo i personalni trening",
    surface: "mobile", module: "coaching", icon: Dumbbell, to: "/rgcc/mi-dia",
  },
  {
    id: "rgcc-ath", userId: "u-ath",
    title: "Socio / Atleta", subtitle: "Mi día, clases, reservas y comunicaciones",
    title_en: "Member / Athlete", subtitle_en: "My day, classes, bookings and communications",
    title_sr: "Član / Sportista", subtitle_sr: "Moj dan, časovi, rezervacije i komunikacija",
    surface: "mobile", module: "sportlife", icon: User, to: "/rgcc/mi-dia",
  },
];

const GFF_PROFILES: DemoProfile[] = [
  {
    id: "gff-pres", userId: "u-mgr",
    title: "President · الرئيس",
    subtitle: "Federation overview, FIFA/AFC ranking and national teams",
    title_en: "President · الرئيس",
    subtitle_en: "Federation overview, FIFA/AFC ranking and national teams",
    title_sr: "Predsednik · الرئيس",
    subtitle_sr: "Pregled federacije, FIFA/AFC rang i nacionalne selekcije",
    surface: "desktop", module: "admin", icon: Crown,
  },
  {
    id: "gff-sg", userId: "u-adm",
    title: "General Secretary · الأمين العام",
    subtitle: "Affiliated clubs, calendar windows and administration",
    title_en: "General Secretary · الأمين العام",
    subtitle_en: "Affiliated clubs, calendar windows and administration",
    title_sr: "Generalni sekretar · الأمين العام",
    subtitle_sr: "Pridruženi klubovi, kalendarski prozori i administracija",
    surface: "desktop", module: "admin", icon: ClipboardList,
  },
  {
    id: "gff-tech", userId: "u-mgr",
    title: "Technical Director · المدير الفني",
    subtitle: "Squad, staff, matches and development pathways",
    title_en: "Technical Director · المدير الفني",
    subtitle_en: "Squad, staff, matches and development pathways",
    title_sr: "Tehnički direktor · المدير الفني",
    subtitle_sr: "Selekcija, osoblje, utakmice i razvojni programi",
    surface: "desktop", module: "coaching", icon: BarChart3,
  },
  {
    id: "gff-coach", userId: "u-tec",
    title: "National Team Coach · مدرب المنتخب",
    subtitle: "Convocatoria, sesiones y notas del cuerpo técnico",
    title_en: "National Team Coach · مدرب المنتخب",
    subtitle_en: "Call-up, sessions and technical staff notes",
    title_sr: "Selektor · مدرب المنتخب",
    subtitle_sr: "Poziv, sesije i beleške tehničkog osoblja",
    surface: "mobile", module: "coaching", icon: Dumbbell,
  },
  {
    id: "gff-player", userId: "u-ath",
    title: "National Team Player · لاعب المنتخب",
    subtitle: "Calendario, convocatorias, feedback y comunicaciones",
    title_en: "National Team Player · لاعب المنتخب",
    subtitle_en: "Calendar, call-ups, feedback and communications",
    title_sr: "Reprezentativac · لاعب المنتخب",
    subtitle_sr: "Kalendar, pozivi, povratna informacija i komunikacija",
    surface: "mobile", module: "sportlife", icon: User,
  },
];

const CNSO_PROFILES: DemoProfile[] = [
  {
    id: "cnso-mgr", userId: "u-mgr",
    title: "Dirección CNSO", subtitle: "Dashboard del club, secciones acuáticas y socios",
    title_en: "CNSO Management", subtitle_en: "Club dashboard, aquatic sections and members",
    title_sr: "Uprava CNSO", subtitle_sr: "Kontrolna tabla kluba, sekcije vodenih sportova i članovi",
    surface: "desktop", module: "admin", icon: Briefcase, to: "/cnso/direccion",
  },
  {
    id: "cnso-adm", userId: "u-adm",
    title: "Administración", subtitle: "Cuotas, calles, calendario y comunicaciones",
    title_en: "Administration", subtitle_en: "Fees, lanes, calendar and communications",
    title_sr: "Administracija", subtitle_sr: "Članarine, staze, kalendar i komunikacija",
    surface: "desktop", module: "admin", icon: Wallet, to: "/cnso/socio",
  },
  {
    id: "cnso-med", userId: "u-med",
    title: "Staff médico", subtitle: "Aptitud, restricciones e incidencias de nadadores",
    title_en: "Medical staff", subtitle_en: "Fitness, restrictions and swimmers' incidents",
    title_sr: "Medicinsko osoblje", subtitle_sr: "Sposobnost, ograničenja i incidenti plivača",
    surface: "desktop", module: "wellbeing", icon: Stethoscope, to: "/cnso/incidencias",
  },
  {
    id: "cnso-tec", userId: "u-tec",
    title: "Entrenador de natación", subtitle: "Calle de agua, sesiones, asistencia y notas",
    title_en: "Swimming coach", subtitle_en: "Water lane, sessions, attendance and notes",
    title_sr: "Trener plivanja", subtitle_sr: "Staza, sesije, prisustvo i beleške",
    surface: "mobile", module: "coaching", icon: Dumbbell,
  },
  {
    id: "cnso-ath", userId: "u-ath",
    title: "Nadador / Socio", subtitle: "Mi día, sesiones, marcas y competiciones",
    title_en: "Swimmer / Member", subtitle_en: "My day, sessions, times and competitions",
    title_sr: "Plivač / Član", subtitle_sr: "Moj dan, sesije, vremena i takmičenja",
    surface: "mobile", module: "sportlife", icon: User,
  },
];



const PROFILES_BY_CLUB: Record<ClubKey, DemoProfile[]> = {
  saito: SAITO_PROFILES,
  rgcc: RGCC_PROFILES,
  "gff-demo": GFF_PROFILES,
  cnso: CNSO_PROFILES,
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

const CLUB_ORDER: ClubKey[] = ["saito", "rgcc", "cnso", "gff-demo"];

function isClubKey(v: string | null | undefined): v is ClubKey {
  return v === "saito" || v === "rgcc" || v === "gff-demo" || v === "cnso";
}

type ClubMeta = { tagline: string; subtitle: string };
const CLUB_META: Record<"es" | "en" | "sr", Record<ClubKey, ClubMeta>> = {
  es: {
    saito: { tagline: "Plataforma deportiva SAITO", subtitle: "Elige tu rol. Cada rol entra al canal correcto: escritorio o móvil." },
    rgcc: { tagline: "Real Grupo de Cultura Covadonga", subtitle: "Demo multi-sección polideportiva basada en SAITO." },
    cnso: { tagline: "Club Natación Santa Olaya", subtitle: "Demo enfocada a natación, waterpolo, sincro, triatlón y aguas abiertas." },
    "gff-demo": { tagline: "Gulf Football Federation · Demo", subtitle: "Federación ficticia. Workspace internacional en árabe RTL." },
  },
  en: {
    saito: { tagline: "SAITO sports platform", subtitle: "Pick your role. Each role opens the right channel: desktop or mobile." },
    rgcc: { tagline: "Real Grupo de Cultura Covadonga", subtitle: "Multi-sport demo based on SAITO." },
    cnso: { tagline: "Club Natación Santa Olaya", subtitle: "Demo focused on swimming, water polo, synchro, triathlon and open water." },
    "gff-demo": { tagline: "Gulf Football Federation · Demo", subtitle: "Fictional federation. International RTL Arabic workspace." },
  },
  sr: {
    saito: { tagline: "SAITO sportska platforma", subtitle: "Izaberite ulogu. Svaka uloga otvara odgovarajući kanal: desktop ili mobilni." },
    rgcc: { tagline: "Real Grupo de Cultura Covadonga", subtitle: "Višesportska demo bazirana na SAITO." },
    cnso: { tagline: "Club Natación Santa Olaya", subtitle: "Demo fokusirana na plivanje, vaterpolo, sinhrono, triatlon i otvorene vode." },
    "gff-demo": { tagline: "Gulf Football Federation · Demo", subtitle: "Fiktivna federacija. Internacionalni RTL arapski radni prostor." },
  },
};

function LoginPage() {
  useAuth();
  const navigate = useNavigate();
  const tr = useTr();
  const lang = useLang();
  const setUser = useLocalAuth((s) => s.setUser);
  const switchClub = useActiveClubStore((s) => s.switchClub);
  const activeClubId = useActiveClubStore((s) => s.overrideClubId);
  const [selectedClub, setSelectedClub] = useState<ClubKey>(
    isClubKey(activeClubId) ? activeClubId : "saito",
  );

  const idx = CLUB_ORDER.indexOf(selectedClub);
  const prevClub = idx > 0 ? CLUB_ORDER[idx - 1] : null;
  const nextClub = idx >= 0 && idx < CLUB_ORDER.length - 1 ? CLUB_ORDER[idx + 1] : null;

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

  const profiles = PROFILES_BY_CLUB[selectedClub].map((p) => pickProfile(p, lang));
  const desktop = profiles.filter((p) => p.surface === "desktop");
  const mobile = profiles.filter((p) => p.surface === "mobile");
  const meta = CLUB_META[lang][selectedClub];

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col items-center gap-1 text-center">
          <img
            src={saitoFullLogo}
            alt="SAITO"
            style={{ height: 44 }}
            className="shrink-0 object-contain"
          />
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            powered by Gemini
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">{tr("Ver SAITO como…", "View SAITO as…", "Pogledajte SAITO kao…")}</h1>
          <p className="text-sm text-muted-foreground">{meta.subtitle}</p>
        </header>



        <div className="mb-3 flex flex-col items-center gap-3">
          <ClubPicker value={selectedClub} onChange={setSelectedClub} tagline={meta.tagline} tr={tr} />
        </div>

        {/* Tour guiado: SAITO → RGCC → CNSO → GFF */}
        <div className="mb-8 flex items-center justify-center gap-3 text-xs text-muted-foreground">
          <button
            type="button"
            onClick={() => prevClub && setSelectedClub(prevClub)}
            disabled={!prevClub}
            className="flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={tr("Entidad anterior", "Previous entity", "Prethodni entitet")}
          >
            ← {tr("Anterior", "Previous", "Prethodno")}
          </button>
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {CLUB_ORDER.map((id, i) => (
              <span
                key={id}
                className={`h-1.5 rounded-full transition-all ${
                  i === idx ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <span className="font-medium">
            {tr("Paso", "Step", "Korak")} {idx + 1} {tr("de", "of", "od")} {CLUB_ORDER.length}
          </span>
          <button
            type="button"
            onClick={() => nextClub && setSelectedClub(nextClub)}
            disabled={!nextClub}
            className="flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={tr("Siguiente entidad", "Next entity", "Sledeći entitet")}
          >
            {tr("Siguiente", "Next", "Sledeće")} →
          </button>
        </div>

        {desktop.length > 0 && (
          <ChannelSection
            icon={Monitor}
            title={tr("WebApp · Escritorio", "WebApp · Desktop", "WebApp · Desktop")}
            description={tr("Gestión y operaciones. Sidebar + topbar.", "Management and operations. Sidebar + topbar.", "Upravljanje i operacije. Bočna traka + gornja traka.")}
          >
            <div
              className={
                desktop.length >= 3 ? "grid gap-3 sm:grid-cols-3" : "grid gap-3 sm:grid-cols-2"
              }
            >
              {desktop.map((p) => (
                <ProfileCard key={p.id} profile={p} onSelect={enter} tr={tr} />
              ))}
            </div>
          </ChannelSection>
        )}

        {mobile.length > 0 && (
          <ChannelSection
            icon={Smartphone}
            title={tr("App móvil", "Mobile app", "Mobilna aplikacija")}
            description={tr("Frame 390 px. Solo entrenador y atleta.", "Frame 390 px. Coach and athlete only.", "Frame 390 px. Samo trener i sportista.")}
            className="mt-10"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {mobile.map((p) => (
                <ProfileCard key={p.id} profile={p} onSelect={enter} tr={tr} />
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
