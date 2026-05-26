// Biblioteca de "Formación de Nadadores" CNSO: drills técnicos, sets tipo,
// programas de tecnificación y catálogo de equipación oficial.

export type CnsoDrillCategory =
  | "Técnica crol"
  | "Técnica espalda"
  | "Técnica braza"
  | "Técnica mariposa"
  | "Salidas y virajes"
  | "Patada"
  | "Tracción"
  | "Aguas abiertas"
  | "Seco"
  | "Waterpolo"
  | "Saltos"
  | "Sincro";

export type CnsoDrill = {
  clubId: "cnso";
  id: string;
  name: string;
  category: CnsoDrillCategory;
  group: string;
  equipment: string;
  level: "Iniciación" | "Perfeccionamiento" | "Avanzado";
  dose: string;
  cues?: string;
};

export const CNSO_DRILLS: CnsoDrill[] = [
  { clubId: "cnso", id: "d-1", name: "Catch-up crol", category: "Técnica crol", group: "Brazada", equipment: "—", level: "Iniciación", dose: "4x50", cues: "Espera la mano antes de iniciar la siguiente brazada." },
  { clubId: "cnso", id: "d-2", name: "Pull-buoy + paletas", category: "Tracción", group: "Tren superior", equipment: "Pull-buoy + paletas", level: "Perfeccionamiento", dose: "6x100", cues: "Foco en agarre alto y codo elevado." },
  { clubId: "cnso", id: "d-3", name: "Patada vertical", category: "Patada", group: "Tren inferior", equipment: "—", level: "Perfeccionamiento", dose: "4x30s", cues: "Manos fuera del agua, mantener cadera alta." },
  { clubId: "cnso", id: "d-4", name: "6-1-6 espalda", category: "Técnica espalda", group: "Rolido", equipment: "—", level: "Perfeccionamiento", dose: "8x50", cues: "Seis patadas en posición lateral, una brazada, cambio de lado." },
  { clubId: "cnso", id: "d-5", name: "Braza con dos patadas", category: "Técnica braza", group: "Coordinación", equipment: "—", level: "Avanzado", dose: "8x50", cues: "Dos patadas por cada brazada, glide largo." },
  { clubId: "cnso", id: "d-6", name: "Mariposa 1+1+3", category: "Técnica mariposa", group: "Coordinación", equipment: "—", level: "Avanzado", dose: "8x50", cues: "Una brazada izquierda, una derecha, tres completas." },
  { clubId: "cnso", id: "d-7", name: "Salida de poyete", category: "Salidas y virajes", group: "Reactiva", equipment: "Poyete", level: "Perfeccionamiento", dose: "10 reps", cues: "Track-start, empuje explosivo, entrada limpia." },
  { clubId: "cnso", id: "d-8", name: "Viraje voltereta crol", category: "Salidas y virajes", group: "Técnica viraje", equipment: "—", level: "Perfeccionamiento", dose: "10 reps", cues: "Aproximación a velocidad, ovillado compacto." },
  { clubId: "cnso", id: "d-9", name: "Sighting aguas abiertas", category: "Aguas abiertas", group: "Orientación", equipment: "—", level: "Avanzado", dose: "4x200", cues: "Levanta los ojos cada 6 brazadas sin frenar el ritmo." },
  { clubId: "cnso", id: "d-10", name: "Fuerza específica seca", category: "Seco", group: "Tren superior", equipment: "Banda elástica", level: "Perfeccionamiento", dose: "3x12", cues: "Imitar trayectoria del agarre acuático." },
  { clubId: "cnso", id: "d-11", name: "Boya estática waterpolo", category: "Waterpolo", group: "Pase y recepción", equipment: "Balón", level: "Avanzado", dose: "10 min", cues: "Mantener posición vertical sin perder altura." },
  { clubId: "cnso", id: "d-12", name: "Trampolín 1 m · pica simple", category: "Saltos", group: "Entrada", equipment: "Trampolín", level: "Iniciación", dose: "8 reps", cues: "Brazos rectos, entrada vertical." },
  { clubId: "cnso", id: "d-13", name: "Figura flamenco", category: "Sincro", group: "Figuras", equipment: "—", level: "Perfeccionamiento", dose: "6 reps", cues: "Pierna extendida 90°, control de apnea." },
];

export type CnsoSetTemplate = {
  clubId: "cnso";
  id: string;
  name: string;
  goal: string;
  level: "Iniciación" | "Perfeccionamiento" | "Avanzado" | "Élite";
  totalMeters: number;
  blocks: string[];
};

export const CNSO_SETS: CnsoSetTemplate[] = [
  {
    clubId: "cnso",
    id: "s-1",
    name: "Aeróbico extensivo 4.000 m",
    goal: "Base aeróbica de pretemporada",
    level: "Avanzado",
    totalMeters: 4000,
    blocks: [
      "Calentamiento: 600 crol suave",
      "Técnica: 8x50 con pull-buoy (1:00)",
      "Series: 6x400 crol Z2 (5:30)",
      "Vuelta a la calma: 200 estilos suave",
    ],
  },
  {
    clubId: "cnso",
    id: "s-2",
    name: "Velocidad 3.000 m",
    goal: "Estímulo de potencia y arranques",
    level: "Élite",
    totalMeters: 3000,
    blocks: [
      "Calentamiento: 400 crol + 200 espalda",
      "Drills: 8x50 catch-up (1:00)",
      "Salidas: 10 salidas + 25 sprint",
      "Series: 12x25 sprint máxima (0:45)",
      "Vuelta a la calma: 400 elección",
    ],
  },
  {
    clubId: "cnso",
    id: "s-3",
    name: "Escuela alevín · 1.200 m",
    goal: "Técnica crol y espalda en alternancia",
    level: "Perfeccionamiento",
    totalMeters: 1200,
    blocks: [
      "Calentamiento: 200 elección",
      "Drills: 4x50 6-1-6 espalda",
      "Series: 8x50 crol técnica (1:15)",
      "Juego: relevos 4x25",
    ],
  },
  {
    clubId: "cnso",
    id: "s-4",
    name: "Aguas abiertas · simulacro 2.000 m",
    goal: "Adaptación a competición aguas abiertas",
    level: "Avanzado",
    totalMeters: 2000,
    blocks: [
      "Aproximación a boya: 4x200 con sighting",
      "Bloque continuo: 1.500 m con cambios de ritmo",
      "Salida y entrada en playa: 4 simulacros",
    ],
  },
];

