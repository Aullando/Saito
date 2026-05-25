// Runtime translation layer for demo data values.
// Seeds remain in Spanish; this helper translates known strings on render.
// Proper names (people, venues, club) are intentionally NOT translated.
import { useLang } from "./i18n";
import type { Lang } from "./types";

const MAP: Record<string, string> = {
  // ─── Activities ────────────────────────────────────────────────────────
  TABATA: "TABATA",
  "BODY WORKOUT": "BODY WORKOUT",
  "GAP 30": "CORE 30",
  GAP: "CORE",
  TRX: "TRX",
  "CICLO INDOOR": "INDOOR CYCLING",
  PILATES: "PILATES",
  "PILATES SPRINGBOARD": "PILATES SPRINGBOARD",
  YOGA: "YOGA",
  "FUNCIONAL PLAYA": "BEACH FUNCTIONAL",
  "PÁDEL DIRIGIDO": "COACHED PADEL",

  // ─── Room types ────────────────────────────────────────────────────────
  Fitness: "Fitness",
  Ciclo: "Cycling",
  Yoga: "Yoga",
  Multiusos: "Multipurpose",
  EP: "Personal Training",
  Exterior: "Outdoor",
  Gimnasio: "Gym",

  // ─── Section categories ────────────────────────────────────────────────
  Equipo: "Team",
  Individual: "Individual",
  Acuático: "Aquatic",
  Combate: "Combat",
  Cultural: "Cultural",
  Mente: "Mind",
  Outdoor: "Outdoor",

  // ─── Statuses ──────────────────────────────────────────────────────────
  active: "active",
  maintenance: "maintenance",
  closed: "closed",
  incident: "incident",
  scheduled: "scheduled",
  confirmed: "confirmed",
  completed: "completed",
  cancelled: "cancelled",
  open: "open",
  in_progress: "in progress",
  resolved: "resolved",
  requested: "requested",
  approved: "approved",
  rejected: "rejected",

  // ─── Severity ──────────────────────────────────────────────────────────
  low: "low",
  medium: "medium",
  high: "high",

  // ─── Absence reasons ───────────────────────────────────────────────────
  Vacaciones: "Vacation",
  Enfermedad: "Illness",
  "Asuntos propios": "Personal matters",
  Otro: "Other",

  // ─── Incident types ────────────────────────────────────────────────────
  Sala: "Room",
  Material: "Equipment",
  Clase: "Class",

  // ─── Sport sections (names) ────────────────────────────────────────────
  Ajedrez: "Chess",
  Atletismo: "Athletics",
  Baloncesto: "Basketball",
  Balonmano: "Handball",
  Billar: "Billiards",
  Bolos: "Bowls",
  Boxeo: "Boxing",
  "Coros y Danzas": "Choirs & Dance",
  "Diversidad Funcional": "Functional Diversity",
  Esquí: "Skiing",
  GAF: "Women's Artistic Gymnastics",
  GAM: "Men's Artistic Gymnastics",
  Halterofilia: "Weightlifting",
  Hockey: "Hockey",
  Judo: "Judo",
  Kárate: "Karate",
  Lucha: "Wrestling",
  Montaña: "Mountaineering",
  Natación: "Swimming",
  Orfeón: "Choral Society",
  Pádel: "Padel",
  Pelota: "Pelota",
  Piragüismo: "Canoeing",
  Rugby: "Rugby",
  Surf: "Surfing",
  Tenis: "Tennis",
  "Tiro con Arco": "Archery",
  Vela: "Sailing",
  Voleibol: "Volleyball",

  // ─── Section short descriptions ────────────────────────────────────────
  "Sección histórica con torneos y formación.": "Historic section with tournaments and training.",
  "Pruebas de pista, ruta y campo a través.": "Track, road and cross-country events.",
  "Equipos en categorías de base y senior.": "Youth and senior teams.",
  "Competición autonómica y nacional.": "Regional and national competition.",
  "Salas y modalidades libre y carambola.": "Free and carom billiards rooms.",
  "Bolo asturiano, tradición viva.": "Asturian bowls, a living tradition.",
  "Iniciación, técnica y competición amateur.": "Beginners, technique and amateur competition.",
  "Folclore asturiano y representación.": "Asturian folklore and performance.",
  "Programas inclusivos multidisciplinares.": "Inclusive multidisciplinary programs.",
  "Salidas a Pajares y competición FIS.": "Trips to Pajares and FIS competition.",
  "Gimnasia Artística Femenina.": "Women's Artistic Gymnastics.",
  "Gimnasia Artística Masculina.": "Men's Artistic Gymnastics.",
  "Levantamientos olímpicos.": "Olympic weightlifting.",
  "Hockey hierba, base y senior.": "Field hockey, youth and senior.",
  "Cinturones desde blanco a negro.": "Belts from white to black.",
  "Kata y kumite, todas las edades.": "Kata and kumite, all ages.",
  "Lucha grecorromana y libre.": "Greco-Roman and freestyle wrestling.",
  "Senderismo, alpinismo y BTT.": "Hiking, mountaineering and MTB.",
  "Aprendizaje, perfeccionamiento y competición.":
    "Learning, advanced training and competition.",
  "Coro polifónico del club.": "Club polyphonic choir.",
  "Liga interna y escuela técnica.": "Internal league and technical school.",
  "Pelota mano y paleta.": "Hand pelota and paddle.",
  "Aguas tranquilas y travesías.": "Flatwater and touring.",
  "Equipos masculino, femenino y base.": "Men's, women's and youth teams.",
  "Escuela y entrenamiento de competición.": "School and competition training.",
  "Pistas de tierra batida y dura.": "Clay and hard courts.",
  "Recurvo y compuesto, sala y aire libre.": "Recurve and compound, indoor and outdoor.",
  "Optimist, Láser y travesías.": "Optimist, Laser and touring.",
  "Equipos absolutos y categorías base.": "Senior teams and youth categories.",

  // ─── Venue descriptions ────────────────────────────────────────────────
  "Sede principal con más de 80.000 m² dedicados al deporte y la actividad social.":
    "Main venue with over 80,000 m² dedicated to sport and social activity.",
  "Local histórico del club en La Arena.": "Historic club venue in La Arena.",
  "Sede urbana de Begoña en el corazón de Gijón.":
    "Urban Begoña venue in the heart of Gijón.",
  "Sede del antiguo Centro Asturiano de la Habana.":
    "Former Centro Asturiano de la Habana venue.",

  // ─── Incident descriptions ─────────────────────────────────────────────
  "Falta una correa TRX, hay 13 puestos operativos.":
    "A TRX strap is missing; 13 stations operational.",
  "Lumbalgia, parte médico enviado.": "Lower back pain, medical note sent.",

  // ─── Venue zones ───────────────────────────────────────────────────────
  "Gijón centro": "Gijón center",
  "La Arena · zona playa": "La Arena · beach area",
  "Begoña · centro Gijón": "Begoña · Gijón center",
  "Mareo · zona exterior": "Mareo · outdoor area",

  // ─── Common demo strings ───────────────────────────────────────────────
  Entrenamiento: "Training",
  "Sin sesión hoy": "No session today",
  Hoy: "Today",
  Mañana: "Tomorrow",
  Ayer: "Yesterday",

  // ─── RGCC nav labels ───────────────────────────────────────────────────
  Biblioteca: "Library",
  "Centro Datos": "Data Center",
  Clases: "Classes",
  Copiloto: "Copilot",
  Dashboard: "Dashboard",
  Dirección: "Management",
  "Entrenamiento Personal": "Personal Training",
  Incidencias: "Incidents",
  "Mi Día": "My Day",
  Monitores: "Coaches",
  Quiosco: "Kiosk",
  Resumen: "Summary",
  Salas: "Rooms",
  Secciones: "Sections",
  Sedes: "Venues",
  Socio: "Member",
  Sustituciones: "Substitutions",
  // Vacaciones already mapped above

  // ─── Medical / fitness status ─────────────────────────────────────────────
  Apto: "Fit",
  "No apto": "Not fit",
  "En revisión": "Under review",

  // ─── Incident types ────────────────────────────────────────────────────────
  "Molestia muscular": "Muscle discomfort",
  Sobrecarga: "Overload",
  "Contusión": "Bruise",
  Esguince: "Sprain",
  "Tendinopatía": "Tendinopathy",

  // ─── Medical specialties ───────────────────────────────────────────────────
  Fisioterapia: "Physiotherapy",
  "Medicina deportiva": "Sports medicine",
  Nutrición: "Nutrition",
  Psicología: "Psychology",

  // ─── Extra absence reasons ────────────────────────────────────────────────
  Lesión: "Injury",
  Estudios: "Studies",
  Trabajo: "Work",

  // ─── Display-level statuses ────────────────────────────────────────────────
  Activo: "Active",
  Finalizado: "Finished",
  Pendiente: "Pending",
  Gestionada: "Managed",
  Convocado: "Called up",
  Sustitución: "Substitution",

};

/** Translate a single demo value. Returns the input unchanged when no mapping. */
export function td(value: string | undefined | null, lang: Lang): string {
  if (!value) return value ?? "";
  if (lang === "es") return value;
  return MAP[value] ?? value;
}

/** Hook variant. */
export function useTd() {
  const lang = useLang();
  return (value: string | undefined | null) => td(value, lang);
}

/** Translate the schedule strings ("L–V 07:00–23:00 · S–D 08:00–22:00"). */
export function tdSchedule(schedule: string, lang: Lang): string {
  if (lang === "es") return schedule;
  return schedule
    .replace(/L–V/g, "Mon–Fri")
    .replace(/L–J/g, "Mon–Thu")
    .replace(/S–D/g, "Sat–Sun")
    .replace(/\bS\b/g, "Sat")
    .replace(/\bV\b/g, "Fri");
}
