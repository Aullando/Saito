export type FitStatus = "Apto" | "No apto" | "En revisión";

export type Incident = {
  id: string;
  athlete: string;
  date: string;
  type: string;
  description: string;
  restriction: string;
  fitness: FitStatus;
  responsible: string;
  attachments: string[];
};

export const INCIDENT_TYPES = [
  "Molestia muscular",
  "Sobrecarga",
  "Contusión",
  "Esguince",
  "Tendinopatía",
  "Otro",
];

export const SEED_INCIDENTS: Incident[] = [
  {
    id: "i1",
    athlete: "Alejandro Ruiz",
    date: "2026-05-15",
    type: "Esguince",
    description: "Molestia en tobillo derecho tras gesto técnico.",
    restriction: "Sin saltos ni cambios de dirección 7 días.",
    fitness: "No apto",
    responsible: "J. Romero (fisio)",
    attachments: ["parte_inicial.pdf"],
  },
  {
    id: "i2",
    athlete: "Marta Domínguez",
    date: "2026-05-12",
    type: "Sobrecarga",
    description: "Sobrecarga en isquiotibial izquierdo.",
    restriction: "Trabajo a intensidad ≤ 70%.",
    fitness: "En revisión",
    responsible: "J. Romero (fisio)",
    attachments: [],
  },
  {
    id: "i3",
    athlete: "Hugo López",
    date: "2026-05-09",
    type: "Contusión",
    description: "Contusión leve en rodilla.",
    restriction: "Sin restricciones operativas.",
    fitness: "Apto",
    responsible: "Dra. M. Vidal",
    attachments: ["alta.pdf"],
  },
];

export function fitnessClass(s: FitStatus) {
  return s === "Apto"
    ? "bg-emerald-100 text-emerald-800"
    : s === "No apto"
      ? "bg-rose-100 text-rose-800"
      : "bg-amber-100 text-amber-800";
}

export type Treatment = {
  id: string;
  athlete: string;
  title: string;
  responsible: string;
  sessionsDone: number;
  sessionsTotal: number;
  nextReview: string;
  status: "active" | "finished";
};

export const SEED_TREATMENTS: Treatment[] = [
  {
    id: "t1",
    athlete: "Alejandro Ruiz",
    title: "Protocolo tobillo · 4 semanas",
    responsible: "J. Romero (fisio)",
    sessionsDone: 5,
    sessionsTotal: 12,
    nextReview: "2026-05-22",
    status: "active",
  },
  {
    id: "t2",
    athlete: "Marta Domínguez",
    title: "Readaptación isquiotibial",
    responsible: "J. Romero (fisio)",
    sessionsDone: 2,
    sessionsTotal: 8,
    nextReview: "2026-05-20",
    status: "active",
  },
  {
    id: "t3",
    athlete: "Hugo López",
    title: "Recuperación contusión rodilla",
    responsible: "Dra. M. Vidal",
    sessionsDone: 6,
    sessionsTotal: 6,
    nextReview: "—",
    status: "finished",
  },
];

export type ApptRequest = {
  id: string;
  athlete: string;
  reason: string;
  specialty: string;
  preferred: string;
  requestedAt: string;
  status: "pending" | "managed";
};

export const SEED_REQUESTS: ApptRequest[] = [
  {
    id: "r1",
    athlete: "Lucía Martín",
    reason: "Reconocimiento anual",
    specialty: "Medicina deportiva",
    preferred: "2026-05-22",
    requestedAt: "hoy 09:12",
    status: "pending",
  },
  {
    id: "r2",
    athlete: "Pablo Sánchez",
    reason: "Molestia aductor",
    specialty: "Fisioterapia",
    preferred: "2026-05-20",
    requestedAt: "ayer",
    status: "pending",
  },
  {
    id: "r3",
    athlete: "Nadia Abad",
    reason: "Revisión post-incidencia",
    specialty: "Medicina deportiva",
    preferred: "2026-05-23",
    requestedAt: "hace 2 días",
    status: "managed",
  },
];
