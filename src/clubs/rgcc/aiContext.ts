// RGCC AI context — feeds the SAITO assistant when the active club is RGCC.
// La identidad la resuelve resolveRgccIdentity (ver identity.ts), no full_name.
import {
  RGCC_SESSIONS,
  RGCC_INCIDENTS,
  RGCC_ABSENCES,
  RGCC_COACHES,
  RGCC_MEMBERS,
  RGCC_VENUES,
  RGCC_ROOMS,
  RGCC_PT_SESSIONS,
  RGCC_WORKOUTS,
  RGCC_ROUTINES,
  RGCC_EXERCISES,
} from "./seed";
import { resolveRgccIdentity, type RgccIdentity, type RgccScope } from "./identity";
import type { Role } from "@/lib/types";

const today = () => new Date().toISOString().slice(0, 10);

function compactSession(s: (typeof RGCC_SESSIONS)[number]) {
  const venue = RGCC_VENUES.find((v) => v.id === s.venueId)?.name;
  return {
    id: s.id,
    fecha: s.date,
    hora: s.time,
    actividad: s.activity,
    sede: venue,
    sala: s.roomLabel,
    monitor: s.primaryCoach,
    sustituto: s.substituteCoach,
    aforo: s.capacity,
    reservados: s.bookings.length,
    espera: s.waitlist.length,
    estado: s.status,
  };
}

type RgccUserLike = { id: string; email?: string | null } | null | undefined;

/**
 * Builds the JSON context delivered to the AI for the RGCC club.
 * El alcance se determina por la identidad RGCC (coordinacion / monitor / socio).
 */
export function buildRgccContext(role: Role | string, user: RgccUserLike, rolesArg?: Role[]) {
  const roles = (rolesArg ?? [role as Role]).filter(Boolean) as Role[];
  const identity = resolveRgccIdentity(user, roles);
  return buildRgccContextFromIdentity(identity);
}

export function buildRgccContextFromIdentity(identity: RgccIdentity) {
  const fechaHoy = today();
  const sedes = RGCC_VENUES.map((v) => ({
    id: v.id,
    nombre: v.name,
    zona: v.zone,
    estado: v.status,
  }));
  const salas = RGCC_ROOMS.map((r) => ({
    id: r.id,
    sedeId: r.venueId,
    nombre: r.name,
    capacidad: r.capacity,
  }));

  // Coordinación → cockpit completo
  if (identity.scope === "coordinacion") {
    const incidenciasAbiertas = RGCC_INCIDENTS.filter((i) => i.status !== "resolved");
    return {
      club: "Real Grupo de Cultura Covadonga",
      alcance: "coordinacion" as const,
      fechaHoy,
      sedes,
      salas,
      clasesHoy: RGCC_SESSIONS.filter((s) => s.date === fechaHoy).map(compactSession),
      clasesProximas: RGCC_SESSIONS.filter((s) => s.date > fechaHoy).map(compactSession),
      clasesSinMonitor: RGCC_SESSIONS.filter((s) => s.date === fechaHoy && !s.primaryCoach).map(
        compactSession,
      ),
      monitores: RGCC_COACHES.map((c) => ({
        nombre: c.name,
        especialidad: c.specialty,
        estado: c.status,
        horasContratadas: c.contractedHours,
        horasTotales: c.totalHours,
      })),
      incidencias: incidenciasAbiertas,
      ausenciasPendientes: RGCC_ABSENCES.filter((a) => a.status === "requested"),
      ep: RGCC_PT_SESSIONS,
      sociosTotales: RGCC_MEMBERS.length,
      bibliotecaTotales: {
        ejercicios: RGCC_EXERCISES.length,
        rutinas: RGCC_ROUTINES.length,
        workouts: RGCC_WORKOUTS.length,
      },
    };
  }

  // Monitor → su día
  if (identity.scope === "monitor") {
    const ref = identity.coachName ?? "";
    const mine = RGCC_SESSIONS.filter((s) => s.primaryCoach === ref || s.substituteCoach === ref);
    const horasSemana = mine
      .filter((c) => c.date >= fechaHoy)
      .reduce((acc, c) => acc + c.durationMin / 60, 0);
    return {
      club: "Real Grupo de Cultura Covadonga",
      alcance: "monitor" as const,
      monitor: ref,
      fechaHoy,
      sedes,
      misClasesHoy: mine.filter((s) => s.date === fechaHoy).map(compactSession),
      misClasesProximas: mine.filter((s) => s.date > fechaHoy).map(compactSession),
      misSesionesEp: RGCC_PT_SESSIONS.filter((e) => e.coachName === ref),
      misIncidencias: RGCC_INCIDENTS.filter((i) => i.reportedBy === ref),
      misAusencias: RGCC_ABSENCES.filter((a) => a.coachName === ref),
      horasSemanaEstimadas: Number(horasSemana.toFixed(1)),
    };
  }

  // Socio
  const memberNumber = identity.memberNumber ?? "";
  const misReservas = RGCC_SESSIONS.filter((s) => s.bookings.includes(memberNumber)).map(
    compactSession,
  );
  const disponibles = RGCC_SESSIONS.filter(
    (s) => s.date >= fechaHoy && !s.bookings.includes(memberNumber) && s.status !== "cancelled",
  ).map(compactSession);
  return {
    club: "Real Grupo de Cultura Covadonga",
    alcance: "socio" as const,
    socio: identity.memberName ?? "",
    numeroSocio: memberNumber,
    fechaHoy,
    sedes,
    misReservas,
    clasesDisponibles: disponibles.slice(0, 30),
    misWorkouts: RGCC_WORKOUTS.filter((w) => w.memberNumber === memberNumber),
  };
}

