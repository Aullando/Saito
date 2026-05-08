// RGCC operational dashboard — adapted from covadonga-hub's Resumen/Analytics
// view. Uses SAITO's ui-kit, design tokens and seed data (no AuthContext, no
// covadonga router, no covadonga store). Rendered inside SAITO's AppLayout
// when the active club is "rgcc".

import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Card, PageHeader, Pill } from "@/components/ui-kit";
import { useClub } from "@/clubs/ClubProvider";
import {
  RGCC_COACHES,
  RGCC_SESSIONS,
  RGCC_INCIDENTS,
  RGCC_ABSENCES,
  RGCC_MEMBERS,
} from "./seed";
import {
  Users, CalendarDays, Clock, AlertTriangle, CheckCircle2,
  Dumbbell, Search, FileDown,
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip,
  BarChart, Bar, CartesianGrid, Legend,
} from "recharts";

const TABS = ["Resumen", "Analytics", "Control Horas"] as const;
type Tab = typeof TABS[number];

export function RgccDashboard() {
  const { club } = useClub();
  const [tab, setTab] = useState<Tab>("Resumen");

  return (
    <>
      <PageHeader
        title={`Dashboard · ${club.brand.shortName}`}
        subtitle="Resumen operativo del club"
      />

      <div className="mb-5 flex items-center gap-1 border-b border-border overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative px-4 h-10 text-sm whitespace-nowrap transition-colors ${
              tab === t ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
            {tab === t && <span className="absolute left-2 right-2 bottom-0 h-[2px] bg-primary" />}
          </button>
        ))}
      </div>

      {tab === "Resumen" && <ResumenTab />}
      {tab === "Analytics" && <AnalyticsTab />}
      {tab === "Control Horas" && <ControlHorasTab />}
    </>
  );
}

// ─── Resumen ────────────────────────────────────────────────────────────────

