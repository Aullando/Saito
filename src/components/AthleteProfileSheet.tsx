import { useMemo } from "react";
import { Pill } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useData } from "@/lib/store";
import { toast } from "sonner";
import type { Role } from "@/lib/types";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import {
  CalendarDays,
  ClipboardList,
  CreditCard,
  FileText,
  HeartPulse,
  Megaphone,
  ShieldCheck,
  Stethoscope,
  Activity,
  Paperclip,
  BellOff,
  TrendingUp,
  Plus,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type AthleteLike = {
  id: string;
  first_name: string;
  last_name: string;
  section_id: string | null;
  category_id: string | null;
  status: string;
  medical_status: string;
  performance_status: string;
};

type ViewRole = "manager" | "technical" | "medical" | "athlete";

const ROLE_LABEL: Record<ViewRole, string> = {
  manager: "Administración / Gestor",
  technical: "Entrenador",
  medical: "Staff médico",
  athlete: "Atleta",
};

const ROLE_TONE: Record<ViewRole, string> = {
  manager: "bg-indigo-50 text-indigo-700 border-indigo-200",
  technical: "bg-amber-50 text-amber-700 border-amber-200",
  medical: "bg-rose-50 text-rose-700 border-rose-200",
  athlete: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function pickRole(roles: string[]): ViewRole {
  if (roles.includes("medical")) return "medical";
  if (roles.includes("technical")) return "technical";
  if (roles.includes("athlete")) return "athlete";
  return "manager";
}

export function AthleteProfileSheet({
  athlete,
  roles,
  sectionName,
  categoryName,
  groupNames,
}: {
  athlete: AthleteLike;
  roles: string[];
  sectionName: string;
  categoryName: string;
  groupNames: string[];
}) {
  const view = pickRole(roles);

  const payments = useData((s) => s.payments).filter((p) => p.athleteId === athlete.id);
  const appointments = useData((s) => s.appointments).filter((a) => a.athleteId === athlete.id);
  const events = useData((s) => s.events);

  const athleteEvents = useMemo(
    () =>
      events
        .filter((e) => e.athleteId === athlete.id || (athlete.section_id && e.sectionId === athlete.section_id))
        .sort((a, b) => `${a.date}T${a.startTime}`.localeCompare(`${b.date}T${b.startTime}`))
        .slice(0, 6),
    [events, athlete],
  );

  const pendingAmount = payments
    .filter((p) => p.status !== "Paid")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <>
      <SheetHeader>
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
            {athlete.first_name[0]}
            {athlete.last_name[0]}
          </div>
          <div className="min-w-0 flex-1">
            <SheetTitle className="text-xl">
              {athlete.first_name} {athlete.last_name.toUpperCase()}
            </SheetTitle>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Pill tone="info">{sectionName}</Pill>
              <Pill>{categoryName}</Pill>
              {(() => {
                const info = medicalStatusInfo(athlete.medical_status);
                return <Pill tone={info.tone}>{info.label}</Pill>;
              })()}
            </div>
            <div
              className={`mt-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${ROLE_TONE[view]}`}
            >
              <ShieldCheck className="h-3 w-3" />
              Vista según rol: {ROLE_LABEL[view]}
            </div>
          </div>
        </div>
      </SheetHeader>

      <div className="mt-6 space-y-4 text-sm">
        {view === "manager" && (
          <ManagerView
            athlete={athlete}
            groupNames={groupNames}
            payments={payments}
            pendingAmount={pendingAmount}
          />
        )}
        {view === "technical" && (
          <TechnicalView athlete={athlete} groupNames={groupNames} events={athleteEvents} />
        )}
        {view === "medical" && (
          <MedicalView athlete={athlete} appointments={appointments} />
        )}
        {view === "athlete" && (
          <AthleteView events={athleteEvents} appointments={appointments} />
        )}
      </div>
    </>
  );
}

// ────────── Helpers ──────────
function Section({
  title,
  icon: Icon,
  action,
  children,
}: {
  title: string;
  icon: LucideIcon;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
          {title}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1.5 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-slate-800">{value}</span>
    </div>
  );
}

const fmtEur = (n: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

// Safe-language helper for medical status. Never expose diagnosis or
// auto-derived clinical judgement — labels come from professional input.
function medicalStatusInfo(status: string): {
  label: "Apto" | "No apto" | "En revisión";
  tone: "success" | "danger" | "warning";
} {
  if (status === "Fit") return { label: "Apto", tone: "success" };
  if (status === "Injured") return { label: "No apto", tone: "danger" };
  return { label: "En revisión", tone: "warning" };
}

// ────────── ManagerView ──────────
function ManagerView({
  athlete,
  groupNames,
  payments,
  pendingAmount,
}: {
  athlete: AthleteLike;
  groupNames: string[];
  payments: { id: string; subscription: string; amount: number; status: string; date: string }[];
  pendingAmount: number;
}) {
  return (
    <>
      <Section title="Datos personales" icon={Users}>
        <Row label="Nombre" value={`${athlete.first_name} ${athlete.last_name}`} />
        <Row label="Estado" value={athlete.status} />
        <Row label="Grupos" value={groupNames.join(", ") || "—"} />
        <Row label="Tutor" value={"María López (madre) · 612 345 678"} />
      </Section>

      <Section title="Consentimientos" icon={ShieldCheck}>
        <Row label="RGPD" value={<Pill tone="success">Firmado</Pill>} />
        <Row label="Derechos de imagen" value={<Pill tone="success">Firmado</Pill>} />
        <Row label="Asistencia médica" value={<Pill tone="warning">Pendiente</Pill>} />
      </Section>

      <Section title="Cuotas y pagos" icon={CreditCard}>
        <Row label="Importe pendiente" value={fmtEur(pendingAmount)} />
        <div className="mt-2 divide-y divide-border text-xs">
          {payments.slice(0, 4).map((p) => (
            <div key={p.id} className="flex items-center justify-between py-1.5">
              <div>
                <div className="font-medium text-slate-800">{p.subscription}</div>
                <div className="text-[11px] text-muted-foreground">{p.date}</div>
              </div>
              <div className="flex items-center gap-2">
                <span>{fmtEur(p.amount)}</span>
                <Pill tone={p.status === "Paid" ? "success" : p.status === "Failed" ? "danger" : "warning"}>
                  {p.status}
                </Pill>
              </div>
            </div>
          ))}
          {payments.length === 0 && (
            <div className="py-2 text-muted-foreground">Sin pagos registrados.</div>
          )}
        </div>
      </Section>

      <Section title="Estado médico (resumen)" icon={HeartPulse}>
        <Row
          label="Aptitud"
          value={
            <Pill
              tone={
                athlete.medical_status === "Fit"
                  ? "success"
                  : athlete.medical_status === "Injured"
                    ? "danger"
                    : "warning"
              }
            >
              {athlete.medical_status}
            </Pill>
          }
        />
        <Row label="Detalle clínico" value={<span className="text-muted-foreground">Restringido al staff médico</span>} />
      </Section>
    </>
  );
}

// ────────── TechnicalView ──────────
function TechnicalView({
  athlete,
  groupNames,
  events,
}: {
  athlete: AthleteLike;
  groupNames: string[];
  events: { id: string; date: string; startTime: string; title: string; type: string }[];
}) {
  const restrictionTone =
    athlete.medical_status === "Fit" ? "success" : athlete.medical_status === "Injured" ? "danger" : "warning";
  const restrictionLabel =
    athlete.medical_status === "Fit"
      ? "Sin restricciones"
      : athlete.medical_status === "Injured"
        ? "No apto: trabajo individualizado"
        : "En revisión: cargas reducidas";

  return (
    <>
      <Section title="Datos deportivos" icon={Activity}>
        <Row label="Grupo principal" value={groupNames[0] ?? "—"} />
        <Row label="Otros grupos" value={groupNames.slice(1).join(", ") || "—"} />
        <Row label="Rendimiento" value={<Pill tone="info">{athlete.performance_status}</Pill>} />
        <Row label="Disponibilidad" value={<Pill tone="success">Activo</Pill>} />
      </Section>

      <Section title="Restricción operativa" icon={ShieldCheck}>
        <Pill tone={restrictionTone}>{restrictionLabel}</Pill>
        <p className="mt-2 text-xs text-muted-foreground">
          Información operativa sin diagnóstico ni detalle clínico.
        </p>
      </Section>

      <Section title="Asistencia (últimas 4 semanas)" icon={ClipboardList}>
        <Row label="Sesiones convocadas" value="12" />
        <Row label="Asistidas" value="11" />
        <Row label="% asistencia" value={<Pill tone="success">92%</Pill>} />
      </Section>

      <Section title="Valoraciones recientes" icon={TrendingUp}>
        <Row label="Técnica" value="8.2 / 10" />
        <Row label="Compromiso" value="9.0 / 10" />
        <Row label="Físico" value="7.5 / 10" />
      </Section>

      <Section title="Notas de sesión" icon={FileText}>
        <ul className="space-y-1.5 text-xs">
          <li className="rounded-lg bg-slate-50 p-2">
            <span className="font-medium">12/05 · Sesión técnica:</span> mejora visible en transiciones.
          </li>
          <li className="rounded-lg bg-slate-50 p-2">
            <span className="font-medium">08/05 · Carga:</span> recuperación buena tras serie.
          </li>
        </ul>
      </Section>

      <Section title="Próximas convocatorias" icon={CalendarDays}>
        {events.length === 0 ? (
          <div className="text-xs text-muted-foreground">Sin eventos.</div>
        ) : (
          <ul className="divide-y divide-border text-xs">
            {events.map((e) => (
              <li key={e.id} className="flex items-center justify-between py-1.5">
                <span className="truncate pr-2">{e.title}</span>
                <span className="text-muted-foreground">
                  {e.date} · {e.startTime}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}

// ────────── MedicalView ──────────
function MedicalView({
  athlete,
  appointments,
}: {
  athlete: AthleteLike;
  appointments: { id: string; date: string; time: string; reason: string; status: string; notes: string }[];
}) {
  return (
    <>
      <MedicalDisclaimer className="mb-3" />
      <Section
        title="Acciones"
        icon={Stethoscope}
        action={
          <Button size="sm" onClick={() => toast.success("Incidencia registrada")}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Registrar incidencia
          </Button>
        }
      >
        <p className="text-xs text-muted-foreground">
          Salud deportiva — información gestionada por staff médico autorizado.
        </p>
      </Section>

      <Section title="Registro de incidencias" icon={HeartPulse}>
        <ul className="space-y-2 text-xs">
          <li className="rounded-lg border border-rose-200 bg-rose-50 p-2">
            <div className="font-medium text-rose-900">Molestias aductor derecho · 02/05/2026</div>
            <div className="text-rose-700">Retirado de sesión. Hielo + descarga.</div>
          </li>
          <li className="rounded-lg border border-amber-200 bg-amber-50 p-2">
            <div className="font-medium text-amber-900">Molestia tobillo · 12/03/2026</div>
            <div className="text-amber-700">Estado apto introducido por staff médico tras 14 días.</div>
          </li>
        </ul>
      </Section>

      <Section title="Restricciones operativas" icon={ShieldCheck}>
        <Pill tone={athlete.medical_status === "Fit" ? "success" : "warning"}>
          {athlete.medical_status === "Fit" ? "Sin restricciones activas" : "Con restricciones"}
        </Pill>
        <ul className="mt-2 space-y-1 text-xs text-slate-700">
          <li>• Evitar trabajo pliométrico de alta intensidad.</li>
          <li>• No competición hasta revisión del 25/05.</li>
        </ul>
      </Section>

      <Section title="Citas médicas" icon={CalendarDays}>
        {appointments.length === 0 ? (
          <div className="text-xs text-muted-foreground">Sin citas registradas.</div>
        ) : (
          <ul className="divide-y divide-border text-xs">
            {appointments.map((a) => (
              <li key={a.id} className="py-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{a.reason}</span>
                  <Pill tone={a.status === "Completed" ? "success" : a.status === "Cancelled" ? "danger" : "info"}>
                    {a.status}
                  </Pill>
                </div>
                <div className="text-muted-foreground">
                  {a.date} · {a.time}
                </div>
                {a.notes && <div className="mt-1 text-slate-700">{a.notes}</div>}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Planes de tratamiento bajo supervisión" icon={ClipboardList}>
        <ul className="space-y-2 text-xs">
          <li className="rounded-lg bg-emerald-50 p-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-emerald-900">Readaptación aductor</span>
              <Pill tone="success">Activo</Pill>
            </div>
            <div className="text-emerald-700">Fase 2 · 3 sesiones/semana · fisio responsable: J. Romero</div>
          </li>
          <li className="rounded-lg bg-slate-100 p-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-700">Protocolo tobillo</span>
              <Pill>Finalizado</Pill>
            </div>
            <div className="text-slate-600">Estado apto introducido por staff médico el 26/03/2026.</div>
          </li>
        </ul>
      </Section>

      <Section title="Adjuntos clínicos" icon={Paperclip}>
        <ul className="space-y-1 text-xs">
          <li className="flex items-center justify-between rounded-lg bg-slate-50 px-2 py-1.5">
            <span>Informe ecografía aductor.pdf</span>
            <Button size="sm" variant="ghost">Ver</Button>
          </li>
          <li className="flex items-center justify-between rounded-lg bg-slate-50 px-2 py-1.5">
            <span>Reconocimiento médico anual.pdf</span>
            <Button size="sm" variant="ghost">Ver</Button>
          </li>
        </ul>
      </Section>
    </>
  );
}

// ────────── AthleteView ──────────
function AthleteView({
  events,
  appointments,
}: {
  events: { id: string; date: string; startTime: string; title: string; type: string }[];
  appointments: { id: string; date: string; time: string; reason: string; status: string }[];
}) {
  const next = events[0];
  return (
    <>
      <Section title="Próxima sesión" icon={CalendarDays}>
        {next ? (
          <div className="rounded-lg bg-indigo-50 p-3">
            <div className="font-semibold text-indigo-900">{next.title}</div>
            <div className="text-xs text-indigo-700">
              {next.date} · {next.startTime}
            </div>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">No hay sesiones próximas.</div>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => toast.success("Ausencia notificada")}>
            <BellOff className="mr-1.5 h-3.5 w-3.5" />
            Notificar ausencia
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("Feedback enviado")}>
            <Megaphone className="mr-1.5 h-3.5 w-3.5" />
            Feedback post-entreno
          </Button>
        </div>
      </Section>

      <Section title="Calendario personal" icon={CalendarDays}>
        {events.length === 0 ? (
          <div className="text-xs text-muted-foreground">Sin eventos.</div>
        ) : (
          <ul className="divide-y divide-border text-xs">
            {events.map((e) => (
              <li key={e.id} className="flex items-center justify-between py-1.5">
                <span className="truncate pr-2">{e.title}</span>
                <span className="text-muted-foreground">
                  {e.date} · {e.startTime}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section
        title="Plan de tratamiento"
        icon={ClipboardList}
        action={
          <Button size="sm" variant="outline" onClick={() => toast.success("Solicitud enviada")}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Solicitar cita
          </Button>
        }
      >
        <div className="rounded-lg bg-emerald-50 p-2 text-xs">
          <div className="font-medium text-emerald-900">Readaptación aductor · Fase 2</div>
          <div className="text-emerald-700">Próxima sesión fisio: jueves 12:00</div>
        </div>
        {appointments[0] && (
          <div className="mt-2 text-xs text-slate-700">
            Próxima cita médica: <strong>{appointments[0].date} · {appointments[0].time}</strong>
          </div>
        )}
      </Section>

      <Section title="Rendimiento" icon={TrendingUp}>
        <Row label="Asistencia mes" value={<Pill tone="success">92%</Pill>} />
        <Row label="RPE medio" value="6.5 / 10" />
        <Row label="Carga semanal" value="Media" />
      </Section>
    </>
  );
}
