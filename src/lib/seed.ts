import type {
  User,
  Organization,
  Facility,
  SportSection,
  Category,
  Group,
  Athlete,
  CalendarEvent,
  Fee,
  Payment,
  Conversation,
  MedicalAppointment,
} from "./types";

export const DEMO_USERS: User[] = [
  {
    id: "u-sys",
    name: "SysAdmin SAITO",
    email: "sysadmin@saito.app",
    role: "sysadmin",
    language: "en",
    initials: "SS",
  },
  {
    id: "u-adm",
    name: "Carlos GARCÍA",
    email: "clubadmin0@saito.app",
    role: "admin",
    language: "en",
    initials: "CG",
  },
  {
    id: "u-mgr",
    name: "Carla LUIS",
    email: "professional0@saito.app",
    role: "manager",
    language: "es",
    initials: "CL",
  },
  {
    id: "u-tec",
    name: "Pol GUILLEN",
    email: "professional20@saito.app",
    role: "technical",
    language: "es",
    initials: "PG",
    specialty: "Gestor",
  },
  {
    id: "u-med",
    name: "Pol ECHEVARRÍA",
    email: "professional60@saito.app",
    role: "medical",
    language: "es",
    initials: "PE",
    specialty: "Fisioterapeuta",
    licenseNumber: "LIC-PROF-2808XW",
    area: "Gestor Deportivo",
  },
  {
    id: "u-ath",
    name: "Lucía MARTÍN",
    email: "athlete@saito.app",
    role: "athlete",
    language: "es",
    initials: "LM",
  },
  // Extra cast for messages
  {
    id: "u-ath-nadia",
    name: "Nadia ABAD",
    email: "athlete1@saito.app",
    role: "technical",
    language: "es",
    initials: "NA",
  },
];

const today = new Date();
const iso = (d: Date) => d.toISOString().slice(0, 10);

const isoAt = (y: number, m: number, d: number, h = 12, min = 0) =>
  new Date(y, m, d, h, min).toISOString();

// ───────── Organizaciones ─────────
// Organización principal: Real Club Deportivo Demo (org-3, mantenida para retrocompatibilidad).
export const ORGANIZATIONS: Organization[] = [
  {
    name: "Real Club Deportivo Demo",
    createdAt: isoAt(2024, 8, 1, 9, 0),
    updatedAt: isoAt(2026, 3, 15, 9, 0),
    aiEnabled: true,
  },
  {
    name: "Club Atletismo Sant Cugat",
    createdAt: isoAt(2024, 9, 5, 9, 0),
    updatedAt: isoAt(2026, 3, 1, 9, 0),
    aiEnabled: true,
  },
  {
    name: "Club Polideportivo Hortaleza",
    createdAt: isoAt(2024, 10, 12, 9, 0),
    updatedAt: isoAt(2026, 3, 1, 9, 0),
    aiEnabled: true,
  },
  {
    name: "Club Natación Triana",
    createdAt: isoAt(2024, 11, 20, 9, 0),
    updatedAt: isoAt(2026, 2, 28, 9, 0),
    aiEnabled: false,
  },
  {
    name: "Federación Española de Atletismo",
    createdAt: isoAt(2023, 5, 10, 9, 0),
    updatedAt: isoAt(2026, 1, 15, 9, 0),
    aiEnabled: false,
  },
].map((o, i) => ({ ...o, id: `org-${i + 1}`, status: "Active" as const }));

// ───────── Secciones ─────────
export const SECTIONS: SportSection[] = [
  { id: "sec-atletismo", name: "Atletismo", athleteCount: 0, managerCount: 2, staffCount: 4 },
  { id: "sec-futbol", name: "Fútbol", athleteCount: 0, managerCount: 2, staffCount: 5 },
  { id: "sec-natacion", name: "Natación", athleteCount: 0, managerCount: 2, staffCount: 3 },
  { id: "sec-baloncesto", name: "Baloncesto", athleteCount: 0, managerCount: 2, staffCount: 4 },
  { id: "sec-gimnasia", name: "Gimnasia", athleteCount: 0, managerCount: 1, staffCount: 3 },
];

