import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { PageHeader, Card, Pill } from "@/components/ui-kit";
import { CheckCircle2, AlertCircle, Circle } from "lucide-react";
import { useTr } from "@/lib/i18n";

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

function QAPage() {
  const tr = useTr();

  const ROUTES: { area: string; path: string; role: string; status: Status; note?: string }[] = [
    { area: tr("Entrada directa (gate de contraseña + selector ES/EN/SR)", "Direct entry (password gate + ES/EN/SR selector)", "Direktan ulaz (lozinka + ES/EN/SR izbor)"), path: "/", role: tr("público", "public", "javno"), status: "ok", note: tr("Solo SAITO. El idioma elegido en el gate se persiste.", "SAITO only. Language picked at the gate persists.", "Samo SAITO. Jezik izabran na ulazu ostaje.") },
    { area: "Dashboard", path: "/dashboard", role: "admin · manager · technical · medical", status: "ok" },
    { area: tr("Club / instalaciones", "Club / facilities", "Klub / objekti"), path: "/club", role: "admin · manager", status: "ok" },
    { area: tr("Deportistas (filtros + ficha)", "Athletes (filters + profile)", "Sportisti (filteri + profil)"), path: "/athletes", role: "admin · manager · technical · medical", status: "ok" },
    { area: tr("Calendario (entrenos, partidos, reuniones)", "Calendar (training, matches, meetings)", "Kalendar (treninzi, utakmice, sastanci)"), path: "/calendar", role: "admin · manager · technical", status: "ok" },
    { area: tr("Asistencia y disponibilidad", "Attendance and availability", "Prisustvo i dostupnost"), path: "/attendance", role: "admin · manager · technical", status: "ok", note: tr("Mockup demo, listo para piloto", "Demo mockup, pilot-ready", "Demo model, spreman za pilot") },
    { area: tr("Comunicación segmentada", "Segmented communication", "Segmentirana komunikacija"), path: "/communication", role: "admin · manager · technical · medical", status: "ok" },
    { area: tr("Cuotas", "Fees", "Članarine"), path: "/economic/fees", role: "admin · manager", status: "ok" },
    { area: tr("Pagos", "Payments", "Plaćanja"), path: "/economic/payments", role: "admin · manager", status: "ok" },
    { area: tr("Citas médicas", "Medical appointments", "Medicinski termini"), path: "/medical/calendar", role: "medical", status: "ok" },
    { area: tr("Restricciones y lesiones", "Restrictions and injuries", "Ograničenja i povrede"), path: "/medical/restrictions", role: "medical · admin", status: "ok", note: tr("Datos representativos", "Illustrative data", "Ilustrativni podaci") },
    { area: tr("Privacidad y seguridad", "Privacy & security", "Privatnost i bezbednost"), path: "/settings/privacy", role: "admin · sysadmin", status: "ok" },
    { area: tr("Equipo y permisos", "Team & permissions", "Tim i dozvole"), path: "/settings/team", role: "admin", status: "ok" },
    { area: tr("Onboarding club", "Club onboarding", "Uvođenje kluba"), path: "/onboarding", role: "admin", status: "partial", note: tr("Wizard funcional, pendiente personalización por deporte", "Wizard working, sport-specific customization pending", "Čarobnjak radi, prilagođavanje po sportu na čekanju") },
    { area: tr("Cambio de rol dentro de la app (Topbar)", "In-app role switch (Topbar)", "Promena uloge unutar aplikacije (Topbar)"), path: "/dashboard", role: "demo", status: "ok", note: tr("5 perfiles SAITO: Dirección, Administración, Staff médico, Entrenador, Deportista.", "5 SAITO profiles: Manager, Admin, Medical, Coach, Athlete.", "5 SAITO profila: Direkcija, Administracija, Medicinsko, Trener, Sportista.") },
  ];

  const NON_BLOCKING: string[] = [
    tr("Notificaciones push reales (mockeadas en UI).", "Real push notifications (mocked in UI).", "Pravi push zahtevi (imitirano u UI)."),
    tr("Exportación CSV de cuotas y asistencia.", "CSV export of fees and attendance.", "CSV izvoz članarina i prisustva."),
    tr("Importación masiva de jugadores desde Excel.", "Bulk athlete import from Excel.", "Masovan uvoz sportista iz Excela."),
    tr("Firma electrónica de consentimientos médicos.", "Electronic signature of medical consents.", "Elektronski potpis medicinskih saglasnosti."),
    tr("Roles familia / jugador (vista propia) — pendiente de piloto fase 2.", "Family / player roles (personal view) — pending pilot phase 2.", "Uloge porodica / igrač (lični prikaz) — čeka pilot fazu 2."),
    tr("Integración real de pasarela de pago.", "Real payment gateway integration.", "Prava integracija platnog sistema."),
  ];

  const STATUS_META: Record<Status, { label: string; icon: typeof CheckCircle2; cls: string; tone: "success" | "warning" | "info" }> = {
    ok: { label: tr("Listo piloto", "Pilot ready", "Spreman za pilot"), icon: CheckCircle2, cls: "text-emerald-600", tone: "success" },
    partial: { label: tr("Parcial", "Partial", "Delimično"), icon: AlertCircle, cls: "text-amber-600", tone: "warning" },
    todo: { label: tr("Pendiente", "Pending", "Na čekanju"), icon: Circle, cls: "text-muted-foreground", tone: "info" },
  };

  const ok = ROUTES.filter((r) => r.status === "ok").length;
  const partial = ROUTES.filter((r) => r.status === "partial").length;
  return (
    <>
      <PageHeader
        title={tr("Checklist piloto", "Pilot checklist", "Pilot čeklista")}
        subtitle={tr(
          "Estado de los módulos antes de arrancar con un club piloto. Vista interna SAITO.",
          "Module status before starting with a pilot club. Internal SAITO view.",
          "Status modula pre pokretanja pilot kluba. Interni SAITO pregled.",
        )}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {tr("Listos", "Ready", "Spremno")}
          </div>
          <div className="mt-1 text-2xl font-bold text-emerald-600">{ok}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {tr("Parciales", "Partial", "Delimično")}
          </div>
          <div className="mt-1 text-2xl font-bold text-amber-600">{partial}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {tr("Total módulos auditados", "Total audited modules", "Ukupno pregledanih modula")}
          </div>
          <div className="mt-1 text-2xl font-bold">{ROUTES.length}</div>
        </Card>
      </div>

      <Card className="mt-6 p-0">
        <div className="border-b border-border px-5 py-3 text-sm font-semibold">
          {tr("Recorrido por rol", "Walkthrough by role", "Pregled po ulozi")}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-2 font-semibold">{tr("Módulo", "Module", "Modul")}</th>
                <th className="px-3 py-2 font-semibold">{tr("Ruta", "Route", "Ruta")}</th>
                <th className="px-3 py-2 font-semibold">{tr("Roles", "Roles", "Uloge")}</th>
                <th className="px-3 py-2 font-semibold">{tr("Estado", "Status", "Status")}</th>
                <th className="px-3 py-2 font-semibold">{tr("Notas", "Notes", "Napomene")}</th>
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
        <div className="text-sm font-semibold">{tr("Pendientes no bloqueantes para piloto", "Non-blocking items for pilot", "Stavke koje ne blokiraju pilot")}</div>
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
        <div className="text-sm font-semibold">{tr("Compromisos durante el piloto", "Commitments during the pilot", "Obaveze tokom pilota")}</div>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>• {tr("No se entrenan modelos de IA con los datos del club.", "AI models are not trained with club data.", "AI modeli se ne treniraju podacima kluba.")}</li>
          <li>• {tr("La IA no realiza diagnóstico médico; sólo organiza información clínico-administrativa.", "AI does not perform medical diagnosis; it only organizes clinical-administrative information.", "AI ne postavlja medicinske dijagnoze; samo organizuje kliničko-administrativne informacije.")}</li>
          <li>
            • {tr("Acceso a datos sensibles auditado y visible en", "Access to sensitive data is audited and visible at", "Pristup osetljivim podacima se beleži i vidljiv je u")}{" "}
            <Link to="/settings/privacy" className="text-primary hover:underline">/settings/privacy</Link>.
          </li>
          <li>• {tr("No se anuncian certificaciones que aún estén en proceso.", "No certifications still in progress are advertised.", "Ne najavljuju se sertifikati koji su još u toku.")}</li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <Pill tone="info">{tr("Versión Alpha", "Alpha version", "Alfa verzija")}</Pill>
          <Pill tone="success">{tr("Listo piloto", "Pilot ready", "Spreman za pilot")}</Pill>
        </div>
      </Card>
    </>
  );
}
