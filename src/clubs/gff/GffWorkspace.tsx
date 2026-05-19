import { useMemo, useState, type ReactNode } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Trophy,
  CalendarDays,
  Building2,
  GraduationCap,
  BarChart3,
  Shield,
  Users,
  ChevronLeft,
  ChevronRight,
  Crown,
  Briefcase,
  Activity,
  Award,
  Tent,
  Map,
} from "lucide-react";
import { Card, Pill } from "@/components/ui-kit";
import { cn } from "@/lib/utils";
import { GFFBadge } from "./GFFBadge";
import { useGffTranslation } from "./translations";
import {
  gffFederation,
  gffTeams,
  gffPlayers,
  gffStaff,
  gffMatches,
  gffStats,
  gffAffiliatedClubs,
  type GffTeam,
  type GffMatch,
} from "./seed";

export type GffView =
  | "dashboard"
  | "national-teams"
  | "calendar"
  | "clubs"
  | "development"
  | "reporting"
  | "administration";

const VIEWS: GffView[] = [
  "dashboard",
  "national-teams",
  "calendar",
  "clubs",
  "development",
  "reporting",
  "administration",
];

// Helper: wrap any latin/number content so RTL paragraphs don't reverse it.
function N({ children }: { children: ReactNode }) {
  return <bdi className="font-semibold tabular-nums">{children}</bdi>;
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

// ----- Internal workspace header ----------------------------------------
function WorkspaceHero({
  selectedTeam,
  onSelectTeam,
}: {
  selectedTeam: GffTeam;
  onSelectTeam: (t: GffTeam) => void;
}) {
  return (
    <div className="gff-accent-card relative overflow-hidden p-6 sm:p-7">
      <div className="absolute -end-12 -top-12 h-48 w-48 rounded-full bg-[var(--gff-gold)] opacity-15 blur-2xl" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="shrink-0 rounded-2xl bg-white/8 p-2 ring-1 ring-white/15">
          <GFFBadge size={92} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[var(--gff-gold)]/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--gff-gold)]">
              GFF · Demo
            </span>
            <span className="text-[11px] text-white/70">
              Demo workspace · Fictional federation &amp; data
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">
            {gffFederation.nameAr}
          </h1>
          <p className="mt-0.5 text-sm text-white/70">{gffFederation.nameLatin}</p>
          <p className="mt-2 text-xs italic text-[var(--gff-gold)]">
            « {gffFederation.mottoAr} » · {gffFederation.mottoLatin}
          </p>
        </div>
        <div className="shrink-0">
          <TeamSwitcher selected={selectedTeam} onSelect={onSelectTeam} />
        </div>
      </div>
    </div>
  );
}

function TeamSwitcher({
  selected,
  onSelect,
}: {
  selected: GffTeam;
  onSelect: (t: GffTeam) => void;
}) {
  return (
    <div className="inline-flex flex-col gap-1 rounded-2xl bg-white/8 p-1 ring-1 ring-white/15">
      {gffTeams.map((t) => {
        const active = t.id === selected.id;
        return (
          <button
            key={t.id}
            onClick={() => onSelect(t)}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold transition",
              active
                ? "bg-[var(--gff-gold)] text-[var(--gff-ink)] shadow-sm"
                : "text-white/85 hover:bg-white/10",
            )}
          >
            {t.nameAr}
          </button>
        );
      })}
    </div>
  );
}

