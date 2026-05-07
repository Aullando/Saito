import type {
  User, Organization, Facility, SportSection, Category, Group,
  Athlete, CalendarEvent, Fee, Payment, Conversation, MedicalAppointment,
} from "./types";

export const DEMO_USERS: User[] = [
  { id: "u-sys", name: "Alex Sysadmin", email: "alex.sys@saito.demo", role: "sysadmin", language: "en", initials: "AS" },
  { id: "u-adm", name: "Helen Carter", email: "helen.admin@saito.demo", role: "admin", language: "en", initials: "HC" },
  { id: "u-mgr", name: "Carlos Ruiz", email: "carlos.gerente@saito.demo", role: "manager", language: "es", initials: "CR" },
  { id: "u-tec", name: "María López", email: "maria.tecnico@saito.demo", role: "technical", language: "es", initials: "ML" },
  { id: "u-med", name: "Dr. Pablo Vega", email: "pablo.medico@saito.demo", role: "medical", language: "es", initials: "PV", specialty: "Traumatología", licenseNumber: "COL-48291", area: "Medicina deportiva" },
];

const today = new Date();
const iso = (d: Date) => d.toISOString().slice(0, 10);
const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

export const ORGANIZATIONS: Organization[] = [
  "European Commission",
  "Sport Innovation Hub SL",
  "Saito Club",
  "Athletic Club Bilbao",
  "FC Barcelona",
  "Real Madrid CF",
  "Federación de Voleibol",
  "Federación de Baloncesto",
  "Federación de Atletismo",
  "Federación de Natación",
].map((name, i) => ({
  id: `org-${i + 1}`,
  name,
  createdAt: iso(new Date(2024, i % 12, (i * 3) % 27 + 1)),
  updatedAt: iso(new Date(2025, (i + 2) % 12, (i * 5) % 27 + 1)),
  status: i % 5 === 0 ? "Inactive" : "Active",
  aiEnabled: i % 2 === 0,
}));

export const FACILITIES: Facility[] = [
  { id: "f-1", name: "Instalación Deportiva Valencia", location: "Valencia", sportSections: ["sec-1", "sec-3"], status: "Active" },
  { id: "f-2", name: "Complejo Deportivo Barcelona", location: "Barcelona", sportSections: ["sec-2", "sec-5"], status: "Active" },
  { id: "f-3", name: "Centro Olímpico Madrid", location: "Madrid", sportSections: ["sec-4", "sec-6"], status: "Active" },
  { id: "f-4", name: "Main Stadium", location: "Madrid", sportSections: ["sec-1"], status: "Active" },
  { id: "f-5", name: "Medical Room", location: "Madrid", sportSections: [], status: "Active" },
  { id: "f-6", name: "Pool Complex", location: "Valencia", sportSections: ["sec-7"], status: "Active" },
];

export const SECTIONS: SportSection[] = [
  { id: "sec-1", name: "Boxeo", athleteCount: 0 },
  { id: "sec-2", name: "Esgrima", athleteCount: 0 },
  { id: "sec-3", name: "Gimnasia", athleteCount: 0 },
  { id: "sec-4", name: "Natación", athleteCount: 0 },
  { id: "sec-5", name: "Atletismo", athleteCount: 0 },
  { id: "sec-6", name: "Deporte prueba", athleteCount: 0 },
  { id: "sec-7", name: "Test Section - Multi Role", athleteCount: 0 },
];

export const CATEGORIES: Category[] = SECTIONS.flatMap((s) => [
  { id: `${s.id}-cat-1`, name: "Senior", sectionId: s.id },
  { id: `${s.id}-cat-2`, name: "Junior", sectionId: s.id },
]);

export const GROUPS: Group[] = CATEGORIES.flatMap((c) => [
  { id: `${c.id}-g-A`, name: `${c.name} Grupo A`, sectionId: c.sectionId, categoryId: c.id },
  { id: `${c.id}-g-B`, name: `${c.name} Grupo B`, sectionId: c.sectionId, categoryId: c.id },
]);

const FIRST = ["Miguel", "Lucía", "Pablo", "Sofía", "Diego", "Carmen", "Iván", "Elena", "Hugo", "Marta", "Alex", "Noa", "Bruno", "Olivia", "Sergio", "Ana", "Marco", "Julia", "David", "Paula", "Adrián", "Laura", "Iker", "Vega", "Nicolás", "Inés", "Pol", "Daniela", "Joel", "Aitana"];
const LAST = ["Ochoa", "García", "Martín", "Sánchez", "Rodríguez", "Pérez", "Gómez", "Fernández", "Torres", "Ramos", "Vidal", "Navarro", "Castro", "Romero", "Molina"];

export const ATHLETES: Athlete[] = Array.from({ length: 30 }, (_, i) => {
  const sec = SECTIONS[i % SECTIONS.length];
  const cats = CATEGORIES.filter((c) => c.sectionId === sec.id);
  const cat = cats[i % cats.length];
  const grps = GROUPS.filter((g) => g.categoryId === cat.id);
  const status: Athlete["status"] = i % 7 === 0 ? "Pending" : i % 11 === 0 ? "Inactive" : "Active";
  const med: Athlete["medicalStatus"] = ["Fit", "Injured", "Under review", "Unknown"][i % 4] as Athlete["medicalStatus"];
  const perf: Athlete["performanceStatus"] = ["High", "Medium", "Low"][i % 3] as Athlete["performanceStatus"];
  return {
    id: `ath-${i + 1}`,
    firstName: FIRST[i % FIRST.length],
    lastName: LAST[i % LAST.length],
    sectionId: sec.id,
    categoryId: cat.id,
    groupIds: [grps[i % grps.length].id],
    status,
    medicalStatus: med,
    performanceStatus: perf,
  };
});