/** Sugerencias contextuales RGCC por alcance. */
export function rgccSuggestions(
  role: Role | string,
  user?: RgccUserLike,
  rolesArg?: Role[],
  lang: "es" | "en" | "sr" = "es",
): string[] {
  const roles = (rolesArg ?? [role as Role]).filter(Boolean) as Role[];
  const id = resolveRgccIdentity(user, roles);
  const dict = {
    coordinacion: {
      es: [
        "¿Qué clases hay hoy y cuáles van llenas?",
        "¿Hay clases sin monitor asignado?",
        "Resumen de incidencias abiertas",
        "¿Qué monitores están sobre su límite de horas?",
      ],
      en: [
        "Which classes are today and which are full?",
        "Are there classes without an assigned coach?",
        "Summary of open incidents",
        "Which coaches are over their hours limit?",
      ],
      sr: [
        "Koji časovi su danas i koji su popunjeni?",
        "Ima li časova bez dodeljenog trenera?",
        "Pregled otvorenih incidenata",
        "Koji treneri su prekoračili limit sati?",
      ],
    },
    monitor: {
      es: [
        "¿Qué clases tengo hoy?",
        "¿Tengo sesiones de entrenamiento personal pendientes?",
        "¿Cuántas horas llevo esta semana?",
      ],
      en: [
        "Which classes do I have today?",
        "Do I have pending personal training sessions?",
        "How many hours have I logged this week?",
      ],
      sr: [
        "Koje časove imam danas?",
        "Imam li zakazanih personalnih sesija?",
        "Koliko sati sam odradio ove nedelje?",
      ],
    },
    socio: {
      es: [
        "¿Cuáles son mis próximas reservas?",
        "¿Qué clases hay disponibles esta tarde?",
        "Recomiéndame una rutina sencilla",
      ],
      en: [
        "What are my upcoming bookings?",
        "Which classes are available this afternoon?",
        "Recommend me a simple routine",
      ],
      sr: [
        "Koje su moje sledeće rezervacije?",
        "Koji časovi su dostupni popodne?",
        "Preporuči mi jednostavnu rutinu",
      ],
    },
  } as const;
  const scope =
    id.scope === "coordinacion" ? "coordinacion" : id.scope === "monitor" ? "monitor" : "socio";
  return [...dict[scope][lang]];
}

/** Resolver determinista local — fallback rápido cuando la IA no responde. */
export function rgccLocalFallback(
  _role: string,
  ctx: ReturnType<typeof buildRgccContextFromIdentity>,
  q: string,
  lang: "es" | "en" | "sr" = "es",
): string | null {
  const text = q.toLowerCase();
  const T = {
    es: {
      todayHead: (n: number) => `**Clases de hoy (${n}):**\n`,
      noToday: "No hay clases programadas hoy.",
      noCoach: (n: number) => `Hay ${n} clase(s) sin monitor.`,
      allCoach: "No hay clases sin monitor hoy. ✅",
      openInc: (n: number) => `Hay ${n} incidencia(s) abierta(s).`,
      noInc: "Sin incidencias abiertas.",
      bookN: (n: number) => `Tienes ${n} reserva(s).`,
      noBook: "No tienes reservas próximas.",
    },
    en: {
      todayHead: (n: number) => `**Today's classes (${n}):**\n`,
      noToday: "No classes scheduled today.",
      noCoach: (n: number) => `There are ${n} class(es) without a coach.`,
      allCoach: "No classes without a coach today. ✅",
      openInc: (n: number) => `There are ${n} open incident(s).`,
      noInc: "No open incidents.",
      bookN: (n: number) => `You have ${n} booking(s).`,
      noBook: "You have no upcoming bookings.",
    },
    sr: {
      todayHead: (n: number) => `**Današnji časovi (${n}):**\n`,
      noToday: "Nema zakazanih časova danas.",
      noCoach: (n: number) => `Postoji ${n} čas(ova) bez trenera.`,
      allCoach: "Nema časova bez trenera danas. ✅",
      openInc: (n: number) => `Postoji ${n} otvoreni incident(a).`,
      noInc: "Nema otvorenih incidenata.",
      bookN: (n: number) => `Imate ${n} rezervaciju(e).`,
      noBook: "Nemate narednih rezervacija.",
    },
  }[lang];
  if (/clases?.*(hoy|del d[ií]a)|today.*class|class.*today|danas/.test(text) && "clasesHoy" in ctx) {
    const list = (ctx as Record<string, unknown>).clasesHoy as ReturnType<typeof compactSession>[];
    if (!list?.length) return T.noToday;
    return (
      T.todayHead(list.length) +
      list
        .map(
          (c) =>
            `- ${c.hora} · ${c.actividad} · ${c.sede ?? ""} ${c.sala ? "· " + c.sala : ""} (${c.reservados}/${c.aforo}) — ${c.monitor}`,
        )
        .join("\n")
    );
  }
  if (/sin monitor|without.*coach|bez trenera/.test(text) && "clasesSinMonitor" in ctx) {
    const list = (ctx as Record<string, unknown>).clasesSinMonitor as unknown[];
    return list?.length ? T.noCoach(list.length) : T.allCoach;
  }
  if (/incidenc|incident/.test(text) && "incidencias" in ctx) {
    const list = (ctx as Record<string, unknown>).incidencias as unknown[];
    return list?.length ? T.openInc(list.length) : T.noInc;
  }
  if ("misReservas" in ctx && /reserv|book|rezerv/.test(text)) {
    const list = (ctx as Record<string, unknown>).misReservas as unknown[];
    return list?.length ? T.bookN(list.length) : T.noBook;
  }
  return null;
}

export type { RgccScope };
