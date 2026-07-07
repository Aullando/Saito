import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { ChevronLeft, ChevronRight, Clock, MapPin, Info, Check } from "lucide-react";

export const Route = createFileRoute("/_app/calendar/demo")({
  head: () => ({ meta: [{ title: "Calendario — SAITO" }] }),
  component: () => (
    <RoleGate roles={["admin", "manager"]}>
      <AppLayout>
        <CalendarDemoPage />
      </AppLayout>
    </RoleGate>
  ),
});

type EvtKind = "aflorado" | "editando" | "normal";
type Evt = { time: string; label: string; kind: EvtKind };
type Day = { n: number; muted?: boolean; today?: boolean; events?: Evt[] };

const DAYS: Day[] = [
  { n: 29, muted: true },
  { n: 30, muted: true },
  {
    n: 1,
    events: [
      { time: "18:00", label: "Grupo Norte", kind: "aflorado" },
      { time: "18:00", label: "Alevín", kind: "normal" },
    ],
  },
  { n: 2, events: [{ time: "18:00", label: "Grupo Norte", kind: "aflorado" }] },
  { n: 3, events: [{ time: "19:30", label: "Cadete", kind: "normal" }] },
  { n: 4, muted: true },
  { n: 5, muted: true },

  { n: 6, events: [
    { time: "18:00", label: "Grupo Norte", kind: "aflorado" },
    { time: "21:00", label: "Sénior", kind: "normal" },
  ] },
  { n: 7, today: true },
  {
    n: 8,
    events: [
      { time: "18:00", label: "Grupo Norte", kind: "editando" },
      { time: "20:00", label: "Cadete", kind: "aflorado" },
    ],
  },
  { n: 9, events: [{ time: "18:00", label: "Grupo Norte", kind: "aflorado" }] },
  { n: 10, events: [{ time: "18:00", label: "Grupo Norte", kind: "aflorado" }] },
  { n: 11, muted: true },
  { n: 12, muted: true },

  { n: 13, events: [{ time: "18:00", label: "Grupo Norte", kind: "aflorado" }] },
  { n: 14, events: [{ time: "18:00", label: "Grupo Norte", kind: "aflorado" }] },
  { n: 15, events: [{ time: "18:00", label: "Grupo Norte", kind: "aflorado" }] },
  { n: 16, events: [{ time: "18:00", label: "Grupo Norte", kind: "aflorado" }] },
  { n: 17, events: [{ time: "18:00", label: "Grupo Norte", kind: "aflorado" }] },
  { n: 18, muted: true },
  { n: 19, muted: true },
];

const EVENT_STYLES: Record<EvtKind, string> = {
  aflorado: "bg-[#E0EBFC] text-[#0067C9]",
  editando: "bg-[#FEE2E2] text-[#B91C1C]",
  normal: "bg-[#EEF3FB] text-[#334155]",
};

function Select({ label }: { label: string }) {
  return (
    <button className="flex items-center justify-between w-full px-5 py-3.5 bg-white rounded-2xl border border-[#E4EAF2] text-[#8A98AE] hover:border-[#0067C9]">
      <span>{label}</span>
      <ChevronRight className="w-4 h-4 rotate-90" />
    </button>
  );
}

function CalendarDemoPage() {
  const [reason, setReason] = useState("");

  return (
    <div className="p-8 max-w-[1500px]">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <h1 className="text-3xl font-semibold text-[#0F1B2D]">Calendario</h1>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-full bg-[#EEF3FB] text-[#0F1B2D] font-medium text-sm">
            Hoy
          </button>
          <button className="w-9 h-9 rounded-full bg-white border border-[#E4EAF2] flex items-center justify-center text-[#6B7A90]">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 rounded-full bg-white border border-[#E4EAF2] flex items-center justify-center text-[#6B7A90]">
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-xl font-semibold text-[#0F1B2D] ml-2">Julio 2026</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Select label="Seleccionar secciones" />
        <Select label="Seleccionar categorías" />
        <Select label="Seleccionar grupos" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Grid */}
        <div className="bg-white rounded-2xl border border-[#E4EAF2] overflow-hidden">
          <div className="grid grid-cols-7 text-xs font-medium text-[#8A98AE] border-b border-[#EEF1F6]">
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
              <div key={d} className="px-3 py-3">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {DAYS.map((d, i) => (
              <div
                key={i}
                className="min-h-[110px] p-2 border-r border-b border-[#F1F4F9] last:border-r-0"
              >
                <div className="flex justify-end mb-1">
                  {d.today ? (
                    <span className="w-7 h-7 rounded-full bg-[#0067C9] text-white text-sm font-semibold flex items-center justify-center">
                      {d.n}
                    </span>
                  ) : (
                    <span className={`text-sm ${d.muted ? "text-[#C7D0DD]" : "text-[#0F1B2D]"}`}>
                      {d.n}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  {d.events?.map((e, j) => (
                    <div
                      key={j}
                      className={`px-2 py-1 rounded-md text-[11px] font-medium truncate ${EVENT_STYLES[e.kind]}`}
                    >
                      {e.time} · {e.label}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side panel */}
        <aside className="bg-white rounded-2xl border border-[#E4EAF2] p-6 self-start space-y-5">
          <div>
            <h2 className="text-xl font-semibold text-[#0F1B2D]">
              Entrenamiento · Grupo Norte
            </h2>
            <span className="inline-flex items-center gap-1.5 mt-2 text-sm font-medium text-[#16A34A]">
              <Check className="w-4 h-4" /> Evento aflorado
            </span>
          </div>

          <div>
            <div className="text-xs text-[#8A98AE] mb-1.5">Fecha y hora</div>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#F4F7FB] text-[#0F1B2D]">
              <Clock className="w-4 h-4 text-[#6B7A90]" />
              <span>Mié 8 jul ·</span>
              <span className="line-through text-[#8A98AE]">18:00</span>
              <span>→</span>
              <span className="font-semibold">19:00</span>
            </div>
          </div>

          <div>
            <div className="text-xs text-[#8A98AE] mb-1.5">Ubicación</div>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#F4F7FB] text-[#0F1B2D]">
              <MapPin className="w-4 h-4 text-[#6B7A90]" />
              <span>El Prado · Pista central</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl px-3 py-3 text-sm bg-[#EEF3FB] text-[#0F1B2D]">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#0067C9]" />
            <span>
              Este evento ya tiene participantes y notificaciones enviadas. Al guardar el cambio
              de hora se enviará una <strong>notificación automática a 18 participantes</strong>.
            </span>
          </div>

          <div>
            <div className="text-xs text-[#8A98AE] mb-1.5">
              Motivo del cambio <span className="text-[#DC2626]">*</span>
            </div>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Cambio de disponibilidad de la instalación"
              className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#E4EAF2] text-sm text-[#0F1B2D] placeholder:text-[#8A98AE] focus:outline-none focus:border-[#0067C9]"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button className="flex-1 h-11 rounded-full border border-[#FCA5A5] text-[#DC2626] font-medium hover:bg-[#FEF2F2]">
              Cancelar evento
            </button>
            <button className="flex-1 h-11 rounded-full bg-[#0067C9] text-white font-medium hover:opacity-90">
              Guardar cambios
            </button>
          </div>

          <p className="text-center text-xs text-[#8A98AE]">
            Los eventos aflorados no se eliminan: se cancelan con motivo y aviso.
          </p>
        </aside>
      </div>
    </div>
  );
}
