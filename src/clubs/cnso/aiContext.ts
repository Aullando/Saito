// CNSO AI context — feeds the SAITO assistant when the active club is CNSO.
import {
  CNSO_SESSIONS,
  CNSO_INCIDENTS,
  CNSO_ABSENCES,
  CNSO_COACHES,
  CNSO_MEMBERS,
  CNSO_VENUES,
  CNSO_ROOMS,
  CNSO_CLINIC_SESSIONS,
  CNSO_WORKOUTS,
  CNSO_SETS,
  CNSO_DRILLS,
  CNSO_COMPETITIONS,
  CNSO_SECTIONS,
} from "./seed";
import { resolveCnsoIdentity, type CnsoIdentity, type CnsoScope } from "./identity";
import type { Role } from "@/lib/types";

const today = () => new Date().toISOString().slice(0, 10);

function compactSession(s: (typeof CNSO_SESSIONS)[number]) {
  const venue = CNSO_VENUES.find((v) => v.id === s.venueId)?.name;
  return {
    id: s.id,
    fecha: s.date,
    hora: s.time,
    actividad: s.activity,
    sede: venue,
    calle: s.roomLabel,
    entrenador: s.primaryCoach,
    sustituto: s.substituteCoach,
    aforo: s.capacity,
    reservados: s.bookings.length,
    espera: s.waitlist.length,
    estado: s.status,
  };
}

type CnsoUserLike = { id: string; email?: string | null } | null | undefined;

/** Construye el JSON de contexto para la IA del club CNSO. */
export function buildCnsoContext(role: Role | string, user: CnsoUserLike, rolesArg?: Role[]) {
  const roles = (rolesArg ?? [role as Role]).filter(Boolean) as Role[];
  const identity = resolveCnsoIdentity(user, roles);
  return buildCnsoContextFromIdentity(identity);
}

export function buildCnsoContextFromIdentity(identity: CnsoIdentity) {
  const fechaHoy = today();
  const sedes = CNSO_VENUES.map((v) => ({
    id: v.id,
    nombre: v.name,
    zona: v.zone,
    estado: v.status,
  }));
  const calles = CNSO_ROOMS.map((r) => ({
    id: r.id,
    sedeId: r.venueId,
    nombre: r.name,
    capacidad: r.capacity,
    tipo: r.type,
    estado: r.status,
  }));

  // Dirección → cockpit completo
  if (identity.scope === "direccion") {
    const incidenciasAbiertas = CNSO_INCIDENTS.filter((i) => i.status !== "resolved");
    return {
      club: "Club Natación Santa Olaya",
      alcance: "direccion" as const,
      fechaHoy,
      sedes,
      calles,
      secciones: CNSO_SECTIONS.map((s) => ({
        id: s.id,
        nombre: s.name,
        categoria: s.category,
        responsable: s.responsible,
        nadadores: s.membersCount,
      })),
      sesionesHoy: CNSO_SESSIONS.filter((s) => s.date === fechaHoy).map(compactSession),
      sesionesProximas: CNSO_SESSIONS.filter((s) => s.date > fechaHoy).map(compactSession),
      sesionesSinEntrenador: CNSO_SESSIONS.filter(
        (s) => s.date === fechaHoy && !s.primaryCoach,
      ).map(compactSession),
      entrenadores: CNSO_COACHES.map((c) => ({
        nombre: c.name,
        especialidad: c.specialty,
        estado: c.status,
        horasContratadas: c.contractedHours,
        horasTotales: c.totalHours,
      })),
      incidencias: incidenciasAbiertas,
      ausenciasPendientes: CNSO_ABSENCES.filter((a) => a.status === "requested"),
      tecnificacion: CNSO_CLINIC_SESSIONS,
      competicionesProximas: CNSO_COMPETITIONS.slice(0, 8),
      nadadoresTotales: CNSO_SECTIONS.reduce((a, s) => a + s.membersCount, 0),
      bibliotecaTotales: {
        drills: CNSO_DRILLS.length,
        sets: CNSO_SETS.length,
        workouts: CNSO_WORKOUTS.length,
      },
    };
  }

  // Entrenador → su día
  if (identity.scope === "tecnico") {
    const ref = identity.coachName ?? "";
    const mine = CNSO_SESSIONS.filter((s) => s.primaryCoach === ref || s.substituteCoach === ref);
    const horasSemana = mine
      .filter((c) => c.date >= fechaHoy)
      .reduce((acc, c) => acc + c.durationMin / 60, 0);
    return {
      club: "Club Natación Santa Olaya",
      alcance: "tecnico" as const,
      entrenador: ref,
      fechaHoy,
      sedes,
      misSesionesHoy: mine.filter((s) => s.date === fechaHoy).map(compactSession),
      misSesionesProximas: mine.filter((s) => s.date > fechaHoy).map(compactSession),
      misSesionesTecnificacion: CNSO_CLINIC_SESSIONS.filter((e) => e.coachName === ref),
      misIncidencias: CNSO_INCIDENTS.filter((i) => i.reportedBy === ref),
      misAusencias: CNSO_ABSENCES.filter((a) => a.coachName === ref),
      horasSemanaEstimadas: Number(horasSemana.toFixed(1)),
      competicionesProximas: CNSO_COMPETITIONS.slice(0, 5),
    };
  }

  // Socio / Nadador
  const memberNumber = identity.memberNumber ?? "";
  const me = CNSO_MEMBERS.find((m) => m.memberNumber === memberNumber);
  const misReservas = CNSO_SESSIONS.filter((s) => s.bookings.includes(memberNumber)).map(
    compactSession,
  );
  const disponibles = CNSO_SESSIONS.filter(
    (s) => s.date >= fechaHoy && !s.bookings.includes(memberNumber) && s.status !== "cancelled",
  ).map(compactSession);
  return {
    club: "Club Natación Santa Olaya",
    alcance: "socio" as const,
    socio: identity.memberName ?? "",
    numeroSocio: memberNumber,
    fechaHoy,
    sedes,
    actividad: me?.activity,
    nivel: me?.level,
    entrenador: me?.coachName,
    objetivo: me?.goal,
    mejoresMarcas: me?.bestTimes ?? [],
    misReservas,
    sesionesDisponibles: disponibles.slice(0, 30),
    misPlanes: CNSO_WORKOUTS.filter((w) => w.memberNumber === memberNumber),
    competicionesProximas: CNSO_COMPETITIONS.slice(0, 5),
  };
}

