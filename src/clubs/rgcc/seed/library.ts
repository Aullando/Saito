// Library: exercises + routines + workout assignments + kit catalogue.
// Maps from covadonga-hub: seed.ts (exercises/routines), workouts.ts, equipacion-kit.ts.

export type RgccExerciseCategory =
  | "Fuerza"
  | "Core"
  | "Metabólico"
  | "Cardio"
  | "Pilates"
  | "TRX"
  | "Movilidad"
  | "Prevención"
  | "Reeducación"
  | "Técnica deportiva";

export type RgccExercise = {
  clubId: "rgcc";
  id: string;
  name: string;
  category: RgccExerciseCategory;
  group: string;
  equipment: string;
  level: "Inicial" | "Intermedio" | "Avanzado";
  dose: string;
  cues?: string;
  /** Source: "library" = catálogo general, "evidence" = ejercicios EV. */
  source?: "library" | "evidence";
};

export const RGCC_EXERCISES: RgccExercise[] = [
  {
    clubId: "rgcc",
    id: "ex-1",
    name: "Sentadilla goblet",
    category: "Fuerza",
    group: "Pierna",
    equipment: "Kettlebell",
    level: "Inicial",
    dose: "3x12",
    cues: "Espalda neutra, rodillas alineadas, bajar controlado.",
  },
  {
    clubId: "rgcc",
    id: "ex-2",
    name: "Peso muerto rumano",
    category: "Fuerza",
    group: "Cadena posterior",
    equipment: "Mancuernas",
    level: "Intermedio",
    dose: "3x10",
    cues: "Bisagra de cadera, carga cerca del cuerpo, cuello neutro.",
  },
  {
    clubId: "rgcc",
    id: "ex-3",
    name: "Press banca mancuernas",
    category: "Fuerza",
    group: "Pecho",
    equipment: "Banco + mancuernas",
    level: "Intermedio",
    dose: "4x8",
    cues: "Escápulas retraídas, recorrido completo.",
  },
  {
    clubId: "rgcc",
    id: "ex-4",
    name: "Remo TRX",
    category: "Fuerza",
    group: "Espalda",
    equipment: "TRX",
    level: "Inicial",
    dose: "3x12",
    cues: "Cuerpo en línea, retracción escapular.",
  },
  {
    clubId: "rgcc",
    id: "ex-5",
    name: "Plancha frontal",
    category: "Core",
    group: "Abdomen",
    equipment: "Colchoneta",
    level: "Inicial",
    dose: "3x35s",
    cues: "Glúteo activo, sin caer cadera.",
  },
  {
    clubId: "rgcc",
    id: "ex-6",
    name: "Dead bug",
    category: "Core",
    group: "Core profundo",
    equipment: "Colchoneta",
    level: "Inicial",
    dose: "3x10/lado",
  },
  {
    clubId: "rgcc",
    id: "ex-7",
    name: "Battle rope intervals",
    category: "Metabólico",
    group: "Full body",
    equipment: "Cuerdas",
    level: "Avanzado",
    dose: "8x20s",
  },
  {
    clubId: "rgcc",
    id: "ex-8",
    name: "Ciclo indoor sprint",
    category: "Cardio",
    group: "Cardiorrespiratorio",
    equipment: "Bike",
    level: "Intermedio",
    dose: "10x30s",
  },
  {
    clubId: "rgcc",
    id: "ex-9",
    name: "Pilates hundred",
    category: "Pilates",
    group: "Core",
    equipment: "Colchoneta",
    level: "Intermedio",
    dose: "1x100",
  },
  {
    clubId: "rgcc",
    id: "ex-10",
    name: "Springboard leg series",
    category: "Pilates",
    group: "Pierna/Core",
    equipment: "Springboard",
    level: "Avanzado",
    dose: "12 min",
  },
  {
    clubId: "rgcc",
    id: "ex-11",
    name: "TRX chest press",
    category: "TRX",
    group: "Pecho/Core",
    equipment: "TRX",
    level: "Intermedio",
    dose: "3x12",
  },
  {
    clubId: "rgcc",
    id: "ex-12",
    name: "TRX atomic push-up",
    category: "TRX",
    group: "Full body",
    equipment: "TRX",
    level: "Avanzado",
    dose: "3x8",
  },
  {
    clubId: "rgcc",
    id: "ex-13",
    name: "Body workout AMRAP",
    category: "Metabólico",
    group: "Full body",
    equipment: "Mixto",
    level: "Avanzado",
    dose: "16 min",
  },
  {
    clubId: "rgcc",
    id: "ex-14",
    name: "Yoga saludo al sol",
    category: "Movilidad",
    group: "Global",
    equipment: "Esterilla",
    level: "Inicial",
    dose: "8 min",
  },
  {
    clubId: "rgcc",
    id: "ex-15",
    name: "Hip thrust",
    category: "Fuerza",
    group: "Glúteo",
    equipment: "Banco + barra",
    level: "Intermedio",
    dose: "4x10",
  },
  {
    clubId: "rgcc",
    id: "ex-16",
    name: "Farmer carry",
    category: "Fuerza",
    group: "Core/Agarre",
    equipment: "Kettlebells",
    level: "Inicial",
    dose: "6x30m",
  },

  // ─── Evidence-based / EV catalogue ────────────────────────────────────────
  {
    clubId: "rgcc",
    id: "ev-aterrizaje-bilateral",
    name: "Aterrizaje bilateral controlado",
    category: "Prevención",
    group: "Pierna",
    equipment: "Cajón bajo",
    level: "Inicial",
    dose: "3x6",
    cues: "Cae con tobillo, rodilla y cadera alineados.",
    source: "evidence",
  },
  {
    clubId: "rgcc",
    id: "ev-blunder-check",
    name: "Blunder check escapular",
    category: "Prevención",
    group: "Hombro",
    equipment: "Banda elástica",
    level: "Inicial",
    dose: "3x10",
    source: "evidence",
  },
  {
    clubId: "rgcc",
    id: "ev-circuito-adaptado",
    name: "Circuito adaptado",
    category: "Reeducación",
    group: "Full body",
    equipment: "Mixto",
    level: "Inicial",
    dose: "3 vueltas",
    source: "evidence",
  },
  {
    clubId: "rgcc",
    id: "ev-copenhagen-plank",
    name: "Copenhagen plank",
    category: "Prevención",
    group: "Aductores",
    equipment: "Banco",
    level: "Avanzado",
    dose: "3x20s/lado",
    source: "evidence",
  },
  {
    clubId: "rgcc",
    id: "ev-equilibrio-tobillo",
    name: "Equilibrio unipodal tobillo",
    category: "Prevención",
    group: "Tobillo",
    equipment: "Plataforma inestable",
    level: "Inicial",
    dose: "3x30s",
    source: "evidence",
  },
  {
    clubId: "rgcc",
    id: "ev-frenada-reactiva",
    name: "Frenada reactiva",
    category: "Técnica deportiva",
    group: "Pierna",
    equipment: "Conos",
    level: "Avanzado",
    dose: "6x10m",
    source: "evidence",
  },
  {
    clubId: "rgcc",
    id: "ev-hip-hinge",
    name: "Hip hinge con pica",
    category: "Técnica deportiva",
    group: "Cadera",
    equipment: "Pica",
    level: "Inicial",
    dose: "3x10",
    cues: "Mantén las 3 puntas de contacto en la pica.",
    source: "evidence",
  },
  {
    clubId: "rgcc",
    id: "ev-isometria-cervical",
    name: "Isometría cervical multidirección",
    category: "Prevención",
    group: "Cuello",
    equipment: "Toalla",
    level: "Inicial",
    dose: "4x10s",
    source: "evidence",
  },
  {
    clubId: "rgcc",
    id: "ev-lanzamiento-rotacional",
    name: "Lanzamiento rotacional con balón",
    category: "Técnica deportiva",
    group: "Core/Hombro",
    equipment: "Balón medicinal",
    level: "Avanzado",
    dose: "4x6/lado",
    source: "evidence",
  },
  {
    clubId: "rgcc",
    id: "ev-nordic-hamstring",
    name: "Nordic hamstring curl",
    category: "Prevención",
    group: "Isquios",
    equipment: "Compañero",
    level: "Avanzado",
    dose: "3x6",
    source: "evidence",
  },
  {
    clubId: "rgcc",
    id: "ev-pallof-press",
    name: "Pallof press",
    category: "Core",
    group: "Antirrotación",
    equipment: "Polea/Banda",
    level: "Intermedio",
    dose: "3x12/lado",
    source: "evidence",
  },
  {
    clubId: "rgcc",
    id: "ev-pausa-cervical",
    name: "Pausa activa cervical",
    category: "Reeducación",
    group: "Cuello",
    equipment: "—",
    level: "Inicial",
    dose: "5 min",
    source: "evidence",
  },
  {
    clubId: "rgcc",
    id: "ev-remo-banda",
    name: "Remo con banda elástica",
    category: "Fuerza",
    group: "Espalda",
    equipment: "Banda",
    level: "Inicial",
    dose: "3x12",
    source: "evidence",
  },
  {
    clubId: "rgcc",
    id: "ev-respiracion-cd",
    name: "Respiración costo-diafragmática",
    category: "Reeducación",
    group: "Diafragma",
    equipment: "Colchoneta",
    level: "Inicial",
    dose: "5 min",
    source: "evidence",
  },
  {
    clubId: "rgcc",
    id: "ev-rotadores-banda",
    name: "Rotadores externos con banda",
    category: "Prevención",
    group: "Hombro",
    equipment: "Banda",
    level: "Inicial",
    dose: "3x12",
    source: "evidence",
  },
  {
    clubId: "rgcc",
    id: "ev-sentadilla-caja",
    name: "Sentadilla a caja",
    category: "Reeducación",
    group: "Pierna",
    equipment: "Cajón",
    level: "Inicial",
    dose: "3x8",
    source: "evidence",
  },
  {
    clubId: "rgcc",
    id: "ev-skipping-tecnico",
    name: "Skipping técnico",
    category: "Técnica deportiva",
    group: "Carrera",
    equipment: "—",
    level: "Intermedio",
    dose: "4x20m",
    source: "evidence",
  },
  {
    clubId: "rgcc",
    id: "ev-split-step",
    name: "Split step reactivo",
    category: "Técnica deportiva",
    group: "Pierna",
    equipment: "—",
    level: "Intermedio",
    dose: "4x20s",
    source: "evidence",
  },
  {
    clubId: "rgcc",
    id: "ev-ukemi",
    name: "Caídas controladas (ukemi)",
    category: "Técnica deportiva",
    group: "Full body",
    equipment: "Tatami",
    level: "Intermedio",
    dose: "10 reps",
    source: "evidence",
  },
];

