import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { PageHeader, Card, Pill } from "@/components/ui-kit";
import { useAuth } from "@/lib/auth";
import { useT } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { useClub } from "@/clubs/ClubProvider";
import { RgccDashboard } from "@/clubs/rgcc/RgccDashboard";
import {
  DEMO_DASHBOARD_STATS,
  DEMO_DASHBOARD_CHARTS,
  DEMO_ATHLETES_MIN_ROWS,
} from "@/lib/demoFallbacks";
import { Users, Calendar, CreditCard, Activity, MessageSquare, Stethoscope, TrendingUp, BarChart3 } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

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
  return <DashboardPage />;
}

const today = () => new Date().toISOString().slice(0, 10);
const monthStart = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
};
const sixMonthsAgo = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() - 5, 1).toISOString().slice(0, 10);
};
const thirtyDaysAgo = () => {
  const d = new Date();
  d.setDate(d.getDate() - 29);
  return d.toISOString().slice(0, 10);
};
const MONTHS_ES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function DashboardPage() {
  const t = useT();
  const { profile } = useAuth();
  const orgId = profile?.organization_id;

  const stats = useQuery({
    queryKey: ["dashboard", orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const oid = orgId!;
      const [ath, sec, evToday, payPending, payMonth, apptUpcoming, msgs] = await Promise.all([
        supabase.from("athletes").select("id, status, medical_status", { count: "exact" }).eq("organization_id", oid),
        supabase.from("sport_sections").select("id", { count: "exact", head: true }).eq("organization_id", oid),
        supabase.from("calendar_events").select("id, title, start_time, end_time, type").eq("organization_id", oid).eq("event_date", today()).order("start_time"),
        supabase.from("payments").select("id, amount", { count: "exact" }).eq("organization_id", oid).eq("status", "Pending"),
        supabase.from("payments").select("amount, status").eq("organization_id", oid).gte("payment_date", monthStart()),
        supabase.from("medical_appointments").select("id, appointment_date, appointment_time, reason, athlete_id").eq("organization_id", oid).gte("appointment_date", today()).order("appointment_date").limit(5),
        supabase.from("conversations").select("id", { count: "exact", head: true }).eq("organization_id", oid),
      ]);

      const athletes = ath.data ?? [];
      const activeAth = athletes.filter((a) => a.status === "Active").length;
      const injured = athletes.filter((a) => a.medical_status === "Injured").length;
      const monthRevenue = (payMonth.data ?? [])
        .filter((p) => p.status === "Paid")
        .reduce((s, p) => s + Number(p.amount ?? 0), 0);
      const pendingAmount = (payPending.data ?? []).reduce((s, p) => s + Number(p.amount ?? 0), 0);

      return {
        athletesTotal: ath.count ?? athletes.length,
        athletesActive: activeAth,
        injured,
        sectionsCount: sec.count ?? 0,
        eventsToday: evToday.data ?? [],
        pendingCount: payPending.count ?? 0,
        pendingAmount,
        monthRevenue,
        upcomingAppts: apptUpcoming.data ?? [],
        conversationsCount: msgs.count ?? 0,
      };
    },
  });

  const athleteNames = useQuery({
    queryKey: ["athlete-names", orgId, stats.data?.upcomingAppts.map((a) => a.athlete_id).join(",")],
    enabled: !!orgId && !!stats.data?.upcomingAppts.length,
    queryFn: async () => {
      const ids = stats.data!.upcomingAppts.map((a) => a.athlete_id);
      const { data } = await supabase.from("athletes").select("id, first_name, last_name").in("id", ids);
      const map = new Map<string, string>();
      (data ?? []).forEach((a) => map.set(a.id, `${a.first_name} ${a.last_name}`));
      return map;
    },
  });

  const lang = (profile?.language ?? "es") as "es" | "en";
  const monthNames = lang === "es" ? MONTHS_ES : MONTHS_EN;

  const charts = useQuery({
    queryKey: ["dashboard-charts", orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const oid = orgId!;
      const [pays, evs, ath] = await Promise.all([
        supabase.from("payments").select("amount, status, payment_date").eq("organization_id", oid).gte("payment_date", sixMonthsAgo()),
        supabase.from("calendar_events").select("event_date, type").eq("organization_id", oid).gte("event_date", thirtyDaysAgo()),
        supabase.from("athletes").select("medical_status, performance_status, status").eq("organization_id", oid),
      ]);

      // Revenue by month (last 6 months)
      const now = new Date();
      const buckets: { key: string; label: string; revenue: number; pending: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        buckets.push({
          key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
          label: monthNames[d.getMonth()],
          revenue: 0,
          pending: 0,
        });
      }
      const bucketMap = new Map(buckets.map((b) => [b.key, b]));
      (pays.data ?? []).forEach((p) => {
        if (!p.payment_date) return;
        const k = p.payment_date.slice(0, 7);
        const b = bucketMap.get(k);
        if (!b) return;
        const amt = Number(p.amount ?? 0);
        if (p.status === "Paid") b.revenue += amt;
        else if (p.status === "Pending") b.pending += amt;
      });

      // Events per day (last 30)
      const dayMap = new Map<string, number>();
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        dayMap.set(d.toISOString().slice(0, 10), 0);
      }
      (evs.data ?? []).forEach((e) => {
        if (dayMap.has(e.event_date)) dayMap.set(e.event_date, (dayMap.get(e.event_date) ?? 0) + 1);
      });
      const eventsSeries = Array.from(dayMap.entries()).map(([date, count]) => ({
        date: date.slice(5),
        count,
      }));

      // Event types breakdown
      const typeCount: Record<string, number> = {};
      (evs.data ?? []).forEach((e) => {
        typeCount[e.type] = (typeCount[e.type] ?? 0) + 1;
      });
      const typeData = Object.entries(typeCount).map(([name, value]) => ({ name, value }));

      // Medical status breakdown
      const medCount: Record<string, number> = {};
      (ath.data ?? []).forEach((a) => {
        medCount[a.medical_status] = (medCount[a.medical_status] ?? 0) + 1;
      });
      const medData = Object.entries(medCount).map(([name, value]) => ({ name, value }));

      return { revenueSeries: buckets, eventsSeries, typeData, medData };
    },
  });

  const fmtMoney = (n: number) =>
    new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);

  const s = stats.data ?? DEMO_DASHBOARD_STATS;
  const chartsData = chartsData ?? DEMO_DASHBOARD_CHARTS;
  const athleteNamesMap = athleteNames.data ?? new Map<string, string>(
    DEMO_ATHLETES_MIN_ROWS.map((a) => [a.id, `${a.first_name} ${a.last_name}`])
  );

  return (
    <>
      <PageHeader title={t("dashboard") || "Dashboard"} subtitle={profile?.full_name ?? ""} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<Users className="h-5 w-5" />}
          label={t("athletes_lower")}
          value={s ? `${s.athletesActive}/${s.athletesTotal}` : "—"}
          hint={s ? `${s.injured} ${t("injured")}` : undefined}
          tone="info"
        />
        <KpiCard
          icon={<Activity className="h-5 w-5" />}
          label={t("sections") || "Secciones"}
          value={s ? String(s.sectionsCount) : "—"}
          tone="default"
        />
        <KpiCard
          icon={<CreditCard className="h-5 w-5" />}
          label={t("pending_pay") || "Pendientes"}
          value={s ? String(s.pendingCount) : "—"}
          hint={s ? fmtMoney(s.pendingAmount) : undefined}
          tone="warning"
        />
        <KpiCard
          icon={<CreditCard className="h-5 w-5" />}
          label={t("revenue_month") || "Ingresos mes"}
          value={s ? fmtMoney(s.monthRevenue) : "—"}
          tone="success"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Calendar className="h-4 w-4" /> {t("today") || "Hoy"}
            </h2>
            <Link to="/calendar" className="text-xs text-primary hover:underline">{t("view_all") || "Ver todo"}</Link>
          </div>
          {!s ? (
            <div className="text-sm text-muted-foreground">…</div>
          ) : s.eventsToday.length === 0 ? (
            <div className="text-sm text-muted-foreground">{t("no_events") || "Sin eventos hoy"}</div>
          ) : (
            <ul className="space-y-2">
              {s.eventsToday.map((e) => (
                <li key={e.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                  <div>
                    <div className="font-medium">{e.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {e.start_time?.slice(0, 5)}{e.end_time ? `–${e.end_time.slice(0, 5)}` : ""}
                    </div>
                  </div>
                  <Pill tone="info">{e.type}</Pill>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Stethoscope className="h-4 w-4" /> {t("medical_calendar") || "Citas próximas"}
            </h2>
            <Link to="/medical/calendar" className="text-xs text-primary hover:underline">{t("view_all") || "Ver todo"}</Link>
          </div>
          {!s ? (
            <div className="text-sm text-muted-foreground">…</div>
          ) : s.upcomingAppts.length === 0 ? (
            <div className="text-sm text-muted-foreground">{t("no_appointments") || "Sin citas próximas"}</div>
          ) : (
            <ul className="space-y-2">
              {s.upcomingAppts.map((a) => (
                <li key={a.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                  <div>
                    <div className="font-medium">{athleteNamesMap.get(a.athlete_id) ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">{a.reason ?? ""}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {a.appointment_date}{a.appointment_time ? ` ${a.appointment_time.slice(0, 5)}` : ""}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <TrendingUp className="h-4 w-4" /> {lang === "es" ? "Ingresos (6 meses)" : "Revenue (6 months)"}
            </h2>
          </div>
          <div className="h-64 w-full">
            {chartsData && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartsData.revenueSeries} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `${v}€`} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                    formatter={(v: number) => fmtMoney(v)}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="url(#revGrad)" strokeWidth={2} name={lang === "es" ? "Cobrado" : "Paid"} />
                  <Area type="monotone" dataKey="pending" stroke="hsl(var(--warning))" fill="transparent" strokeWidth={2} strokeDasharray="4 4" name={lang === "es" ? "Pendiente" : "Pending"} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <BarChart3 className="h-4 w-4" /> {lang === "es" ? "Eventos (30 días)" : "Events (30 days)"}
            </h2>
          </div>
          <div className="h-64 w-full">
            {chartsData && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartsData.eventsSeries} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} interval={4} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-lg font-semibold">{lang === "es" ? "Tipos de evento" : "Event types"}</h2>
          <div className="h-56 w-full">
            {chartsData && chartsData.typeData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartsData.typeData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                    {chartsData.typeData.map((_, i) => (
                      <Cell key={i} fill={["hsl(var(--primary))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--destructive))"][i % 4]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 text-lg font-semibold">{lang === "es" ? "Estado médico" : "Medical status"}</h2>
          <div className="h-56 w-full">
            {chartsData && chartsData.medData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartsData.medData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                    {chartsData.medData.map((entry, i) => {
                      const colorMap: Record<string, string> = {
                        Fit: "hsl(var(--success))",
                        Injured: "hsl(var(--destructive))",
                        "Under review": "hsl(var(--warning))",
                        Unknown: "hsl(var(--muted-foreground))",
                      };
                      return <Cell key={i} fill={colorMap[entry.name] ?? "hsl(var(--primary))"} />;
                    })}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickLink to="/athletes" icon={<Users className="h-4 w-4" />} label={t("athletes") || "Deportistas"} />
        <QuickLink to="/calendar" icon={<Calendar className="h-4 w-4" />} label={t("calendar") || "Calendario"} />
        <QuickLink to="/economic/payments" icon={<CreditCard className="h-4 w-4" />} label={t("payments") || "Pagos"} />
        <QuickLink to="/communication" icon={<MessageSquare className="h-4 w-4" />} label={t("communication") || "Comunicación"} />
      </div>
    </>
  );
}

function KpiCard({
  icon, label, value, hint, tone = "default",
}: {
  icon: React.ReactNode; label: string; value: string; hint?: string;
  tone?: "default" | "info" | "success" | "warning";
}) {
  const toneCls: Record<string, string> = {
    default: "bg-muted text-foreground",
    info: "bg-primary/10 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
  };
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="mt-2 text-2xl font-bold">{value}</div>
          {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
        </div>
        <div className={`flex h-9 w-9 items-center justify-center rounded-full ${toneCls[tone]}`}>{icon}</div>
      </div>
    </Card>
  );
}

function QuickLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium transition hover:border-primary hover:bg-primary/5"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">{icon}</span>
      {label}
    </Link>
  );
}
