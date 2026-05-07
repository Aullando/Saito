import type {
  User, Organization, Facility, SportSection, Category, Group,
  Athlete, CalendarEvent, Fee, Payment, Conversation, MedicalAppointment,
} from "./types";

export const DEMO_USERS: User[] = [
  { id: "u-sys", name: "SysAdmin SAITO", email: "sysadmin@saito.app", role: "sysadmin", language: "en", initials: "SS" },
  { id: "u-adm", name: "Carlos GARCÍA", email: "clubadmin0@saito.app", role: "admin", language: "en", initials: "CG" },
  { id: "u-mgr", name: "Carla LUIS", email: "professional0@saito.app", role: "manager", language: "es", initials: "CL" },
  { id: "u-tec", name: "Pol GUILLEN", email: "professional20@saito.app", role: "technical", language: "es", initials: "PG", specialty: "Gestor" },
  { id: "u-med", name: "Pol ECHEVARRÍA", email: "professional60@saito.app", role: "medical", language: "es", initials: "PE", specialty: "Fisioterapeuta", licenseNumber: "LIC-PROF-2808XW", area: "Gestor Deportivo" },
  // Extra cast for messages
  { id: "u-ath-nadia", name: "Nadia ABAD", email: "athlete1@saito.app", role: "technical", language: "es", initials: "NA" },
];

const today = new Date();
const iso = (d: Date) => d.toISOString().slice(0, 10);
const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

const dt = (day: number, hour: number, minute: number) => {
  const d = new Date(2026, 3, day, hour, minute); // April 2026
  return d.toISOString();
};

export const ORGANIZATIONS: Organization[] = [
  { name: "European Commission", createdAt: dt(29, 12, 42), updatedAt: dt(29, 12, 42), aiEnabled: true },
  { name: "Sport Innovation Hub SL", createdAt: dt(29, 12, 32), updatedAt: dt(29, 12, 32), aiEnabled: true },
  { name: "Saito Club", createdAt: new Date(2026, 2, 27, 14, 36).toISOString(), updatedAt: new Date(2026, 2, 27, 14, 36).toISOString(), aiEnabled: true },
  { name: "Athletic Club Bilbao", createdAt: new Date(2026, 2, 24, 12, 25).toISOString(), updatedAt: new Date(2026, 2, 24, 12, 25).toISOString(), aiEnabled: true },
  { name: "FC Barcelona", createdAt: new Date(2026, 2, 24, 12, 25).toISOString(), updatedAt: new Date(2026, 2, 24, 12, 25).toISOString(), aiEnabled: true },
  { name: "Real Madrid CF", createdAt: new Date(2026, 2, 24, 12, 25).toISOString(), updatedAt: new Date(2026, 2, 24, 12, 25).toISOString(), aiEnabled: true },
  { name: "Federación de Voleibol", createdAt: new Date(2026, 2, 24, 12, 25).toISOString(), updatedAt: new Date(2026, 2, 24, 12, 25).toISOString(), aiEnabled: false },
  { name: "Federación de Baloncesto", createdAt: new Date(2026, 2, 24, 12, 25).toISOString(), updatedAt: new Date(2026, 2, 24, 12, 25).toISOString(), aiEnabled: false },
  { name: "Federación de Atletismo", createdAt: new Date(2026, 2, 24, 12, 25).toISOString(), updatedAt: new Date(2026, 2, 24, 12, 25).toISOString(), aiEnabled: false },
  { name: "Federación de Natación", createdAt: new Date(2026, 2, 24, 12, 25).toISOString(), updatedAt: new Date(2026, 2, 24, 12, 25).toISOString(), aiEnabled: false },
].map((o, i) => ({ ...o, id: `org-${i + 1}`, status: "Active" as const }));

export const FACILITIES: Facility[] = [
  { id: "f-1", name: "Instalación Deportiva Valencia", location: "Valencia", sportSections: [], status: "Active" },
  { id: "f-2", name: "Complejo Deportivo Barcelona", location: "Barcelona", sportSections: [], status: "Active" },
  { id: "f-3", name: "Centro Olímpico Madrid", location: "Madrid", sportSections: [], status: "Active" },
];