export type RgccRoutine = {
  clubId: "rgcc";
  id: string;
  name: string;
  goal: string;
  level: "Inicial" | "Intermedio" | "Avanzado";
  durationMin: number;
  exerciseIds: string[];
};

export const RGCC_ROUTINES: RgccRoutine[] = [
  {
    clubId: "rgcc",
    id: "r-1",
    name: "EP Fuerza Base",
    goal: "Ganancia de fuerza general",
    level: "Intermedio",
    durationMin: 55,
    exerciseIds: ["ex-1", "ex-3", "ex-4", "ex-5"],
  },
  {
    clubId: "rgcc",
    id: "r-2",
    name: "Pilates Springboard Control",
    goal: "Control lumbo-pélvico y movilidad",
    level: "Avanzado",
    durationMin: 50,
    exerciseIds: ["ex-9", "ex-10", "ex-6", "ex-14"],
  },
  {
    clubId: "rgcc",
    id: "r-3",
    name: "TRX Full Body",
    goal: "Trabajo global con autocarga",
    level: "Intermedio",
    durationMin: 45,
    exerciseIds: ["ex-11", "ex-4", "ex-12", "ex-16"],
  },
  {
    clubId: "rgcc",
    id: "r-4",
    name: "Ciclo + Core Express",
    goal: "Cardio interválico con core",
    level: "Inicial",
    durationMin: 35,
    exerciseIds: ["ex-8", "ex-6", "ex-5", "ex-14"],
  },
];

