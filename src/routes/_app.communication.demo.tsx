import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { Plus, Megaphone, Briefcase, Send, CalendarCheck } from "lucide-react";

export const Route = createFileRoute("/_app/communication/demo")({
  head: () => ({ meta: [{ title: "Comunicación — SAITO" }] }),
  component: () => (
    <RoleGate roles={["admin", "manager", "medical"]}>
      <AppLayout>
        <CommDemoPage />
      </AppLayout>
    </RoleGate>
  ),
});

type Thread = {
  id: string;
  title: string;
  preview: string;
  time: string;
  unread?: number;
  icon: "circular" | "group" | "medical";
};

const THREADS: Thread[] = [
  {
    id: "1",
    icon: "circular",
    title: "Circulares",
    preview: "Revisión médica el 14 de julio",
    time: "10:20",
  },
  {
    id: "2",
    icon: "group",
    title: "Grupo Norte",
    preview: "Marta: ¿a qué hora quedamos?",
    time: "",
    unread: 3,
  },
  {
    id: "3",
    icon: "medical",
    title: "Solicitud de cita médica",
    preview: "Fisioterapia · molestias en el to…",
    time: "hoy",
  },
  {
    id: "4",
    icon: "group",
    title: "Familia de Nora ISERN",
    preview: "Confirmado, gracias",
    time: "ayer",
  },
];

function RainbowDot({ size = 40 }: { size?: number }) {
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

function ThreadIcon({ icon }: { icon: Thread["icon"] }) {
  if (icon === "circular")
    return (
      <div className="w-10 h-10 rounded-full bg-[#EEF3FB] flex items-center justify-center shrink-0">
        <Megaphone className="w-5 h-5 text-[#0067C9]" />
      </div>
    );
  if (icon === "medical")
    return (
      <div className="w-10 h-10 rounded-full bg-[#EEF3FB] flex items-center justify-center shrink-0">
        <Briefcase className="w-5 h-5 text-[#0067C9]" />
      </div>
    );
  return <RainbowDot />;
}

function CommDemoPage() {
  const [active, setActive] = useState("3");
  const [msg, setMsg] = useState("");

  return (
    <div className="p-8 max-w-[1500px]">
      <h1 className="text-3xl font-semibold text-[#0F1B2D] mb-4">Comunicación</h1>
      <button className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#0067C9] text-white font-medium mb-6 hover:opacity-90">
        <Plus className="w-4 h-4" />
        Nueva circular
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        {/* Inbox */}
        <aside className="bg-white rounded-2xl border border-[#E4EAF2] p-5 self-start">
          <h2 className="text-lg font-semibold text-[#0F1B2D] mb-4">Bandeja de entrada</h2>
          <ul className="space-y-2">
            {THREADS.map((t) => {
              const isActive = t.id === active;
              return (
                <li key={t.id}>
                  <button
                    onClick={() => setActive(t.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-colors ${
                      isActive ? "bg-[#EEF3FB]" : "hover:bg-[#F4F7FB]"
                    }`}
                  >
                    <ThreadIcon icon={t.icon} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[#0F1B2D] truncate">{t.title}</div>
                      <div className="text-sm text-[#6B7A90] truncate">{t.preview}</div>
                    </div>
                    <div className="text-xs text-[#8A98AE] shrink-0 flex flex-col items-end gap-1">
                      {t.time && <span>{t.time}</span>}
                      {t.unread && (
                        <span className="min-w-[22px] h-[22px] px-1.5 rounded-full bg-[#0067C9] text-white text-xs font-semibold flex items-center justify-center">
                          {t.unread}
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Chat */}
        <section className="bg-white rounded-2xl border border-[#E4EAF2] flex flex-col min-h-[600px]">
          <header className="flex items-center gap-3 p-6 border-b border-[#EEF1F6]">
            <div className="w-11 h-11 rounded-full bg-[#EEF3FB] flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-[#0067C9]" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#0F1B2D]">Solicitud de cita médica</h3>
              <p className="text-sm text-[#6B7A90]">Bruno CANO · Fisioterapia</p>
            </div>
          </header>

          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EEF3FB] text-[#0067C9] text-sm font-medium">
                <CalendarCheck className="w-4 h-4" />
                Solicitud generada automáticamente
              </span>
            </div>

            <div className="max-w-[70%]">
              <div className="text-sm font-semibold text-[#0F1B2D] mb-1">
                Bruno CANO · <span className="text-[#6B7A90] font-normal">Deportista</span>
              </div>
              <div className="rounded-2xl bg-[#F4F7FB] p-4 text-[#0F1B2D]">
                Solicitud de cita para <strong>Fisioterapia</strong>. Motivo: molestias en el
                tobillo tras el último partido.
              </div>
              <div className="text-xs text-[#8A98AE] mt-1">12:40</div>
            </div>

            <div className="max-w-[70%] ml-auto">
              <div className="rounded-2xl bg-[#0067C9] text-white p-4">
                Recibido. Te veo mañana a las 17:00 en la sala de fisioterapia. Ven con la
                equipación de entrenamiento.
              </div>
              <div className="text-xs text-[#8A98AE] mt-1 text-right">12:52</div>
            </div>

            <div className="max-w-[70%]">
              <div className="text-sm font-semibold text-[#0F1B2D] mb-1">
                Bruno CANO · <span className="text-[#6B7A90] font-normal">Deportista</span>
              </div>
              <div className="rounded-2xl bg-[#F4F7FB] p-4 text-[#0F1B2D]">Perfecto, gracias.</div>
              <div className="text-xs text-[#8A98AE] mt-1">12:54</div>
            </div>
          </div>

          <div className="p-4 border-t border-[#EEF1F6] flex items-center gap-3">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Escribe aquí"
              className="flex-1 px-4 py-3 rounded-full bg-[#F4F7FB] text-[#0F1B2D] placeholder:text-[#8A98AE] focus:outline-none"
            />
            <button className="inline-flex items-center gap-2 px-6 h-12 rounded-full bg-[#0067C9] text-white font-semibold hover:opacity-90">
              Enviar
              <Send className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
