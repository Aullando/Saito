// Calendario competitivo CNSO — temporada en curso (mezcla autonómico/nacional/triatlón).
export type CnsoCompetition = {
  clubId: "cnso";
  id: string;
  date: string;
  name: string;
  name_en?: string;
  name_sr?: string;
  venue: string;
  venue_en?: string;
  venue_sr?: string;
  category: "Regional" | "Nacional" | "Internacional" | "Máster" | "Triatlón" | "Trofeo";
  discipline: "Natación" | "Waterpolo" | "Saltos" | "Sincro" | "Triatlón" | "Aguas Abiertas";
  swimmersCount: number;
  highlight?: string;
  highlight_en?: string;
  highlight_sr?: string;
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
    name_en: "39th Villa de Gijón International Trophy",
    name_sr: "39. međunarodni trofej Vilja de Hihon",
    venue: "Las Mestas · Piscina 50 m",
    venue_en: "Las Mestas · 50 m pool",
    venue_sr: "Las Mestas · bazen 50 m",
    category: "Internacional",
    discipline: "Natación",
    swimmersCount: 480,
    highlight: "Organización propia · clubs de 8 países invitados",
    highlight_en: "Hosted by CNSO · clubs from 8 countries invited",
    highlight_sr: "Organizuje CNSO · pozvani klubovi iz 8 zemalja",
  },
  {
    clubId: "cnso",
    id: "cp-aut-junior",
    date: futureISO(28),
    name: "Cto. Autonómico Junior",
    name_en: "Regional Junior Championship",
    name_sr: "Regionalno juniorsko prvenstvo",
    venue: "Oviedo · Piscina Pumarín",
    venue_en: "Oviedo · Pumarín pool",
    venue_sr: "Oviedo · bazen Pumarin",
    category: "Regional",
    discipline: "Natación",
    swimmersCount: 22,
  },
  {
    clubId: "cnso",
    id: "cp-tri-villa",
    date: futureISO(42),
    name: "Triatlón Villa de Gijón Sprint",
    name_en: "Villa de Gijón Sprint Triathlon",
    name_sr: "Sprint triatlon Vilja de Hihon",
    venue: "Playa de San Lorenzo",
    venue_en: "San Lorenzo Beach",
    venue_sr: "Plaža San Lorenzo",
    category: "Triatlón",
    discipline: "Triatlón",
    swimmersCount: 12,
  },
  {
    clubId: "cnso",
    id: "cp-nac-abs",
    date: futureISO(70),
    name: "Cto. España Absoluto Open",
    name_en: "Spanish Open Senior Championship",
    name_sr: "Špansko seniorsko open prvenstvo",
    venue: "Sabadell",
    category: "Nacional",
    discipline: "Natación",
    swimmersCount: 8,
    highlight: "Mínimas para mundialista",
    highlight_en: "World-championship qualifying times",
    highlight_sr: "Kvalifikacione norme za svetsko prvenstvo",
  },
  {
    clubId: "cnso",
    id: "cp-wp-liga",
    date: futureISO(7),
    name: "Liga Asturiana de Waterpolo · J5",
    name_en: "Asturian Water Polo League · Round 5",
    name_sr: "Asturijska vaterpolo liga · 5. kolo",
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
    name_en: "Asturias Masters League",
    name_sr: "Asturijska Masters liga",
    venue: "Gijón · Las Mestas",
    venue_en: "Gijón · Las Mestas",
    venue_sr: "Hihon · Las Mestas",
    category: "Máster",
    discipline: "Natación",
    swimmersCount: 28,
  },
  {
    clubId: "cnso",
    id: "cp-sincro-clas",
    date: futureISO(56),
    name: "Cto. Asturias Natación Artística",
    name_en: "Asturias Artistic Swimming Championship",
    name_sr: "Asturijsko prvenstvo u umetničkom plivanju",
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
    name_en: "Cabo Peñas 5 km Open-Water Swim",
    name_sr: "Cabo Peñas plivanje u otvorenim vodama 5 km",
    venue: "Cabo Peñas",
    category: "Trofeo",
    discipline: "Aguas Abiertas",
    swimmersCount: 18,
  },
];