// ─── Personal Training sessions ─────────────────────────────────────────────
export type RgccPtSession = {
  clubId: "rgcc";
  id: string;
  time: string;
  memberName: string;
  routineId: string | null;
  coachName: string;
  status: "pending" | "ready" | "confirmed" | "done";
  notes: string;
  completedExerciseIds: string[];
};

export const RGCC_PT_SESSIONS: RgccPtSession[] = [
  {
    clubId: "rgcc",
    id: "ep-1",
    time: "08:00",
    memberName: "Marta Fernández",
    routineId: "r-1",
    coachName: "Juan",
    status: "ready",
    notes: "",
    completedExerciseIds: [],
  },
  {
    clubId: "rgcc",
    id: "ep-2",
    time: "10:30",
    memberName: "Carlos Menéndez",
    routineId: "r-4",
    coachName: "Débora",
    status: "pending",
    notes: "Pendiente valoración inicial.",
    completedExerciseIds: [],
  },
  {
    clubId: "rgcc",
    id: "ep-3",
    time: "17:00",
    memberName: "Laura Pardo",
    routineId: "r-3",
    coachName: "Maria A C",
    status: "confirmed",
    notes: "",
    completedExerciseIds: [],
  },
  {
    clubId: "rgcc",
    id: "ep-4",
    time: "19:30",
    memberName: "Diego Caso",
    routineId: "r-2",
    coachName: "Patricia Rivas",
    status: "confirmed",
    notes: "",
    completedExerciseIds: [],
  },
];

