import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { PageHeader, Card } from "@/components/ui-kit";
import { useAuth } from "@/lib/auth";
import {
  ShieldCheck, Users, Activity, Building2, Clock, Brain,
  CheckCircle2, XCircle, Eye, AlertTriangle,
} from "lucide-react";

export const Route = createFileRoute("/_app/settings/privacy")({
  component: () => (
    <RoleGate roles={["admin", "sysadmin"]}>
      <AppLayout>
        <PrivacyMockup />
      </AppLayout>
    </RoleGate>
  ),
});

const ROLES = ["admin", "manager", "technical", "medical"] as const;
type Role = (typeof ROLES)[number];

const PERMISSIONS: {
  key: string;
  label_es: string;
  label_en: string;
  matrix: Record<Role, "full" | "limited" | "none">;
}[] = [
  { key: "club", label_es: "Datos del club", label_en: "Club data", matrix: { admin: "full", manager: "full", technical: "limited", medical: "limited" } },
  { key: "athletes", label_es: "Ficha deportistas", label_en: "Athletes", matrix: { admin: "full", manager: "full", technical: "limited", medical: "limited" } },
  { key: "medical", label_es: "Historial médico", label_en: "Medical records", matrix: { admin: "none", manager: "none", technical: "none", medical: "full" } },
  { key: "payments", label_es: "Pagos y cuotas", label_en: "Payments & fees", matrix: { admin: "full", manager: "full", technical: "none", medical: "none" } },
  { key: "minors", label_es: "Datos de menores", label_en: "Minors data", matrix: { admin: "limited", manager: "limited", technical: "limited", medical: "limited" } },
  { key: "communication", label_es: "Comunicación masiva", label_en: "Mass communication", matrix: { admin: "full", manager: "full", technical: "limited", medical: "none" } },
];

const ACCESS_LOG = [
  { ts: "2026-05-09 10:42", user: "Marta López", role: "medical", action: "Vio historial médico de A. García", action_en: "Viewed A. García's medical record", area: "Salud", area_en: "Health" },
  { ts: "2026-05-09 09:31", user: "Carlos Ruiz", role: "admin", action: "Cambió permisos de equipo", action_en: "Changed team permissions", area: "Settings", area_en: "Settings" },
  { ts: "2026-05-08 18:05", user: "Lucía Pérez", role: "manager", action: "Exportó listado de cuotas pendientes", action_en: "Exported pending fees list", area: "Económico", area_en: "Economic" },
  { ts: "2026-05-08 16:22", user: "Marta López", role: "medical", action: "Editó parte de lesión", action_en: "Edited injury report", area: "Salud", area_en: "Health" },
  { ts: "2026-05-08 11:14", user: "Carlos Ruiz", role: "admin", action: "Invitó a nuevo miembro técnico", action_en: "Invited new technical member", area: "Settings", area_en: "Settings" },
];

const SUB_PROCESSORS = [
  { name: "SAITO Cloud", purpose: "Proveedor de infraestructura cloud: hosting, base de datos, auth y storage", purpose_en: "Cloud infrastructure provider: hosting, database, auth and storage", region: "EU", dpa: true },
  { name: "Proveedor de email transaccional", purpose: "Envío de notificaciones y comunicaciones por email", purpose_en: "Sending notifications and email communications", region: "EU/US", dpa: true },
  { name: "SAITO AI Gateway", purpose: "Proveedor de servicios de IA con privacidad por diseño", purpose_en: "AI services provider with privacy-by-design", region: "EU/US", dpa: true },
];

const RETENTION = [
  { area: "Pagos y facturación", area_en: "Payments & billing", period: "6 años", period_en: "6 years", basis: "Obligación legal contable", basis_en: "Legal accounting obligation" },
  { area: "Comunicaciones internas", area_en: "Internal communications", period: "24 meses", period_en: "24 months", basis: "Interés legítimo del club", basis_en: "Legitimate interest of the club" },
  { area: "Datos médicos", area_en: "Medical data", period: "Mientras dure la relación + 5 años", period_en: "Duration of relationship + 5 years", basis: "Categoría especial RGPD art. 9", basis_en: "Special category GDPR art. 9" },
  { area: "Logs de acceso sensible", area_en: "Sensitive access logs", period: "12 meses", period_en: "12 months", basis: "Auditoría y seguridad", basis_en: "Audit and security" },
];

const AI_MODULES_BASE = [
  { module: "Resúmenes en comunicación", module_en: "Summaries in communication", on: true },
  { module: "Sugerencias en cuotas y pagos", module_en: "Suggestions in fees and payments", on: true },
  { module: "Asistente en módulo médico", module_en: "Assistant in medical module", on: false },
  { module: "Generación de comunicados a familias", module_en: "Generation of family communications", on: true },
  { module: "Análisis de rendimiento deportivo", module_en: "Sports performance analysis", on: false },
];