// ─── Tecnificación CNSO Clinics — sesiones individuales ─────────────────────
export type CnsoClinicSession = {
  clubId: "cnso";
  id: string;
  time: string;
  memberName: string;
  setId: string | null;
  coachName: string;
  status: "pending" | "ready" | "confirmed" | "done";
  notes: string;
};

export const CNSO_CLINIC_SESSIONS: CnsoClinicSession[] = [
  { clubId: "cnso", id: "cl-1", time: "07:30", memberName: "Marta Fernández", setId: "s-1", coachName: "Iván Méndez", status: "ready", notes: "Foco en cadencia 38 bpm." },
  { clubId: "cnso", id: "cl-2", time: "16:30", memberName: "Carlos Menéndez", setId: "s-3", coachName: "Marta Solís", status: "confirmed", notes: "Vídeo subacuático de mariposa." },
  { clubId: "cnso", id: "cl-3", time: "18:00", memberName: "Alba Riestra", setId: "s-3", coachName: "Pablo Roces", status: "pending", notes: "Test 200 estilos." },
  { clubId: "cnso", id: "cl-4", time: "19:15", memberName: "Diego Caso", setId: "s-4", coachName: "Andrés Coto", status: "confirmed", notes: "Preparación Triatlón Villa de Gijón." },
];

// ─── Workouts asignados a nadadores ─────────────────────────────────────────
export type CnsoWorkoutBlock = { name: string; dose: string; rest?: string; notes?: string };
export type CnsoWorkout = {
  clubId: "cnso";
  id: string;
  memberNumber: string;
  coachName: string;
  title: string;
  goal: string;
  assignedAt: string;
  targetDate?: string;
  blocks: CnsoWorkoutBlock[];
  notes?: string;
  source: "manual" | "ai" | "library";
  status: "assigned" | "in_progress" | "completed";
};

const dISO = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

export const CNSO_WORKOUTS: CnsoWorkout[] = [
  {
    clubId: "cnso",
    id: "w-1",
    memberNumber: "CNSO-04212",
    coachName: "Iván Méndez",
    title: "Espalda · bloque potencia · semana 3",
    goal: "Mejorar arranque y primeros 25 m de espalda.",
    assignedAt: dISO(-3),
    targetDate: dISO(2),
    source: "manual",
    status: "in_progress",
    blocks: [
      { name: "Calentamiento 600 m mixto", dose: "600 m" },
      { name: "Salidas + 15 m sprint", dose: "8 reps", rest: "1:30" },
      { name: "6x100 espalda fuerte", dose: "6x100", rest: "0:30" },
      { name: "Vuelta a la calma", dose: "300 m" },
    ],
    notes: "Cuidar hombro derecho, parar si molesta.",
  },
  {
    clubId: "cnso",
    id: "w-2",
    memberNumber: "CNSO-05011",
    coachName: "Andrés Coto",
    title: "Triatlón · simulacro distancia sprint",
    goal: "Bloque combinado 750 m + rodillo.",
    assignedAt: dISO(-1),
    targetDate: dISO(1),
    source: "ai",
    status: "assigned",
    blocks: [
      { name: "Calentamiento 400 m", dose: "400 m" },
      { name: "750 m continuo con sighting", dose: "750 m", notes: "RPE 7" },
      { name: "Rodillo 20 min", dose: "20 min" },
      { name: "Carrera 2 km", dose: "2 km" },
    ],
  },
];

// ─── Catálogo de equipación oficial CNSO ────────────────────────────────────
export type CnsoKitItem = {
  clubId: "cnso";
  id: string;
  name: string;
  category: string;
  sizes: string[];
  mandatory?: boolean;
};

export const CNSO_KIT: CnsoKitItem[] = [
  { clubId: "cnso", id: "k-ban", name: "Bañador competición masculino", category: "Bañador", sizes: ["28", "30", "32", "34", "36"], mandatory: true },
  { clubId: "cnso", id: "k-bah", name: "Bañador competición femenino", category: "Bañador", sizes: ["28", "30", "32", "34", "36"], mandatory: true },
  { clubId: "cnso", id: "k-gor", name: "Gorro silicona CNSO", category: "Gorro", sizes: ["Única"], mandatory: true },
  { clubId: "cnso", id: "k-gaf", name: "Gafas competición CNSO", category: "Gafas", sizes: ["Estándar", "Junior"] },
  { clubId: "cnso", id: "k-cha", name: "Chándal oficial CNSO", category: "Chándal", sizes: ["XS", "S", "M", "L", "XL", "2XL"], mandatory: true },
  { clubId: "cnso", id: "k-pol", name: "Polo paseo CNSO", category: "Polo", sizes: ["S", "M", "L", "XL"] },
  { clubId: "cnso", id: "k-moc", name: "Mochila CNSO", category: "Mochila", sizes: ["Única"] },
  { clubId: "cnso", id: "k-tow", name: "Toalla microfibra CNSO", category: "Toalla", sizes: ["Única"] },
];