// ───────── Instalaciones ─────────
export const FACILITIES: Facility[] = [
  {
    id: "f-pista",
    name: "Pista de Atletismo",
    location: "Madrid · Sede principal",
    sportSections: ["sec-atletismo"],
    status: "Active",
    photoUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=70",
    address: "Av. del Deporte 24, 28042 Madrid",
    capacity: 1200,
    sports: ["Atletismo"],
    nextActivity: "Hoy 17:30 · Tecnificación Infantil",
  },
  {
    id: "f-campo",
    name: "Campo de Fútbol Anexo",
    location: "Madrid · Sede principal",
    sportSections: ["sec-futbol"],
    status: "Active",
    photoUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=70",
    address: "Av. del Deporte 24, 28042 Madrid",
    capacity: 800,
    sports: ["Fútbol"],
    nextActivity: "Sábado 11:00 · Partido Juvenil",
  },
  {
    id: "f-piscina",
    name: "Piscina Cubierta",
    location: "Madrid · Sede principal",
    sportSections: ["sec-natacion"],
    status: "Active",
    photoUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=70",
    address: "Av. del Deporte 24, 28042 Madrid",
    capacity: 200,
    sports: ["Natación"],
    nextActivity: "Hoy 18:00 · Grupo Competición",
  },
  {
    id: "f-pabellon",
    name: "Pabellón Polideportivo",
    location: "Madrid · Sede principal",
    sportSections: ["sec-baloncesto", "sec-gimnasia"],
    status: "Active",
    photoUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=70",
    address: "Av. del Deporte 24, 28042 Madrid",
    capacity: 600,
    sports: ["Baloncesto", "Gimnasia"],
    nextActivity: "Mañana 10:00 · Escuela Benjamín",
  },
];

// ───────── Categorías ─────────
// Helper para construir categorías por sección.
const CAT_NAMES = ["Benjamín", "Alevín", "Infantil", "Cadete", "Juvenil", "Absoluto"] as const;

type CatKey = (typeof CAT_NAMES)[number];
const catId = (sec: string, cat: CatKey) =>
  `cat-${sec.replace("sec-", "")}-${cat
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")}`;

const SECTION_CATEGORIES: Record<string, CatKey[]> = {
  "sec-atletismo": ["Benjamín", "Alevín", "Infantil", "Absoluto"],
  "sec-futbol": ["Alevín", "Infantil", "Cadete", "Juvenil"],
  "sec-natacion": ["Benjamín", "Alevín", "Infantil", "Absoluto"],
  "sec-baloncesto": ["Infantil", "Cadete", "Juvenil"],
  "sec-gimnasia": ["Benjamín", "Alevín", "Infantil"],
};

export const CATEGORIES: Category[] = Object.entries(SECTION_CATEGORIES).flatMap(([sec, cats]) =>
  cats.map((c) => ({ id: catId(sec, c), name: c, sectionId: sec })),
);

// ───────── Grupos ─────────
// Cada categoría tiene 1-2 grupos: Escuela (Benjamín), Grupo A/B (alevín/infantil),
// Tecnificación (infantil), Competición (cadete/juvenil/absoluto).
const GROUP_TEMPLATE: Record<CatKey, string[]> = {
  Benjamín: ["Escuela"],
  Alevín: ["Grupo A"],
  Infantil: ["Grupo A", "Tecnificación"],
  Cadete: ["Competición"],
  Juvenil: ["Competición"],
  Absoluto: ["Competición"],
};

const groupId = (sec: string, cat: CatKey, group: string) =>
  `grp-${sec.replace("sec-", "")}-${cat
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")}-${group
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")}`;

export const GROUPS: Group[] = Object.entries(SECTION_CATEGORIES).flatMap(([sec, cats]) =>
  cats.flatMap((cat) =>
    GROUP_TEMPLATE[cat].map((g) => ({
      id: groupId(sec, cat, g),
      name: g,
      sectionId: sec,
      categoryId: catId(sec, cat),
    })),
  ),
);

