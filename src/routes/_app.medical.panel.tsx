import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { CalendarClock, AlertTriangle, Activity, Briefcase } from "lucide-react";
import { useTr } from "@/lib/i18n";


export const Route = createFileRoute("/_app/medical/panel")({
  head: () => ({ meta: [{ title: "Panel médico — SAITO" }] }),
  component: () => (
    <RoleGate roles={["medical", "admin"]}>
      <AppLayout>
        <MedicalPanelPage />
      </AppLayout>
    </RoleGate>
  ),
});

const AMBER = "#F59E0B";
const AMBER_SOFT = "#FEF3C7";

function Kpi({
  value,
  label,
  Icon,
}: {
  value: number | string;
  label: string;
  Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E4EAF2]">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-6"
        style={{ background: AMBER_SOFT }}
      >
        <Icon className="w-5 h-5" style={{ color: AMBER }} />
      </div>
      <div className="text-4xl font-semibold text-[#0F1B2D] leading-none">{value}</div>
      <div className="text-sm text-[#6B7A90] mt-2">{label}</div>
    </div>
  );
}

function RainbowDot({ size = 32 }: { size?: number }) {
  return (
    <div
      className="rounded-full shrink-0"
      style={{
        width: size,
        height: size,
        background:
          "conic-gradient(from 210deg,#F12F4A,#FDB113,#00A74D,#0067C9,#8A2BE2,#F12F4A)",
        WebkitMask: "radial-gradient(circle, transparent 42%, #000 44%)",
        mask: "radial-gradient(circle, transparent 42%, #000 44%)",
      }}
    />
  );
}

function MedicalPanelPage() {
  const tr = useTr();
  const APPOINTMENT_REQUESTS = [
    { id: "1", name: "Bruno CANO", detail: tr("Fisioterapia · hoy 12:40", "Physiotherapy · today 12:40", "Fizioterapija · danas 12:40") },
    { id: "2", name: "Vera MOLINS", detail: tr("Revisión · hoy 11:05", "Check-up · today 11:05", "Pregled · danas 11:05") },
  ];
  const NON_APT = [{ id: "1", name: "Iker BALDA", detail: tr("Cadete · Grupo Norte", "Cadet · North Group", "Kadet · Severna grupa") }];

  return (
    <div className="p-8 space-y-6 max-w-[1400px]">
      <h1 className="text-3xl font-semibold text-[#0F1B2D]">{tr("Panel médico", "Medical panel", "Medicinski panel")}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi value={3} label={tr("Citas hoy", "Appointments today", "Termini danas")} Icon={CalendarClock} />
        <Kpi value={2} label={tr("Solicitudes por atender", "Requests to review", "Zahtevi za obradu")} Icon={AlertTriangle} />
        <Kpi value={1} label={tr("Deportistas no aptos", "Unfit athletes", "Nesposobni sportisti")} Icon={Activity} />
        <Kpi value={6} label={tr("Planes activos", "Active plans", "Aktivni planovi")} Icon={Briefcase} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E4EAF2]">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-semibold text-[#0F1B2D]">{tr("Solicitudes de cita", "Appointment requests", "Zahtevi za termin")}</h2>
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ background: AMBER_SOFT, color: "#B45309" }}
            >
              {APPOINTMENT_REQUESTS.length} {tr("pendientes", "pending", "na čekanju")}
            </span>
          </div>
          <ul className="divide-y divide-[#EEF1F6]">
            {APPOINTMENT_REQUESTS.map((r) => (
              <li key={r.id} className="flex items-center gap-3 py-3">
                <RainbowDot />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[#0F1B2D]">{r.name}</div>
                  <div className="text-sm text-[#6B7A90]">{r.detail}</div>
                </div>
                <Link
                  to="/medical/athletes/$id"
                  params={{ id: r.id }}
                  className="inline-flex items-center text-white rounded-full px-5 h-10 font-medium hover:opacity-90"
                  style={{ background: AMBER }}
                >
                  {tr("Atender", "Attend", "Obradi")}
                </Link>

              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E4EAF2]">
          <h2 className="text-lg font-semibold text-[#0F1B2D] mb-4">{tr("Deportistas no aptos", "Unfit athletes", "Nesposobni sportisti")}</h2>
          <ul className="divide-y divide-[#EEF1F6]">
            {NON_APT.map((r) => (
              <li key={r.id} className="flex items-center gap-3 py-3">
                <RainbowDot />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[#0F1B2D]">{r.name}</div>
                  <div className="text-sm text-[#6B7A90]">{r.detail}</div>
                </div>
                <span
                  className="text-xs font-medium px-3 py-1 rounded-full border border-[#E4EAF2] text-[#6B7A90]"
                >
                  {tr("No apto", "Unfit", "Nesposoban")}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-center text-sm text-[#8A98AE] mt-6">
            {tr("El resto del grupo está apto para competir.", "The rest of the group is fit to compete.", "Ostatak grupe je spreman za takmičenje.")}
          </p>
        </div>
      </div>

      <MedicalDisclaimer />

      <div className="text-sm text-[#6B7A90]">
        <Link to="/medical/calendar" className="underline mr-4">{tr("Ver agenda", "View calendar", "Prikaži kalendar")}</Link>
        <Link to="/medical/restrictions" className="underline">{tr("Ver restricciones", "View restrictions", "Prikaži ograničenja")}</Link>
      </div>
    </div>
  );
}
