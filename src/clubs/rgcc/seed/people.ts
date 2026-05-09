// Coaches/monitors mapped to a SAITO-friendly user shape, plus members (athletes).

export type RgccCoach = {
  clubId: "rgcc";
  id: string;
  name: string;
  email: string;
  role: "coach";
  contractedHours: number;
  baseHours: number;
  variableHours: number;
  substitutionsHours: number;
  ptHours: number;
  totalHours: number;
  maxHours: number;
  bagHours: number;
  status: "ok" | "limit" | "over" | "absent";
  specialty?: string;
};

const COACH_NAMES = [
  "Sheila",
  "Maria A C",
  "Aitor",
  "Joana",
  "Hugo",
  "Maria Mato",
  "Felipe",
  "Juan",
  "Débora",
  "Monitor Prueba",
  "Paco",
  "Jano",
  "Patricia Rivas",
  "Belén",
  "Lucía",
  "Carlos",
  "Andrés",
  "Marta",
  "Elena",
  "Pablo",
  "Raquel",
  "Diego",
  "Sara",
  "Iván",
  "Nuria",
  "Adrián",
  "Cristina",
  "Rubén",
  "Paula",
  "Álvaro",
  "Ana",
  "Daniel",
  "Beatriz",
  "Sergio",
  "Lorena",
  "Manuel",
  "Eva",
  "David",
  "Rocío",
  "Javier",
  "Silvia",
  "Óscar",
  "Inés",
  "Roberto",
];

function seedRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export const RGCC_COACHES: RgccCoach[] = (() => {
  const r = seedRand(42);
  const SPECIALTIES = ["Pilates", "Ciclo Indoor", "TRX", "Yoga", "Funcional", "GAP"];
  return COACH_NAMES.map((n, i) => {
    const contract = [8, 9, 10, 12, 15, 20, 25, 30, 34, 35, 40][Math.floor(r() * 11)];
    const base = +(r() * contract * 0.8).toFixed(1);
    const variable = +(r() * 4).toFixed(1);
    const sust = +(r() * 2).toFixed(1);
    const pt = +(r() * 3).toFixed(1);
    let total = +(base + variable + sust + pt).toFixed(1);
    const fixed: Record<string, number> = {
      Sheila: 31,
      "Maria A C": 24,
      Aitor: 23,
      Joana: 19,
      Hugo: 16,
      "Maria Mato": 15,
      Felipe: 14,
      Juan: 13,
      "Monitor Prueba": 0,
      Paco: 0,
      Jano: 10,
    };
    if (n in fixed) total = fixed[n];
    const max = Math.max(contract, Math.ceil(total + r() * 4));
    const ratio = total / max;
    let status: RgccCoach["status"] = ratio > 1 ? "over" : ratio >= 0.9 ? "limit" : "ok";
    if (n === "Sheila") status = "limit";
    return {
      clubId: "rgcc",
      id: `m-${i + 1}`,
      name: n,
      email: n.toLowerCase().replace(/\s+/g, ".") + "@rgcc.es",
      role: "coach",
      contractedHours: contract,
      baseHours: base,
      variableHours: variable,
      substitutionsHours: sust,
      ptHours: pt,
      totalHours: total,
      maxHours: max,
      bagHours: +(r() * 10).toFixed(1),
      status,
      specialty: SPECIALTIES[i % SPECIALTIES.length],
    };
  });
})();

// ─── Members / Athletes ─────────────────────────────────────────────────────
export type RgccMember = {
  clubId: "rgcc";
  id: string;
  memberNumber: string; // RGCC-XXXXX (socio)
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  coachName: string;
  activity: string;
  level: "Inicial" | "Intermedio" | "Avanzado";
  status: "active" | "paused" | "inactive";
  joinedAt: string;
  goal: string;
  notes: string;
  progress: { date: string; weight?: number; bodyFat?: number; test?: string; notes?: string }[];
};

const dISO = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

const splitName = (full: string): [string, string] => {
  const parts = full.split(" ");
  return [parts[0], parts.slice(1).join(" ") || ""];
};