export const SECTIONS: SportSection[] = [
  { id: "sec-prueba", name: "Deporte prueba", athleteCount: 6, managerCount: 3, staffCount: 2 },
  { id: "sec-shared", name: "Test Section - Shared Staff", athleteCount: 3, managerCount: 7, staffCount: 9 },
  { id: "sec-multi", name: "Test Section - Multi Role", athleteCount: 5, managerCount: 6, staffCount: 8 },
  { id: "sec-boxeo", name: "Boxeo (Test)", athleteCount: 8, managerCount: 9, staffCount: 8 },
  { id: "sec-esgrima", name: "Esgrima", athleteCount: 0, managerCount: 8, staffCount: 8 },
  { id: "sec-gimnasia", name: "Gimnasia", athleteCount: 0, managerCount: 9, staffCount: 8 },
  { id: "sec-natacion", name: "Natación", athleteCount: 0, managerCount: 9, staffCount: 9 },
  { id: "sec-atletismo", name: "Atletismo", athleteCount: 0, managerCount: 11, staffCount: 9 },
];

export const CATEGORIES: Category[] = [
  { id: "cat-prueba-inf", name: "Infantil", sectionId: "sec-prueba" },
  { id: "cat-shared", name: "Test Shared Staff", sectionId: "sec-shared" },
  { id: "cat-shared-inf", name: "Deporte prueba Test Shared Staff Infantil", sectionId: "sec-shared" },
  { id: "cat-multi", name: "Test Multi-Role", sectionId: "sec-multi" },
  { id: "cat-boxeo", name: "Deporte prueba 70lbs (Test) Infantil", sectionId: "sec-boxeo" },
  { id: "cat-esgrima", name: "Senior", sectionId: "sec-esgrima" },
  { id: "cat-gimnasia", name: "Senior", sectionId: "sec-gimnasia" },
  { id: "cat-natacion", name: "Senior", sectionId: "sec-natacion" },
  { id: "cat-atletismo", name: "Senior", sectionId: "sec-atletismo" },
];

export const GROUPS: Group[] = [
  { id: "g-prueba-1", name: "Grupo 1", sectionId: "sec-prueba", categoryId: "cat-prueba-inf" },
  { id: "g-prueba-A", name: "Grupo A - Titular", sectionId: "sec-prueba", categoryId: "cat-prueba-inf" },
  { id: "g-prueba-B", name: "Grupo B - Reserva", sectionId: "sec-prueba", categoryId: "cat-prueba-inf" },
  { id: "g-prueba-aaa", name: "AAA", sectionId: "sec-prueba", categoryId: "cat-prueba-inf" },
  { id: "g-shared-A", name: "Grupo A", sectionId: "sec-shared", categoryId: "cat-shared" },
  { id: "g-shared-B", name: "Grupo B", sectionId: "sec-shared", categoryId: "cat-shared" },
  { id: "g-multi-A", name: "Grupo A", sectionId: "sec-multi", categoryId: "cat-multi" },
  { id: "g-multi-At", name: "Grupo A - Titular", sectionId: "sec-multi", categoryId: "cat-multi" },
  { id: "g-multi-Br", name: "Grupo B - Reserva", sectionId: "sec-multi", categoryId: "cat-multi" },
  { id: "g-boxeo-1", name: "Grupo 1", sectionId: "sec-boxeo", categoryId: "cat-boxeo" },
  { id: "g-boxeo-At", name: "Grupo A - Titular", sectionId: "sec-boxeo", categoryId: "cat-boxeo" },
  { id: "g-boxeo-Br", name: "Grupo B - Reserva", sectionId: "sec-boxeo", categoryId: "cat-boxeo" },
  { id: "g-boxeo-senior", name: "Grupo Senior", sectionId: "sec-boxeo", categoryId: "cat-boxeo" },
];