function PrivacyMockup() {
  const { profile } = useAuth();
  const lang = (profile?.language ?? "en") as "es" | "en";
  const t = (es: string, en: string) => (lang === "en" ? en : es);

  const [aiState, setAiState] = useState(AI_MODULES_BASE);

  return (
    <>
      <PageHeader
        title={t("Privacidad y seguridad", "Privacy & security")}
        subtitle={t(
          "Vista previa de la configuración de privacidad del club. Mockup visual sin lógica activa.",
          "Preview of the club's privacy configuration. Visual mockup, not yet active.",
        )}
      />

      <div className="mb-4 flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-xs text-amber-700 dark:text-amber-300">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span>
          {t(
            "Esta sección es un mockup. Los datos mostrados son representativos y no reflejan configuración en producción.",
            "This section is a mockup. The data shown is illustrative and does not reflect production configuration.",
          )}
        </span>
      </div>

      <Card className="mb-6 p-6">
        <SectionTitle icon={Users} title={t("Estado de permisos por rol", "Role permissions status")} />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-3 py-2 font-semibold">{t("Recurso", "Resource")}</th>
                {ROLES.map((r) => <th key={r} className="px-3 py-2 font-semibold">{r}</th>)}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map((p) => (
                <tr key={p.key} className="border-t border-border">
                  <td className="px-3 py-2.5 font-medium">{lang === "es" ? p.label_es : p.label_en}</td>
                  {ROLES.map((r) => (
                    <td key={r} className="px-3 py-2.5"><PermBadge level={p.matrix[r]} lang={lang} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="mb-6 p-6">
        <SectionTitle icon={Activity} title={t("Registro de accesos sensibles", "Sensitive access log")} />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-3 py-2 font-semibold">{t("Fecha", "Date")}</th>
                <th className="px-3 py-2 font-semibold">{t("Usuario", "User")}</th>
                <th className="px-3 py-2 font-semibold">{t("Rol", "Role")}</th>
                <th className="px-3 py-2 font-semibold">{t("Acción", "Action")}</th>
                <th className="px-3 py-2 font-semibold">{t("Área", "Area")}</th>
              </tr>
            </thead>
            <tbody>
              {ACCESS_LOG.map((l, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-3 py-2 text-muted-foreground">{l.ts}</td>
                  <td className="px-3 py-2 font-medium">{l.user}</td>
                  <td className="px-3 py-2">
                    <span className="rounded-full border border-border px-2 py-0.5 text-[11px] uppercase tracking-wider">{l.role}</span>
                  </td>
                  <td className="px-3 py-2">{lang === "es" ? l.action : l.action_en}</td>
                  <td className="px-3 py-2 text-muted-foreground">{lang === "es" ? l.area : l.area_en}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="mb-6 p-6">
        <SectionTitle icon={Building2} title={t("Subencargados del tratamiento", "Sub-processors")} />
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {SUB_PROCESSORS.map((s) => (
            <div key={s.name} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-semibold">{s.name}</h4>
                <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">{s.region}</span>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">{lang === "es" ? s.purpose : s.purpose_en}</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                {t("Contrato de encargado firmado", "DPA signed")}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mb-6 p-6">
        <SectionTitle icon={Clock} title={t("Retención de datos", "Data retention")} />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-3 py-2 font-semibold">{t("Categoría", "Category")}</th>
                <th className="px-3 py-2 font-semibold">{t("Periodo", "Period")}</th>
                <th className="px-3 py-2 font-semibold">{t("Base legal", "Legal basis")}</th>
              </tr>
            </thead>
            <tbody>
              {RETENTION.map((r) => (
                <tr key={r.area} className="border-t border-border">
                  <td className="px-3 py-2.5 font-medium">{lang === "es" ? r.area : r.area_en}</td>
                  <td className="px-3 py-2.5">{lang === "es" ? r.period : r.period_en}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{lang === "es" ? r.basis : r.basis_en}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <SectionTitle icon={Brain} title={t("IA por módulo", "AI per module")} />
        <p className="mt-1.5 text-xs text-muted-foreground">
          {t(
            "Activa o desactiva la IA en cada área. La IA solo accede a información que el usuario ya tiene permiso para ver.",
            "Enable or disable AI per area. AI only accesses information the user already has permission to view.",
          )}
        </p>
        <div className="mt-4 space-y-2">
          {aiState.map((m, i) => (
            <div key={m.module} className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
              <div className="flex items-center gap-3">
                {m.on ? <Eye className="h-4 w-4 text-primary" /> : <XCircle className="h-4 w-4 text-muted-foreground" />}
                <span className="text-sm font-medium">{lang === "es" ? m.module : m.module_en}</span>
              </div>
              <button
                type="button"
                onClick={() => setAiState((s) => s.map((x, j) => (j === i ? { ...x, on: !x.on } : x)))}
                className={`relative h-6 w-11 rounded-full transition ${m.on ? "bg-primary" : "bg-muted"}`}
                aria-label={m.on ? "disable" : "enable"}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${m.on ? "left-5" : "left-0.5"}`} />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: React.ComponentType<{ className?: string }>; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <h2 className="text-base font-semibold">{title}</h2>
      <ShieldCheck className="ml-auto h-4 w-4 text-muted-foreground/40" />
    </div>
  );
}

function PermBadge({ level, lang }: { level: "full" | "limited" | "none"; lang: "es" | "en" }) {
  const map = {
    full: { label: lang === "es" ? "Completo" : "Full", cls: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
    limited: { label: lang === "es" ? "Limitado" : "Limited", cls: "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400" },
    none: { label: lang === "es" ? "Sin acceso" : "None", cls: "border-border bg-muted text-muted-foreground" },
  } as const;
  const v = map[level];
  return <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium ${v.cls}`}>{v.label}</span>;
}
