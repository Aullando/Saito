// CNSO Sedes y calles/salas — adaptado al perfil real del club.
// Sede principal: Complejo Deportivo Las Mestas (Gijón).

export const CNSO_CLUB_ID = "cnso" as const;
export type CnsoTag = { clubId: typeof CNSO_CLUB_ID };

export type CnsoVenue = CnsoTag & {
  id: string;
  name: string;
  address: string;
  zone: string;
  description: string;
  description_en?: string;
  description_sr?: string;
  photo: string;
  schedule: string;
  services: string[];
  capacity: number;
  status: "active" | "maintenance" | "closed";
};

export const CNSO_VENUES: CnsoVenue[] = [
  {
    clubId: "cnso",
    id: "s-mestas",
    name: "Complejo Deportivo Las Mestas",
    address: "Av. Juan Carlos I, s/n, 33203 Gijón",
    zone: "Gijón · Las Mestas",
    description:
      "Sede principal con piscina olímpica de 50 m, vaso de 25 m, foso de saltos y gimnasio de preparación física.",
    description_en:
      "Main venue with an Olympic 50 m pool, a 25 m pool, a diving pit and a strength & conditioning gym.",
    description_sr:
      "Glavni objekat sa olimpijskim bazenom od 50 m, bazenom od 25 m, bazenom za skokove i teretanom za kondicionu pripremu.",
    photo:
      "https://cnsantaolaya.org/wp-content/uploads/2023/08/portada-piscina-mestas.jpg",
    schedule: "L–V 06:30–22:30 · S 08:00–21:00 · D 09:00–14:30",
    services: [
      "Piscina 50 m",
      "Piscina 25 m",
      "Foso de saltos",
      "Gimnasio Squali",
      "Vestuarios",
      "Cafetería",
    ],
    capacity: 1200,
    status: "active",
  },
  {
    clubId: "cnso",
    id: "s-tejerona",
    name: "Piscina La Tejerona",
    address: "C. Pintor Mariano Moré, 33212 Gijón",
    zone: "Gijón · Roces",
    description:
      "Vaso de 25 m utilizado como sede secundaria para la escuela deportiva y grupos de tecnificación.",
    description_en:
      "25 m pool used as a secondary venue for the sports school and development groups.",
    description_sr:
      "Bazen 25 m koji se koristi kao sekundarni objekat za sportsku školu i razvojne grupe.",
    photo:
      "https://cnsantaolaya.org/wp-content/uploads/2023/08/tejerona.jpg",
    schedule: "L–V 16:00–22:00 · S 09:00–14:00",
    services: ["Piscina 25 m", "Vestuarios"],
    capacity: 220,
    status: "active",
  },
  {
    clubId: "cnso",
    id: "s-squali",
    name: "Squali · Sala Seca",
    address: "Complejo Las Mestas, Gijón",
    zone: "Anexo Las Mestas",
    description:
      "Sala de preparación física en seco para fuerza, core, movilidad y prevención de lesiones.",
    description_en:
      "Dryland conditioning room for strength, core, mobility and injury-prevention work.",
    description_sr:
      "Sala za suvi trening za snagu, kor, pokretljivost i prevenciju povreda.",
    photo:
      "https://cnsantaolaya.org/wp-content/uploads/2023/08/logotipo_squali.png",
    schedule: "L–V 07:00–22:00 · S 09:00–13:00",
    services: ["Fuerza", "Movilidad", "Core", "Recuperación"],
    capacity: 40,
    status: "active",
  },
  {
    clubId: "cnso",
    id: "s-playa",
    name: "Playa de San Lorenzo",
    address: "Paseo del Muro, 33205 Gijón",
    zone: "Gijón · Playa",
    description:
      "Entrenamientos de aguas abiertas para triatlón y travesías de pretemporada.",
    description_en:
      "Open-water sessions for triathlon and pre-season distance swims.",
    description_sr:
      "Treninzi u otvorenim vodama za triatlon i pretsezonska duga plivanja.",
    photo:
      "https://cnsantaolaya.org/wp-content/uploads/2023/08/aguas-abiertas.jpg",
    schedule: "Sáb. 09:30–11:30 (temporada mayo–septiembre)",
    services: ["Aguas abiertas", "Triatlón"],
    capacity: 60,
    status: "active",
  },
];

// ─── Calles / Salas (recursos asignables) ────────────────────────────────────
export type CnsoRoom = CnsoTag & {
  id: string;
  venueId: string;
  name: string;
  capacity: number;
  type: "Calle" | "Vaso" | "Foso" | "Sala Seca" | "Aguas Abiertas" | "Sala Spinning";
  status: "active" | "incident" | "maintenance";
};

export const CNSO_ROOMS: CnsoRoom[] = [
  { clubId: "cnso", id: "c-50-1", venueId: "s-mestas", name: "Calle 1 (50 m)", capacity: 8, type: "Calle", status: "active" },
  { clubId: "cnso", id: "c-50-2", venueId: "s-mestas", name: "Calle 2 (50 m)", capacity: 8, type: "Calle", status: "active" },
  { clubId: "cnso", id: "c-50-3", venueId: "s-mestas", name: "Calle 3 (50 m)", capacity: 8, type: "Calle", status: "active" },
  { clubId: "cnso", id: "c-50-4", venueId: "s-mestas", name: "Calle 4 (50 m)", capacity: 8, type: "Calle", status: "active" },
  { clubId: "cnso", id: "c-50-5", venueId: "s-mestas", name: "Calle 5 (50 m)", capacity: 8, type: "Calle", status: "active" },
  { clubId: "cnso", id: "c-50-6", venueId: "s-mestas", name: "Calle 6 (50 m)", capacity: 8, type: "Calle", status: "incident" },
  { clubId: "cnso", id: "c-50-7", venueId: "s-mestas", name: "Calle 7 (50 m)", capacity: 8, type: "Calle", status: "active" },
  { clubId: "cnso", id: "c-50-8", venueId: "s-mestas", name: "Calle 8 (50 m)", capacity: 8, type: "Calle", status: "active" },
  { clubId: "cnso", id: "v-25", venueId: "s-mestas", name: "Vaso 25 m", capacity: 40, type: "Vaso", status: "active" },
  { clubId: "cnso", id: "f-saltos", venueId: "s-mestas", name: "Foso de saltos", capacity: 12, type: "Foso", status: "active" },
  { clubId: "cnso", id: "sq-fuerza", venueId: "s-squali", name: "Squali Fuerza", capacity: 20, type: "Sala Seca", status: "active" },
  { clubId: "cnso", id: "sq-mov", venueId: "s-squali", name: "Squali Movilidad", capacity: 16, type: "Sala Seca", status: "active" },
  { clubId: "cnso", id: "sq-spin", venueId: "s-squali", name: "Squali Spinning", capacity: 18, type: "Sala Spinning", status: "active" },
  { clubId: "cnso", id: "tj-25", venueId: "s-tejerona", name: "Tejerona Vaso 25 m", capacity: 30, type: "Vaso", status: "active" },
  { clubId: "cnso", id: "pl-aa", venueId: "s-playa", name: "San Lorenzo · zona acotada", capacity: 60, type: "Aguas Abiertas", status: "active" },
];
