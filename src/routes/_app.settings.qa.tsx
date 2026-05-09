import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { PageHeader, Card, Pill } from "@/components/ui-kit";
import { CheckCircle2, AlertCircle, Circle } from "lucide-react";

export const Route = createFileRoute("/_app/settings/qa")({
  head: () => ({ meta: [{ title: "Checklist piloto — SAITO" }] }),
  component: () => (
    <RoleGate roles={["admin", "sysadmin"]}>
      <AppLayout>
        <QAPage />
      </AppLayout>
    </RoleGate>
  ),
});

type Status = "ok" | "partial" | "todo";

const ROUTES: { area: string; path: string; role: string; status: Status; note?: string }[] = [
  { area: "Login por rol", path: "/login", role: "público", status: "ok" },
  {
    area: "Dashboard",
    path: "/dashboard",
    role: "admin · manager · technical · medical",
    status: "ok",
  },
  { area: "Club / instalaciones", path: "/club", role: "admin · manager", status: "ok" },
  {
    area: "Deportistas (filtros + ficha)",
    path: "/athletes",
    role: "admin · manager · technical · medical",
    status: "ok",
  },
  {
    area: "Calendario (entrenos, partidos, reuniones)",
    path: "/calendar",
    role: "admin · manager · technical",
    status: "ok",
  },
  {
    area: "Asistencia y disponibilidad",
    path: "/attendance",
    role: "admin · manager · technical",
    status: "ok",
    note: "Mockup demo, listo para piloto",
  },
  {
    area: "Comunicación segmentada",
    path: "/communication",
    role: "admin · manager · technical · medical",
    status: "ok",
  },
  { area: "Cuotas", path: "/economic/fees", role: "admin · manager", status: "ok" },
  { area: "Pagos", path: "/economic/payments", role: "admin · manager", status: "ok" },
  { area: "Citas médicas", path: "/medical/calendar", role: "medical", status: "ok" },
  {
    area: "Restricciones y lesiones",
    path: "/medical/restrictions",
    role: "medical · admin",
    status: "ok",
    note: "Datos representativos",
  },
  {
    area: "Privacidad y seguridad",
    path: "/settings/privacy",
    role: "admin · sysadmin",
    status: "ok",
  },
  { area: "Equipo y permisos", path: "/settings/team", role: "admin", status: "ok" },
  {
    area: "Onboarding club",
    path: "/onboarding",
    role: "admin",
    status: "partial",
    note: "Wizard funcional, pendiente personalización por deporte",
  },
  { area: "RGCC (club ejemplo)", path: "/rgcc/mi-dia", role: "demo", status: "ok" },
];

const NON_BLOCKING: string[] = [
  "Notificaciones push reales (mockeadas en UI).",
  "Exportación CSV de cuotas y asistencia.",
  "Importación masiva de jugadores desde Excel.",
  "Firma electrónica de consentimientos médicos.",
  "Roles familia / jugador (vista propia) — pendiente de piloto fase 2.",
  "Integración real de pasarela de pago.",
];

const STATUS_META: Record<
  Status,
  { label: string; icon: typeof CheckCircle2; cls: string; tone: "success" | "warning" | "info" }
> = {
  ok: { label: "Listo piloto", icon: CheckCircle2, cls: "text-emerald-600", tone: "success" },
  partial: { label: "Parcial", icon: AlertCircle, cls: "text-amber-600", tone: "warning" },
  todo: { label: "Pendiente", icon: Circle, cls: "text-muted-foreground", tone: "info" },
};

function QAPage() {
  const ok = ROUTES.filter((r) => r.status === "ok").length;
  const partial = ROUTES.filter((r) => r.status === "partial").length;
  return (
    <>
      <PageHeader
        title="Checklist piloto"
        subtitle="Estado de los módulos antes de arrancar con un club piloto. Vista interna SAITO."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Listos
          </div>
          <div className="mt-1 text-2xl font-bold text-emerald-600">{ok}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Parciales
          </div>
          <div className="mt-1 text-2xl font-bold text-amber-600">{partial}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total módulos auditados
          </div>
          <div className="mt-1 text-2xl font-bold">{ROUTES.length}</div>
        </Card>
      </div>

      <Card className="mt-6 p-0">
        <div className="border-b border-border px-5 py-3 text-sm font-semibold">
          Recorrido por rol
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-2 font-semibold">Módulo</th>
                <th className="px-3 py-2 font-semibold">Ruta</th>
                <th className="px-3 py-2 font-semibold">Roles</th>
                <th className="px-3 py-2 font-semibold">Estado</th>
                <th className="px-3 py-2 font-semibold">Notas</th>
              </tr>
            </thead>
            <tbody>
              {ROUTES.map((r) => {
                const meta = STATUS_META[r.status];
                const Icon = meta.icon;
                return (
                  <tr key={r.path} className="border-t border-border">
                    <td className="px-5 py-2.5 font-medium">{r.area}</td>
                    <td className="px-3 py-2.5">
                      <Link to={r.path} className="text-xs text-primary hover:underline">
                        {r.path}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground">{r.role}</td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-flex items-center gap-1.5 ${meta.cls}`}>
                        <Icon className="h-4 w-4" />
                        <span className="text-xs font-semibold">{meta.label}</span>
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground">{r.note ?? ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="mt-6 p-6">
        <div className="text-sm font-semibold">Pendientes no bloqueantes para piloto</div>
        <ul className="mt-3 space-y-2 text-sm">
          {NON_BLOCKING.map((item) => (
            <li key={item} className="flex items-start gap-2 text-muted-foreground">
              <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mt-6 p-6">
        <div className="text-sm font-semibold">Compromisos durante el piloto</div>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>• No se entrenan modelos de IA con los datos del club.</li>
          <li>
            • La IA no realiza diagnóstico médico; sólo organiza información clínico-administrativa.
          </li>
          <li>
            • Acceso a datos sensibles auditado y visible en{" "}
            <Link to="/settings/privacy" className="text-primary hover:underline">
              /settings/privacy
            </Link>
            .
          </li>
          <li>• No se anuncian certificaciones que aún estén en proceso.</li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <Pill tone="info">Versión Alpha</Pill>
          <Pill tone="success">Pilot ready</Pill>
        </div>
      </Card>
    </>
  );
}
