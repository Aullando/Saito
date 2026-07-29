import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, TrendingUp, Users, Wallet } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { PageHeader } from "@/components/ui-kit";
import { useTr } from "@/lib/i18n";

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

function ReportsPage() {
  const tr = useTr();
  const reports = [
    {
      icon: Users,
      title: tr("Altas y bajas", "New & lost members", "Prijave i odjave"),
      desc: tr(
        "Evolución mensual de la base de deportistas.",
        "Monthly evolution of the athlete base.",
        "Mesečna evolucija baze sportista.",
      ),
    },
    {
      icon: Wallet,
      title: tr("Ingresos por cuotas", "Fee revenue", "Prihodi od članarina"),
      desc: tr(
        "Recaudación, morosidad y previsión.",
        "Collection, overdue payments and forecast.",
        "Naplata, dugovanja i projekcija.",
      ),
    },
    {
      icon: TrendingUp,
      title: tr("Asistencia por sección", "Attendance by section", "Prisustvo po sekciji"),
      desc: tr(
        "Ratio de asistencia a entrenamientos.",
        "Training attendance ratio.",
        "Odnos prisustva na treninzima.",
      ),
    },
    {
      icon: BarChart3,
      title: tr("Ocupación de instalaciones", "Facility usage", "Iskorišćenost objekata"),
      desc: tr(
        "Uso semanal por instalación.",
        "Weekly usage by facility.",
        "Nedeljno korišćenje po objektu.",
      ),
    },
  ];
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
          <div
            key={r.title}
            className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-primary hover:shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <r.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">{r.title}</div>
              <div className="text-xs text-muted-foreground">{r.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
        {tr(
          "Próximamente: exportación a PDF/Excel y programación de envíos.",
          "Coming soon: PDF/Excel export and scheduled deliveries.",
          "Uskoro: izvoz u PDF/Excel i zakazane isporuke.",
        )}
      </div>
    </>
  );
}