// ───────── Deportistas ─────────
type AthleteSeed = {
  firstName: string;
  lastName: string;
  sectionId: string;
  categoryId: string;
  groupIds: string[];
  medicalStatus: Athlete["medicalStatus"];
  performanceStatus: Athlete["performanceStatus"];
};

const A = (
  firstName: string,
  lastName: string,
  sec: string,
  cat: CatKey,
  groups: string[],
  medical: Athlete["medicalStatus"] = "Fit",
  perf: Athlete["performanceStatus"] = "Medium",
): AthleteSeed => ({
  firstName,
  lastName,
  sectionId: sec,
  categoryId: catId(sec, cat),
  groupIds: groups.map((g) => groupId(sec, cat, g)),
  medicalStatus: medical,
  performanceStatus: perf,
});

const ATHLETE_SEEDS: AthleteSeed[] = [
  // Atletismo
  A("Lucía", "Martín García", "sec-atletismo", "Benjamín", ["Escuela"], "Fit", "Medium"),
  A("Hugo", "Sánchez López", "sec-atletismo", "Benjamín", ["Escuela"], "Fit", "Medium"),
  A("Martina", "Rodríguez Ruiz", "sec-atletismo", "Alevín", ["Grupo A"], "Fit", "Medium"),
  A("Pablo", "Gómez Fernández", "sec-atletismo", "Alevín", ["Grupo A"], "Under review", "Medium"),
  A("Carla", "Jiménez Moreno", "sec-atletismo", "Infantil", ["Tecnificación"], "Fit", "High"),
  A("Diego", "Hernández Castro", "sec-atletismo", "Infantil", ["Grupo A"], "Fit", "Medium"),
  A("Andrea", "Romero Díaz", "sec-atletismo", "Absoluto", ["Competición"], "Fit", "High"),
  A("Javier", "Iglesias Vega", "sec-atletismo", "Absoluto", ["Competición"], "Injured", "Low"),

  // Fútbol
  A("Mateo", "Álvarez Soler", "sec-futbol", "Alevín", ["Grupo A"], "Fit", "Medium"),
  A("Nicolás", "Torres Reyes", "sec-futbol", "Infantil", ["Grupo A"], "Fit", "High"),
  A("Adrián", "Navarro Gil", "sec-futbol", "Infantil", ["Grupo B"], "Fit", "Medium"),
  A("Marcos", "Vázquez Pardo", "sec-futbol", "Infantil", ["Grupo B"], "Under review", "Medium"),
  A("Iván", "Molina Cano", "sec-futbol", "Cadete", ["Competición"], "Fit", "High"),
  A("Álex", "Ortega Bravo", "sec-futbol", "Cadete", ["Competición"], "Injured", "Medium"),
  A("Daniel", "Serrano Marín", "sec-futbol", "Juvenil", ["Competición"], "Fit", "High"),
  A("Pol", "Cortés Lara", "sec-futbol", "Juvenil", ["Competición"], "Fit", "Medium"),

  // Natación
  A("Emma", "Domínguez Crespo", "sec-natacion", "Benjamín", ["Escuela"], "Fit", "Medium"),
  A("Leo", "Ramos Aguilar", "sec-natacion", "Benjamín", ["Escuela"], "Fit", "Medium"),
  A("Valeria", "Prieto Núñez", "sec-natacion", "Alevín", ["Grupo A"], "Fit", "High"),
  A("Sergio", "Calvo Herrero", "sec-natacion", "Infantil", ["Tecnificación"], "Fit", "High"),
  A("Noa", "Méndez Salas", "sec-natacion", "Infantil", ["Grupo A"], "Under review", "Medium"),
  A("Marta", "Blanco Ibáñez", "sec-natacion", "Absoluto", ["Competición"], "Fit", "High"),
  A("Raúl", "Aguirre Pascual", "sec-natacion", "Absoluto", ["Competición"], "Fit", "Medium"),

  // Baloncesto
  A("Daniela", "Ferrer Bosch", "sec-baloncesto", "Infantil", ["Grupo A"], "Fit", "Medium"),
  A("Bruno", "Riera Massana", "sec-baloncesto", "Infantil", ["Grupo A"], "Fit", "High"),
  A("Sara", "Vidal Esteve", "sec-baloncesto", "Cadete", ["Competición"], "Fit", "High"),
  A("Óscar", "Pons Bauzá", "sec-baloncesto", "Cadete", ["Competición"], "Injured", "Low"),
  A("Aitana", "Carmona Salvador", "sec-baloncesto", "Juvenil", ["Competición"], "Fit", "Medium"),
  A("Guillermo", "Reyes Cabrera", "sec-baloncesto", "Juvenil", ["Competición"], "Fit", "High"),

  // Gimnasia
  A("Julia", "Pastor León", "sec-gimnasia", "Benjamín", ["Escuela"], "Fit", "Medium"),
  A("Olivia", "Ferrer Tovar", "sec-gimnasia", "Alevín", ["Grupo A"], "Fit", "Medium"),
  A("Inés", "Cordero Plaza", "sec-gimnasia", "Infantil", ["Tecnificación"], "Fit", "High"),
  A("Vega", "Salgado Lorenzo", "sec-gimnasia", "Infantil", ["Grupo A"], "Under review", "Medium"),
];