type AthleteSeed = { firstName: string; lastName: string; sectionId: string; categoryId: string; groupIds: string[]; medicalStatus: Athlete["medicalStatus"]; performanceStatus: Athlete["performanceStatus"] };

const ATHLETE_SEEDS: AthleteSeed[] = [
  { firstName: "raul4", lastName: "GARC", sectionId: "sec-prueba", categoryId: "cat-prueba-inf", groupIds: ["g-prueba-1"], medicalStatus: "Unknown", performanceStatus: "Medium" },
  { firstName: "Athlete2", lastName: "MULTIROLTEST", sectionId: "sec-multi", categoryId: "cat-multi", groupIds: ["g-multi-A"], medicalStatus: "Unknown", performanceStatus: "Medium" },
  { firstName: "Athlete1", lastName: "MULTIROLTEST", sectionId: "sec-multi", categoryId: "cat-multi", groupIds: ["g-multi-A"], medicalStatus: "Unknown", performanceStatus: "Medium" },
  { firstName: "Héctor", lastName: "Cabello", sectionId: "sec-shared", categoryId: "cat-shared-inf", groupIds: ["g-prueba-A", "g-prueba-1"], medicalStatus: "Fit", performanceStatus: "High" },
  { firstName: "Miguel", lastName: "Ochoa", sectionId: "sec-multi", categoryId: "cat-multi", groupIds: ["g-multi-Br"], medicalStatus: "Fit", performanceStatus: "Medium" },
  { firstName: "Eric", lastName: "Navarro", sectionId: "sec-multi", categoryId: "cat-multi", groupIds: ["g-multi-At"], medicalStatus: "Fit", performanceStatus: "High" },
  { firstName: "Jordi", lastName: "Guardado", sectionId: "sec-boxeo", categoryId: "cat-boxeo", groupIds: ["g-boxeo-Br", "g-boxeo-1"], medicalStatus: "Fit", performanceStatus: "Medium" },
  { firstName: "Juan", lastName: "Granados", sectionId: "sec-boxeo", categoryId: "cat-boxeo", groupIds: ["g-boxeo-At", "g-boxeo-1"], medicalStatus: "Fit", performanceStatus: "High" },
  { firstName: "Lorena", lastName: "Tamayo", sectionId: "sec-shared", categoryId: "cat-shared", groupIds: ["g-shared-B"], medicalStatus: "Under review", performanceStatus: "Medium" },
  { firstName: "Erik", lastName: "Llorente", sectionId: "sec-shared", categoryId: "cat-shared", groupIds: ["g-shared-A"], medicalStatus: "Fit", performanceStatus: "Medium" },
  { firstName: "María Dolores", lastName: "Garza", sectionId: "sec-boxeo", categoryId: "cat-boxeo", groupIds: ["g-boxeo-senior", "g-boxeo-1"], medicalStatus: "Unknown", performanceStatus: "Low" },
  { firstName: "Nadia", lastName: "Abad", sectionId: "sec-boxeo", categoryId: "cat-boxeo", groupIds: ["g-prueba-aaa", "g-boxeo-1"], medicalStatus: "Unknown", performanceStatus: "Medium" },
  { firstName: "Marc", lastName: "Vidal", sectionId: "sec-prueba", categoryId: "cat-prueba-inf", groupIds: ["g-prueba-A"], medicalStatus: "Injured", performanceStatus: "Low" },
  { firstName: "Sofía", lastName: "Ramos", sectionId: "sec-prueba", categoryId: "cat-prueba-inf", groupIds: ["g-prueba-B"], medicalStatus: "Fit", performanceStatus: "Medium" },
  { firstName: "Iván", lastName: "Castro", sectionId: "sec-shared", categoryId: "cat-shared", groupIds: ["g-shared-A"], medicalStatus: "Under review", performanceStatus: "Medium" },
  { firstName: "Elena", lastName: "Romero", sectionId: "sec-multi", categoryId: "cat-multi", groupIds: ["g-multi-A"], medicalStatus: "Fit", performanceStatus: "High" },
  { firstName: "Hugo", lastName: "Molina", sectionId: "sec-boxeo", categoryId: "cat-boxeo", groupIds: ["g-boxeo-1"], medicalStatus: "Fit", performanceStatus: "Medium" },
  { firstName: "Marta", lastName: "Sánchez", sectionId: "sec-prueba", categoryId: "cat-prueba-inf", groupIds: ["g-prueba-1"], medicalStatus: "Fit", performanceStatus: "Medium" },
  { firstName: "Adrián", lastName: "Pérez", sectionId: "sec-multi", categoryId: "cat-multi", groupIds: ["g-multi-At"], medicalStatus: "Injured", performanceStatus: "Low" },
  { firstName: "Laura", lastName: "Torres", sectionId: "sec-shared", categoryId: "cat-shared", groupIds: ["g-shared-B"], medicalStatus: "Fit", performanceStatus: "High" },
  { firstName: "Iker", lastName: "Gómez", sectionId: "sec-boxeo", categoryId: "cat-boxeo", groupIds: ["g-boxeo-At"], medicalStatus: "Fit", performanceStatus: "High" },
  { firstName: "Vega", lastName: "Fernández", sectionId: "sec-prueba", categoryId: "cat-prueba-inf", groupIds: ["g-prueba-aaa"], medicalStatus: "Unknown", performanceStatus: "Medium" },
];

