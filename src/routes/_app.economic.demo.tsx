import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { Check } from "lucide-react";

export const Route = createFileRoute("/_app/economic/demo")({
  head: () => ({ meta: [{ title: "Cuotas y tasas — SAITO" }] }),
  component: () => (
    <RoleGate roles={["admin", "manager"]}>
      <AppLayout>
        <EconomicDemoPage />
      </AppLayout>
    </RoleGate>
  ),
});

const FEES = [
  { name: "Cuota mensual", amount: "42,00 €", freq: "Mensual", period: "Sep–Jun", to: "Grupo Norte" },
  { name: "Matrícula anual", amount: "55,00 €", freq: "Único", period: "Temporada", to: "Todos" },
  { name: "Desplazamientos", amount: "18,00 €", freq: "Puntual", period: "—", to: "Grupo Norte" },
];

const PAYMENTS = [
  { name: "Bruno CANO", sub: "Cuota mensual", amount: "42,00 €", status: "Pagado" as const },
  { name: "Vera MOLINS", sub: "Cuota mensual", amount: "42,00 €", status: "Pendiente" as const },
  { name: "Iker BALDA", sub: "Matrícula anual", amount: "55,00 €", status: "Pagado" as const },
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

function StatusBadge({ status }: { status: "Pagado" | "Pendiente" }) {
  return status === "Pagado" ? (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[#DCFCE7] text-[#166534]">
      <Check className="w-3.5 h-3.5" /> Pagado
    </span>
  ) : (
    <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-[#FEF3C7] text-[#92400E]">
      Pendiente
    </span>
  );
}

function EconomicDemoPage() {
  return (
    <div className="p-8 max-w-[1500px]">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <h1 className="text-3xl font-semibold text-[#0F1B2D]">Cuotas y tasas</h1>
        <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#DCFCE7] border border-[#86EFAC]">
          <span className="w-6 h-6 rounded-md bg-[#635BFF] flex items-center justify-center text-white font-bold text-xs">
            S
          </span>
          <span className="text-sm font-semibold text-[#166534]">
            Cobros conectados con Stripe
          </span>
          <Check className="w-4 h-4 text-[#166534]" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        <div className="space-y-6">
          <button className="px-5 py-2.5 rounded-xl bg-[#0F1B2D] text-white font-medium text-sm">
            Fútbol
          </button>

          <div className="bg-white rounded-2xl border border-[#E4EAF2] p-6">
            <h2 className="text-xl font-semibold text-[#0F1B2D] mb-5">Cuotas</h2>
            <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-4 text-xs text-[#8A98AE] pb-3 border-b border-[#EEF1F6]">
              <div>Nombre de cuota</div>
              <div>Importe</div>
              <div>Frecuencia</div>
              <div>Periodo</div>
              <div>Aplica a</div>
            </div>
            <ul className="divide-y divide-[#EEF1F6]">
              {FEES.map((f) => (
                <li key={f.name} className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-4 py-4 text-[#0F1B2D]">
                  <div className="font-semibold">{f.name}</div>
                  <div className="font-semibold">{f.amount}</div>
                  <div>{f.freq}</div>
                  <div>{f.period}</div>
                  <div>{f.to}</div>
                </li>
              ))}
            </ul>

            <h2 className="text-xl font-semibold text-[#0F1B2D] mt-8 mb-5">Estado de pagos</h2>
            <div className="grid grid-cols-[1.4fr_1.2fr_1fr_1fr] gap-4 text-xs text-[#8A98AE] pb-3 border-b border-[#EEF1F6]">
              <div>Atleta</div>
              <div>Suscripción</div>
              <div>Importe</div>
              <div>Estado</div>
            </div>
            <ul className="divide-y divide-[#EEF1F6]">
              {PAYMENTS.map((p) => (
                <li key={p.name} className="grid grid-cols-[1.4fr_1.2fr_1fr_1fr] gap-4 items-center py-4">
                  <div className="flex items-center gap-3">
                    <RainbowDot size={28} />
                    <span className="font-semibold text-[#0F1B2D]">{p.name}</span>
                  </div>
                  <div className="text-[#0F1B2D]">{p.sub}</div>
                  <div className="font-semibold text-[#0F1B2D]">{p.amount}</div>
                  <div><StatusBadge status={p.status} /></div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Side form */}
        <aside className="bg-white rounded-2xl border border-[#E4EAF2] p-6 self-start">
          <div className="flex gap-6 border-b border-[#EEF1F6] mb-5">
            <button className="text-[#0067C9] font-semibold pb-3 border-b-2 border-[#0067C9]">
              Cuota
            </button>
            <button className="text-[#8A98AE] pb-3">Otras tasas</button>
          </div>

          <div className="space-y-4">
            <Field label="Nombre de cuota" required value="Cuota mensual" />
            <Field label="Importe" required value="42,00 €" />
            <Field label="Frecuencia" required value="Mensual" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Desde" value="Sep 2026" />
              <Field label="Hasta" value="Jun 2027" />
            </div>
            <button className="w-full h-12 rounded-full bg-[#0067C9] text-white font-semibold hover:opacity-90">
              Añadir cuota
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, value, required }: { label: string; value: string; required?: boolean }) {
  return (
    <div>
      <div className="text-xs text-[#8A98AE] mb-1.5">
        {label} {required && <span className="text-[#DC2626]">*</span>}
      </div>
      <input
        defaultValue={value}
        className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#E4EAF2] text-sm text-[#0F1B2D] focus:outline-none focus:border-[#0067C9]"
      />
    </div>
  );
}