export const ATHLETES: Athlete[] = ATHLETE_SEEDS.map((a, i) => ({
  id: `ath-${i + 1}`,
  ...a,
  status: i % 13 === 0 ? "Pending" : i % 17 === 0 ? "Inactive" : "Active",
}));

// Recalcular conteo de deportistas por sección.
SECTIONS.forEach((s) => {
  s.athleteCount = ATHLETES.filter((a) => a.sectionId === s.id).length;
});

// ───────── Calendario ─────────
// 2-4 eventos por día de semana, 0-2 fin de semana. Mezcla entrenamientos, partidos,
// citas médicas y reuniones. Cubre el mes actual completo.
export const EVENTS: CalendarEvent[] = (() => {
  const evs: CalendarEvent[] = [];
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let id = 1;

  // Plantilla de sesiones por día de semana.
  // Lunes/Miércoles/Viernes: atletismo + natación + gimnasia
  // Martes/Jueves: fútbol + baloncesto
  // Sábado: partidos
  // Domingo: descanso (1 evento opcional)
  const trainings: Record<number, Array<{ time: string; gid: string; title: string }>> = {
    1: [
      // Lunes
      {
        time: "17:00",
        gid: groupId("sec-atletismo", "Benjamín", "Escuela"),
        title: "Atletismo · Escuela Benjamín",
      },
      {
        time: "18:00",
        gid: groupId("sec-natacion", "Infantil", "Tecnificación"),
        title: "Natación · Tecnificación Infantil",
      },
      {
        time: "19:00",
        gid: groupId("sec-gimnasia", "Infantil", "Tecnificación"),
        title: "Gimnasia · Tecnificación Infantil",
      },
    ],
    2: [
      // Martes
      {
        time: "17:30",
        gid: groupId("sec-futbol", "Alevín", "Grupo A"),
        title: "Fútbol · Alevín Grupo A",
      },
      {
        time: "18:30",
        gid: groupId("sec-baloncesto", "Cadete", "Competición"),
        title: "Baloncesto · Cadete Competición",
      },
      {
        time: "20:00",
        gid: groupId("sec-futbol", "Juvenil", "Competición"),
        title: "Fútbol · Juvenil Competición",
      },
    ],
    3: [
      // Miércoles
      {
        time: "17:00",
        gid: groupId("sec-atletismo", "Alevín", "Grupo A"),
        title: "Atletismo · Alevín Grupo A",
      },
      {
        time: "18:00",
        gid: groupId("sec-natacion", "Absoluto", "Competición"),
        title: "Natación · Absoluto Competición",
      },
      {
        time: "19:30",
        gid: groupId("sec-gimnasia", "Alevín", "Grupo A"),
        title: "Gimnasia · Alevín Grupo A",
      },
    ],
    4: [
      // Jueves
      {
        time: "17:30",
        gid: groupId("sec-futbol", "Infantil", "Grupo A"),
        title: "Fútbol · Infantil Grupo A",
      },
      {
        time: "18:30",
        gid: groupId("sec-baloncesto", "Infantil", "Grupo A"),
        title: "Baloncesto · Infantil Grupo A",
      },
      {
        time: "20:00",
        gid: groupId("sec-baloncesto", "Juvenil", "Competición"),
        title: "Baloncesto · Juvenil Competición",
      },
    ],
    5: [
      // Viernes
      {
        time: "17:00",
        gid: groupId("sec-atletismo", "Infantil", "Tecnificación"),
        title: "Atletismo · Tecnificación Infantil",
      },
      {
        time: "18:00",
        gid: groupId("sec-natacion", "Benjamín", "Escuela"),
        title: "Natación · Escuela Benjamín",
      },
      {
        time: "19:30",
        gid: groupId("sec-atletismo", "Absoluto", "Competición"),
        title: "Atletismo · Absoluto Competición",
      },
    ],
    6: [
      // Sábado · partidos
      {
        time: "11:00",
        gid: groupId("sec-futbol", "Juvenil", "Competición"),
        title: "Partido · Fútbol Juvenil",
      },
      {
        time: "12:30",
        gid: groupId("sec-baloncesto", "Cadete", "Competición"),
        title: "Partido · Baloncesto Cadete",
      },
    ],
    0: [], // Domingo descanso
  };

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dow = date.getDay();
    const items = trainings[dow] ?? [];

    items.forEach((item) => {
      const grp = GROUPS.find((g) => g.id === item.gid);
      if (!grp) return;
      const isMatch = item.title.startsWith("Partido");
      evs.push({
        id: `ev-${id++}`,
        date: iso(date),
        startTime: item.time,
        title: item.title,
        sectionId: grp.sectionId,
        categoryId: grp.categoryId,
        groupId: grp.id,
        type: isMatch ? "match" : "training",
      });
    });

    // Reunión técnica un lunes al mes
    if (dow === 1 && day <= 7) {
      evs.push({
        id: `ev-${id++}`,
        date: iso(date),
        startTime: "20:30",
        title: "Reunión de coordinación técnica",
        type: "meeting",
      });
    }
  }

  // Algunas citas médicas dispersas
  const medDays = [5, 12, 19, 26].filter((d) => d <= daysInMonth);
  medDays.forEach((d) => {
    const date = new Date(year, month, d);
    const ath = ATHLETES[d % ATHLETES.length];
    evs.push({
      id: `ev-${id++}`,
      date: iso(date),
      startTime: "10:00",
      title: `Revisión médica · ${ath.firstName} ${ath.lastName}`,
      sectionId: ath.sectionId,
      athleteId: ath.id,
      staffId: "u-med",
      type: "medical",
    });
  });

  return evs;
})();

