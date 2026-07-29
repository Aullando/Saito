// Secciones / disciplinas de CN Santa Olaya, mapeadas desde su web oficial.
export type CnsoSection = {
  clubId: "cnso";
  id: string;
  name: string;
  category: "Competición" | "Escuela" | "Adultos" | "Especial" | "Multi-deporte";
  responsible: string;
  membersCount: number;
  venueLabel: string;
  description: string;
  description_en?: string;
  description_sr?: string;
};

export const CNSO_SECTIONS: CnsoSection[] = [
  {
    clubId: "cnso",
    id: "primer-equipo",
    name: "Primer Equipo",
    category: "Competición",
    responsible: "Iván Méndez",
    membersCount: 38,
    venueLabel: "Las Mestas",
    description:
      "Nadadores de alto rendimiento con licencia nacional. Doble sesión diaria y bloque de seco.",
    description_en:
      "High-performance swimmers with a national licence. Two daily pool sessions plus dryland work.",
    description_sr:
      "Plivači visokih performansi sa nacionalnom licencom. Dva treninga u bazenu dnevno plus suvi trening.",
  },
  {
    clubId: "cnso",
    id: "tecnificacion",
    name: "Tecnificación CNSO",
    category: "Competición",
    responsible: "Marta Solís",
    membersCount: 52,
    venueLabel: "Las Mestas",
    description:
      "Programa de paso entre escuela y primer equipo. Clinics, control técnico y vídeo subacuático.",
    description_en:
      "Bridge programme between school and first team. Clinics, technical checks and underwater video.",
    description_sr:
      "Program prelaza između škole i prvog tima. Klinike, tehnička kontrola i podvodni video.",
  },
  {
    clubId: "cnso",
    id: "escuela-prebenjamin",
    name: "Escuela · Prebenjamín",
    category: "Escuela",
    responsible: "Lucía Granda",
    membersCount: 84,
    venueLabel: "Tejerona",
    description: "Iniciación acuática 5–7 años. Familiarización con el medio y estilos básicos.",
    description_en: "Water introduction for ages 5–7. Familiarisation with the water and basic strokes.",
    description_sr: "Upoznavanje sa vodom za uzrast 5–7 godina. Familijarizacija i osnovni stilovi.",
  },
  {
    clubId: "cnso",
    id: "escuela-benjamin",
    name: "Escuela · Benjamín",
    category: "Escuela",
    responsible: "David Rubio",
    membersCount: 96,
    venueLabel: "Las Mestas",
    description: "Aprendizaje de los 4 estilos, primeras competiciones internas.",
    description_en: "Learning the four strokes; first internal competitions.",
    description_sr: "Učenje četiri stila; prva interna takmičenja.",
  },
  {
    clubId: "cnso",
    id: "escuela-alevin",
    name: "Escuela · Alevín",
    category: "Escuela",
    responsible: "Elena Pando",
    membersCount: 102,
    venueLabel: "Las Mestas",
    description: "Perfeccionamiento técnico y entrada en competiciones autonómicas.",
    description_en: "Technical refinement and entry into regional competitions.",
    description_sr: "Tehničko usavršavanje i ulazak u regionalna takmičenja.",
  },
  {
    clubId: "cnso",
    id: "escuela-infantil",
    name: "Escuela · Infantil",
    category: "Escuela",
    responsible: "Pablo Roces",
    membersCount: 64,
    venueLabel: "Las Mestas",
    description: "Volúmenes de entrenamiento crecientes y especialización por estilos.",
    description_en: "Growing training volumes and stroke specialisation.",
    description_sr: "Rastući obim treninga i specijalizacija po stilovima.",
  },
  {
    clubId: "cnso",
    id: "grupo-master",
    name: "Grupo Máster",
    category: "Adultos",
    responsible: "Belén Tuñón",
    membersCount: 74,
    venueLabel: "Las Mestas",
    description:
      "Adultos +25 con vocación competitiva o de mantenimiento. Liga Máster y travesías.",
    description_en:
      "Adults over 25 with a competitive or fitness focus. Masters league and open-water swims.",
    description_sr:
      "Odrasli preko 25 godina takmičarske ili rekreativne orijentacije. Masters liga i plivanja u otvorenim vodama.",
  },
  {
    clubId: "cnso",
    id: "waterpolo",
    name: "Waterpolo",
    category: "Competición",
    responsible: "Hugo Vega",
    membersCount: 28,
    venueLabel: "Las Mestas",
    description: "Categoría masculina senior y formación de base.",
    description_en: "Senior men's team plus youth development.",
    description_sr: "Seniorska muška ekipa i razvoj mladih.",
  },
  {
    clubId: "cnso",
    id: "sincronizada",
    name: "Natación Artística",
    category: "Competición",
    responsible: "Sheila Casariego",
    membersCount: 22,
    venueLabel: "Las Mestas",
    description: "Antes sincronizada. Equipos de figuras y rutinas combinadas.",
    description_en: "Formerly synchronised swimming. Figures teams and combined routines.",
    description_sr: "Ranije sinhrono plivanje. Ekipe za figure i kombinovane rutine.",
  },
  {
    clubId: "cnso",
    id: "triatlon",
    name: "Triatlón",
    category: "Multi-deporte",
    responsible: "Andrés Coto",
    membersCount: 34,
    venueLabel: "Las Mestas + Playa",
    description: "Bloques de natación, rodillo y aguas abiertas en pretemporada.",
    description_en: "Blocks of swimming, indoor cycling and open-water work in pre-season.",
    description_sr: "Blokovi plivanja, sobnog bicikla i treninga u otvorenim vodama u pretsezoni.",
  },
  {
    clubId: "cnso",
    id: "adaptada",
    name: "Natación Adaptada",
    category: "Especial",
    responsible: "Sara Cabal",
    membersCount: 18,
    venueLabel: "Tejerona",
    description:
      "Programa inclusivo con apoyo de fisioterapia. Coordinado con Servicios Sociales.",
    description_en:
      "Inclusive programme with physiotherapy support. Coordinated with Social Services.",
    description_sr:
      "Inkluzivni program uz podršku fizioterapije. Koordinisano sa socijalnim službama.",
  },
  {
    clubId: "cnso",
    id: "salto",
    name: "Saltos",
    category: "Competición",
    responsible: "Borja Estrada",
    membersCount: 14,
    venueLabel: "Las Mestas · Foso",
    description: "Plataforma 5 m, trampolín 1 m y 3 m. Escuela y competición autonómica.",
    description_en: "5 m platform, 1 m and 3 m springboards. School and regional competition.",
    description_sr: "Platforma 5 m, odskočne daske 1 m i 3 m. Škola i regionalna takmičenja.",
  },
];
