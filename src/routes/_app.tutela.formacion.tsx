import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { ArrowLeft, MapPin, Clock, ShieldCheck, Check } from "lucide-react";

export const Route = createFileRoute("/_app/tutela/formacion")({
  head: () => ({ meta: [{ title: "Tutela · Formación — SAITO" }] }),
  component: () => (
    <RoleGate roles={["admin", "manager"]}>
      <AppLayout>
        <TutelaFormacionPage />
      </AppLayout>
    </RoleGate>
  ),
});

type Tutela = "aceptada" | "pendiente" | "no_requiere";

const ROWS: {
  id: string;
  name: string;
  birth: string;
  age: number;
  tutela: Tutela;
  active: boolean;
}[] = [
  { id: "1", name: "Bruno CANO", birth: "12/03/2013", age: 13, tutela: "aceptada", active: true },
  { id: "2", name: "Nora ISERN", birth: "04/09/2013", age: 12, tutela: "pendiente", active: false },
  { id: "3", name: "Iker BALDA", birth: "22/01/2010", age: 16, tutela: "no_requiere", active: true },
  { id: "4", name: "Vera MOLINS", birth: "30/06/2012", age: 13, tutela: "aceptada", active: true },
  { id: "5", name: "Teo ARANDA", birth: "15/11/2013", age: 12, tutela: "pendiente", active: false },
];

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

function TutelaBadge({ t }: { t: Tutela }) {
  if (t === "aceptada")
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[#DCFCE7] text-[#166534]">
        <Check className="w-3.5 h-3.5" /> Tutela aceptada
      </span>
    );
  if (t === "pendiente")
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[#FEF3C7] text-[#92400E]">
        <Clock className="w-3.5 h-3.5" /> Pendiente de tutor
      </span>
    );
  return (
    <span className="text-xs font-medium px-3 py-1.5 rounded-full border border-[#E4EAF2] text-[#6B7A90]">
      No requiere tutor
    </span>
  );
}

function ActiveBadge({ active }: { active: boolean }) {
  return active ? (
    <span className="text-xs font-medium px-3 py-1.5 rounded-full text-[#166534]">Activo</span>
  ) : (
    <span className="text-xs font-medium px-3 py-1.5 rounded-full text-[#8A98AE]">Pendiente</span>
  );
}

function TutelaFormacionPage() {
  const aceptadas = 7;
  const pendientes = ROWS.filter((r) => r.tutela === "pendiente").length;
  const noReq = ROWS.filter((r) => r.tutela === "no_requiere").length;

  return (
    <div className="p-8 max-w-[1400px]">
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/athletes"
          className="w-10 h-10 rounded-full bg-white border border-[#E4EAF2] flex items-center justify-center text-[#6B7A90] hover:bg-[#F4F7FB]"
          aria-label="Volver"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-3xl font-semibold text-[#0F1B2D]">Categoría: Formación</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Main card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E4EAF2]">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold text-[#0067C9]">Grupo Norte</h2>
              <button className="text-[#8A98AE] hover:text-[#0067C9]" aria-label="Editar">
                ✎
              </button>
            </div>
            <div className="text-sm text-[#6B7A90]">
              11 deportistas · 2 staff técnico · 1 staff médico
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F4F7FB] text-sm text-[#0F1B2D]">
              <MapPin className="w-4 h-4 text-[#6B7A90]" /> Pabellón Central
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F4F7FB] text-sm text-[#0F1B2D]">
              <Clock className="w-4 h-4 text-[#6B7A90]" /> Lun · Mar · Mié · Jue · Vie
            </span>
          </div>

          <div className="grid grid-cols-[1fr_1fr_80px_1fr_100px] gap-4 text-xs text-[#8A98AE] pb-3 border-b border-[#EEF1F6]">
            <div>Deportista</div>
            <div>Nacimiento</div>
            <div>Edad</div>
            <div>Tutela</div>
            <div>Estado</div>
          </div>

          <ul className="divide-y divide-[#EEF1F6]">
            {ROWS.map((r) => (
              <li
                key={r.id}
                className="grid grid-cols-[1fr_1fr_80px_1fr_100px] gap-4 items-center py-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <RainbowDot size={28} />
                  <span className="font-semibold text-[#0F1B2D] truncate">{r.name}</span>
                </div>
                <div className="text-[#0F1B2D]">{r.birth}</div>
                <div className="text-[#0F1B2D]">{r.age}</div>
                <div>
                  <TutelaBadge t={r.tutela} />
                </div>
                <div>
                  <ActiveBadge active={r.active} />
                </div>
              </li>
            ))}
          </ul>

          <div
            className="mt-8 flex items-start gap-3 rounded-2xl px-4 py-3 text-sm bg-[#EEF3FB] text-[#0F1B2D]"
          >
            <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-[#0067C9]" />
            <span>
              El umbral de consentimiento se aplica automáticamente por país. En España,{" "}
              <strong>14 años</strong>. Un club puede exigir más edad, nunca menos.
            </span>
          </div>
        </div>

        {/* Sidebar counts */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E4EAF2] self-start">
          <h3 className="text-lg font-semibold text-[#0F1B2D] mb-6">Estado de tutela</h3>

          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-[#EEF1F6] pb-4">
              <span className="text-[#6B7A90]">Aceptadas</span>
              <span className="text-2xl font-semibold text-[#16A34A]">{aceptadas}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#EEF1F6] pb-4">
              <span className="text-[#6B7A90]">Pendientes de tutor</span>
              <span className="text-2xl font-semibold text-[#D97706]">{pendientes}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6B7A90]">No requieren tutor</span>
              <span className="text-2xl font-semibold text-[#0F1B2D]">{noReq}</span>
            </div>
          </div>

          <div className="mt-6 rounded-xl px-4 py-3 text-sm bg-[#FEF3C7] text-[#7C4A03]">
            Si un tutor rechaza la tutela, el administrador recibe un aviso y queda registrado
            en el historial de actividad.
          </div>
        </div>
      </div>
    </div>
  );
}