export const ATHLETES: Athlete[] = ATHLETE_SEEDS.map((a, i) => ({
  id: `ath-${i + 1}`,
  ...a,
  status: i % 11 === 0 ? "Pending" : i === 7 ? "Inactive" : "Active",
}));

// Recompute athleteCount from real data
SECTIONS.forEach((s) => {
  s.athleteCount = ATHLETES.filter((a) => a.sectionId === s.id).length || s.athleteCount;
});

// Generate dense calendar events for current month: per weekday a few events
export const EVENTS: CalendarEvent[] = (() => {
  const evs: CalendarEvent[] = [];
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  let id = 1;
  const groupCycle = [
    { gid: "g-prueba-aaa", title: "AAA", role: "" },
    { gid: "g-prueba-B", title: "Grupo B", role: "" },
    { gid: "g-prueba-A", title: "Grupo A - Titular", role: "Titular" },
    { gid: "g-multi-At", title: "Grupo A - Titular", role: "Titular" },
    { gid: "g-multi-Br", title: "Grupo B - Reserva", role: "Reserva" },
    { gid: "g-boxeo-At", title: "Grupo A - Titular", role: "Titular" },
    { gid: "g-shared-A", title: "Grupo A", role: "" },
  ];
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(today.getFullYear(), today.getMonth(), day);
    const dow = date.getDay(); // 0 sun
    // weekend lighter
    const count = dow === 0 || dow === 6 ? 2 : 8 + (day % 5) * 3; // up to ~20
    for (let i = 0; i < count; i++) {
      const hour = 6 + (i % 12);
      const g = groupCycle[i % groupCycle.length];
      const grp = GROUPS.find((x) => x.id === g.gid)!;
      evs.push({
        id: `ev-${id++}`,
        date: iso(date),
        startTime: `${String(hour).padStart(2, "0")}:00`,
        title: g.title,
        sectionId: grp.sectionId,
        categoryId: grp.categoryId,
        groupId: grp.id,
        roleInGroup: g.role || undefined,
        type: "training",
      });
    }
  }
  return evs;
})();

