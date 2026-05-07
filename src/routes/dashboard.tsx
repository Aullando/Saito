import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { PageHeader, Card, Pill } from "@/components/ui-kit";
import { useAuth } from "@/lib/auth";
import { useT } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Users, Calendar, CreditCard, Activity, MessageSquare, Stethoscope } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <RoleGate roles={["sysadmin", "admin", "manager", "technical", "medical"]}>
      <AppLayout>
        <DashboardPage />
      </AppLayout>
    </RoleGate>
  ),
});

const today = () => new Date().toISOString().slice(0, 10);
const monthStart = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
};

function DashboardPage() {
  const t = useT();
  const { profile } = useAuth();
  const orgId = profile?.organization_id;

  const stats = useQuery({
    queryKey: ["dashboard", orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const [ath, sec, evToday, payPending, payMonth, apptUpcoming, msgs] = await Promise.all([
        supabase.from("athletes").select("id, status, medical_status", { count: "exact" }).eq("organization_id", orgId),
        supabase.from("sport_sections").select("id", { count: "exact", head: true }).eq("organization_id", orgId),
        supabase.from("calendar_events").select("id, title, start_time, end_time, type").eq("organization_id", orgId).eq("event_date", today()).order("start_time"),
        supabase.from("payments").select("id, amount", { count: "exact" }).eq("organization_id", orgId).eq("status", "Pending"),
        supabase.from("payments").select("amount, status").eq("organization_id", orgId).gte("payment_date", monthStart()),
        supabase.from("medical_appointments").select("id, appointment_date, appointment_time, reason, athlete_id").eq("organization_id", orgId).gte("appointment_date", today()).order("appointment_date").limit(5),
        supabase.from("conversations").select("id", { count: "exact", head: true }).eq("organization_id", orgId),
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

  const fmtMoney = (n: number) =>
    new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);

  const s = stats.data;

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
                    <div className="font-medium">{athleteNames.data?.get(a.athlete_id) ?? "—"}</div>
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
    warning: "bg-warning/20 text-warning-foreground",
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
