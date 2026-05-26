// Sesiones de "calle de agua" + incidencias + ausencias para CNSO.

const today = () => new Date().toISOString().slice(0, 10);
const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};

export type CnsoSession = {
  clubId: "cnso";
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMin: number;
  activity: string;
  venueId: string;
  roomId: string;
  roomLabel: string;
  primaryCoach: string;
  substituteCoach?: string;
  capacity: number;
  bookings: string[]; // memberNumber refs
  waitlist: string[];
  status: "scheduled" | "confirmed" | "completed" | "cancelled";
  changeNote?: string;
};

export const CNSO_SESSIONS: CnsoSession[] = [
  {
    clubId: "cnso",
    id: "ses-1",
    date: today(),
    time: "06:30",
    durationMin: 120,
    activity: "Primer Equipo · Aeróbico extensivo",
    venueId: "s-mestas",
    roomId: "c-50-1",
    roomLabel: "Calle 1 (50 m)",
    primaryCoach: "Iván Méndez",
    capacity: 8,
    bookings: ["CNSO-04212", "CNSO-04999"],
    waitlist: [],
    status: "confirmed",
  },
  {
    clubId: "cnso",
    id: "ses-2",
    date: today(),
    time: "06:30",
    durationMin: 120,
    activity: "Primer Equipo · Velocidad",
    venueId: "s-mestas",
    roomId: "c-50-2",
    roomLabel: "Calle 2 (50 m)",
    primaryCoach: "Marta Solís",
    capacity: 8,
    bookings: ["CNSO-03988"],
    waitlist: [],
    status: "confirmed",
  },
  {
    clubId: "cnso",
    id: "ses-3",
    date: today(),
    time: "08:30",
    durationMin: 60,
    activity: "Squali · Fuerza seca",
    venueId: "s-squali",
    roomId: "sq-fuerza",
    roomLabel: "Squali Fuerza",
    primaryCoach: "Sergio Caso",
    capacity: 20,
    bookings: ["CNSO-04212", "CNSO-04999", "CNSO-05204"],
    waitlist: [],
    status: "confirmed",
  },
  {
    clubId: "cnso",
    id: "ses-4",
    date: today(),
    time: "17:00",
    durationMin: 60,
    activity: "Escuela Benjamín · 4 estilos",
    venueId: "s-mestas",
    roomId: "v-25",
    roomLabel: "Vaso 25 m",
    primaryCoach: "David Rubio",
    capacity: 30,
    bookings: ["CNSO-05500"],
    waitlist: [],
    status: "scheduled",
  },
  {
    clubId: "cnso",
    id: "ses-5",
    date: today(),
    time: "18:00",
    durationMin: 60,
    activity: "Escuela Alevín · Técnica crol",
    venueId: "s-mestas",
    roomId: "c-50-3",
    roomLabel: "Calle 3 (50 m)",
    primaryCoach: "Elena Pando",
    capacity: 8,
    bookings: ["CNSO-05122"],
    waitlist: [],
    status: "scheduled",
  },
  {
    clubId: "cnso",
    id: "ses-6",
    date: today(),
    time: "19:00",
    durationMin: 90,
    activity: "Tecnificación · Series umbral",
    venueId: "s-mestas",
    roomId: "c-50-4",
    roomLabel: "Calle 4 (50 m)",
    primaryCoach: "Marta Solís",
    capacity: 8,
    bookings: ["CNSO-03988", "CNSO-04444"],
    waitlist: [],
    status: "scheduled",
  },
  {
    clubId: "cnso",
    id: "ses-7",
    date: today(),
    time: "20:00",
    durationMin: 75,
    activity: "Grupo Máster",
    venueId: "s-mestas",
    roomId: "c-50-5",
    roomLabel: "Calle 5 (50 m)",
    primaryCoach: "Belén Tuñón",
    capacity: 16,
    bookings: ["CNSO-04777"],
    waitlist: [],
    status: "scheduled",
  },
  {
    clubId: "cnso",
    id: "ses-8",
    date: today(),
    time: "20:00",
    durationMin: 75,
    activity: "Waterpolo · Senior",
    venueId: "s-mestas",
    roomId: "c-50-7",
    roomLabel: "Calle 7 + 8",
    primaryCoach: "Hugo Vega",
    capacity: 16,
    bookings: ["CNSO-05204"],
    waitlist: [],
    status: "scheduled",
  },
  {
    clubId: "cnso",
    id: "ses-9",
    date: today(),
    time: "19:30",
    durationMin: 60,
    activity: "Natación Artística · Figuras",
    venueId: "s-mestas",
    roomId: "v-25",
    roomLabel: "Vaso 25 m",
    primaryCoach: "Sheila Casariego",
    capacity: 22,
    bookings: ["CNSO-05330"],
    waitlist: [],
    status: "scheduled",
  },
  {
    clubId: "cnso",
    id: "ses-10",
    date: today(),
    time: "18:30",
    durationMin: 75,
    activity: "Saltos · Trampolín 1 m",
    venueId: "s-mestas",
    roomId: "f-saltos",
    roomLabel: "Foso de saltos",
    primaryCoach: "Borja Estrada",
    capacity: 12,
    bookings: [],
    waitlist: [],
    status: "scheduled",
  },
  {
    clubId: "cnso",
    id: "ses-11",
    date: tomorrow(),
    time: "06:30",
    durationMin: 120,
    activity: "Primer Equipo · Aeróbico medio",
    venueId: "s-mestas",
    roomId: "c-50-1",
    roomLabel: "Calle 1 (50 m)",
    primaryCoach: "Iván Méndez",
    capacity: 8,
    bookings: ["CNSO-04212"],
    waitlist: [],
    status: "scheduled",
  },
  {
    clubId: "cnso",
    id: "ses-12",
    date: tomorrow(),
    time: "07:30",
    durationMin: 60,
    activity: "Triatlón · Aguas abiertas",
    venueId: "s-playa",
    roomId: "pl-aa",
    roomLabel: "San Lorenzo · zona acotada",
    primaryCoach: "Andrés Coto",
    capacity: 20,
    bookings: ["CNSO-05011"],
    waitlist: [],
    status: "scheduled",
    changeNote: "Sólo si oleaje ≤ 1 m. Verificar punto de salida.",
  },
];

