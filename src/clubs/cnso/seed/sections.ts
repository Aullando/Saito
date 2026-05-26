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
  },
];
