// RGCC AI context — feeds the SAITO assistant when the active club is RGCC.
// Adapted from covadonga-hub's copilot/roleContext.ts but mapped to SAITO seeds.
import {
  RGCC_SESSIONS, RGCC_INCIDENTS, RGCC_ABSENCES,
  RGCC_COACHES, RGCC_MEMBERS, RGCC_VENUES, RGCC_ROOMS,
  RGCC_PT_SESSIONS, RGCC_WORKOUTS, RGCC_ROUTINES, RGCC_EXERCISES,
} from "./seed";

const today = () => new Date().toISOString().slice(0, 10);

function compactSession(s: typeof RGCC_SESSIONS[number]) {
  const venue = RGCC_VENUES.find((v) => v.id === s.venueId)?.name;
  return {
    id: s.id, fecha: s.date, hora: s.time, actividad: s.activity,
    sede: venue, sala: s.roomLabel, monitor: s.primaryCoach,
    sustituto: s.substituteCoach, aforo: s.capacity,
    reservados: s.bookings.length, espera: s.waitlist.length,
    estado: s.status,
  };
}

/**
 * Builds the JSON context delivered to the AI for the RGCC club.
 * Filtered by SAITO role (admin/manager → club_admin, technical → coach, athlete → socio).
 */
export function buildRgccContext(role: string, userName?: string) {
  const fechaHoy = today();
  const sedes = RGCC_VENUES.map((v) => ({ id: v.id, nombre: v.name, zona: v.zone, estado: v.status }));
  const salas = RGCC_ROOMS.map((r) => ({ id: r.id, sedeId: r.venueId, nombre: r.name, capacidad: r.capacity }));

  // Admin / Manager → cockpit completo
  if (role === "admin" || role === "manager" || role === "sysadmin") {
    const incidenciasAbiertas = RGCC_INCIDENTS.filter((i) => i.status !== "resolved");
    return {
      club: "Real Grupo de Cultura Covadonga",
      rol: role,
      fechaHoy,
      sedes, salas,
      clasesHoy: RGCC_SESSIONS.filter((s) => s.date === fechaHoy).map(compactSession),
      clasesProximas: RGCC_SESSIONS.filter((s) => s.date > fechaHoy).map(compactSession),
      clasesSinMonitor: RGCC_SESSIONS
        .filter((s) => s.date === fechaHoy && !s.primaryCoach)
        .map(compactSession),
      monitores: RGCC_COACHES.map((c) => ({
        nombre: c.name, especialidad: c.specialty, estado: c.status,
        horasContratadas: c.contractedHours, horasTotales: c.totalHours,
      })),
      incidencias: incidenciasAbiertas,
      ausenciasPendientes: RGCC_ABSENCES.filter((a) => a.status === "requested"),
      ep: RGCC_PT_SESSIONS,
      sociosTotales: RGCC_MEMBERS.length,
      bibliotecaTotales: { ejercicios: RGCC_EXERCISES.length, rutinas: RGCC_ROUTINES.length, workouts: RGCC_WORKOUTS.length },
    };
  }

  // Coach (technical) → su día
  if (role === "technical") {
    const ref = userName ?? "";
    const mine = RGCC_SESSIONS.filter((s) => s.primaryCoach === ref || s.substituteCoach === ref);
    const horasSemana = mine
      .filter((c) => c.date >= fechaHoy)
      .reduce((acc, c) => acc + c.durationMin / 60, 0);
    return {
      club: "Real Grupo de Cultura Covadonga",
      rol: role,
      monitor: ref,
      fechaHoy,
      misClasesHoy: mine.filter((s) => s.date === fechaHoy).map(compactSession),
      misClasesProximas: mine.filter((s) => s.date > fechaHoy).map(compactSession),
      misSesionesEp: RGCC_PT_SESSIONS.filter((e) => e.coachName === ref),
      misIncidencias: RGCC_INCIDENTS.filter((i) => i.reportedBy === ref),
      misAusencias: RGCC_ABSENCES.filter((a) => a.coachName === ref),
      horasSemanaEstimadas: Number(horasSemana.toFixed(1)),
      sedes,
    };
  }

  // Socio / athlete
  const memberRef = userName ?? "";
  const misReservas = RGCC_SESSIONS.filter((s) => s.bookings.includes(memberRef)).map(compactSession);
  const disponibles = RGCC_SESSIONS
    .filter((s) => s.date >= fechaHoy && !s.bookings.includes(memberRef) && s.status !== "cancelled")
    .map(compactSession);
  return {
    club: "Real Grupo de Cultura Covadonga",
    rol: role,
    socio: memberRef,
    fechaHoy,
    sedes,
    misReservas,
    clasesDisponibles: disponibles.slice(0, 30),
    misWorkouts: RGCC_WORKOUTS.filter((w) => w.memberId === memberRef),
  };
}

/** Sugerencias contextuales RGCC por rol. */
export function rgccSuggestions(role: string): string[] {
  if (role === "admin" || role === "manager" || role === "sysadmin") {
    return [
      "¿Qué clases hay hoy y cuáles van llenas?",
      "¿Hay clases sin monitor asignado?",
      "Resumen de incidencias abiertas",
      "¿Qué monitores están sobre su límite de horas?",
    ];
  }
  if (role === "technical") {
    return [
      "¿Qué clases tengo hoy?",
      "¿Tengo sesiones de entrenamiento personal pendientes?",
      "¿Cuántas horas llevo esta semana?",
    ];
  }
  return [
    "¿Cuáles son mis próximas reservas?",
    "¿Qué clases hay disponibles esta tarde?",
    "Recomiéndame una rutina sencilla",
  ];
}

/** Resolver determinista local — fallback rápido cuando la IA no responde. */
export function rgccLocalFallback(role: string, ctx: ReturnType<typeof buildRgccContext>, q: string): string | null {
  const text = q.toLowerCase();
  if (/clases?.*(hoy|del d[ií]a)/.test(text) && "clasesHoy" in ctx) {
    const list = (ctx as any).clasesHoy as ReturnType<typeof compactSession>[];
    if (!list?.length) return "No hay clases programadas hoy.";
    return `**Clases de hoy (${list.length}):**\n` + list.map((c) => `- ${c.hora} · ${c.actividad} · ${c.sede ?? ""} ${c.sala ? "· " + c.sala : ""} (${c.reservados}/${c.aforo}) — ${c.monitor}`).join("\n");
  }
  if (/sin monitor/.test(text) && "clasesSinMonitor" in ctx) {
    const list = (ctx as any).clasesSinMonitor as any[];
    return list?.length ? `Hay ${list.length} clase(s) sin monitor.` : "No hay clases sin monitor hoy. ✅";
  }
  if (/incidenc/.test(text) && "incidencias" in ctx) {
    const list = (ctx as any).incidencias as any[];
    return list?.length ? `Hay ${list.length} incidencia(s) abierta(s).` : "Sin incidencias abiertas.";
  }
  return null;
}
