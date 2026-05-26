// Calendario competitivo CNSO — temporada en curso (mezcla autonómico/nacional/triatlón).
export type CnsoCompetition = {
  clubId: "cnso";
  id: string;
  date: string;
  name: string;
  venue: string;
  category: "Regional" | "Nacional" | "Internacional" | "Máster" | "Triatlón" | "Trofeo";
  discipline: "Natación" | "Waterpolo" | "Saltos" | "Sincro" | "Triatlón" | "Aguas Abiertas";
  swimmersCount: number;
  highlight?: string;
};

const futureISO = (daysAhead: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().slice(0, 10);
};

export const CNSO_COMPETITIONS: CnsoCompetition[] = [
  {
    clubId: "cnso",
    id: "cp-villa",
    date: futureISO(14),
    name: "XXXIX Trofeo Internacional Villa de Gijón",
    venue: "Las Mestas · Piscina 50 m",
    category: "Internacional",
    discipline: "Natación",
    swimmersCount: 480,
    highlight: "Organización propia · clubs de 8 países invitados",
  },
  {
    clubId: "cnso",
    id: "cp-aut-junior",
    date: futureISO(28),
    name: "Cto. Autonómico Junior",
    venue: "Oviedo · Piscina Pumarín",
    category: "Regional",
    discipline: "Natación",
    swimmersCount: 22,
  },
  {
    clubId: "cnso",
    id: "cp-tri-villa",
    date: futureISO(42),
    name: "Triatlón Villa de Gijón Sprint",
    venue: "Playa de San Lorenzo",
    category: "Triatlón",
    discipline: "Triatlón",
    swimmersCount: 12,
  },
  {
    clubId: "cnso",
    id: "cp-nac-abs",
    date: futureISO(70),
    name: "Cto. España Absoluto Open",
    venue: "Sabadell",
    category: "Nacional",
    discipline: "Natación",
    swimmersCount: 8,
    highlight: "Mínimas para mundialista",
  },
  {
    clubId: "cnso",
    id: "cp-wp-liga",
    date: futureISO(7),
    name: "Liga Asturiana de Waterpolo · J5",
    venue: "Las Mestas",
    category: "Regional",
    discipline: "Waterpolo",
    swimmersCount: 14,
  },
  {
    clubId: "cnso",
    id: "cp-master",
    date: futureISO(35),
    name: "Liga Máster Asturias",
    venue: "Gijón · Las Mestas",
    category: "Máster",
    discipline: "Natación",
    swimmersCount: 28,
  },
  {
    clubId: "cnso",
    id: "cp-sincro-clas",
    date: futureISO(56),
    name: "Cto. Asturias Natación Artística",
    venue: "Oviedo",
    category: "Regional",
    discipline: "Sincro",
    swimmersCount: 16,
  },
  {
    clubId: "cnso",
    id: "cp-aa-cabo",
    date: futureISO(90),
    name: "Travesía Cabo Peñas 5 km",
    venue: "Cabo Peñas",
    category: "Trofeo",
    discipline: "Aguas Abiertas",
    swimmersCount: 18,
  },
];