function ResumenTab() {
  const today = new Date().toISOString().slice(0, 10);
  const sessionsToday = RGCC_SESSIONS.filter((s) => s.date === today);
  const totalHours = RGCC_COACHES.reduce((s, c) => s + c.totalHours, 0);
  const absencesToday = RGCC_ABSENCES.filter((a) => a.from <= today && a.to >= today && a.status !== "rejected").length;

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi icon={<Users className="h-4 w-4" />} label="Monitores activos" value={String(RGCC_COACHES.length)} />
        <Kpi icon={<CalendarDays className="h-4 w-4" />} label="Clases programadas" value={String(RGCC_SESSIONS.length)} />
        <Kpi icon={<Clock className="h-4 w-4" />} label="Horas producción" value={`${totalHours.toFixed(1)}h`} tone="warning" />
        <Kpi icon={<AlertTriangle className="h-4 w-4" />} label="Ausencias hoy" value={String(absencesToday)} tone={absencesToday === 0 ? "success" : "warning"} />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="mb-3">
            <h2 className="text-lg font-semibold">Carga horaria por monitor</h2>
            <p className="text-xs text-muted-foreground">Top 8 · semana en curso</p>
          </div>
          <div className="space-y-3">
            {[...RGCC_COACHES].sort((a, b) => b.totalHours - a.totalHours).slice(0, 8).map((m) => {
              const pct = Math.min(100, (m.totalHours / Math.max(1, m.maxHours)) * 100);
              const tone =
                pct >= 90 ? "bg-destructive" : pct >= 75 ? "bg-warning" : "bg-success";
              return (
                <div key={m.id} className="grid grid-cols-[120px_1fr_90px] items-center gap-3">
                  <div className="text-sm font-medium truncate">{m.name}</div>
                  <div className="h-3 bg-muted rounded overflow-hidden">
                    <div className={`h-full ${tone}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="text-xs text-muted-foreground text-right tabular-nums">
                    <span className="text-foreground font-semibold">{m.totalHours.toFixed(1)}h</span>
                    {" / "}{m.maxHours}h
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <AlertasCard />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Clases de hoy</h2>
            <Link to="/rgcc/$slug" params={{ slug: "clases" }} className="text-xs text-primary hover:underline">
              Ver todas
            </Link>
          </div>
          {sessionsToday.length === 0 ? (
            <div className="text-sm text-muted-foreground">Sin clases programadas hoy.</div>
          ) : (
            <ul className="divide-y divide-border">
              {sessionsToday.slice(0, 8).map((s) => (
                <li key={s.id} className="flex items-center justify-between py-2.5">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{s.activity}</div>
                    <div className="text-xs text-muted-foreground">
                      {s.time} · {s.roomLabel} · {s.primaryCoach}
                    </div>
                  </div>
                  <Pill tone={s.status === "confirmed" ? "success" : s.status === "cancelled" ? "danger" : "info"}>
                    {s.status}
                  </Pill>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <AccionesRapidas />
      </div>
    </>
  );
}

function AlertasCard() {
  const monLimite = RGCC_COACHES.filter((c) => c.totalHours / Math.max(1, c.maxHours) >= 0.9);
  const incidentsOpen = RGCC_INCIDENTS.filter((i) => i.status !== "resolved");
  const absRequested = RGCC_ABSENCES.filter((a) => a.status === "requested");

  const alerts: { tone: "danger" | "warning" | "info"; text: string }[] = [
    ...monLimite.map((m) => ({
      tone: "warning" as const,
      text: `${m.name} al ${Math.round((m.totalHours / m.maxHours) * 100)}% de su máximo`,
    })),
    ...incidentsOpen.map((i) => ({
      tone: i.severity === "high" ? ("danger" as const) : ("warning" as const),
      text: `${i.type}: ${i.description}`,
    })),
    ...absRequested.map((a) => ({
      tone: "info" as const,
      text: `Solicitud de ausencia: ${a.coachName} (${a.reason})`,
    })),
  ];

  return (
    <Card className="bg-foreground text-background">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">Alertas activas</div>
          <div className="text-xs opacity-60">Detección automática</div>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
          {alerts.length}
        </span>
      </div>
      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle2 className="h-8 w-8 mb-2 text-success" />
          <div className="text-sm font-semibold">Todo en orden</div>
        </div>
      ) : (
        <ul className="space-y-2">
          {alerts.map((a, i) => (
            <li key={i} className="flex items-start gap-2 text-xs">
              <span
                className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${
                  a.tone === "danger" ? "bg-destructive" : a.tone === "warning" ? "bg-warning" : "bg-primary"
                }`}
              />
              <span className="opacity-90">{a.text}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function AccionesRapidas() {
  const items: { icon: React.ReactNode; label: string; slug: string }[] = [
    { icon: <Dumbbell className="h-4 w-4" />, label: "Entrenamiento Personal", slug: "pt" },
    { icon: <Search className="h-4 w-4" />, label: "Biblioteca", slug: "biblioteca" },
    { icon: <Users className="h-4 w-4" />, label: "Monitores", slug: "monitores" },
    { icon: <FileDown className="h-4 w-4" />, label: "Centro Datos", slug: "centro-datos" },
  ];
  return (
    <Card>
      <div className="mb-3">
        <h2 className="text-lg font-semibold">Acciones rápidas</h2>
        <p className="text-xs text-muted-foreground">Atajos del coordinador</p>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {items.map((a) => (
          <Link
            key={a.slug}
            to="/rgcc/$slug"
            params={{ slug: a.slug }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md border border-border hover:border-primary hover:bg-muted/50 transition-colors"
          >
            <div className="h-8 w-8 rounded-md bg-foreground text-background grid place-items-center">{a.icon}</div>
            <div className="text-sm font-medium flex-1">{a.label}</div>
            <span className="text-xs text-muted-foreground">IR →</span>
          </Link>
        ))}
      </div>
    </Card>
  );
}

// ─── Analytics ──────────────────────────────────────────────────────────────

function AnalyticsTab() {
  const { donut, top, salas } = useMemo(() => {
    const acts: Record<string, number> = {};
    const rooms: Record<string, { used: number; cap: number }> = {};
    RGCC_SESSIONS.forEach((s) => {
      acts[s.activity] = (acts[s.activity] ?? 0) + 1;
      const r = (rooms[s.roomLabel] ??= { used: 0, cap: 0 });
      r.used += s.bookings.length;
      r.cap += s.capacity;
    });
    const PALETTE = ["hsl(var(--primary))", "hsl(var(--warning))", "hsl(var(--success))", "hsl(var(--destructive))", "hsl(var(--accent))"];
    const top = Object.entries(acts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([act, n]) => ({ act, n }));
    const donut = top.slice(0, 5).map((d, i) => ({ name: d.act, value: d.n, fill: PALETTE[i % PALETTE.length] }));
    const salas = Object.entries(rooms).map(([sala, v]) => ({
      sala, ocup: v.cap > 0 ? Math.round((v.used / v.cap) * 100) : 0,
    })).sort((a, b) => b.ocup - a.ocup).slice(0, 6);
    return { donut, top, salas };
  }, []);

  const evol = [
    { sem: "S1", horas: 280 }, { sem: "S2", horas: 295 }, { sem: "S3", horas: 305 },
    { sem: "S4", horas: 312 }, { sem: "S5", horas: +RGCC_COACHES.reduce((s, c) => s + c.totalHours, 0).toFixed(1) },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <h2 className="mb-2 text-lg font-semibold">Distribución de actividades</h2>
        <div className="h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={donut} dataKey="value" innerRadius={55} outerRadius={90} paddingAngle={2}>
                {donut.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <h2 className="mb-2 text-lg font-semibold">Evolución horas producción</h2>
        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={evol}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="sem" fontSize={11} stroke="hsl(var(--muted-foreground))" />
              <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Line type="monotone" dataKey="horas" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <h2 className="mb-2 text-lg font-semibold">Top actividades por volumen</h2>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={top} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" fontSize={11} stroke="hsl(var(--muted-foreground))" />
              <YAxis type="category" dataKey="act" fontSize={11} width={80} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Bar dataKey="n" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <h2 className="mb-2 text-lg font-semibold">Ocupación de salas (%)</h2>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={salas}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="sala" fontSize={10} stroke="hsl(var(--muted-foreground))" />
              <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Bar dataKey="ocup" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

// ─── Control Horas ─────────────────────────────────────────────────────────

function ControlHorasTab() {
  const total = +RGCC_COACHES.reduce((s, c) => s + c.totalHours, 0).toFixed(1);
  const contract = RGCC_COACHES.reduce((s, c) => s + c.contractedHours, 0);
  const diff = +(total - contract).toFixed(1);
  return (
    <Card>
      <div className="mb-3">
        <h2 className="text-lg font-semibold">Control de horas global</h2>
        <p className="text-xs text-muted-foreground">Resumen semanal · {RGCC_MEMBERS.length} socios activos</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Stat label="Producción total" value={`${total}h`} />
        <Stat label="Contrato total" value={`${contract}h`} />
        <Stat label="Diferencia" value={`${diff > 0 ? "+" : ""}${diff}h`} tone={diff > 0 ? "warning" : "success"} />
      </div>
    </Card>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function Kpi({
  icon, label, value, tone,
}: {
  icon: React.ReactNode; label: string; value: string;
  tone?: "default" | "warning" | "success" | "danger";
}) {
  const color =
    tone === "danger" ? "text-destructive"
      : tone === "warning" ? "text-warning"
      : tone === "success" ? "text-success"
      : "text-foreground";
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="h-7 w-7 rounded-md bg-muted grid place-items-center text-muted-foreground">{icon}</div>
      </div>
      <div className={`mt-3 text-3xl font-bold leading-none ${color}`}>{value}</div>
    </Card>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "warning" | "success" }) {
  const c = tone === "warning" ? "text-warning" : tone === "success" ? "text-success" : "text-foreground";
  return (
    <div className="rounded-md border border-border p-4">
      <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</div>
      <div className={`mt-2 text-2xl font-bold ${c}`}>{value}</div>
    </div>
  );
}
