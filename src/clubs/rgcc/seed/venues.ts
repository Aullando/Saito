// RGCC seed — typed, all entities tagged with clubId: "rgcc".
// Mapped from covadonga-hub source data into the SAITO domain shape.

export const RGCC_CLUB_ID = "rgcc" as const;
export type RgccTag = { clubId: typeof RGCC_CLUB_ID };

// ─── Sedes (Venues / Facilities) ────────────────────────────────────────────
export type RgccVenue = RgccTag & {
  id: string;
  name: string;
  address: string;
  zone: string;
  description: string;
  photo: string;
  schedule: string;
  services: string[];
  capacity: number;
  status: "active" | "maintenance" | "closed";
};

export const RGCC_VENUES: RgccVenue[] = [
  { clubId: "rgcc", id: "s-grupo",  name: "El Grupo", address: "Avd. Jesús Revuelta, 2, 33204 Gijón", zone: "Gijón centro", description: "Sede principal con más de 80.000 m² dedicados al deporte y la actividad social.", photo: "https://www.rgcc.es/wp-content/uploads/2022/04/MG_0785_puerta_norte.jpg", schedule: "L–V 07:00–23:00 · S–D 08:00–22:00", services: ["Fitness","Piscina","Tenis","Pádel","Cafetería","Vestuarios"], capacity: 1800, status: "active" },
  { clubId: "rgcc", id: "s-grupin", name: 'Grupín "playa"', address: "Calle Emilio Tuya, 14, 33202 Gijón", zone: "La Arena · zona playa", description: "Local histórico del club en La Arena.", photo: "https://www.rgcc.es/wp-content/uploads/2022/04/Grupin1.jpg", schedule: "L–V 08:00–22:00 · S 09:00–14:00", services: ["Gimnasio","Vestuario","Sauna"], capacity: 120, status: "active" },
  { clubId: "rgcc", id: "s-begona", name: "Grupo Begoña", address: "Calle Anselmo Cifuentes, 1, 33201 Gijón", zone: "Begoña · centro Gijón", description: "Sede urbana de Begoña en el corazón de Gijón.", photo: "https://www.rgcc.es/wp-content/uploads/2022/04/Grupo_Begona_02-1-2048x1363-1.jpg", schedule: "L–V 08:00–22:00 · S–D 09:00–21:00", services: ["Gimnasio","Sala polivalente","Vestuarios","Cafetería"], capacity: 350, status: "active" },
  { clubId: "rgcc", id: "s-mareo",  name: "Grupo Mareo", address: "Camín de la Cuesta Gil, 290, Gijón", zone: "Mareo · zona exterior", description: "Sede del antiguo Centro Asturiano de la Habana.", photo: "https://www.rgcc.es/wp-content/uploads/2022/04/mareo.jpg", schedule: "L–J 17:00–22:00 · V 14:00–22:00 · S–D 09:00–22:00", services: ["Pistas exteriores","Vestuarios","Cafetería"], capacity: 600, status: "active" },
];

// ─── Salas (Rooms) ──────────────────────────────────────────────────────────
export type RgccRoom = RgccTag & {
  id: string;
  venueId: string;
  name: string;
  capacity: number;
  type: "Fitness" | "Ciclo" | "Yoga" | "TRX" | "Multiusos" | "EP" | "Exterior" | "Gimnasio";
  status: "active" | "incident" | "maintenance";
};

export const RGCC_ROOMS: RgccRoom[] = [
  { clubId: "rgcc", id: "sala-grupofit", venueId: "s-grupo", name: "GRUPOFIT", capacity: 30, type: "Fitness",   status: "active" },
  { clubId: "rgcc", id: "sala-ciclo",    venueId: "s-grupo", name: "CICLO INDOOR", capacity: 22, type: "Ciclo",  status: "active" },
  { clubId: "rgcc", id: "sala-yoga",     venueId: "s-grupo", name: "YOGA",         capacity: 18, type: "Yoga",   status: "active" },
  { clubId: "rgcc", id: "sala-trx",      venueId: "s-grupo", name: "TRX",          capacity: 14, type: "TRX",    status: "incident" },
  { clubId: "rgcc", id: "sala-mu1",      venueId: "s-grupo", name: "MULTIUSOS 1",  capacity: 20, type: "Multiusos", status: "active" },
  { clubId: "rgcc", id: "sala-mu2",      venueId: "s-grupo", name: "MULTIUSOS 2",  capacity: 20, type: "Multiusos", status: "active" },
  { clubId: "rgcc", id: "sala-ep",       venueId: "s-grupo", name: "EP",           capacity: 8,  type: "EP",     status: "active" },
  { clubId: "rgcc", id: "sala-gim",      venueId: "s-grupo", name: "GIMNASIO",     capacity: 60, type: "Gimnasio", status: "active" },
  { clubId: "rgcc", id: "sala-grupin-gim", venueId: "s-grupin", name: "GIMNASIO PLAYA", capacity: 35, type: "Gimnasio", status: "active" },
  { clubId: "rgcc", id: "sala-bego-poli",  venueId: "s-begona", name: "POLIVALENTE BEGOÑA", capacity: 24, type: "Multiusos", status: "active" },
  { clubId: "rgcc", id: "sala-bego-gim",   venueId: "s-begona", name: "GIMNASIO BEGOÑA",    capacity: 40, type: "Gimnasio",  status: "active" },
  { clubId: "rgcc", id: "sala-mareo-ext",  venueId: "s-mareo",  name: "PISTA EXTERIOR MAREO", capacity: 30, type: "Exterior", status: "active" },
];