// ───────── Cuotas y tasas ─────────
export const FEES: Fee[] = [
  {
    id: "fee-mensual",
    name: "Cuota mensual",
    amount: 45,
    frequency: "Monthly",
    appliesToGroupIds: GROUPS.map((g) => g.id),
    sectionId: "sec-atletismo",
    kind: "fee",
  },
  {
    id: "fee-licencia",
    name: "Licencia federativa",
    amount: 65,
    frequency: "Annual",
    periodStart: `${today.getFullYear()}-09-01`,
    periodEnd: `${today.getFullYear() + 1}-06-30`,
    appliesToGroupIds: GROUPS.filter((g) => g.name === "Competición").map((g) => g.id),
    sectionId: "sec-atletismo",
    kind: "fee",
  },
  {
    id: "fee-equipacion",
    name: "Equipación oficial",
    amount: 75,
    frequency: "One-time",
    paymentDate: `${today.getFullYear()}-09-15`,
    appliesToGroupIds: GROUPS.map((g) => g.id),
    sectionId: "sec-futbol",
    kind: "fee",
  },
  {
    id: "fee-campus",
    name: "Campus de verano",
    amount: 220,
    frequency: "One-time",
    paymentDate: `${today.getFullYear()}-07-01`,
    appliesToGroupIds: GROUPS.filter((g) => g.name === "Escuela" || g.name === "Grupo A").map(
      (g) => g.id,
    ),
    sectionId: "sec-natacion",
    kind: "fee",
  },
  {
    id: "rate-inscripcion",
    name: "Inscripción competición",
    amount: 25,
    frequency: "One-time",
    paymentDate: iso(new Date(today.getFullYear(), today.getMonth(), 15)),
    appliesToGroupIds: GROUPS.filter((g) => g.name === "Competición").map((g) => g.id),
    sectionId: "sec-atletismo",
    kind: "rate",
  },
  {
    id: "rate-matricula",
    name: "Matrícula anual",
    amount: 50,
    frequency: "Annual",
    periodStart: `${today.getFullYear()}-09-01`,
    periodEnd: `${today.getFullYear() + 1}-06-30`,
    appliesToGroupIds: GROUPS.map((g) => g.id),
    sectionId: "sec-atletismo",
    kind: "rate",
  },
];

