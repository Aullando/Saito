// Entrenadores y nadadores de CNSO. Adaptado del patrón RGCC.

export type CnsoCoach = {
  clubId: "cnso";
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
  "Iván Méndez",
  "Marta Solís",
  "Lucía Granda",
  "David Rubio",
  "Elena Pando",
  "Pablo Roces",
  "Belén Tuñón",
  "Hugo Vega",
  "Sheila Casariego",
  "Andrés Coto",
  "Sara Cabal",
  "Borja Estrada",
  "Sergio Caso",
  "Carla Méndez",
  "Adrián Bao",
  "Patricia Rivas",
  "Diego Caso",
  "Nuria Vega",
  "Rubén Ardura",
  "Eva Tuñón",
];

const SPECIALTIES = [
  "Crol",
  "Espalda",
  "Braza",
  "Mariposa",
  "Estilos",
  "Aguas abiertas",
  "Waterpolo",
  "Saltos",
  "Sincro",
  "Triatlón",
  "Seco · Fuerza",
];

function seedRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export const CNSO_COACHES: CnsoCoach[] = (() => {
  const r = seedRand(31);
  return COACH_NAMES.map((name, i) => {
    const contract = [10, 15, 20, 25, 30, 35, 40][Math.floor(r() * 7)];
    const base = +(r() * contract * 0.8).toFixed(1);
    const variable = +(r() * 3).toFixed(1);
    const sust = +(r() * 2).toFixed(1);
    const pt = +(r() * 2).toFixed(1);
    const total = +(base + variable + sust + pt).toFixed(1);
    const max = Math.max(contract, Math.ceil(total + r() * 4));
    const ratio = total / max;
    const status: CnsoCoach["status"] =
      ratio > 1 ? "over" : ratio >= 0.9 ? "limit" : "ok";
    return {
      clubId: "cnso",
      id: `tec-${i + 1}`,
      name,
      email:
        name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, ".") + "@cnsantaolaya.org",
      role: "coach",
      contractedHours: contract,
      baseHours: base,
      variableHours: variable,
      substitutionsHours: sust,
      ptHours: pt,
      totalHours: total,
      maxHours: max,
      bagHours: +(r() * 8).toFixed(1),
      status,
      specialty: SPECIALTIES[i % SPECIALTIES.length],
    };
  });
})();

// ─── Socios / Nadadores ─────────────────────────────────────────────────────
export type CnsoMember = {
  clubId: "cnso";
  id: string;
  memberNumber: string; // CNSO-XXXXX
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  coachName: string;
  activity: string;
  level: "Iniciación" | "Perfeccionamiento" | "Competición" | "Élite";
  status: "active" | "paused" | "inactive";
  joinedAt: string;
  goal: string;
  notes: string;
  bestTimes: { event: string; time: string; date: string }[];
};

const dISO = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

