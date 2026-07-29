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
  name_en?: string;
  name_sr?: string;
  category: CnsoDrillCategory;
  group: string;
  group_en?: string;
  group_sr?: string;
  equipment: string;
  equipment_en?: string;
  equipment_sr?: string;
  level: "Iniciación" | "Perfeccionamiento" | "Avanzado";
  dose: string;
  cues?: string;
  cues_en?: string;
  cues_sr?: string;
};

export const CNSO_DRILLS: CnsoDrill[] = [
  { clubId: "cnso", id: "d-1", name: "Catch-up crol", name_en: "Catch-up freestyle", name_sr: "Catch-up kraul", category: "Técnica crol", group: "Brazada", group_en: "Stroke", group_sr: "Zaveslaj", equipment: "—", level: "Iniciación", dose: "4x50", cues: "Espera la mano antes de iniciar la siguiente brazada.", cues_en: "Wait for the recovering hand before starting the next stroke.", cues_sr: "Sačekaj da ruka stigne pre nego što započneš sledeći zaveslaj." },
  { clubId: "cnso", id: "d-2", name: "Pull-buoy + paletas", name_en: "Pull-buoy + paddles", name_sr: "Pull-buoy + lopatice", category: "Tracción", group: "Tren superior", group_en: "Upper body", group_sr: "Gornji deo tela", equipment: "Pull-buoy + paletas", equipment_en: "Pull-buoy + paddles", equipment_sr: "Pull-buoy + lopatice", level: "Perfeccionamiento", dose: "6x100", cues: "Foco en agarre alto y codo elevado.", cues_en: "Focus on a high catch with a high elbow.", cues_sr: "Fokus na visok hvat i podignut lakat." },
  { clubId: "cnso", id: "d-3", name: "Patada vertical", name_en: "Vertical kick", name_sr: "Vertikalno udaranje nogama", category: "Patada", group: "Tren inferior", group_en: "Lower body", group_sr: "Donji deo tela", equipment: "—", level: "Perfeccionamiento", dose: "4x30s", cues: "Manos fuera del agua, mantener cadera alta.", cues_en: "Hands out of the water, keep hips high.", cues_sr: "Ruke iznad vode, kukovi visoko." },
  { clubId: "cnso", id: "d-4", name: "6-1-6 espalda", name_en: "6-1-6 backstroke", name_sr: "6-1-6 leđno", category: "Técnica espalda", group: "Rolido", group_en: "Body roll", group_sr: "Rotacija tela", equipment: "—", level: "Perfeccionamiento", dose: "8x50", cues: "Seis patadas en posición lateral, una brazada, cambio de lado.", cues_en: "Six kicks on your side, one stroke, switch sides.", cues_sr: "Šest udaraca nogama na boku, jedan zaveslaj, promena strane." },
  { clubId: "cnso", id: "d-5", name: "Braza con dos patadas", name_en: "Two-kick breaststroke", name_sr: "Prsno sa dva udarca nogama", category: "Técnica braza", group: "Coordinación", group_en: "Coordination", group_sr: "Koordinacija", equipment: "—", level: "Avanzado", dose: "8x50", cues: "Dos patadas por cada brazada, glide largo.", cues_en: "Two kicks per stroke, long glide.", cues_sr: "Dva udarca nogama po zaveslaju, dugo klizanje." },
  { clubId: "cnso", id: "d-6", name: "Mariposa 1+1+3", name_en: "Butterfly 1+1+3", name_sr: "Delfin 1+1+3", category: "Técnica mariposa", group: "Coordinación", group_en: "Coordination", group_sr: "Koordinacija", equipment: "—", level: "Avanzado", dose: "8x50", cues: "Una brazada izquierda, una derecha, tres completas.", cues_en: "One left stroke, one right stroke, three full strokes.", cues_sr: "Jedan levi zaveslaj, jedan desni, tri puna zaveslaja." },
  { clubId: "cnso", id: "d-7", name: "Salida de poyete", name_en: "Block start", name_sr: "Start sa startnog bloka", category: "Salidas y virajes", group: "Reactiva", group_en: "Reactive", group_sr: "Reaktivno", equipment: "Poyete", equipment_en: "Starting block", equipment_sr: "Startni blok", level: "Perfeccionamiento", dose: "10 reps", cues: "Track-start, empuje explosivo, entrada limpia.", cues_en: "Track start, explosive drive, clean entry.", cues_sr: "Track start, eksplozivan potisak, čist ulazak u vodu." },
  { clubId: "cnso", id: "d-8", name: "Viraje voltereta crol", name_en: "Freestyle flip turn", name_sr: "Kraul flip okret", category: "Salidas y virajes", group: "Técnica viraje", group_en: "Turn technique", group_sr: "Tehnika okreta", equipment: "—", level: "Perfeccionamiento", dose: "10 reps", cues: "Aproximación a velocidad, ovillado compacto.", cues_en: "Approach at speed with a compact tuck.", cues_sr: "Prilaz brzinom, kompaktno sklupčan." },
  { clubId: "cnso", id: "d-9", name: "Sighting aguas abiertas", name_en: "Open-water sighting", name_sr: "Orijentacija u otvorenim vodama", category: "Aguas abiertas", group: "Orientación", group_en: "Orientation", group_sr: "Orijentacija", equipment: "—", level: "Avanzado", dose: "4x200", cues: "Levanta los ojos cada 6 brazadas sin frenar el ritmo.", cues_en: "Lift your eyes every 6 strokes without breaking rhythm.", cues_sr: "Podigni pogled na svakih 6 zaveslaja bez gubitka ritma." },
  { clubId: "cnso", id: "d-10", name: "Fuerza específica seca", name_en: "Sport-specific dryland strength", name_sr: "Specifična snaga na suvom", category: "Seco", group: "Tren superior", group_en: "Upper body", group_sr: "Gornji deo tela", equipment: "Banda elástica", equipment_en: "Resistance band", equipment_sr: "Elastična traka", level: "Perfeccionamiento", dose: "3x12", cues: "Imitar trayectoria del agarre acuático.", cues_en: "Mimic the underwater catch path.", cues_sr: "Imitiraj putanju podvodnog hvata." },
  { clubId: "cnso", id: "d-11", name: "Boya estática waterpolo", name_en: "Static hole-set water polo", name_sr: "Statičan centar u vaterpolu", category: "Waterpolo", group: "Pase y recepción", group_en: "Passing & receiving", group_sr: "Dodavanje i prijem", equipment: "Balón", equipment_en: "Ball", equipment_sr: "Lopta", level: "Avanzado", dose: "10 min", cues: "Mantener posición vertical sin perder altura.", cues_en: "Hold a vertical position without losing height.", cues_sr: "Održavaj uspravan položaj bez gubljenja visine." },
  { clubId: "cnso", id: "d-12", name: "Trampolín 1 m · pica simple", name_en: "1 m springboard · pike dive", name_sr: "1 m odskočna daska · pika skok", category: "Saltos", group: "Entrada", group_en: "Entry", group_sr: "Ulazak", equipment: "Trampolín", equipment_en: "Springboard", equipment_sr: "Odskočna daska", level: "Iniciación", dose: "8 reps", cues: "Brazos rectos, entrada vertical.", cues_en: "Straight arms, vertical entry.", cues_sr: "Ispravljene ruke, vertikalan ulazak u vodu." },
  { clubId: "cnso", id: "d-13", name: "Figura flamenco", name_en: "Flamingo figure", name_sr: "Flamingo figura", category: "Sincro", group: "Figuras", group_en: "Figures", group_sr: "Figure", equipment: "—", level: "Perfeccionamiento", dose: "6 reps", cues: "Pierna extendida 90°, control de apnea.", cues_en: "Leg extended at 90°, controlled breath-hold.", cues_sr: "Noga ispružena pod 90°, kontrola zadržavanja daha." },
];