// ───────── Pagos ─────────
// Un registro por deportista activo, distribuido en los últimos 30 días.
export const PAYMENTS: Payment[] = (() => {
  const result: Payment[] = [];
  const statuses: Payment["status"][] = ["Paid", "Paid", "Paid", "Active", "Pending", "Failed"];
  let id = 1;
  ATHLETES.forEach((a, i) => {
    // Cuota mensual
    const dayOffset = (i * 3) % 28;
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - dayOffset);
    result.push({
      id: `pay-${id++}`,
      athleteId: a.id,
      subscription: "Cuota mensual",
      sectionId: a.sectionId,
      categoryId: a.categoryId,
      amount: 45,
      status: statuses[i % statuses.length],
      date: iso(date),
    });
    // Licencia para deportistas de competición
    if (a.groupIds.some((g) => g.includes("competicion"))) {
      result.push({
        id: `pay-${id++}`,
        athleteId: a.id,
        subscription: "Licencia federativa",
        sectionId: a.sectionId,
        categoryId: a.categoryId,
        amount: 65,
        status: i % 5 === 0 ? "Pending" : "Paid",
        date: iso(new Date(today.getFullYear(), today.getMonth() - 1, 5)),
      });
    }
  });
  return result;
})();

// ───────── Conversaciones ─────────
const carlos = "u-adm";
const carla = "u-mgr";
const pol = "u-tec";
const polMed = "u-med";