// Recompute athleteCount
SECTIONS.forEach((s) => {
  s.athleteCount = ATHLETES.filter((a) => a.sectionId === s.id).length;
});

export const EVENTS: CalendarEvent[] = Array.from({ length: 24 }, (_, i) => {
  const day = new Date(monthStart);
  day.setDate(1 + ((i * 2) % 27));
  const grp = GROUPS[i % GROUPS.length];
  return {
    id: `ev-${i + 1}`,
    date: iso(day),
    startTime: `${String(8 + (i % 10)).padStart(2, "0")}:00`,
    title: `Entrenamiento ${grp.name}`,
    sectionId: grp.sectionId,
    categoryId: grp.categoryId,
    groupId: grp.id,
    roleInGroup: i % 2 === 0 ? "Titular" : "Reserva",
    type: i % 6 === 0 ? "match" : "training",
  };
});

export const FEES: Fee[] = [
  { id: "fee-1", name: "Cuota mensual Senior", amount: 65, frequency: "Monthly", periodStart: "2025-01-01", periodEnd: "2025-12-31", appliesToGroupIds: [GROUPS[0].id, GROUPS[1].id], sectionId: SECTIONS[0].id, kind: "fee" },
  { id: "fee-2", name: "Cuota mensual Junior", amount: 45, frequency: "Monthly", periodStart: "2025-01-01", periodEnd: "2025-12-31", appliesToGroupIds: [GROUPS[2].id], sectionId: SECTIONS[0].id, kind: "fee" },
  { id: "fee-3", name: "Matrícula anual", amount: 120, frequency: "Annual", periodStart: "2025-01-01", periodEnd: "2025-12-31", appliesToGroupIds: [], sectionId: SECTIONS[1].id, kind: "fee" },
  { id: "rate-1", name: "Equipación oficial", amount: 80, frequency: "One-time", appliesToGroupIds: [], sectionId: SECTIONS[0].id, kind: "rate", paymentDate: "2025-09-01" },
  { id: "rate-2", name: "Viaje competición", amount: 150, frequency: "One-time", appliesToGroupIds: [], sectionId: SECTIONS[2].id, kind: "rate", paymentDate: "2025-11-15" },
];

export const PAYMENTS: Payment[] = ATHLETES.slice(0, 20).map((a, i) => ({
  id: `pay-${i + 1}`,
  athleteId: a.id,
  subscription: i % 2 === 0 ? "Cuota mensual Senior" : "Cuota mensual Junior",
  sectionId: a.sectionId,
  categoryId: a.categoryId,
  amount: i % 2 === 0 ? 65 : 45,
  status: (["Paid", "Active", "Failed", "Pending"] as const)[i % 4],
  date: iso(new Date(today.getFullYear(), today.getMonth(), (i % 27) + 1)),
}));

export const CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    title: "Bienvenida temporada 2025/26",
    type: "circular",
    participants: ["u-adm", "u-mgr", "u-tec", "u-med"],
    unreadCount: 2,
    messages: [
      { id: "m-1", authorId: "u-adm", authorRole: "admin", targetLabel: "Whole club", content: "Bienvenidos a la nueva temporada. Recordad revisar el calendario semanal.", createdAt: new Date(today.getTime() - 86400000 * 2).toISOString() },
      { id: "m-2", authorId: "u-mgr", authorRole: "manager", targetLabel: "Whole club", content: "Recordatorio: reunión de coordinación el viernes.", createdAt: new Date(today.getTime() - 86400000).toISOString() },
    ],
  },
  {
    id: "conv-2",
    title: "Solicitud de cita médica - Miguel Ochoa",
    type: "direct",
    participants: ["u-tec", "u-med"],
    unreadCount: 1,
    messages: [
      { id: "m-3", authorId: "u-tec", authorRole: "technical", targetLabel: "Medical Staff", content: "¿Podemos agendar valoración para Miguel? Molestias en el tobillo.", createdAt: new Date(today.getTime() - 3600000 * 5).toISOString() },
    ],
  },
  {
    id: "conv-3",
    title: "Grupo Senior A - Cambio horario",
    type: "group",
    participants: ["u-adm", "u-tec"],
    unreadCount: 0,
    messages: [
      { id: "m-4", authorId: "u-adm", authorRole: "admin", targetLabel: "Senior Grupo A", content: "El entrenamiento del jueves se mueve a las 19:00.", createdAt: new Date(today.getTime() - 86400000 * 3).toISOString() },
    ],
  },
];

export const MEDICAL_APPOINTMENTS: MedicalAppointment[] = ATHLETES.slice(0, 8).map((a, i) => {
  const day = new Date(monthStart);
  day.setDate(1 + (i * 3) % 27);
  return {
    id: `apt-${i + 1}`,
    athleteId: a.id,
    staffId: "u-med",
    date: iso(day),
    time: `${String(9 + i).padStart(2, "0")}:00`,
    reason: ["Revisión rutinaria", "Lesión muscular", "Seguimiento", "Evaluación física"][i % 4],
    status: i % 5 === 0 ? "Completed" : "Scheduled",
    notes: "Sin observaciones.",
  };
});

export const ALL_USERS: User[] = DEMO_USERS;