// ─── Workout assignments ────────────────────────────────────────────────────
const dISO = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

export type RgccWorkoutBlock = {
  exerciseId?: string;
  name: string;
  dose: string;
  rest?: string;
  notes?: string;
};
export type RgccWorkout = {
  clubId: "rgcc";
  id: string;
  memberNumber: string;
  coachName: string;
  title: string;
  goal: string;
  assignedAt: string;
  targetDate?: string;
  blocks: RgccWorkoutBlock[];
  notes?: string;
  source: "manual" | "ai" | "library";
  status: "assigned" | "in_progress" | "completed";
  ts: string;
};

export const RGCC_WORKOUTS: RgccWorkout[] = [
  {
    clubId: "rgcc",
    id: "w-seed-1",
    memberNumber: "RGCC-04212",
    coachName: "Juan",
    title: "Fuerza glúteo · semana 3",
    goal: "Reforzar cadena posterior con foco en hip thrust",
    assignedAt: dISO(-2),
    targetDate: dISO(0),
    source: "manual",
    status: "in_progress",
    blocks: [
      {
        exerciseId: "ex-15",
        name: "Hip thrust con barra",
        dose: "4x10",
        rest: "90s",
        notes: "Pausa 1s arriba",
      },
      { exerciseId: "ex-2", name: "Peso muerto rumano", dose: "3x10", rest: "60s" },
      { exerciseId: "ex-5", name: "Plancha frontal", dose: "3x35s", rest: "30s" },
    ],
    notes: "Cuida la zona lumbar. Si aparece molestia, regresa a goblet.",
    ts: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    clubId: "rgcc",
    id: "w-seed-2",
    memberNumber: "RGCC-03988",
    coachName: "Débora",
    title: "Cardio + core express",
    goal: "30 min mantenimiento metabólico",
    assignedAt: dISO(-1),
    targetDate: dISO(1),
    source: "ai",
    status: "assigned",
    blocks: [
      { exerciseId: "ex-8", name: "Bici suave 10 min", dose: "10 min", notes: "RPE 5/10" },
      { exerciseId: "ex-5", name: "Plancha frontal", dose: "3x35s", rest: "30s" },
      { exerciseId: "ex-6", name: "Dead bug", dose: "3x10/lado", rest: "30s" },
      { exerciseId: "ex-8", name: "Bici intervalos", dose: "8x30s", rest: "30s" },
    ],
    ts: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
];

// ─── Coach kit catalogue ────────────────────────────────────────────────────
export type RgccKitItem = {
  clubId: "rgcc";
  id: string;
  name: string;
  category: string;
  sizes: string[];
  mandatory?: boolean;
};

export const RGCC_KIT: RgccKitItem[] = [
  {
    clubId: "rgcc",
    id: "k-cha",
    name: "Chaqueta RGCC (E4)",
    category: "Chaqueta",
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    mandatory: true,
  },
  {
    clubId: "rgcc",
    id: "k-pol",
    name: "Polo Squadra 25 (E3)",
    category: "Polo",
    sizes: ["S", "M", "L", "XL", "2XL"],
    mandatory: true,
  },
  {
    clubId: "rgcc",
    id: "k-cam",
    name: "Camiseta Squadra 25 (E3)",
    category: "Camiseta",
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    mandatory: true,
  },
  {
    clubId: "rgcc",
    id: "k-pan",
    name: "Pantalón largo Squadra 25 (E1)",
    category: "Pantalón",
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    mandatory: true,
  },
  {
    clubId: "rgcc",
    id: "k-ber",
    name: "Bermuda Tiro 24 (E1)",
    category: "Bermuda",
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
  },
  {
    clubId: "rgcc",
    id: "k-moc",
    name: "Mochila Tiro 23 (E1)",
    category: "Mochila",
    sizes: ["Única"],
  },
];