const RAW_MEMBERS: Array<Omit<CnsoMember, "clubId">> = [
  {
    id: "n-1",
    memberNumber: "CNSO-04212",
    firstName: "Marta",
    lastName: "Fernández",
    email: "marta.fernandez@socio.cnsantaolaya.org",
    phone: "+34 985 33 21 01",
    birthDate: "2007-03-14",
    coachName: "Iván Méndez",
    activity: "Primer Equipo · Espalda",
    level: "Élite",
    status: "active",
    joinedAt: "2017-09-01",
    goal: "Bajar de 2:15 en 200 espalda largo.",
    notes: "Mejora notable en arranques tras bloque de seco.",
    bestTimes: [
      { event: "200 espalda L", time: "2:16.45", date: dISO(-25) },
      { event: "100 espalda L", time: "1:04.10", date: dISO(-90) },
      { event: "50 espalda L", time: "29.88", date: dISO(-180) },
    ],
  },
  {
    id: "n-2",
    memberNumber: "CNSO-03988",
    firstName: "Carlos",
    lastName: "Menéndez",
    email: "carlos.menendez@socio.cnsantaolaya.org",
    phone: "+34 985 33 21 02",
    birthDate: "2010-07-22",
    coachName: "Marta Solís",
    activity: "Tecnificación · Mariposa",
    level: "Competición",
    status: "active",
    joinedAt: "2019-09-15",
    goal: "Consolidar técnica de mariposa y bajar 1:05 en 100 m.",
    notes: "Foco en respiración asimétrica y patada ondulatoria.",
    bestTimes: [
      { event: "100 mariposa C", time: "1:08.22", date: dISO(-40) },
      { event: "50 mariposa C", time: "30.55", date: dISO(-100) },
    ],
  },
  {
    id: "n-3",
    memberNumber: "CNSO-04777",
    firstName: "Laura",
    lastName: "Pardo",
    email: "laura.pardo@socio.cnsantaolaya.org",
    phone: "+34 985 33 21 03",
    birthDate: "1985-11-02",
    coachName: "Belén Tuñón",
    activity: "Grupo Máster",
    level: "Perfeccionamiento",
    status: "active",
    joinedAt: "2022-01-08",
    goal: "Completar travesía 5 km Playa de San Lorenzo.",
    notes: "Plan combinado piscina + aguas abiertas en primavera.",
    bestTimes: [{ event: "1500 libre L", time: "23:14.00", date: dISO(-60) }],
  },
  {
    id: "n-4",
    memberNumber: "CNSO-05011",
    firstName: "Diego",
    lastName: "Caso",
    email: "diego.caso@socio.cnsantaolaya.org",
    phone: "+34 985 33 21 04",
    birthDate: "2008-05-19",
    coachName: "Andrés Coto",
    activity: "Triatlón",
    level: "Competición",
    status: "active",
    joinedAt: "2020-06-12",
    goal: "Preparar Triatlón Villa de Gijón Sprint.",
    notes: "Buen umbral aeróbico, mejorar transiciones.",
    bestTimes: [
      { event: "750 m aguas abiertas", time: "10:42", date: dISO(-180) },
      { event: "400 libre C", time: "4:58.00", date: dISO(-30) },
    ],
  },
  {
    id: "n-5",
    memberNumber: "CNSO-05122",
    firstName: "Nadia",
    lastName: "Bárcena",
    email: "nadia.barcena@socio.cnsantaolaya.org",
    phone: "+34 985 33 21 05",
    birthDate: "2012-02-04",
    coachName: "Lucía Granda",
    activity: "Escuela · Alevín",
    level: "Perfeccionamiento",
    status: "active",
    joinedAt: "2021-09-01",
    goal: "Mejorar viraje de espalda y participar en Trofeo Villa.",
    notes: "Excelente actitud, motivación alta.",
    bestTimes: [{ event: "50 libre C", time: "33.12", date: dISO(-20) }],
  },
  {
    id: "n-6",
    memberNumber: "CNSO-05204",
    firstName: "Hugo",
    lastName: "Lago",
    email: "hugo.lago@socio.cnsantaolaya.org",
    phone: "+34 985 33 21 06",
    birthDate: "2006-10-30",
    coachName: "Hugo Vega",
    activity: "Waterpolo",
    level: "Competición",
    status: "active",
    joinedAt: "2018-09-10",
    goal: "Consolidar puesto de boya en categoría sub-18.",
    notes: "Trabajo específico de potencia de remate.",
    bestTimes: [],
  },
  {
    id: "n-7",
    memberNumber: "CNSO-05330",
    firstName: "Carla",
    lastName: "Acebal",
    email: "carla.acebal@socio.cnsantaolaya.org",
    phone: "+34 985 33 21 07",
    birthDate: "2011-08-12",
    coachName: "Sheila Casariego",
    activity: "Natación Artística",
    level: "Competición",
    status: "active",
    joinedAt: "2019-09-12",
    goal: "Rutina equipo libre infantil para Cto. Asturias.",
    notes: "Flexibilidad excelente, mejorar apnea.",
    bestTimes: [],
  },
  {
    id: "n-8",
    memberNumber: "CNSO-04444",
    firstName: "Alba",
    lastName: "Riestra",
    email: "alba.riestra@socio.cnsantaolaya.org",
    phone: "+34 985 33 21 08",
    birthDate: "2009-01-25",
    coachName: "Pablo Roces",
    activity: "Escuela · Infantil · Estilos",
    level: "Perfeccionamiento",
    status: "active",
    joinedAt: "2018-09-10",
    goal: "Pasar a Tecnificación la próxima temporada.",
    notes: "Marca propia en 200 estilos esta semana.",
    bestTimes: [{ event: "200 estilos C", time: "2:48.10", date: dISO(-10) }],
  },
  {
    id: "n-9",
    memberNumber: "CNSO-04999",
    firstName: "Mario",
    lastName: "Cienfuegos",
    email: "mario.cienfuegos@socio.cnsantaolaya.org",
    phone: "+34 985 33 21 09",
    birthDate: "2005-06-08",
    coachName: "Iván Méndez",
    activity: "Primer Equipo · Crol",
    level: "Élite",
    status: "active",
    joinedAt: "2014-09-01",
    goal: "Mínima nacional 100 crol absoluta.",
    notes: "Volumen alto, monitorizar carga acumulada.",
    bestTimes: [
      { event: "100 libre L", time: "51.20", date: dISO(-15) },
      { event: "50 libre L", time: "23.95", date: dISO(-15) },
    ],
  },
  {
    id: "n-10",
    memberNumber: "CNSO-05500",
    firstName: "Olaya",
    lastName: "Pando",
    email: "olaya.pando@socio.cnsantaolaya.org",
    phone: "+34 985 33 21 10",
    birthDate: "2013-04-17",
    coachName: "David Rubio",
    activity: "Escuela · Benjamín",
    level: "Iniciación",
    status: "active",
    joinedAt: "2022-09-12",
    goal: "Aprender salida desde poyete.",
    notes: "Primer año en competiciones internas.",
    bestTimes: [],
  },
];

export const CNSO_MEMBERS: CnsoMember[] = RAW_MEMBERS.map((m) => ({
  clubId: "cnso",
  ...m,
}));
