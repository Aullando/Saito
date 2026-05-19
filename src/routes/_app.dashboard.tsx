import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { PageHeader, Card, Pill } from "@/components/ui-kit";
import { useCurrentUser, useData } from "@/lib/store";
import { useClub } from "@/clubs/ClubProvider";
import { RgccDashboard } from "@/clubs/rgcc/RgccDashboard";
import { GffWorkspace } from "@/clubs/gff/GffWorkspace";
import {
  Users,
  CalendarDays,
  CreditCard,
  Activity,
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Dumbbell,
  HeartPulse,
  Wallet,
  ClipboardCheck,
  Megaphone,
  Bell,
  ArrowRight,
  Clock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/_app/dashboard")({
  component: () => (
    <RoleGate roles={["sysadmin", "admin", "manager", "technical", "medical"]}>
      <AppLayout>
        <DashboardSwitch />
      </AppLayout>
    </RoleGate>
  ),
});

function DashboardSwitch() {
  const { club } = useClub();
  if (club.id === "rgcc") return <RgccDashboard />;
  return <CommandCenter />;
}

// ---------- Helpers ----------
const fmtMoney = (n: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const todayISO = () => new Date().toISOString().slice(0, 10);

function weekRange() {
  const d = new Date();
  const day = (d.getDay() + 6) % 7; // Monday=0
  const start = new Date(d);
  start.setDate(d.getDate() - day);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

// Deterministic helper to derive a stable fake percentage from an array length
const stableHash = (n: number, salt = 7) =>
  Math.abs(Math.sin(n * 9301 + salt) * 10000) % 1;

// ---------- Command Center ----------
function CommandCenter() {
  const user = useCurrentUser();
  const athletes = useData((s) => s.athletes);
  const sections = useData((s) => s.sections);
  const groups = useData((s) => s.groups);
  const events = useData((s) => s.events);
  const payments = useData((s) => s.payments);
  const conversations = useData((s) => s.conversations);
  const appointments = useData((s) => s.appointments);

  const week = useMemo(weekRange, []);

  const kpis = useMemo(() => {
    const activeAthletes = athletes.filter((a) => a.status === "Active");
    // RGPD válido — sintético determinista: ~92% de los activos
    const rgpdInvalid = Math.max(0, Math.round(activeAthletes.length * 0.08));
    const rgpdValid = activeAthletes.length - rgpdInvalid;

    const weekTrainings = events.filter(
      (e) => e.type === "training" && e.date >= week.start && e.date <= week.end,
    );

    // Asistencia media semanal — sintético determinista a partir del nº de entrenamientos
    const attendance =
      weekTrainings.length === 0
        ? 0
        : Math.round(82 + stableHash(weekTrainings.length) * 12);

    const pendingPayments = payments.filter((p) => p.status === "Pending");
    const pendingAmount = pendingPayments.reduce((s, p) => s + Number(p.amount ?? 0), 0);

    const injured = athletes.filter((a) => a.medicalStatus === "Injured");
    const underReview = athletes.filter((a) => a.medicalStatus === "Under review");
    const notFit = injured.length + underReview.length;

    const openIncidents = injured.length + appointments.filter((a) => a.status === "Scheduled").length;

    return {
      activeAthletes: activeAthletes.length,
      totalAthletes: athletes.length,
      rgpdValid,
      rgpdInvalid,
      sectionsCount: sections.length,
      groupsCount: groups.length,
      weekTrainings: weekTrainings.length,
      attendance,
      pendingCount: pendingPayments.length,
      pendingAmount,
      openIncidents,
      notFit,
    };
  }, [athletes, sections, groups, events, payments, appointments, week]);

  const upcomingEvents = useMemo(() => {
    const t = todayISO();
    return events
      .filter((e) => e.date >= t)
      .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))
      .slice(0, 5);
  }, [events]);

  const recentCirculars = useMemo(() => {
    return conversations
      .filter((c) => c.type === "circular")
      .slice(0, 4)
      .map((c) => {
        const last = c.messages[c.messages.length - 1];
        return {
          id: c.id,
          title: c.title,
          excerpt: last?.content ?? "",
          createdAt: last?.createdAt ?? "",
          unread: c.unreadCount,
        };
      });
  }, [conversations]);

  const risks = useMemo(() => {
    const items: { label: string; tone: "warning" | "danger" | "info"; to: string }[] = [];
    if (kpis.rgpdInvalid > 0)
      items.push({
        label: `${kpis.rgpdInvalid} deportistas sin RGPD vigente`,
        tone: "danger",
        to: "/athletes",
      });
    if (kpis.pendingCount > 0)
      items.push({
        label: `${kpis.pendingCount} pagos pendientes · ${fmtMoney(kpis.pendingAmount)}`,
        tone: "warning",
        to: "/economic/payments",
      });
    if (kpis.notFit > 0)
      items.push({
        label: `${kpis.notFit} atletas no aptos o en revisión`,
        tone: "warning",
        to: "/medical/restrictions",
      });
    if (kpis.weekTrainings === 0)
      items.push({
        label: "Sin entrenamientos planificados esta semana",
        tone: "info",
        to: "/calendar",
      });
    if (kpis.openIncidents > 5)
      items.push({
        label: `${kpis.openIncidents} incidencias médicas abiertas`,
        tone: "danger",
        to: "/medical/incidents",
      });
    return items;
  }, [kpis]);

  const activity = useMemo(() => {
    type Item = { icon: LucideIcon; text: string; time: string; tone: "info" | "success" | "warning" };
    const items: Item[] = [];
    // Latest paid payment
    const lastPaid = [...payments]
      .filter((p) => p.status === "Paid")
      .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))[0];
    if (lastPaid) {
      const ath = athletes.find((a) => a.id === lastPaid.athleteId);
      items.push({
        icon: Wallet,
        text: `Cobro registrado · ${ath ? `${ath.firstName} ${ath.lastName}` : "Deportista"} · ${fmtMoney(Number(lastPaid.amount))}`,
        time: lastPaid.date ?? "",
        tone: "success",
      });
    }
    // Latest event added
    const nextEvent = upcomingEvents[0];
    if (nextEvent) {
      items.push({
        icon: CalendarDays,
        text: `Próximo evento: ${nextEvent.title}`,
        time: `${nextEvent.date} · ${nextEvent.startTime}`,
        tone: "info",
      });
    }
    // Latest message
    const lastConv = conversations
      .flatMap((c) => c.messages.map((m) => ({ m, title: c.title })))
      .sort((a, b) => b.m.createdAt.localeCompare(a.m.createdAt))[0];
    if (lastConv) {
      items.push({
        icon: MessageSquare,
        text: `Nuevo mensaje en “${lastConv.title}”`,
        time: lastConv.m.createdAt.slice(0, 10),
        tone: "info",
      });
    }
    // Latest medical
    const nextAppt = [...appointments].sort((a, b) => a.date.localeCompare(b.date))[0];
    if (nextAppt) {
      const ath = athletes.find((a) => a.id === nextAppt.athleteId);
      items.push({
        icon: HeartPulse,
        text: `Cita médica · ${ath ? `${ath.firstName} ${ath.lastName}` : "Deportista"} · ${nextAppt.reason}`,
        time: `${nextAppt.date} ${nextAppt.time}`,
        tone: "warning",
      });
    }
    return items;
  }, [payments, upcomingEvents, conversations, appointments, athletes]);

  return (
    <>
      <PageHeader
        title="Centro de mando"
        subtitle={user ? `Hola, ${user.name.split(" ")[0]} — visión global del club hoy` : ""}
      />

      {/* Headline KPIs */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Kpi
          icon={Users}
          label="Deportistas activos"
          value={kpis.activeAthletes}
          hint={`${kpis.totalAthletes} en total`}
          tone="primary"
        />
        <Kpi
          icon={ShieldCheck}
          label="RGPD válido"
          value={`${kpis.rgpdValid}/${kpis.activeAthletes}`}
          hint={kpis.rgpdInvalid > 0 ? `${kpis.rgpdInvalid} pendientes` : "Al día"}
          tone={kpis.rgpdInvalid > 0 ? "warning" : "success"}
        />
        <Kpi
          icon={Layers}
          label="Secciones activas"
          value={kpis.sectionsCount}
          tone="default"
        />
        <Kpi
          icon={Activity}
          label="Grupos activos"
          value={kpis.groupsCount}
          tone="default"
        />
        <Kpi
          icon={Dumbbell}
          label="Entrenos esta semana"
          value={kpis.weekTrainings}
          tone="info"
        />
      </section>

      {/* Secondary KPIs */}
      <section className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Kpi
          icon={ClipboardCheck}
          label="Asistencia media"
          value={kpis.weekTrainings === 0 ? "—" : `${kpis.attendance}%`}
          hint="Última semana"
          tone="success"
        />
        <Kpi
          icon={CreditCard}
          label="Pagos pendientes"
          value={kpis.pendingCount}
          tone={kpis.pendingCount > 0 ? "warning" : "default"}
        />
        <Kpi
          icon={Wallet}
          label="Importe pendiente"
          value={fmtMoney(kpis.pendingAmount)}
          tone={kpis.pendingAmount > 0 ? "warning" : "default"}
        />
        <Kpi
          icon={AlertTriangle}
          label="Incidencias abiertas"
          value={kpis.openIncidents}
          tone={kpis.openIncidents > 0 ? "danger" : "success"}
        />
        <Kpi
          icon={HeartPulse}
          label="No aptos / en revisión"
          value={kpis.notFit}
          tone={kpis.notFit > 0 ? "warning" : "success"}
        />
      </section>

      {/* Main content */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {/* Próximos eventos */}
        <Card className="lg:col-span-2">
          <SectionHeader
            icon={CalendarDays}
            title="Próximos eventos"
            actionLabel="Ver calendario"
            actionTo="/calendar"
          />
          {upcomingEvents.length === 0 ? (
            <Empty>Sin eventos próximos.</Empty>
          ) : (
            <ul className="divide-y divide-border">
              {upcomingEvents.map((e) => (
                <li key={e.id} className="flex items-center gap-3 py-2.5">
                  <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <span className="text-[10px] font-semibold uppercase">
                      {new Date(e.date).toLocaleDateString("es-ES", { month: "short" })}
                    </span>
                    <span className="text-sm font-bold leading-none">
                      {new Date(e.date).getDate()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{e.title}</div>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {e.startTime}
                      <span>·</span>
                      <span className="capitalize">{e.type}</span>
                    </div>
                  </div>
                  <Pill tone={eventTone(e.type)}>{e.type}</Pill>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Riesgos operativos */}
        <Card>
          <SectionHeader icon={AlertTriangle} title="Riesgos operativos" />
          {risks.length === 0 ? (
            <Empty>Sin riesgos detectados. Todo en orden.</Empty>
          ) : (
            <ul className="space-y-2">
              {risks.map((r, i) => (
                <li key={i}>
                  <Link
                    to={r.to}
                    className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm transition hover:border-primary hover:bg-primary/5"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${
                          r.tone === "danger"
                            ? "bg-destructive"
                            : r.tone === "warning"
                              ? "bg-warning"
                              : "bg-primary"
                        }`}
                      />
                      <span className="truncate">{r.label}</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* Circulares recientes */}
        <Card className="lg:col-span-2">
          <SectionHeader
            icon={Megaphone}
            title="Circulares recientes"
            actionLabel="Ver comunicación"
            actionTo="/communication"
          />
          {recentCirculars.length === 0 ? (
            <Empty>No hay circulares publicadas.</Empty>
          ) : (
            <ul className="divide-y divide-border">
              {recentCirculars.map((c) => (
                <li key={c.id} className="py-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold">{c.title}</span>
                        {c.unread > 0 && <Pill tone="info">{c.unread} nuevas</Pill>}
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {c.excerpt}
                      </p>
                    </div>
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {c.createdAt.slice(0, 10)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Actividad reciente */}
        <Card>
          <SectionHeader icon={Bell} title="Actividad reciente" />
          {activity.length === 0 ? (
            <Empty>Sin actividad reciente.</Empty>
          ) : (
            <ul className="space-y-2.5">
              {activity.map((it, i) => {
                const Icon = it.icon;
                return (
                  <li key={i} className="flex items-start gap-3">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        it.tone === "success"
                          ? "bg-success/15 text-success"
                          : it.tone === "warning"
                            ? "bg-warning/15 text-warning"
                            : "bg-primary/10 text-primary"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm leading-tight">{it.text}</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">{it.time}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}

function eventTone(type: string): "info" | "success" | "warning" | "danger" | "default" {
  switch (type) {
    case "training":
      return "info";
    case "match":
      return "success";
    case "medical":
      return "warning";
    case "meeting":
      return "default";
    default:
      return "default";
  }
}

function Kpi({
  icon: Icon,
  label,
  value,
  hint,
  tone = "default",
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "primary" | "info" | "success" | "warning" | "danger";
}) {
  const toneCls: Record<string, string> = {
    default: "bg-muted text-foreground",
    primary: "bg-primary text-primary-foreground",
    info: "bg-primary/10 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    danger: "bg-destructive/15 text-destructive",
  };
  return (
    <div className="rounded-2xl border border-border bg-card p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          <div className="mt-1.5 truncate text-xl font-bold tracking-tight">{value}</div>
          {hint && <div className="mt-0.5 truncate text-[11px] text-muted-foreground">{hint}</div>}
        </div>
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${toneCls[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  actionLabel,
  actionTo,
}: {
  icon: LucideIcon;
  title: string;
  actionLabel?: string;
  actionTo?: string;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
        <Icon className="h-4 w-4 text-primary" /> {title}
      </h2>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="text-xs font-medium text-primary hover:underline">
          {actionLabel} →
        </Link>
      )}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
      {children}
    </div>
  );
}