const RAW_MEMBERS = [
  {
    id: "al-1",
    memberNumber: "RGCC-04212",
    name: "Marta Fernández",
    email: "marta.fernandez@socio.rgcc.es",
    phone: "+34 985 11 22 01",
    birthDate: "1988-03-14",
    coachName: "Juan",
    activity: "EP Fuerza",
    level: "Intermedio",
    status: "active",
    joinedAt: "2024-01-15",
    goal: "Recomposición y fuerza glúteo.",
    notes: "Lumbalgia crónica leve. Adaptar peso muerto.",
    progress: [
      {
        date: dISO(-90),
        weight: 68.4,
        bodyFat: 28.1,
        test: "Goblet 16kg x10",
        notes: "Inicio plan.",
      },
      { date: dISO(-60), weight: 67.2, bodyFat: 26.8, test: "Goblet 20kg x10" },
      { date: dISO(-30), weight: 66.1, bodyFat: 25.4, test: "Hip thrust 60kg x8" },
      {
        date: dISO(-7),
        weight: 65.4,
        bodyFat: 24.7,
        test: "Hip thrust 70kg x8",
        notes: "Mejora notable.",
      },
    ],
  },
  {
    id: "al-2",
    memberNumber: "RGCC-03988",
    name: "Carlos Menéndez",
    email: "carlos.menendez@socio.rgcc.es",
    phone: "+34 985 11 22 02",
    birthDate: "1979-07-22",
    coachName: "Débora",
    activity: "Ciclo + Core",
    level: "Inicial",
    status: "active",
    joinedAt: "2024-09-02",
    goal: "Pérdida de grasa, mejora cardio.",
    notes: "HTA controlada.",
    progress: [
      { date: dISO(-120), weight: 92.1, bodyFat: 32.0, test: "FTP 180W" },
      { date: dISO(-60), weight: 89.8, bodyFat: 30.2, test: "FTP 195W" },
      {
        date: dISO(-14),
        weight: 88.0,
        bodyFat: 28.9,
        test: "FTP 210W",
        notes: "Constante 4 sesiones/sem.",
      },
    ],
  },
  {
    id: "al-3",
    memberNumber: "RGCC-05011",
    name: "Laura Pardo",
    email: "laura.pardo@socio.rgcc.es",
    phone: "+34 985 11 22 03",
    birthDate: "1992-11-05",
    coachName: "Maria A C",
    activity: "TRX Full Body",
    level: "Intermedio",
    status: "active",
    joinedAt: "2024-05-20",
    goal: "Tono y movilidad.",
    notes: "",
    progress: [
      { date: dISO(-80), weight: 58.2, bodyFat: 22.3, test: "TRX row x12" },
      { date: dISO(-30), weight: 57.6, bodyFat: 21.5, test: "TRX atomic x6" },
    ],
  },
  {
    id: "al-4",
    memberNumber: "RGCC-04777",
    name: "Diego Caso",
    email: "diego.caso@socio.rgcc.es",
    phone: "+34 985 11 22 04",
    birthDate: "1985-02-18",
    coachName: "Patricia Rivas",
    activity: "Pilates Springboard",
    level: "Avanzado",
    status: "active",
    joinedAt: "2023-10-11",
    goal: "Control postural y rehabilitación lumbar.",
    notes: "Hernia L4-L5 estable.",
    progress: [
      { date: dISO(-150), weight: 78.0, bodyFat: 19.0, test: "Hundred 100rep" },
      {
        date: dISO(-30),
        weight: 76.5,
        bodyFat: 17.9,
        test: "Springboard leg 12min",
        notes: "Sin dolor.",
      },
    ],
  },
  {
    id: "al-5",
    memberNumber: "RGCC-05122",
    name: "Sara Vega",
    email: "sara.vega@socio.rgcc.es",
    phone: "+34 985 11 22 05",
    birthDate: "1995-06-30",
    coachName: "Sheila",
    activity: "Body Workout",
    level: "Avanzado",
    status: "active",
    joinedAt: "2025-01-10",
    goal: "Rendimiento metabólico.",
    notes: "",
    progress: [
      { date: dISO(-45), weight: 60.0, bodyFat: 19.8, test: "AMRAP 16 = 5 rondas" },
      { date: dISO(-7), weight: 59.5, bodyFat: 19.0, test: "AMRAP 16 = 6+2" },
    ],
  },
  {
    id: "al-6",
    memberNumber: "RGCC-04999",
    name: "Pablo Ríos",
    email: "pablo.rios@socio.rgcc.es",
    phone: "+34 985 11 22 06",
    birthDate: "1982-12-09",
    coachName: "Aitor",
    activity: "Funcional",
    level: "Intermedio",
    status: "paused",
    joinedAt: "2024-04-04",
    goal: "Volver tras lesión hombro.",
    notes: "Reincorporación gradual.",
    progress: [{ date: dISO(-90), weight: 84.2, bodyFat: 23.1, notes: "Pausa por lesión." }],
  },
  {
    id: "al-7",
    memberNumber: "RGCC-05201",
    name: "Elena Cobo",
    email: "elena.cobo@socio.rgcc.es",
    phone: "+34 985 11 22 07",
    birthDate: "1990-09-12",
    coachName: "Juan",
    activity: "EP Fuerza",
    level: "Inicial",
    status: "active",
    joinedAt: "2025-02-01",
    goal: "Iniciación a fuerza.",
    notes: "",
    progress: [
      { date: dISO(-30), weight: 64.0, bodyFat: 27.0, test: "Goblet 8kg x10" },
      { date: dISO(-3), weight: 63.6, bodyFat: 26.4, test: "Goblet 12kg x10" },
    ],
  },
  {
    id: "al-8",
    memberNumber: "RGCC-04555",
    name: "Iván Rey",
    email: "ivan.rey@socio.rgcc.es",
    phone: "+34 985 11 22 08",
    birthDate: "1976-04-25",
    coachName: "Maria A C",
    activity: "TRX",
    level: "Inicial",
    status: "active",
    joinedAt: "2024-11-08",
    goal: "Mejora postural.",
    notes: "",
    progress: [
      { date: dISO(-60), weight: 95.0, bodyFat: 30.5 },
      { date: dISO(-15), weight: 93.2, bodyFat: 29.1, test: "TRX row x10" },
    ],
  },
] as const;

export const RGCC_MEMBERS: RgccMember[] = RAW_MEMBERS.map((m) => {
  const [first, last] = splitName(m.name);
  return {
    clubId: "rgcc",
    id: m.id,
    memberNumber: m.memberNumber,
    firstName: first,
    lastName: last,
    email: m.email,
    phone: m.phone,
    birthDate: m.birthDate,
    coachName: m.coachName,
    activity: m.activity,
    level: m.level,
    status: m.status,
    joinedAt: m.joinedAt,
    goal: m.goal,
    notes: m.notes,
    progress: [...m.progress],
  };
});
