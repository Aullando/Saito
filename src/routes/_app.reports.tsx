import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, TrendingUp, Users, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { PageHeader } from "@/components/ui-kit";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTr } from "@/lib/i18n";
import { useData } from "@/lib/store";

export const Route = createFileRoute("/_app/reports")({
  head: () => ({ meta: [{ title: "Reports — SAITO" }] }),
  component: () => (
    <RoleGate roles={["admin", "manager"]}>
      <AppLayout>
        <ReportsPage />
      </AppLayout>
    </RoleGate>
  ),
});

type ReportKey = "members" | "revenue" | "attendance" | "facilities";

function ReportsPage() {
  const tr = useTr();
  const [open, setOpen] = useState<ReportKey | null>(null);
  const athletes = useData((s) => s.athletes);
  const payments = useData((s) => s.payments);
  const attendance = useData((s) => s.attendance);
  const facilities = useData((s) => s.facilities);
  const events = useData((s) => s.events);

  const stats = useMemo(() => {
    const total = athletes.length;
    const active = athletes.filter((a) => a.status === "Active").length;
    const inactive = total - active;
    const paid = payments.filter((p) => p.status === "Paid");
    const pending = payments.filter((p) => p.status === "Pending");
    const overdue = payments.filter((p) => p.status === "Failed");
    const collected = paid.reduce((s, p) => s + (p.amount || 0), 0);
    const outstanding = pending.concat(overdue).reduce((s, p) => s + (p.amount || 0), 0);
    let att = 0, present = 0;
    Object.values(attendance).forEach((rec) => {
      Object.values(rec).forEach((st) => {
        att++;
        if (st === "present") present++;
      });
    });
    const attRatio = att ? Math.round((present / att) * 100) : 0;
    const facUse = facilities.map((f) => ({
      name: f.name,
      count: events.filter((e) => e.location === f.name).length,
    }));
    return { total, active, inactive, collected, outstanding, paid: paid.length, pending: pending.length, overdue: overdue.length, attRatio, attCount: att, facUse };
  }, [athletes, payments, attendance, facilities, events]);

  const reports: { key: ReportKey; icon: typeof Users; title: string; desc: string }[] = [
    {
      key: "members",
      icon: Users,
      title: tr("Altas y bajas", "New & lost members", "Prijave i odjave"),
      desc: tr("Evolución mensual de la base de deportistas.", "Monthly evolution of the athlete base.", "Mesečna evolucija baze sportista."),
    },
    {
      key: "revenue",
      icon: Wallet,
      title: tr("Ingresos por cuotas", "Fee revenue", "Prihodi od članarina"),
      desc: tr("Recaudación, morosidad y previsión.", "Collection, overdue payments and forecast.", "Naplata, dugovanja i projekcija."),
    },
    {
      key: "attendance",
      icon: TrendingUp,
      title: tr("Asistencia por sección", "Attendance by section", "Prisustvo po sekciji"),
      desc: tr("Ratio de asistencia a entrenamientos.", "Training attendance ratio.", "Odnos prisustva na treninzima."),
    },
    {
      key: "facilities",
      icon: BarChart3,
      title: tr("Ocupación de instalaciones", "Facility usage", "Iskorišćenost objekata"),
      desc: tr("Uso semanal por instalación.", "Weekly usage by facility.", "Nedeljno korišćenje po objektu."),
    },
  ];

  const previewLabel = tr("Vista previa · datos de la demo", "Preview · demo data", "Pregled · demo podaci");
  const prodNote = tr(
    "En producción incluirá gráficas históricas, exportación a PDF/Excel y envío programado.",
    "In production this will include historical charts, PDF/Excel export and scheduled delivery.",
    "U produkciji uključuje istorijske grafikone, izvoz u PDF/Excel i zakazane isporuke.",
  );

  const renderBody = (k: ReportKey) => {
    if (k === "members") {
      return (
        <div className="grid grid-cols-3 gap-3 text-sm">
          <Stat label={tr("Total", "Total", "Ukupno")} value={stats.total} />
          <Stat label={tr("Activos", "Active", "Aktivni")} value={stats.active} tone="ok" />
          <Stat label={tr("Inactivos", "Inactive", "Neaktivni")} value={stats.inactive} />
        </div>
      );
    }
    if (k === "revenue") {
      return (
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Stat label={tr("Recaudado", "Collected", "Naplaćeno")} value={`€${stats.collected.toLocaleString()}`} tone="ok" />
          <Stat label={tr("Pendiente", "Outstanding", "Neizmireno")} value={`€${stats.outstanding.toLocaleString()}`} tone="warn" />
          <Stat label={tr("Pagos OK", "Paid", "Plaćeno")} value={stats.paid} />
          <Stat label={tr("Vencidos", "Overdue", "Kasni")} value={stats.overdue} tone="warn" />
        </div>
      );
    }
    if (k === "attendance") {
      return (
        <div className="space-y-3">
          <Stat label={tr("Ratio de asistencia", "Attendance ratio", "Odnos prisustva")} value={`${stats.attRatio}%`} tone="ok" />
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary" style={{ width: `${stats.attRatio}%` }} />
          </div>
          <div className="text-xs text-muted-foreground">
            {tr("Basado en", "Based on", "Na osnovu")} {stats.attCount} {tr("marcas", "marks", "unosa")}
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-2 text-sm">
        {stats.facUse.map((f) => {
          const max = Math.max(1, ...stats.facUse.map((x) => x.count));
          return (
            <div key={f.name}>
              <div className="flex justify-between text-xs">
                <span>{f.name}</span>
                <span className="text-muted-foreground">{f.count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-primary" style={{ width: `${(f.count / max) * 100}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const current = reports.find((r) => r.key === open);

  return (
    <>
      <PageHeader
        title={tr("Informes", "Reports", "Izveštaji")}
        subtitle={tr(
          "Resumen ejecutivo del club. Selecciona un informe para ver el detalle.",
          "Executive club summary. Select a report to see details.",
          "Izvršni rezime kluba. Izaberite izveštaj za više detalja.",
        )}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {reports.map((r) => (
          <button
            key={r.key}
            onClick={() => setOpen(r.key)}
            className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left transition hover:border-primary hover:shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <r.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">{r.title}</div>
              <div className="text-xs text-muted-foreground">{r.desc}</div>
            </div>
          </button>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
        {tr(
          "Próximamente: exportación a PDF/Excel y programación de envíos.",
          "Coming soon: PDF/Excel export and scheduled deliveries.",
          "Uskoro: izvoz u PDF/Excel i zakazane isporuke.",
        )}
      </div>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{current?.title}</DialogTitle>
          </DialogHeader>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{previewLabel}</div>
          <div className="mt-2">{open && renderBody(open)}</div>
          <div className="mt-4 rounded-xl border border-dashed border-border p-3 text-xs text-muted-foreground">{prodNote}</div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Stat({ label, value, tone }: { label: string; value: string | number; tone?: "ok" | "warn" }) {
  const color = tone === "ok" ? "text-emerald-600" : tone === "warn" ? "text-amber-600" : "text-foreground";
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 text-lg font-semibold ${color}`}>{value}</div>
    </div>
  );
}