export type CnsoSetTemplate = {
  clubId: "cnso";
  id: string;
  name: string;
  name_en?: string;
  name_sr?: string;
  goal: string;
  goal_en?: string;
  goal_sr?: string;
  level: "Iniciación" | "Perfeccionamiento" | "Avanzado" | "Élite";
  totalMeters: number;
  blocks: string[];
  blocks_en?: string[];
  blocks_sr?: string[];
};

export const CNSO_SETS: CnsoSetTemplate[] = [
  {
    clubId: "cnso",
    id: "s-1",
    name: "Aeróbico extensivo 4.000 m",
    name_en: "Extensive aerobic 4,000 m",
    name_sr: "Ekstenzivni aerobni 4.000 m",
    goal: "Base aeróbica de pretemporada",
    goal_en: "Pre-season aerobic base",
    goal_sr: "Pretsezonska aerobna baza",
    level: "Avanzado",
    totalMeters: 4000,
    blocks: [
      "Calentamiento: 600 crol suave",
      "Técnica: 8x50 con pull-buoy (1:00)",
      "Series: 6x400 crol Z2 (5:30)",
      "Vuelta a la calma: 200 estilos suave",
    ],
    blocks_en: [
      "Warm-up: 600 easy freestyle",
      "Technique: 8x50 with pull-buoy (1:00)",
      "Main set: 6x400 freestyle Z2 (5:30)",
      "Cool-down: 200 easy medley",
    ],
    blocks_sr: [
      "Zagrevanje: 600 lagani kraul",
      "Tehnika: 8x50 sa pull-buoy (1:00)",
      "Glavna serija: 6x400 kraul Z2 (5:30)",
      "Smirivanje: 200 lagani mešoviti",
    ],
  },
  {
    clubId: "cnso",
    id: "s-2",
    name: "Velocidad 3.000 m",
    name_en: "Speed 3,000 m",
    name_sr: "Brzina 3.000 m",
    goal: "Estímulo de potencia y arranques",
    goal_en: "Power and start stimulus",
    goal_sr: "Stimulus za snagu i startove",
    level: "Élite",
    totalMeters: 3000,
    blocks: [
      "Calentamiento: 400 crol + 200 espalda",
      "Drills: 8x50 catch-up (1:00)",
      "Salidas: 10 salidas + 25 sprint",
      "Series: 12x25 sprint máxima (0:45)",
      "Vuelta a la calma: 400 elección",
    ],
    blocks_en: [
      "Warm-up: 400 freestyle + 200 backstroke",
      "Drills: 8x50 catch-up (1:00)",
      "Starts: 10 starts + 25 sprint",
      "Main set: 12x25 max sprint (0:45)",
      "Cool-down: 400 choice",
    ],
    blocks_sr: [
      "Zagrevanje: 400 kraul + 200 leđno",
      "Vežbe: 8x50 catch-up (1:00)",
      "Startovi: 10 startova + 25 sprint",
      "Glavna serija: 12x25 maks. sprint (0:45)",
      "Smirivanje: 400 slobodan izbor",
    ],
  },
  {
    clubId: "cnso",
    id: "s-3",
    name: "Escuela alevín · 1.200 m",
    name_en: "Alevín school · 1,200 m",
    name_sr: "Škola mlađih kadeta · 1.200 m",
    goal: "Técnica crol y espalda en alternancia",
    goal_en: "Alternating freestyle and backstroke technique",
    goal_sr: "Naizmenična tehnika kraula i leđnog",
    level: "Perfeccionamiento",
    totalMeters: 1200,
    blocks: [
      "Calentamiento: 200 elección",
      "Drills: 4x50 6-1-6 espalda",
      "Series: 8x50 crol técnica (1:15)",
      "Juego: relevos 4x25",
    ],
    blocks_en: [
      "Warm-up: 200 choice",
      "Drills: 4x50 6-1-6 backstroke",
      "Main set: 8x50 freestyle technique (1:15)",
      "Game: 4x25 relays",
    ],
    blocks_sr: [
      "Zagrevanje: 200 slobodan izbor",
      "Vežbe: 4x50 6-1-6 leđno",
      "Glavna serija: 8x50 tehnika kraula (1:15)",
      "Igra: 4x25 štafeta",
    ],
  },
  {
    clubId: "cnso",
    id: "s-4",
    name: "Aguas abiertas · simulacro 2.000 m",
    name_en: "Open water · 2,000 m simulation",
    name_sr: "Otvorene vode · simulacija 2.000 m",
    goal: "Adaptación a competición aguas abiertas",
    goal_en: "Adaptation to open-water racing",
    goal_sr: "Adaptacija na takmičenje u otvorenim vodama",
    level: "Avanzado",
    totalMeters: 2000,
    blocks: [
      "Aproximación a boya: 4x200 con sighting",
      "Bloque continuo: 1.500 m con cambios de ritmo",
      "Salida y entrada en playa: 4 simulacros",
    ],
    blocks_en: [
      "Buoy approach: 4x200 with sighting",
      "Continuous block: 1,500 m with pace changes",
      "Beach start & exit: 4 simulations",
    ],
    blocks_sr: [
      "Prilaz boji: 4x200 sa orijentacijom",
      "Neprekidni blok: 1.500 m sa promenama tempa",
      "Start i izlazak na plažu: 4 simulacije",
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
  notes_en?: string;
  notes_sr?: string;
};

export const CNSO_CLINIC_SESSIONS: CnsoClinicSession[] = [
  { clubId: "cnso", id: "cl-1", time: "07:30", memberName: "Marta Fernández", setId: "s-1", coachName: "Iván Méndez", status: "ready", notes: "Foco en cadencia 38 bpm.", notes_en: "Focus on a 38 bpm stroke rate.", notes_sr: "Fokus na kadencu od 38 zaveslaja u minutu." },
  { clubId: "cnso", id: "cl-2", time: "16:30", memberName: "Carlos Menéndez", setId: "s-3", coachName: "Marta Solís", status: "confirmed", notes: "Vídeo subacuático de mariposa.", notes_en: "Underwater butterfly video.", notes_sr: "Podvodni snimak delfina." },
  { clubId: "cnso", id: "cl-3", time: "18:00", memberName: "Alba Riestra", setId: "s-3", coachName: "Pablo Roces", status: "pending", notes: "Test 200 estilos.", notes_en: "200 medley test.", notes_sr: "Test 200 mešovito." },
  { clubId: "cnso", id: "cl-4", time: "19:15", memberName: "Diego Caso", setId: "s-4", coachName: "Andrés Coto", status: "confirmed", notes: "Preparación Triatlón Villa de Gijón.", notes_en: "Villa de Gijón Triathlon prep.", notes_sr: "Priprema za triatlon Vilja de Hihon." },
];

// ─── Workouts asignados a nadadores ─────────────────────────────────────────
export type CnsoWorkoutBlock = {
  name: string;
  name_en?: string;
  name_sr?: string;
  dose: string;
  rest?: string;
  notes?: string;
  notes_en?: string;
  notes_sr?: string;
};
export type CnsoWorkout = {
  clubId: "cnso";
  id: string;
  memberNumber: string;
  coachName: string;
  title: string;
  title_en?: string;
  title_sr?: string;
  goal: string;
  goal_en?: string;
  goal_sr?: string;
  assignedAt: string;
  targetDate?: string;
  blocks: CnsoWorkoutBlock[];
  notes?: string;
  notes_en?: string;
  notes_sr?: string;
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
    title_en: "Backstroke · power block · week 3",
    title_sr: "Leđno · blok snage · nedelja 3",
    goal: "Mejorar arranque y primeros 25 m de espalda.",
    goal_en: "Improve the start and first 25 m of backstroke.",
    goal_sr: "Poboljšati start i prvih 25 m leđnog.",
    assignedAt: dISO(-3),
    targetDate: dISO(2),
    source: "manual",
    status: "in_progress",
    blocks: [
      { name: "Calentamiento 600 m mixto", name_en: "Warm-up 600 m mixed", name_sr: "Zagrevanje 600 m mešano", dose: "600 m" },
      { name: "Salidas + 15 m sprint", name_en: "Starts + 15 m sprint", name_sr: "Startovi + 15 m sprint", dose: "8 reps", rest: "1:30" },
      { name: "6x100 espalda fuerte", name_en: "6x100 strong backstroke", name_sr: "6x100 jako leđno", dose: "6x100", rest: "0:30" },
      { name: "Vuelta a la calma", name_en: "Cool-down", name_sr: "Smirivanje", dose: "300 m" },
    ],
    notes: "Cuidar hombro derecho, parar si molesta.",
    notes_en: "Take care of the right shoulder; stop if it bothers you.",
    notes_sr: "Paziti na desno rame; prekinuti ako smeta.",
  },
  {
    clubId: "cnso",
    id: "w-2",
    memberNumber: "CNSO-05011",
    coachName: "Andrés Coto",
    title: "Triatlón · simulacro distancia sprint",
    title_en: "Triathlon · sprint-distance simulation",
    title_sr: "Triatlon · simulacija sprint distance",
    goal: "Bloque combinado 750 m + rodillo.",
    goal_en: "Combined 750 m + indoor bike block.",
    goal_sr: "Kombinovani blok: 750 m + sobni bicikl.",
    assignedAt: dISO(-1),
    targetDate: dISO(1),
    source: "ai",
    status: "assigned",
    blocks: [
      { name: "Calentamiento 400 m", name_en: "400 m warm-up", name_sr: "Zagrevanje 400 m", dose: "400 m" },
      { name: "750 m continuo con sighting", name_en: "750 m continuous with sighting", name_sr: "750 m neprekidno sa orijentacijom", dose: "750 m", notes: "RPE 7", notes_en: "RPE 7", notes_sr: "RPE 7" },
      { name: "Rodillo 20 min", name_en: "20 min indoor bike", name_sr: "20 min sobnog bicikla", dose: "20 min" },
      { name: "Carrera 2 km", name_en: "2 km run", name_sr: "Trčanje 2 km", dose: "2 km" },
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
