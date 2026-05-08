// Sessions = "clases programadas" en SAITO (mapped from CLASES_SEED).
const today = () => new Date().toISOString().slice(0, 10);
const tomorrow = () => {
  const d = new Date(); d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};

export type RgccSession = {
  clubId: "rgcc";
  id: string;
  date: string;          // ISO YYYY-MM-DD
  time: string;          // HH:MM
  durationMin: number;
  activity: string;
  venueId: string;
  roomId: string;
  roomLabel: string;
  primaryCoach: string;
  substituteCoach?: string;
  capacity: number;
  bookings: string[];    // memberNumber refs
  waitlist: string[];
  status: "scheduled" | "confirmed" | "completed" | "cancelled";
  changeNote?: string;
};

export const RGCC_SESSIONS: RgccSession[] = [
  { clubId: "rgcc", id: "cl-1", date: today(), time: "08:30", durationMin: 55, activity: "TABATA", roomLabel: "GRUPOFIT", venueId: "s-grupo", roomId: "sala-grupofit", primaryCoach: "Sheila", capacity: 30, bookings: ["RGCC-04212","RGCC-05122","RGCC-04999"], waitlist: [], status: "confirmed" },
  { clubId: "rgcc", id: "cl-2", date: today(), time: "09:30", durationMin: 55, activity: "BODY WORKOUT", roomLabel: "GRUPOFIT", venueId: "s-grupo", roomId: "sala-grupofit", primaryCoach: "Maria Mato", capacity: 30, bookings: ["RGCC-05122"], waitlist: [], status: "scheduled" },
  { clubId: "rgcc", id: "cl-3", date: today(), time: "10:30", durationMin: 30, activity: "GAP 30", roomLabel: "GRUPOFIT", venueId: "s-grupo", roomId: "sala-grupofit", primaryCoach: "Hugo", capacity: 25, bookings: [], waitlist: [], status: "scheduled" },
  { clubId: "rgcc", id: "cl-4", date: today(), time: "17:30", durationMin: 55, activity: "TRX", roomLabel: "TRX", venueId: "s-grupo", roomId: "sala-trx", primaryCoach: "Maria A C", capacity: 14, bookings: ["RGCC-05011","RGCC-04555"], waitlist: [], status: "confirmed" },
  { clubId: "rgcc", id: "cl-5", date: today(), time: "18:30", durationMin: 55, activity: "CICLO INDOOR", roomLabel: "CICLO INDOOR", venueId: "s-grupo", roomId: "sala-ciclo", primaryCoach: "Jano", capacity: 22, bookings: ["RGCC-03988"], waitlist: [], status: "scheduled" },
  { clubId: "rgcc", id: "cl-6", date: today(), time: "19:00", durationMin: 55, activity: "PILATES SPRINGBOARD", roomLabel: "YOGA", venueId: "s-grupo", roomId: "sala-yoga", primaryCoach: "Patricia Rivas", capacity: 18, bookings: ["RGCC-04777"], waitlist: [], status: "confirmed" },
  { clubId: "rgcc", id: "cl-7", date: today(), time: "20:00", durationMin: 55, activity: "YOGA", roomLabel: "YOGA", venueId: "s-grupo", roomId: "sala-yoga", primaryCoach: "Patricia Rivas", capacity: 18, bookings: [], waitlist: [], status: "scheduled" },
  { clubId: "rgcc", id: "cl-10", date: today(), time: "10:00", durationMin: 55, activity: "GAP", roomLabel: "POLIVALENTE BEGOÑA", venueId: "s-begona", roomId: "sala-bego-poli", primaryCoach: "Sheila", capacity: 24, bookings: ["RGCC-04212"], waitlist: [], status: "scheduled" },
  { clubId: "rgcc", id: "cl-11", date: today(), time: "10:30", durationMin: 55, activity: "FUNCIONAL PLAYA", roomLabel: "GIMNASIO PLAYA", venueId: "s-grupin", roomId: "sala-grupin-gim", primaryCoach: "Sheila", capacity: 35, bookings: ["RGCC-05011"], waitlist: [], status: "scheduled" },
  { clubId: "rgcc", id: "cl-12", date: today(), time: "18:00", durationMin: 60, activity: "PÁDEL DIRIGIDO", roomLabel: "PISTA EXTERIOR MAREO", venueId: "s-mareo", roomId: "sala-mareo-ext", primaryCoach: "Juan", capacity: 12, bookings: ["RGCC-03988","RGCC-04777"], waitlist: [], status: "scheduled" },
  { clubId: "rgcc", id: "cl-8", date: tomorrow(), time: "08:30", durationMin: 55, activity: "PILATES", roomLabel: "MULTIUSOS 1", venueId: "s-grupo", roomId: "sala-mu1", primaryCoach: "Belén", capacity: 20, bookings: ["RGCC-04212"], waitlist: [], status: "scheduled" },
  { clubId: "rgcc", id: "cl-9", date: tomorrow(), time: "18:30", durationMin: 55, activity: "CICLO INDOOR", roomLabel: "CICLO INDOOR", venueId: "s-grupo", roomId: "sala-ciclo", primaryCoach: "Juan", capacity: 22, bookings: [], waitlist: [], status: "scheduled" },
];

// ─── Incidents ──────────────────────────────────────────────────────────────
export type RgccIncident = {
  clubId: "rgcc"; id: string; ts: string; sessionId?: string;
  reportedBy: string; type: "Sala" | "Material" | "Clase" | "Otro";
  severity: "low" | "medium" | "high"; description: string;
  status: "open" | "in_progress" | "resolved"; resolvedBy?: string;
};

export const RGCC_INCIDENTS: RgccIncident[] = [
  { clubId: "rgcc", id: "inc-1", ts: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), sessionId: "cl-4",
    reportedBy: "Maria A C", type: "Material", severity: "medium",
    description: "Falta una correa TRX, hay 13 puestos operativos.", status: "open" },
];

// ─── Absence/Vacation requests ─────────────────────────────────────────────
export type RgccAbsence = {
  clubId: "rgcc"; id: string; coachName: string; from: string; to: string;
  reason: "Vacaciones" | "Enfermedad" | "Asuntos propios" | "Otro";
  detail?: string; status: "requested" | "approved" | "rejected";
  ts: string; resolvedBy?: string;
};

export const RGCC_ABSENCES: RgccAbsence[] = [
  { clubId: "rgcc", id: "abs-1", coachName: "Jano", from: today(), to: today(),
    reason: "Enfermedad", detail: "Lumbalgia, parte médico enviado.",
    status: "requested", ts: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
];