export const CONVERSATIONS: Conversation[] = [
  {
    id: "conv-circ-bienvenida",
    title: "Circulares",
    type: "circular",
    participants: Array.from({ length: 32 }, (_, i) => `p-${i}`),
    unreadCount: 0,
    messages: [
      {
        id: "m-1",
        authorId: carlos,
        authorRole: "admin",
        targetLabel: "Todo el club (32 destinatarios)",
        content:
          "Bienvenida a la nueva temporada 2025/26. Encontraréis el calendario y las cuotas actualizadas en el portal del socio.",
        createdAt: isoAt(today.getFullYear(), today.getMonth(), 1, 9, 0),
      },
      {
        id: "m-2",
        authorId: carla,
        authorRole: "manager",
        targetLabel: "Sección Atletismo (12 destinatarios)",
        content:
          "Reunión de familias del grupo de Tecnificación el próximo viernes a las 18:30 en la sala de juntas.",
        createdAt: isoAt(today.getFullYear(), today.getMonth(), 3, 11, 30),
      },
      {
        id: "m-3",
        authorId: carlos,
        authorRole: "admin",
        targetLabel: "Familias en competición (18 destinatarios)",
        content:
          "Recordamos que el plazo para abonar la licencia federativa finaliza el día 30 de este mes.",
        createdAt: isoAt(today.getFullYear(), today.getMonth(), 5, 10, 0),
      },
    ],
  },
  {
    id: "conv-tec-infantil",
    title: "Atletismo · Tecnificación Infantil",
    type: "group",
    participants: ["u-tec", "p-fam-1", "p-fam-2", "p-fam-3", "p-fam-4"],
    unreadCount: 2,
    messages: [
      {
        id: "g-m1",
        authorId: pol,
        authorRole: "technical",
        targetLabel: "Tecnificación Infantil (5 destinatarios)",
        content: "Mañana entrenamos en la pista 2. Llegada 15 minutos antes para calentamiento.",
        createdAt: isoAt(today.getFullYear(), today.getMonth(), today.getDate() - 1, 19, 0),
      },
      {
        id: "g-m2",
        authorId: pol,
        authorRole: "technical",
        targetLabel: "Tecnificación Infantil (5 destinatarios)",
        content: "Recordatorio: lleváis bidón y muda de recambio.",
        createdAt: isoAt(today.getFullYear(), today.getMonth(), today.getDate(), 8, 30),
      },
    ],
  },
  {
    id: "conv-medico-1",
    title: "Solicitud de cita médica · Álex Ortega",
    type: "direct",
    participants: ["u-tec", "u-med", "p-fam-alex"],
    unreadCount: 1,
    messages: [
      {
        id: "med-1",
        authorId: pol,
        authorRole: "technical",
        targetLabel: "Staff médico (1 destinatario)",
        content: "Álex notó molestias en el aductor en el partido del sábado. ¿Hueco esta semana?",
        createdAt: isoAt(today.getFullYear(), today.getMonth(), today.getDate() - 2, 17, 45),
      },
      {
        id: "med-2",
        authorId: polMed,
        authorRole: "medical",
        targetLabel: "Cuerpo técnico (1 destinatario)",
        content: "Le veo el miércoles a las 10:00. Que venga con la equipación de entrenamiento.",
        createdAt: isoAt(today.getFullYear(), today.getMonth(), today.getDate() - 1, 9, 15),
      },
    ],
  },
  {
    id: "conv-direccion",
    title: "Coordinación Dirección",
    type: "direct",
    participants: [carlos, carla],
    unreadCount: 0,
    messages: [
      {
        id: "d-1",
        authorId: carla,
        authorRole: "manager",
        targetLabel: "Dirección",
        content: "Revisamos cierre de cuotas del mes el viernes después de la reunión técnica.",
        createdAt: isoAt(today.getFullYear(), today.getMonth(), today.getDate() - 1, 16, 0),
      },
    ],
  },
];

// ───────── Citas médicas ─────────
export const MEDICAL_APPOINTMENTS: MedicalAppointment[] = [
  {
    id: "apt-1",
    athleteId: ATHLETES.find((a) => a.firstName === "Álex")!.id,
    staffId: "u-med",
    date: iso(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2)),
    time: "10:00",
    reason: "Molestias en aductor derecho",
    status: "Scheduled",
    notes: "Revisión post-partido.",
  },
  {
    id: "apt-2",
    athleteId: ATHLETES.find((a) => a.firstName === "Javier")!.id,
    staffId: "u-med",
    date: iso(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5)),
    time: "11:30",
    reason: "Seguimiento lesión isquiotibiales",
    status: "Scheduled",
    notes: "",
  },
  {
    id: "apt-3",
    athleteId: ATHLETES.find((a) => a.firstName === "Óscar")!.id,
    staffId: "u-med",
    date: iso(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3)),
    time: "09:30",
    reason: "Revisión esguince tobillo",
    status: "Completed",
    notes: "Buena evolución. Reincorporación progresiva la próxima semana.",
  },
  {
    id: "apt-4",
    athleteId: ATHLETES.find((a) => a.firstName === "Noa")!.id,
    staffId: "u-med",
    date: iso(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)),
    time: "12:00",
    reason: "Reconocimiento médico anual",
    status: "Scheduled",
    notes: "",
  },
];

export const ALL_USERS: User[] = DEMO_USERS;