export const FEES: Fee[] = [
  { id: "fee-1", name: "huhuhuhuhu", amount: 234, frequency: "Daily" as any, appliesToGroupIds: ["g-prueba-1"], sectionId: "sec-prueba", kind: "fee" },
  { id: "fee-2", name: "nueva cuota", amount: 234, frequency: "Monthly", periodStart: "2026-04-24", periodEnd: "2026-04-24", appliesToGroupIds: ["g-prueba-1"], sectionId: "sec-prueba", kind: "fee" },
  { id: "fee-3", name: "para Granados", amount: 1, frequency: "Monthly", appliesToGroupIds: ["g-prueba-1"], sectionId: "sec-prueba", kind: "fee" },
  { id: "fee-4", name: "cuota 2", amount: 190, frequency: "Monthly", appliesToGroupIds: [], sectionId: "sec-prueba", kind: "fee" },
  { id: "fee-5", name: "Grupo 1", amount: 120, frequency: "Daily" as any, appliesToGroupIds: ["g-prueba-1"], sectionId: "sec-prueba", kind: "fee" },
  { id: "rate-1", name: "uuuu", amount: 345, frequency: "One-time", paymentDate: "2026-04-24", appliesToGroupIds: ["g-prueba-1"], sectionId: "sec-prueba", kind: "rate" },
  { id: "rate-2", name: "Granados", amount: 10, frequency: "One-time", paymentDate: "2026-04-23", appliesToGroupIds: ["g-prueba-1"], sectionId: "sec-prueba", kind: "rate" },
  { id: "rate-3", name: "tasa 2", amount: 148, frequency: "One-time", paymentDate: "2026-04-23", appliesToGroupIds: [], sectionId: "sec-prueba", kind: "rate" },
  { id: "rate-4", name: "Tasa 1", amount: 110, frequency: "One-time", appliesToGroupIds: ["g-prueba-1"], sectionId: "sec-prueba", kind: "rate" },
];

// 113 payments alternating between Juan GRANADOS (3 entries/day) and raul4 GARC (1 entry/day), 28 days
export const PAYMENTS: Payment[] = (() => {
  const result: Payment[] = [];
  const granados = ATHLETES.find((a) => a.firstName === "Juan" && a.lastName === "Granados")!;
  const raul = ATHLETES.find((a) => a.firstName === "raul4")!;
  const month = today.getMonth();
  const year = today.getFullYear();
  let id = 1;
  for (let day = 7; day >= 1 && result.length < 113; day--) {
    const date = iso(new Date(year, month, day));
    const isToday = day === 7;
    // raul Fallida 0€
    result.push({
      id: `pay-${id++}`, athleteId: raul.id, subscription: "Grupo 1", sectionId: "sec-prueba", categoryId: "cat-prueba-inf",
      amount: 0, status: "Failed", date,
    });
    // granados huhuhuhuhu 234
    result.push({
      id: `pay-${id++}`, athleteId: granados.id, subscription: "huhuhuhuhu", sectionId: "sec-prueba", categoryId: "cat-prueba-inf",
      amount: 234, status: isToday ? "Paid" : "Active", date,
    });
    // granados Grupo 1 120
    result.push({
      id: `pay-${id++}`, athleteId: granados.id, subscription: "Grupo 1", sectionId: "sec-prueba", categoryId: "cat-prueba-inf",
      amount: 120, status: isToday ? "Paid" : "Active", date,
    });
  }
  // Fill remainder up to 113 with older entries
  let extraDay = 8;
  while (result.length < 113) {
    const date = iso(new Date(year, month - (extraDay > 28 ? 1 : 0), ((extraDay - 1) % 28) + 1));
    result.push({
      id: `pay-${id++}`, athleteId: granados.id, subscription: "huhuhuhuhu", sectionId: "sec-prueba", categoryId: "cat-prueba-inf",
      amount: 234, status: ["Active", "Pending", "Failed"][result.length % 3] as any, date,
    });
    extraDay++;
  }
  return result;
})();

const carlos = "u-adm";
const carla = "u-mgr";
const pol = "u-tec";
const nadia = "u-ath-nadia";