// ─── Incidencias ─────────────────────────────────────────────────────────────
export type CnsoIncident = {
  clubId: "cnso";
  id: string;
  ts: string;
  sessionId?: string;
  reportedBy: string;
  type: "Calle" | "Material" | "Clima" | "Vestuarios" | "Otro";
  severity: "low" | "medium" | "high";
  description: string;
  status: "open" | "in_progress" | "resolved";
  resolvedBy?: string;
};

export const CNSO_INCIDENTS: CnsoIncident[] = [
  {
    clubId: "cnso",
    id: "inc-1",
    ts: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    sessionId: "ses-2",
    reportedBy: "Marta Solís",
    type: "Calle",
    severity: "medium",
    description: "Calle 6 fuera de uso por reparación de corchera.",
    status: "in_progress",
  },
  {
    clubId: "cnso",
    id: "inc-2",
    ts: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    reportedBy: "Hugo Vega",
    type: "Material",
    severity: "low",
    description: "Falta una portería de waterpolo, pedida reposición.",
    status: "open",
  },
];

// ─── Vacaciones / Ausencias ──────────────────────────────────────────────────
export type CnsoAbsence = {
  clubId: "cnso";
  id: string;
  coachName: string;
  from: string;
  to: string;
  reason: "Vacaciones" | "Enfermedad" | "Formación" | "Asuntos propios";
  detail?: string;
  status: "requested" | "approved" | "rejected";
  ts: string;
};

export const CNSO_ABSENCES: CnsoAbsence[] = [
  {
    clubId: "cnso",
    id: "abs-1",
    coachName: "Pablo Roces",
    from: today(),
    to: today(),
    reason: "Formación",
    detail: "Clinic RFEN sobre saltos en Madrid.",
    status: "approved",
    ts: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    clubId: "cnso",
    id: "abs-2",
    coachName: "Sheila Casariego",
    from: tomorrow(),
    to: tomorrow(),
    reason: "Asuntos propios",
    status: "requested",
    ts: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
];
