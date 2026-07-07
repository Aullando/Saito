import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { ArrowLeft, Briefcase, Activity, ChevronDown, Plus, Shield, History } from "lucide-react";

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

// Demo data — mock ficha médica for capture 06 (Bruno CANO)
const ATHLETE = {
  name: "Bruno CANO",
  section: "Fútbol",
  category: "Formación",
  group: "Grupo Norte",
  license: "C-2048",
  insurance: "SM-7731",
  height: "1,69 m",
  weight: "58 kg",
};

const PLANS = [
  {
    id: "p1",
    title: "Recuperación de tobillo",
    subtitle: "Inicio 24/06 · 3 sesiones/semana · próxima revisión 14/07",
    status: "En curso",
  },
];

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
  const [apto, setApto] = useState(true);

  return (
    <div className="p-8 space-y-6 max-w-[1400px]">
      <div className="flex items-center gap-3">
        <Link
          to="/medical/panel"
          className="w-10 h-10 rounded-full bg-white border border-[#E4EAF2] flex items-center justify-center text-[#6B7A90] hover:bg-[#F4F7FB]"
          aria-label="Volver"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-3xl font-semibold text-[#0F1B2D]">{ATHLETE.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Perfil */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E4EAF2]">
          <div className="flex items-start gap-8">
            <RainbowRing size={96} />
            <div className="grid grid-cols-3 gap-x-8 gap-y-6 flex-1">
              <Field label="Sección" value={ATHLETE.section} />
              <Field label="Categoría" value={ATHLETE.category} />
              <Field label="Grupo" value={ATHLETE.group} />
              <Field label="Nº licencia" value={ATHLETE.license} />
              <Field label="Nº seguro médico" value={ATHLETE.insurance} />
              <Field
                label="Historial"
                value={
                  <button className="inline-flex items-center gap-1.5 text-[#0F1B2D] hover:text-[#0067C9]">
                    <History className="w-4 h-4" style={{ color: AMBER }} />
                    Ver historial
                  </button>
                }
              />
              <Field label="Altura" value={ATHLETE.height} />
              <Field label="Peso" value={ATHLETE.weight} />
            </div>
          </div>
        </div>

        {/* Lateral */}
        <div className="space-y-4">
          {/* Toggle apto */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E4EAF2]">
            <div className="text-xs text-[#8A98AE] mb-3">Estado médico</div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold text-[#0F1B2D]">
                {apto ? "Apto" : "No apto"}
              </span>
              <button
                onClick={() => setApto(!apto)}
                aria-label="Cambiar estado"
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

          {/* Registrar incidencia */}
          <button className="w-full bg-white rounded-2xl p-6 shadow-sm border border-[#E4EAF2] text-left hover:border-[#F59E0B] transition-colors">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
              style={{ background: AMBER_SOFT }}
            >
              <Briefcase className="w-5 h-5" style={{ color: AMBER }} />
            </div>
            <div className="text-lg font-semibold text-[#0F1B2D]">Registrar incidencia</div>
            <div className="text-sm text-[#6B7A90] mt-1">
              Registra lesiones o incidencias y consúltalas en el historial.
            </div>
          </button>
        </div>
      </div>

      {/* Planes */}
      <div className="space-y-3">
        <div className="flex items-baseline gap-2">
          <h2 className="text-xl font-semibold text-[#0F1B2D]">Planes de tratamiento activos</h2>
          <span className="text-sm text-[#8A98AE]">· {PLANS.length} plan</span>
        </div>

        <button
          className="inline-flex items-center gap-2 text-white rounded-full px-5 py-2.5 font-medium"
          style={{ background: AMBER }}
        >
          <Plus className="w-4 h-4" />
          Asignar plan
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

      {/* Privacy banner */}
      <div
        className="flex items-start gap-3 rounded-2xl px-4 py-3 text-sm"
        style={{ background: AMBER_SOFT, color: "#7C4A03" }}
      >
        <Shield className="w-5 h-5 shrink-0 mt-0.5" style={{ color: AMBER }} />
        <span>
          Tú registras el detalle clínico. El entrenador y el club solo ven el estado{" "}
          <strong>apto / no apto</strong>, nunca la causa.
        </span>
      </div>
    </div>
  );
}