export const CONVERSATIONS: Conversation[] = [
  // Whole-club circular (45 participants)
  {
    id: "conv-circ-1",
    title: "Circulares",
    type: "circular",
    participants: Array.from({ length: 45 }, (_, i) => `p-${i}`),
    unreadCount: 0,
    messages: [
      { id: "m-1", authorId: carlos, authorRole: "admin", targetLabel: "Todo el club (3 destinatarios)", content: "Bienvenida a la temporada — Les damos la bienvenida a la nueva temporada. Encontraréis en el tablón de anuncios toda la información relevante.", createdAt: new Date(2026, 4, 7, 12, 34).toISOString() },
      { id: "m-2", authorId: carlos, authorRole: "admin", targetLabel: "Sección Atletismo (2 destinatarios)", content: "Reunión de padres - Sección Atletismo: el próximo viernes 20 a las 18:00 en el salón de actos del club.", createdAt: new Date(2026, 4, 7, 12, 34).toISOString() },
      { id: "m-3", authorId: pol, authorRole: "technical", targetLabel: "Sección Atletismo (2 destinatarios)", content: "Convocatoria especial de entrenamiento — recordamos a todos que mañana hay entrenamiento especial a las 09:00. Confirmar asistencia.", createdAt: new Date(2026, 4, 7, 12, 34).toISOString() },
      { id: "m-4", authorId: carla, authorRole: "manager", targetLabel: "Sección Deporte prueba > Infantil > Grupo Grupo 1 (11 destinatarios)", content: "Recordatorio: control de asistencia esta semana.", createdAt: new Date(2026, 4, 7, 11, 49).toISOString() },
    ],
  },
  // Solo participante
  {
    id: "conv-circ-solo",
    title: "Circulares",
    type: "circular",
    participants: [carlos],
    unreadCount: 0,
    messages: [
      { id: "m-solo-1", authorId: carlos, authorRole: "admin", targetLabel: "Todo el club (1 recipients)", content: "Mensaje interno de prueba.", createdAt: new Date(2026, 4, 7, 9, 29).toISOString() },
    ],
  },
  // Group 1 Infantil chat
  {
    id: "conv-g1",
    title: "Grupo 1 Infantil",
    type: "group",
    participants: Array.from({ length: 10 }, (_, i) => `g-p-${i}`),
    unreadCount: 0,
    messages: [
      { id: "g-m1", authorId: pol, authorRole: "technical", targetLabel: "Sección Deporte prueba > Infantil > Grupo Grupo 1 (10 destinatarios)", content: "Buenos días equipo, recordatorio del entrenamiento de mañana.", createdAt: new Date(2026, 4, 6, 21, 53).toISOString() },
      { id: "g-m2", authorId: pol, authorRole: "technical", targetLabel: "Sección Deporte prueba > Infantil > Grupo Grupo 1 (10 destinatarios)", content: "Llevad equipación completa.", createdAt: new Date(2026, 4, 7, 9, 28).toISOString() },
      { id: "g-m3", authorId: nadia, authorRole: "technical", targetLabel: "Sección Deporte prueba > Infantil > Grupo Grupo 1 (10 destinatarios)", content: "Buenas, confirmo asistencia.", createdAt: new Date(2026, 4, 7, 7, 56).toISOString() },
    ],
  },
];

// Medical inbox: 21 medical-request convos
const medicalConvos: Conversation[] = Array.from({ length: 21 }, (_, i) => ({
  id: `conv-med-${i + 1}`,
  title: "Solicitud de cita médica",
  type: "direct",
  participants: ["u-tec", "u-med", `parent-${i}`, `athlete-${i}`],
  unreadCount: i === 0 ? 3 : 1,
  messages: [
    { id: `med-m-${i}`, authorId: pol, authorRole: "technical", targetLabel: "Staff médico (4 destinatarios)", content: "Solicitamos cita para evaluación. Detalles en el grupo.", createdAt: new Date(2026, 4, 7, 10, 38 - i).toISOString() },
  ],
}));

CONVERSATIONS.push(...medicalConvos);

const apptDate = new Date(today.getFullYear(), today.getMonth(), 19);

export const MEDICAL_APPOINTMENTS: MedicalAppointment[] = [
  {
    id: "apt-1",
    athleteId: ATHLETES.find((a) => a.firstName === "Miguel" && a.lastName === "Ochoa")!.id,
    staffId: "u-med",
    date: iso(apptDate),
    time: "09:00",
    reason: "Revisión rutinaria",
    status: "Scheduled",
    notes: "",
  },
];

export const ALL_USERS: User[] = DEMO_USERS;
