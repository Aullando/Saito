import { useState } from "react";
import { ClipboardList, HeartPulse, Sparkles, UserRound } from "lucide-react";

interface Role {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  bullets: string[];
  prompt: string;
}

interface Props {
  title?: string;
  roles: Role[];
}

export function RoleTabs({ roles }: Props) {
  const [active, setActive] = useState(roles[0].key);
  const current = roles.find((r) => r.key === active)!;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-2 backdrop-blur">
      <div className="flex flex-wrap gap-1 rounded-2xl bg-white/5 p-1">
        {roles.map((r) => {
          const Icon = r.icon;
          const isActive = r.key === active;
          return (
            <button
              key={r.key}
              onClick={() => setActive(r.key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
                isActive ? "bg-white text-saito-navy shadow" : "text-white/70 hover:text-white"
              }`}
            >
              <Icon className="size-4" />
              {r.label}
            </button>
          );
        })}
      </div>
      <div className="grid gap-6 p-6 md:grid-cols-2">
        <ul className="space-y-3">
          {current.bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 text-white/85">
              <span className="mt-1 inline-block size-1.5 shrink-0 rounded-full bg-primary" />
              <span className="text-sm leading-relaxed">{b}</span>
            </li>
          ))}
        </ul>
        <div className="rounded-2xl border border-white/10 bg-saito-navy/60 p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/60">
            <Sparkles className="size-3.5" /> Asistente IA
          </div>
          <p className="mt-3 text-sm text-white/90">"{current.prompt}"</p>
          <div className="mt-4 rounded-xl bg-white/10 p-3 text-xs leading-relaxed text-white/80">
            SAITO está consultando datos de tu club… listo. Te muestro el resumen y propongo
            siguientes pasos.
          </div>
        </div>
      </div>
    </div>
  );
}

export const defaultRolesEs: Role[] = [
  {
    key: "direccion",
    label: "Dirección",
    icon: ClipboardList,
    bullets: [
      "Cuadro de mando con KPIs financieros y deportivos.",
      "Previsión de ingresos por sección y temporada.",
      "Alertas de bajas, impagos y ocupación de instalaciones.",
    ],
    prompt: "¿Cómo van las altas y bajas de socios este mes comparado con el anterior?",
  },
  {
    key: "tecnico",
    label: "Cuerpo técnico",
    icon: UserRound,
    bullets: [
      "Plantillas, asistencias y rendimiento por jugador.",
      "Planificación de entrenamientos y partidos.",
      "Comunicación directa con familias y deportistas.",
    ],
    prompt: "Prepárame el resumen de asistencia del Sub-16 de las últimas 4 semanas.",
  },
  {
    key: "medico",
    label: "Servicio médico",
    icon: HeartPulse,
    bullets: [
      "Historial médico, lesiones y revisiones.",
      "Protocolos de retorno y carga semanal.",
      "Permisos y consentimientos centralizados.",
    ],
    prompt: "¿Qué jugadores siguen en plan de readaptación esta semana?",
  },
  {
    key: "socio",
    label: "Socio / familia",
    icon: UserRound,
    bullets: [
      "App propia con calendario, pagos y comunicaciones.",
      "Reserva de instalaciones en un toque.",
      "Documentos y recibos siempre a mano.",
    ],
    prompt: "Inscríbeme al campus de verano y paga con la tarjeta guardada.",
  },
];

export const defaultRolesEn: Role[] = [
  {
    key: "direccion",
    label: "Leadership",
    icon: ClipboardList,
    bullets: [
      "Dashboard with financial and sporting KPIs.",
      "Revenue forecast by section and season.",
      "Alerts on churn, late payments and facility usage.",
    ],
    prompt: "How are member sign-ups and drop-offs trending vs. last month?",
  },
  {
    key: "tecnico",
    label: "Coaching staff",
    icon: UserRound,
    bullets: [
      "Squads, attendance and player performance.",
      "Training and match planning.",
      "Direct comms with athletes and families.",
    ],
    prompt: "Summarise U-16 training attendance for the last 4 weeks.",
  },
  {
    key: "medico",
    label: "Medical",
    icon: HeartPulse,
    bullets: [
      "Medical history, injuries and check-ups.",
      "Return-to-play protocols and weekly load.",
      "Consents and permissions in one place.",
    ],
    prompt: "Which players are still in return-to-play this week?",
  },
  {
    key: "socio",
    label: "Member / family",
    icon: UserRound,
    bullets: [
      "Own app with calendar, payments and comms.",
      "One-tap facility booking.",
      "All documents and receipts in one place.",
    ],
    prompt: "Sign me up for summer camp and charge my saved card.",
  },
];
