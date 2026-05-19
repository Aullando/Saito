import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, TrendingUp, Users, Wallet } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { PageHeader } from "@/components/ui-kit";

export const Route = createFileRoute("/_app/reports")({
  head: () => ({ meta: [{ title: "Informes — SAITO" }] }),
  component: () => (
    <RoleGate roles={["admin", "manager"]}>
      <AppLayout>
        <ReportsPage />
      </AppLayout>
    </RoleGate>
  ),
});

const reports = [
  { icon: Users, title: "Altas y bajas", desc: "Evolución mensual de la base de deportistas." },
  { icon: Wallet, title: "Ingresos por cuotas", desc: "Recaudación, morosidad y previsión." },
  {
    icon: TrendingUp,
    title: "Asistencia por sección",
    desc: "Ratio de asistencia a entrenamientos.",
  },
  { icon: BarChart3, title: "Ocupación de instalaciones", desc: "Uso semanal por instalación." },
];

function ReportsPage() {
  return (
    <>
      <PageHeader
        title="Informes"
        subtitle="Resumen ejecutivo del club. Selecciona un informe para ver el detalle."
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
        Próximamente: exportación a PDF/Excel y programación de envíos.
      </div>
    </>
  );
}
