import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { ArrowLeft, Briefcase, Activity, ChevronDown, Plus, Shield, History } from "lucide-react";
import { useTr } from "@/lib/i18n";

export const Route = createFileRoute("/_app/medical/athletes/$id")({
  head: () => ({ meta: [{ title: "Ficha médica — SAITO" }] }),
  component: () => (
    <RoleGate roles={["medical", "admin"]}>
      <AppLayout>
        <MedicalAthletePage />
      </AppLayout>
    </RoleGate>
  ),
});

const AMBER = "#F59E0B";
const AMBER_SOFT = "#FEF3C7";

function RainbowRing({ size = 96 }: { size?: number }) {
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

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs text-[#8A98AE] mb-1">{label}</div>
      <div className="text-[15px] font-semibold text-[#0F1B2D]">{value}</div>
    </div>
  );
}

function MedicalAthletePage() {
  const tr = useTr();
  const [apto, setApto] = useState(true);

  const ATHLETE = {
    name: "Bruno CANO",
    section: tr("Fútbol", "Football", "Fudbal"),
    category: tr("Formación", "Youth", "Omladinski"),
    group: tr("Grupo Norte", "North Group", "Severna grupa"),
    license: "C-2048",
    insurance: "SM-7731",
    height: "1,69 m",
    weight: "58 kg",
  };

  const PLANS = [
    {
      id: "p1",
      title: tr("Recuperación de tobillo", "Ankle recovery", "Oporavak zgloba"),
      subtitle: tr(
        "Inicio 24/06 · 3 sesiones/semana · próxima revisión 14/07",
        "Start 24/06 · 3 sessions/week · next check-up 14/07",
        "Početak 24/06 · 3 sesije nedeljno · sledeći pregled 14/07",
      ),
      status: tr("En curso", "In progress", "U toku"),
    },
  ];

  return (
    <div className="p-8 space-y-6 max-w-[1400px]">
      <div className="flex items-center gap-3">
        <Link
          to="/medical/panel"
          className="w-10 h-10 rounded-full bg-white border border-[#E4EAF2] flex items-center justify-center text-[#6B7A90] hover:bg-[#F4F7FB]"
          aria-label={tr("Volver", "Back", "Nazad")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-3xl font-semibold text-[#0F1B2D]">{ATHLETE.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E4EAF2]">
          <div className="flex items-start gap-8">
            <RainbowRing size={96} />
            <div className="grid grid-cols-3 gap-x-8 gap-y-6 flex-1">
              <Field label={tr("Sección", "Section", "Sekcija")} value={ATHLETE.section} />
              <Field label={tr("Categoría", "Category", "Kategorija")} value={ATHLETE.category} />
              <Field label={tr("Grupo", "Group", "Grupa")} value={ATHLETE.group} />
              <Field label={tr("Nº licencia", "License #", "Br. licence")} value={ATHLETE.license} />
              <Field label={tr("Nº seguro médico", "Insurance #", "Br. osiguranja")} value={ATHLETE.insurance} />
              <Field
                label={tr("Historial", "History", "Istorija")}
                value={
                  <button className="inline-flex items-center gap-1.5 text-[#0F1B2D] hover:text-[#0067C9]">
                    <History className="w-4 h-4" style={{ color: AMBER }} />
                    {tr("Ver historial", "View history", "Prikaži istoriju")}
                  </button>
                }
              />
              <Field label={tr("Altura", "Height", "Visina")} value={ATHLETE.height} />
              <Field label={tr("Peso", "Weight", "Težina")} value={ATHLETE.weight} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E4EAF2]">
            <div className="text-xs text-[#8A98AE] mb-3">{tr("Estado médico", "Medical status", "Medicinski status")}</div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold text-[#0F1B2D]">
                {apto ? tr("Apto", "Fit", "Sposoban") : tr("No apto", "Unfit", "Nesposoban")}
              </span>
              <button
                onClick={() => setApto(!apto)}
                aria-label={tr("Cambiar estado", "Change status", "Promeni status")}
                className="relative w-14 h-8 rounded-full transition-colors"
                style={{ background: apto ? AMBER : "#D6DCE6" }}
              >
                <span
                  className="absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all"
                  style={{ left: apto ? "28px" : "4px" }}
                />
              </button>
            </div>
          </div>

          <button className="w-full bg-white rounded-2xl p-6 shadow-sm border border-[#E4EAF2] text-left hover:border-[#F59E0B] transition-colors">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
              style={{ background: AMBER_SOFT }}
            >
              <Briefcase className="w-5 h-5" style={{ color: AMBER }} />
            </div>
            <div className="text-lg font-semibold text-[#0F1B2D]">{tr("Registrar incidencia", "Log incident", "Prijavi incident")}</div>
            <div className="text-sm text-[#6B7A90] mt-1">
              {tr(
                "Registra lesiones o incidencias y consúltalas en el historial.",
                "Log injuries or incidents and review them in the history.",
                "Prijavite povrede ili incidente i pregledajte ih u istoriji.",
              )}
            </div>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline gap-2">
          <h2 className="text-xl font-semibold text-[#0F1B2D]">{tr("Planes de tratamiento activos", "Active treatment plans", "Aktivni planovi lečenja")}</h2>
          <span className="text-sm text-[#8A98AE]">· {PLANS.length} {tr("plan", "plan", "plan")}</span>
        </div>

        <button
          className="inline-flex items-center gap-2 text-white rounded-full px-5 py-2.5 font-medium"
          style={{ background: AMBER }}
        >
          <Plus className="w-4 h-4" />
          {tr("Asignar plan", "Assign plan", "Dodeli plan")}
        </button>

        <div className="space-y-3">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-[#E4EAF2] flex items-center gap-4"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: AMBER_SOFT }}
              >
                <Activity className="w-5 h-5" style={{ color: AMBER }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[#0F1B2D]">{p.title}</div>
                <div className="text-sm text-[#6B7A90]">{p.subtitle}</div>
              </div>
              <span
                className="text-xs font-medium px-3 py-1 rounded-full"
                style={{ background: AMBER_SOFT, color: "#B45309" }}
              >
                {p.status}
              </span>
              <ChevronDown className="w-5 h-5 text-[#8A98AE]" />
            </div>
          ))}
        </div>
      </div>

      <div
        className="flex items-start gap-3 rounded-2xl px-4 py-3 text-sm"
        style={{ background: AMBER_SOFT, color: "#7C4A03" }}
      >
        <Shield className="w-5 h-5 shrink-0 mt-0.5" style={{ color: AMBER }} />
        <span>
          {tr(
            "Tú registras el detalle clínico. El entrenador y el club solo ven el estado apto / no apto, nunca la causa.",
            "You log the clinical detail. The coach and the club only see the fit / unfit status, never the cause.",
            "Vi beležite kliničke detalje. Trener i klub vide samo status sposoban / nesposoban, nikada razlog.",
          )}
        </span>
      </div>
    </div>
  );
}