// ----- Internal section nav --------------------------------------------
function InternalNav({
  view,
  onChange,
}: {
  view: GffView;
  onChange: (v: GffView) => void;
}) {
  const { t } = useGffTranslation();
  const items: { view: GffView; label: string; icon: typeof Shield }[] = [
    { view: "dashboard", label: t("dashboard"), icon: Shield },
    { view: "national-teams", label: t("nationalTeams"), icon: Trophy },
    { view: "calendar", label: t("internationalCalendar"), icon: CalendarDays },
    { view: "clubs", label: t("affiliatedClubs"), icon: Building2 },
    { view: "development", label: t("development"), icon: GraduationCap },
    { view: "reporting", label: t("reporting"), icon: BarChart3 },
    { view: "administration", label: t("administration"), icon: Briefcase },
  ];
  return (
    <div className="mt-4 -mx-1 overflow-x-auto px-1 pb-1">
      <div className="inline-flex gap-1 rounded-2xl border border-border bg-card p-1 shadow-sm">
        {items.map((it) => {
          const Icon = it.icon;
          const active = view === it.view;
          return (
            <button
              key={it.view}
              onClick={() => onChange(it.view)}
              className={cn(
                "inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-semibold transition",
                active
                  ? "bg-[var(--gff-green)] text-white shadow"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              <Icon className="h-4 w-4" />
              {it.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// Main workspace
// ============================================================================
export function GffWorkspace({ view: viewProp }: { view?: string }) {
  const initialView: GffView = useMemo(() => {
    const v = (viewProp ?? "dashboard") as GffView;
    return VIEWS.includes(v) ? v : "dashboard";
  }, [viewProp]);

  const [view, setView] = useState<GffView>(initialView);
  const [selectedTeam, setSelectedTeam] = useState<GffTeam>(gffTeams[0]);

  return (
    <div className="space-y-5 text-start">
      <WorkspaceHero selectedTeam={selectedTeam} onSelectTeam={setSelectedTeam} />
      <InternalNav view={view} onChange={setView} />

      <div className="pt-1">
        {view === "dashboard" && (
          <DashboardView
            onOpenTeam={(team) => {
              setSelectedTeam(team);
              setView("national-teams");
            }}
          />
        )}
        {view === "national-teams" && <NationalTeamsView team={selectedTeam} />}
        {view === "calendar" && <CalendarView />}
        {view === "clubs" && <ClubsView />}
        {view === "development" && <DevelopmentView />}
        {view === "reporting" && <ReportingView />}
        {view === "administration" && <AdministrationView />}
      </div>
    </div>
  );
}

// ============================================================================
// Dashboard
// ============================================================================
function DashboardView({ onOpenTeam }: { onOpenTeam: (t: GffTeam) => void }) {
  const { t } = useGffTranslation();
  const senior = gffTeams[0];
  const u23 = gffTeams[1];
  const lastSenior = gffMatches.find((m) => m.teamId === senior.id && m.status === "recent");
  const nextSenior = gffMatches.find((m) => m.teamId === senior.id && m.status === "upcoming");
  const lastU23 = gffMatches.find((m) => m.teamId === u23.id && m.status === "recent");
  const nextU23 = gffMatches.find((m) => m.teamId === u23.id && m.status === "upcoming");

  const windows = [
    { labelAr: "نافذة الفيفا", labelEn: "FIFA window", date: "2026-03-24" },
    { labelAr: "نافذة التصفيات الآسيوية", labelEn: "AFC qualifier window", date: "2026-06-07" },
    { labelAr: "معسكر تدريبي", labelEn: "Training camp", date: "2026-08-15" },
  ];

  return (
    <div className="space-y-5">
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <GffKpi
          icon={Building2}
          label={t("affiliatedClubsCount")}
          value={gffFederation.affiliatedClubs}
        />
        <GffKpi
          icon={Users}
          label={t("registeredPlayers")}
          value={gffFederation.registeredPlayers.toLocaleString("en")}
        />
        <GffKpi
          icon={Trophy}
          label={t("fifaRanking")}
          value={
            <span className="inline-flex items-center gap-1">
              <N>{senior.fifaRanking}</N>
              <span className="text-emerald-300">↑</span>
            </span>
          }
          tone="gold"
        />
        <GffKpi
          icon={Award}
          label={t("afcRanking")}
          value={<N>{senior.afcRanking}</N>}
          tone="green"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <TeamSummaryCard
          team={senior}
          last={lastSenior}
          next={nextSenior}
          onOpen={() => onOpenTeam(senior)}
        />
        <TeamSummaryCard
          team={u23}
          last={lastU23}
          next={nextU23}
          onOpen={() => onOpenTeam(u23)}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionTitle icon={CalendarDays} title={t("internationalCalendar")} />
          <ul className="divide-y divide-border">
            {windows.map((w) => (
              <li key={w.labelEn} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <div className="font-semibold">{w.labelAr}</div>
                  <div className="text-xs text-muted-foreground">{w.labelEn}</div>
                </div>
                <div className="rounded-xl bg-[var(--gff-green-soft)] px-3 py-1.5 text-sm font-semibold text-[var(--gff-green)]">
                  <N>{fmtDate(w.date)}</N>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <SectionTitle icon={GraduationCap} title={t("development")} />
          <ul className="space-y-3">
            <DevRow
              labelAr="لاعبو الناشئين"
              labelEn={t("youthPlayers", "en")}
              value={gffFederation.youthPlayers}
            />
            <DevRow
              labelAr="الأكاديميات المنتسبة"
              labelEn={t("affiliatedAcademies", "en")}
              value={gffFederation.affiliatedAcademies}
            />
            <DevRow
              labelAr="المدربون المعتمدون"
              labelEn={t("certifiedCoaches", "en")}
              value={gffFederation.certifiedCoaches}
            />
          </ul>
        </Card>
      </section>
    </div>
  );
}

function DevRow({
  labelAr,
  labelEn,
  value,
}: {
  labelAr: string;
  labelEn: string;
  value: number;
}) {
  return (
    <li className="flex items-center justify-between gap-2 rounded-xl bg-[var(--gff-green-soft)]/60 px-3 py-2.5">
      <div>
        <div className="text-sm font-semibold text-[var(--gff-ink)]">{labelAr}</div>
        <div className="text-[11px] text-muted-foreground">{labelEn}</div>
      </div>
      <span className="text-xl font-bold text-[var(--gff-green)] tabular-nums">
        <bdi>{value.toLocaleString("en")}</bdi>
      </span>
    </li>
  );
}

function TeamSummaryCard({
  team,
  last,
  next,
  onOpen,
}: {
  team: GffTeam;
  last?: GffMatch;
  next?: GffMatch;
  onOpen: () => void;
}) {
  const { t } = useGffTranslation();
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute -end-10 -top-10 h-32 w-32 rounded-full bg-[var(--gff-gold-soft)] opacity-70" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-[var(--gff-green)]">
            {team.category}
          </p>
          <h3 className="mt-1 text-xl font-bold">{team.nameAr}</h3>
          <p className="text-xs text-muted-foreground">{team.nameLatin}</p>
          {team.nicknameAr && (
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {team.nicknameAr} · {team.nicknameLatin}
            </p>
          )}
        </div>
        <button
          onClick={onOpen}
          className="rounded-full bg-[var(--gff-green)] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
        >
          {t("viewAll")}
        </button>
      </div>

      <div className="relative mt-3 text-sm">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {t("headCoach")}
        </div>
        <div className="font-semibold">{team.headCoachAr}</div>
        <div className="text-xs text-muted-foreground">{team.headCoachLatin}</div>
      </div>

      <div className="relative mt-3 grid grid-cols-2 gap-2">
        <MiniMatch label={t("recentMatches")} match={last} kind="recent" />
        <MiniMatch label={t("upcomingMatches")} match={next} kind="upcoming" />
      </div>
    </Card>
  );
}

function MiniMatch({
  label,
  match,
  kind,
}: {
  label: string;
  match?: GffMatch;
  kind: "recent" | "upcoming";
}) {
  if (!match) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/40 p-3 text-xs text-muted-foreground">
        {label}: —
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 truncate text-sm font-semibold">{match.opponentAr}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">
        <N>{fmtDate(match.date)}</N>
      </div>
      {kind === "recent" && match.scoreFor !== undefined && (
        <div className="mt-1.5 inline-flex items-center gap-1.5">
          <span className="rounded-md bg-[var(--gff-green-soft)] px-1.5 py-0.5 text-xs font-bold text-[var(--gff-green)]">
            <N>
              {match.scoreFor}–{match.scoreAgainst}
            </N>
          </span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {match.resultAr}
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// National teams
// ============================================================================
type NTTab = "squad" | "staff" | "matches" | "stats" | "camps";

function NationalTeamsView({ team }: { team: GffTeam }) {
  const { t } = useGffTranslation();
  const [tab, setTab] = useState<NTTab>("squad");
  const tabs: { id: NTTab; label: string }[] = [
    { id: "squad", label: t("squad") },
    { id: "staff", label: t("staff") },
    { id: "matches", label: t("matches") },
    { id: "stats", label: t("statistics") },
    { id: "camps", label: "جدول المعسكرات" },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-col gap-1">
          <p className="text-xs uppercase tracking-wider text-[var(--gff-green)]">
            {team.category}
          </p>
          <h2 className="text-2xl font-bold">{team.nameAr}</h2>
          <p className="text-sm text-muted-foreground">
            {team.nameLatin} · {t("headCoach")}: {team.headCoachAr}
          </p>
        </div>
      </Card>

      <div className="inline-flex gap-1 rounded-xl border border-border bg-card p-1">
        {tabs.map((tb) => {
          const active = tab === tb.id;
          return (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className={cn(
                "rounded-lg px-3.5 py-1.5 text-sm font-semibold transition",
                active
                  ? "bg-[var(--gff-gold)] text-[var(--gff-ink)]"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {tb.label}
            </button>
          );
        })}
      </div>

      {tab === "squad" && <SquadGrid teamId={team.id} />}
      {tab === "staff" && <StaffGrid teamId={team.id} />}
      {tab === "matches" && <MatchesList teamId={team.id} />}
      {tab === "stats" && <StatsPanel teamId={team.id} />}
      {tab === "camps" && <CampsList />}
    </div>
  );
}

function SquadGrid({ teamId }: { teamId: string }) {
  const { t } = useGffTranslation();
  const players = gffPlayers.filter((p) => p.teamId === teamId);
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {players.map((p) => (
        <Card key={p.id} className="!p-4">
          <div className="flex items-start gap-3">
            <Avatar initial={p.nameAr.charAt(0)} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="truncate text-base font-bold">{p.nameAr}</h4>
                {p.isCaptain && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--gff-gold-soft)] px-2 py-0.5 text-[10px] font-bold text-[#8a6a14]">
                    <Crown className="h-3 w-3" />
                    {t("captain")}
                  </span>
                )}
              </div>
              <p className="truncate text-xs text-muted-foreground">{p.nameLatin}</p>
              <p className="mt-1 text-xs font-semibold text-[var(--gff-green)]">
                {p.positionAr}
              </p>
              <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                <span>
                  {t("position", "en").slice(0, 1)}.{" "}
                  <bdi className="font-bold tabular-nums text-foreground">#{p.number}</bdi>
                </span>
                <span>
                  {t("age")}: <N>{p.age}</N>
                </span>
              </div>
              {p.note && (
                <p className="mt-1 text-[10px] italic text-muted-foreground">{p.note}</p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function StaffGrid({ teamId }: { teamId: string }) {
  const staff = gffStaff.filter((s) => s.teamId === teamId);
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {staff.map((s) => (
        <Card key={s.id} className="!p-4">
          <div className="flex items-start gap-3">
            <Avatar initial={s.nameAr.charAt(0)} tone="gold" />
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-base font-bold">{s.nameAr}</h4>
              <p className="truncate text-xs text-muted-foreground">{s.nameLatin}</p>
              <p className="mt-1 text-xs font-semibold text-[var(--gff-green)]">{s.roleAr}</p>
              <div className="mt-1.5 text-[11px] text-muted-foreground">
                {s.roleLatin} · {s.nationality} · <N>{s.age}</N>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function MatchesList({ teamId }: { teamId: string }) {
  const { t } = useGffTranslation();
  const recent = gffMatches.filter((m) => m.teamId === teamId && m.status === "recent");
  const upcoming = gffMatches.filter((m) => m.teamId === teamId && m.status === "upcoming");

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <SectionTitle icon={ChevronLeft} title={t("recentMatches")} />
        <ul className="space-y-2">
          {recent.map((m) => (
            <MatchRow key={m.id} match={m} />
          ))}
        </ul>
      </Card>
      <Card>
        <SectionTitle icon={ChevronRight} title={t("upcomingMatches")} />
        <ul className="space-y-2">
          {upcoming.map((m) => (
            <MatchRow key={m.id} match={m} />
          ))}
        </ul>
      </Card>
    </div>
  );
}

function MatchRow({ match }: { match: GffMatch }) {
  const isRecent = match.status === "recent";
  return (
    <li className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-sm font-bold">{match.opponentAr}</div>
          <div className="text-[11px] text-muted-foreground">{match.competitionAr}</div>
        </div>
        {isRecent && match.resultLatin ? (
          <Pill tone={resultTone(match.resultLatin)}>{match.resultAr}</Pill>
        ) : (
          <span className="rounded-full bg-[var(--gff-green-soft)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--gff-green)]">
            <N>{fmtDate(match.date)}</N>
          </span>
        )}
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>
          {match.venueLatin} · {match.homeAway}
        </span>
        {isRecent && match.scoreFor !== undefined && (
          <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-bold text-foreground">
            <N>
              {match.scoreFor}–{match.scoreAgainst}
            </N>
          </span>
        )}
      </div>
    </li>
  );
}

function resultTone(r: "victory" | "draw" | "defeat"): "success" | "info" | "danger" {
  if (r === "victory") return "success";
  if (r === "draw") return "info";
  return "danger";
}

function StatsPanel({ teamId }: { teamId: string }) {
  const { t } = useGffTranslation();
  const s = gffStats.find((x) => x.teamId === teamId);
  if (!s) return null;
  const chartData = [
    { name: t("wins"), value: s.wins, fill: "#0a6b4f" },
    { name: t("draws"), value: s.draws, fill: "#d4af37" },
    { name: t("losses"), value: s.losses, fill: "#b94a3a" },
  ];
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatBox label={t("matches")} value={s.played} />
        <StatBox label={t("wins")} value={s.wins} tone="green" />
        <StatBox label={t("draws")} value={s.draws} tone="gold" />
        <StatBox label={t("losses")} value={s.losses} tone="red" />
        <StatBox label={t("goalsScored")} value={s.goalsFor} tone="green" />
        <StatBox label={t("goalsConceded")} value={s.goalsAgainst} tone="red" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionTitle icon={Activity} title={t("statistics")} />
          <div className="h-56" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF2" />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} allowDecimals={false} />
                <Tooltip cursor={{ fill: "rgba(10,107,79,0.08)" }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <SectionTitle icon={Trophy} title={t("topScorer")} />
          <div className="rounded-xl bg-[var(--gff-gold-soft)] p-3">
            <div className="text-base font-bold">{s.topScorer}</div>
            <div className="mt-1 text-[11px] uppercase tracking-wider text-[#8a6a14]">
              {t("goalsScored")}
            </div>
            <div className="text-3xl font-extrabold text-[var(--gff-gold)]">
              <N>{s.topScorerGoals}</N>
            </div>
          </div>
          {s.topAssister && (
            <div className="mt-3 rounded-xl bg-[var(--gff-green-soft)] p-3">
              <div className="text-base font-bold">{s.topAssister}</div>
              <div className="mt-1 text-[11px] uppercase tracking-wider text-[var(--gff-green)]">
                {t("topAssister")}
              </div>
              <div className="text-3xl font-extrabold text-[var(--gff-green)]">
                <N>{s.topAssisterAssists}</N>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "green" | "gold" | "red";
}) {
  const toneCls =
    tone === "green"
      ? "text-[var(--gff-green)]"
      : tone === "gold"
        ? "text-[var(--gff-gold)]"
        : tone === "red"
          ? "text-[#b94a3a]"
          : "text-foreground";
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className={cn("mt-1 text-2xl font-bold tabular-nums", toneCls)}>
        <bdi>{value}</bdi>
      </div>
    </div>
  );
}

function CampsList() {
  const camps = [
    { ar: "معسكر مدينة الخليج", en: "Madinat Al-Khaleej camp", date: "2026-05-10", dur: 14 },
    { ar: "معسكر الدوحة", en: "Doha camp", date: "2026-07-02", dur: 10 },
    { ar: "معسكر لشبونة", en: "Lisbon camp", date: "2026-08-15", dur: 12 },
  ];
  return (
    <Card>
      <SectionTitle icon={Tent} title="جدول المعسكرات" />
      <ul className="divide-y divide-border">
        {camps.map((c) => (
          <li key={c.en} className="flex items-center justify-between gap-3 py-3">
            <div>
              <div className="font-semibold">{c.ar}</div>
              <div className="text-xs text-muted-foreground">{c.en}</div>
            </div>
            <div className="text-end">
              <div className="text-sm font-bold">
                <N>{fmtDate(c.date)}</N>
              </div>
              <div className="text-[11px] text-muted-foreground">
                <N>{c.dur}</N> أيام
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

// ============================================================================
// Calendar view
// ============================================================================
function CalendarView() {
  const { t } = useGffTranslation();
  const items = [
    { ar: "نافذة الفيفا — مباريات ودية", en: "FIFA window — friendlies", date: "2026-03-24", kind: "FIFA" },
    { ar: "تصفيات آسيوية (الجولة 3)", en: "AFC qualifier (matchday 3)", date: "2026-06-07", kind: "AFC" },
    { ar: "تصفيات آسيوية (الجولة 4)", en: "AFC qualifier (matchday 4)", date: "2026-06-12", kind: "AFC" },
    { ar: "معسكر تدريبي صيفي", en: "Summer training camp", date: "2026-08-15", kind: "CAMP" },
    { ar: "نافذة الفيفا — خريف", en: "FIFA window — autumn", date: "2026-09-04", kind: "FIFA" },
    { ar: "تصفيات تحت 23 (الجولة 5)", en: "U-23 qualifier (matchday 5)", date: "2026-10-10", kind: "AFC" },
  ];
  return (
    <div className="space-y-4">
      <Card>
        <SectionTitle icon={CalendarDays} title={t("internationalCalendar")} />
        <ul className="divide-y divide-border">
          {items.map((it) => (
            <li
              key={it.en}
              className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <KindBadge kind={it.kind as "FIFA" | "AFC" | "CAMP"} />
                <div>
                  <div className="font-semibold">{it.ar}</div>
                  <div className="text-xs text-muted-foreground">{it.en}</div>
                </div>
              </div>
              <div className="text-sm font-bold text-[var(--gff-ink)]">
                <N>{fmtDate(it.date)}</N>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function KindBadge({ kind }: { kind: "FIFA" | "AFC" | "CAMP" }) {
  const cls =
    kind === "FIFA"
      ? "bg-[var(--gff-green-soft)] text-[var(--gff-green)]"
      : kind === "AFC"
        ? "bg-[var(--gff-gold-soft)] text-[#8a6a14]"
        : "bg-muted text-foreground";
  return (
    <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", cls)}>
      {kind}
    </span>
  );
}

// ============================================================================
// Affiliated clubs
// ============================================================================
function ClubsView() {
  const { t } = useGffTranslation();
  return (
    <div className="space-y-3">
      <Card>
        <SectionTitle icon={Building2} title={t("affiliatedClubs")} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {gffAffiliatedClubs.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 transition hover:shadow-sm"
            >
              <ClubCrest color={c.color} initials={c.initialsAr} />
              <div className="min-w-0">
                <div className="truncate font-bold">{c.nameAr}</div>
                <div className="truncate text-xs text-muted-foreground">{c.nameLatin}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ClubCrest({ color, initials }: { color: string; initials: string }) {
  return (
    <div
      className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-base font-bold text-white shadow-inner ring-2 ring-white"
      style={{
        background: `linear-gradient(135deg, ${color}, color-mix(in oklab, ${color} 65%, black))`,
      }}
    >
      <bdi>{initials}</bdi>
    </div>
  );
}

// ============================================================================
// Development
// ============================================================================
function DevelopmentView() {
  const { t } = useGffTranslation();
  const programs = [
    {
      titleAr: "برنامج المواهب الوطنية",
      titleEn: "National talent programme",
      bodyAr: "تحديد وتطوير المواهب الشابة في جميع أنحاء منطقة الخليج عبر شبكة الكشافة.",
      icon: Trophy,
      stat: gffFederation.youthPlayers,
      statLabelAr: "ناشئ",
    },
    {
      titleAr: "أكاديميات النخبة",
      titleEn: "Elite academies",
      bodyAr: "شبكة معتمدة من الأكاديميات تعمل وفق منهج فني موحّد.",
      icon: GraduationCap,
      stat: gffFederation.affiliatedAcademies,
      statLabelAr: "أكاديمية",
    },
    {
      titleAr: "اعتماد المدربين",
      titleEn: "Coach certification",
      bodyAr: "مسارات اعتماد على مستويات A وB وC وفق معايير الاتحاد الآسيوي.",
      icon: Shield,
      stat: gffFederation.certifiedCoaches,
      statLabelAr: "مدرب معتمد",
    },
  ];
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-3">
        {programs.map((p) => {
          const Icon = p.icon;
          return (
            <Card key={p.titleEn} className="relative overflow-hidden !p-5">
              <div className="absolute -end-8 -top-8 h-28 w-28 rounded-full bg-[var(--gff-green-soft)]" />
              <div className="relative flex items-start gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--gff-green)] text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold">{p.titleAr}</h3>
                  <p className="text-xs text-muted-foreground">{p.titleEn}</p>
                </div>
              </div>
              <p className="relative mt-3 text-sm text-foreground/80">{p.bodyAr}</p>
              <div className="relative mt-4 inline-flex items-baseline gap-1 rounded-full bg-[var(--gff-gold-soft)] px-3 py-1 text-[#8a6a14]">
                <span className="text-2xl font-extrabold tabular-nums">
                  <bdi>{p.stat}</bdi>
                </span>
                <span className="text-xs font-semibold">{p.statLabelAr}</span>
              </div>
            </Card>
          );
        })}
      </div>
      <Card>
        <SectionTitle icon={GraduationCap} title={t("development")} />
        <p className="text-sm text-foreground/75">
          مساحة عمل تجريبية لعرض مسارات تطوير اللاعبين والمدربين داخل اتحاد خليجي افتراضي.
          البيانات هنا تمثيلية وتُستخدم لأغراض العرض فقط.
        </p>
      </Card>
    </div>
  );
}

// ============================================================================
// Reporting
// ============================================================================
function ReportingView() {
  const { t } = useGffTranslation();
  const senior = gffStats[0];
  const u23 = gffStats[1];
  const data = [
    { name: senior.teamId, ar: gffTeams[0].nameAr, GF: senior.goalsFor, GA: senior.goalsAgainst },
    { name: u23.teamId, ar: gffTeams[1].nameAr, GF: u23.goalsFor, GA: u23.goalsAgainst },
  ];
  return (
    <div className="space-y-4">
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <GffKpi icon={Trophy} label={t("wins")} value={senior.wins + u23.wins} tone="green" />
        <GffKpi icon={Activity} label={t("draws")} value={senior.draws + u23.draws} tone="gold" />
        <GffKpi
          icon={BarChart3}
          label={t("goalsScored")}
          value={senior.goalsFor + u23.goalsFor}
          tone="green"
        />
        <GffKpi
          icon={Shield}
          label={t("goalsConceded")}
          value={senior.goalsAgainst + u23.goalsAgainst}
        />
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle icon={BarChart3} title={`${t("goalsScored")} / ${t("goalsConceded")}`} />
          <div className="h-64" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF2" />
                <XAxis dataKey="ar" fontSize={11} />
                <YAxis fontSize={11} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="GF" fill="#0a6b4f" radius={[6, 6, 0, 0]} />
                <Bar dataKey="GA" fill="#d4af37" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <SectionTitle icon={Trophy} title={`${t("topScorer")} · ${t("topAssister")}`} />
          <ul className="space-y-2">
            <li className="flex items-center justify-between rounded-xl bg-[var(--gff-green-soft)] px-3 py-2.5">
              <span className="font-semibold">{senior.topScorer}</span>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-[var(--gff-green)]">
                <N>{senior.topScorerGoals}</N>
              </span>
            </li>
            {senior.topAssister && (
              <li className="flex items-center justify-between rounded-xl bg-[var(--gff-gold-soft)] px-3 py-2.5">
                <span className="font-semibold">{senior.topAssister}</span>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-[#8a6a14]">
                  <N>{senior.topAssisterAssists}</N>
                </span>
              </li>
            )}
            <li className="flex items-center justify-between rounded-xl bg-[var(--gff-green-soft)] px-3 py-2.5">
              <span className="font-semibold">{u23.topScorer}</span>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-[var(--gff-green)]">
                <N>{u23.topScorerGoals}</N>
              </span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

// ============================================================================
// Administration
// ============================================================================
function AdministrationView() {
  const { t } = useGffTranslation();
  const rows = [
    { labelAr: t("president"), valueAr: gffFederation.presidentAr, sub: gffFederation.presidentLatin, icon: Crown },
    {
      labelAr: t("generalSecretary"),
      valueAr: gffFederation.generalSecretaryAr,
      sub: gffFederation.generalSecretaryLatin,
      icon: Briefcase,
    },
    {
      labelAr: "المقر الرئيسي",
      valueAr: gffFederation.headquartersAr,
      sub: `${gffFederation.headquartersLatin} · ${gffFederation.countryLatin}`,
      icon: Map,
    },
    {
      labelAr: t("founded"),
      valueAr: String(gffFederation.founded),
      sub: `${t("founded", "en")} · ${gffFederation.founded}`,
      icon: Award,
    },
  ];
  return (
    <div className="space-y-4">
      <Card>
        <SectionTitle icon={Briefcase} title="الإدارة الفيدرالية" />
        <p className="text-xs text-muted-foreground">
          Federal administration · {gffFederation.nameLatin}
        </p>
        <ul className="mt-3 divide-y divide-border">
          {rows.map((r) => {
            const Icon = r.icon;
            return (
              <li key={r.labelAr} className="flex items-center gap-3 py-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--gff-green-soft)] text-[var(--gff-green)]">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {r.labelAr}
                  </div>
                  <div className="truncate text-base font-bold">{r.valueAr}</div>
                  <div className="truncate text-xs text-muted-foreground">{r.sub}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
      <Card>
        <p className="text-sm text-foreground/75">
          هذه وحدة عرض تجريبية للإدارة الفيدرالية. ستتضمن النسخة الكاملة الأمانة العامة،
          واللجان الفنية، والمالية، والإعلام، وإدارة المسابقات.
        </p>
        <p className="mt-2 text-[11px] italic text-muted-foreground">
          Demo module · No real federation, person or organisation is represented.
        </p>
      </Card>
    </div>
  );
}

// ============================================================================
// Reusable bits
// ============================================================================
function GffKpi({
  icon: Icon,
  label,
  value,
  tone = "default",
}: {
  icon: typeof Shield;
  label: string;
  value: ReactNode;
  tone?: "default" | "green" | "gold";
}) {
  const accent =
    tone === "green"
      ? "bg-[var(--gff-green)] text-white"
      : tone === "gold"
        ? "bg-[var(--gff-gold)] text-[var(--gff-ink)]"
        : "bg-[var(--gff-green-soft)] text-[var(--gff-green)]";
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={cn("grid h-10 w-10 place-items-center rounded-xl", accent)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          <div className="mt-0.5 text-xl font-bold tabular-nums">{value}</div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: typeof Shield; title: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <div className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--gff-green-soft)] text-[var(--gff-green)]">
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">{title}</h3>
    </div>
  );
}

function Avatar({ initial, tone = "green" }: { initial: string; tone?: "green" | "gold" }) {
  const cls =
    tone === "gold"
      ? "bg-[var(--gff-gold)] text-[var(--gff-ink)]"
      : "bg-[var(--gff-green)] text-white";
  return (
    <div className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-full text-lg font-bold", cls)}>
      <bdi>{initial}</bdi>
    </div>
  );
}