/** Sugerencias contextuales CNSO por alcance. */
export function cnsoSuggestions(
  role: Role | string,
  user?: CnsoUserLike,
  rolesArg?: Role[],
): string[] {
  const roles = (rolesArg ?? [role as Role]).filter(Boolean) as Role[];
  const id = resolveCnsoIdentity(user, roles);
  if (id.scope === "direccion") {
    return [
      "¿Qué sesiones de calle hay hoy y cuáles van llenas?",
      "¿Hay calles fuera de servicio o incidencias abiertas?",
      "¿Qué entrenadores están sobre el límite de horas?",
      "Resumen de próximas competiciones",
    ];
  }
  if (id.scope === "tecnico") {
    return [
      "¿Qué sesiones tengo hoy en la calle?",
      "¿Cuántas horas llevo esta semana?",
      "¿Tengo sesiones de tecnificación pendientes?",
    ];
  }
  return [
    "¿Cuáles son mis próximas reservas?",
    "¿Qué set me toca hoy?",
    "¿Cuándo es mi próxima competición?",
  ];
}

/** Resolver determinista local — fallback rápido cuando la IA no responde. */
export function cnsoLocalFallback(
  _role: string,
  ctx: ReturnType<typeof buildCnsoContextFromIdentity>,
  q: string,
): string | null {
  const text = q.toLowerCase();
  if (/sesion.*(hoy|del d[ií]a)|calle.*hoy/.test(text) && "sesionesHoy" in ctx) {
    const list = (ctx as Record<string, unknown>).sesionesHoy as ReturnType<typeof compactSession>[];
    if (!list?.length) return "No hay sesiones programadas hoy.";
    return (
      `**Sesiones de hoy (${list.length}):**\n` +
      list
        .map(
          (c) =>
            `- ${c.hora} · ${c.actividad} · ${c.sede ?? ""} ${c.calle ? "· " + c.calle : ""} (${c.reservados}/${c.aforo}) — ${c.entrenador}`,
        )
        .join("\n")
    );
  }
  if (/incidenc/.test(text) && "incidencias" in ctx) {
    const list = (ctx as Record<string, unknown>).incidencias as unknown[];
    return list?.length
      ? `Hay ${list.length} incidencia(s) abierta(s).`
      : "Sin incidencias abiertas.";
  }
  if (/competic/.test(text) && "competicionesProximas" in ctx) {
    const list = (ctx as Record<string, unknown>).competicionesProximas as Array<{
      date: string;
      name: string;
      venue: string;
    }>;
    if (!list?.length) return "No hay competiciones próximas.";
    return (
      `**Próximas competiciones:**\n` +
      list.map((c) => `- ${c.date} · ${c.name} · ${c.venue}`).join("\n")
    );
  }
  if ("misReservas" in ctx && /reserv/.test(text)) {
    const list = (ctx as Record<string, unknown>).misReservas as unknown[];
    return list?.length ? `Tienes ${list.length} reserva(s).` : "No tienes reservas próximas.";
  }
  return null;
}

export type { CnsoScope };
