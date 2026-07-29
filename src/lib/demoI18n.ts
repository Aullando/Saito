// Runtime translation layer for demo data values.
// Seeds remain in Spanish; this helper translates known strings on render.
// Proper names (people, venues, club) are intentionally NOT translated.
import { useCallback } from "react";
import { useLang } from "./i18n";
import type { Lang } from "./types";

type Tri = { en: string; sr: string };

const MAP: Record<string, Tri> = {
  // ─── Activities ────────────────────────────────────────────────────────
  TABATA: { en: "TABATA", sr: "TABATA" },
  "BODY WORKOUT": { en: "BODY WORKOUT", sr: "BODY WORKOUT" },
  "GAP 30": { en: "CORE 30", sr: "CORE 30" },
  GAP: { en: "CORE", sr: "CORE" },
  TRX: { en: "TRX", sr: "TRX" },
  "CICLO INDOOR": { en: "INDOOR CYCLING", sr: "INDOOR CIKLING" },
  PILATES: { en: "PILATES", sr: "PILATES" },
  "PILATES SPRINGBOARD": { en: "PILATES SPRINGBOARD", sr: "PILATES SPRINGBOARD" },
  YOGA: { en: "YOGA", sr: "JOGA" },
  "FUNCIONAL PLAYA": { en: "BEACH FUNCTIONAL", sr: "FUNKCIONALNI TRENING NA PLAŽI" },
  "PÁDEL DIRIGIDO": { en: "COACHED PADEL", sr: "PADEL SA TRENEROM" },

  // ─── Room types ────────────────────────────────────────────────────────
  Fitness: { en: "Fitness", sr: "Fitnes" },
  Ciclo: { en: "Cycling", sr: "Ciklizam" },
  Yoga: { en: "Yoga", sr: "Joga" },
  Multiusos: { en: "Multipurpose", sr: "Višenamenska" },
  EP: { en: "Personal Training", sr: "Personalni trening" },
  Exterior: { en: "Outdoor", sr: "Otvoreni prostor" },
  Gimnasio: { en: "Gym", sr: "Teretana" },

  // ─── Section categories ────────────────────────────────────────────────
  Equipo: { en: "Team", sr: "Ekipa" },
  Individual: { en: "Individual", sr: "Individualno" },
  Acuático: { en: "Aquatic", sr: "Vodeni sportovi" },
  Combate: { en: "Combat", sr: "Borilački" },
  Cultural: { en: "Cultural", sr: "Kulturni" },
  Mente: { en: "Mind", sr: "Um" },
  Outdoor: { en: "Outdoor", sr: "Na otvorenom" },

  // ─── Statuses ──────────────────────────────────────────────────────────
  active: { en: "active", sr: "aktivno" },
  maintenance: { en: "maintenance", sr: "održavanje" },
  closed: { en: "closed", sr: "zatvoreno" },
  incident: { en: "incident", sr: "incident" },
  scheduled: { en: "scheduled", sr: "zakazano" },
  confirmed: { en: "confirmed", sr: "potvrđeno" },
  completed: { en: "completed", sr: "završeno" },
  cancelled: { en: "cancelled", sr: "otkazano" },
  open: { en: "open", sr: "otvoreno" },
  in_progress: { en: "in progress", sr: "u toku" },
  resolved: { en: "resolved", sr: "rešeno" },
  requested: { en: "requested", sr: "zatraženo" },
  approved: { en: "approved", sr: "odobreno" },
  rejected: { en: "rejected", sr: "odbijeno" },

  // ─── Severity ──────────────────────────────────────────────────────────
  low: { en: "low", sr: "nizak" },
  medium: { en: "medium", sr: "srednji" },
  high: { en: "high", sr: "visok" },

  // ─── Absence reasons ───────────────────────────────────────────────────
  Vacaciones: { en: "Vacation", sr: "Odmor" },
  Enfermedad: { en: "Illness", sr: "Bolest" },
  "Asuntos propios": { en: "Personal matters", sr: "Lične obaveze" },
  Otro: { en: "Other", sr: "Drugo" },

  // ─── Incident types ────────────────────────────────────────────────────
  Sala: { en: "Room", sr: "Sala" },
  Material: { en: "Equipment", sr: "Oprema" },
  Clase: { en: "Class", sr: "Čas" },

  // ─── Sport sections (names) ────────────────────────────────────────────
  Ajedrez: { en: "Chess", sr: "Šah" },
  Atletismo: { en: "Athletics", sr: "Atletika" },
  Baloncesto: { en: "Basketball", sr: "Košarka" },
  Balonmano: { en: "Handball", sr: "Rukomet" },
  Billar: { en: "Billiards", sr: "Bilijar" },
  Bolos: { en: "Bowls", sr: "Kuglanje" },
  Boxeo: { en: "Boxing", sr: "Boks" },
  "Coros y Danzas": { en: "Choirs & Dance", sr: "Horovi i igre" },
  "Diversidad Funcional": { en: "Functional Diversity", sr: "Funkcionalna raznolikost" },
  Esquí: { en: "Skiing", sr: "Skijanje" },
  GAF: { en: "Women's Artistic Gymnastics", sr: "Ženska sportska gimnastika" },
  GAM: { en: "Men's Artistic Gymnastics", sr: "Muška sportska gimnastika" },
  Halterofilia: { en: "Weightlifting", sr: "Dizanje tegova" },
  Hockey: { en: "Hockey", sr: "Hokej" },
  Judo: { en: "Judo", sr: "Džudo" },
  Kárate: { en: "Karate", sr: "Karate" },
  Lucha: { en: "Wrestling", sr: "Rvanje" },
  Montaña: { en: "Mountaineering", sr: "Planinarenje" },
  Natación: { en: "Swimming", sr: "Plivanje" },
  Orfeón: { en: "Choral Society", sr: "Horsko društvo" },
  Pádel: { en: "Padel", sr: "Padel" },
  Pelota: { en: "Pelota", sr: "Pelota" },
  Piragüismo: { en: "Canoeing", sr: "Kajakaštvo" },
  Rugby: { en: "Rugby", sr: "Ragbi" },
  Surf: { en: "Surfing", sr: "Surfovanje" },
  Tenis: { en: "Tennis", sr: "Tenis" },
  "Tiro con Arco": { en: "Archery", sr: "Streličarstvo" },
  Vela: { en: "Sailing", sr: "Jedrenje" },
  Voleibol: { en: "Volleyball", sr: "Odbojka" },

  // ─── Section short descriptions ────────────────────────────────────────
  "Sección histórica con torneos y formación.": {
    en: "Historic section with tournaments and training.",
    sr: "Istorijska sekcija sa turnirima i obukom.",
  },
  "Pruebas de pista, ruta y campo a través.": {
    en: "Track, road and cross-country events.",
    sr: "Discipline na stazi, drumu i krosu.",
  },
  "Equipos en categorías de base y senior.": {
    en: "Youth and senior teams.",
    sr: "Omladinske i seniorske ekipe.",
  },
  "Competición autonómica y nacional.": {
    en: "Regional and national competition.",
    sr: "Regionalno i nacionalno takmičenje.",
  },
  "Salas y modalidades libre y carambola.": {
    en: "Free and carom billiards rooms.",
    sr: "Sale i discipline slobodni bilijar i karambol.",
  },
  "Bolo asturiano, tradición viva.": {
    en: "Asturian bowls, a living tradition.",
    sr: "Asturijsko kuglanje, živa tradicija.",
  },
  "Iniciación, técnica y competición amateur.": {
    en: "Beginners, technique and amateur competition.",
    sr: "Početnici, tehnika i amatersko takmičenje.",
  },
  "Folclore asturiano y representación.": {
    en: "Asturian folklore and performance.",
    sr: "Asturijski folklor i nastupi.",
  },
  "Programas inclusivos multidisciplinares.": {
    en: "Inclusive multidisciplinary programs.",
    sr: "Inkluzivni multidisciplinarni programi.",
  },
  "Salidas a Pajares y competición FIS.": {
    en: "Trips to Pajares and FIS competition.",
    sr: "Izleti u Pahares i FIS takmičenja.",
  },
  "Gimnasia Artística Femenina.": {
    en: "Women's Artistic Gymnastics.",
    sr: "Ženska sportska gimnastika.",
  },
  "Gimnasia Artística Masculina.": {
    en: "Men's Artistic Gymnastics.",
    sr: "Muška sportska gimnastika.",
  },
  "Levantamientos olímpicos.": { en: "Olympic weightlifting.", sr: "Olimpijsko dizanje tegova." },
  "Hockey hierba, base y senior.": {
    en: "Field hockey, youth and senior.",
    sr: "Hokej na travi, omladinci i seniori.",
  },
  "Cinturones desde blanco a negro.": {
    en: "Belts from white to black.",
    sr: "Pojasevi od belog do crnog.",
  },
  "Kata y kumite, todas las edades.": {
    en: "Kata and kumite, all ages.",
    sr: "Kata i kumite, svi uzrasti.",
  },
  "Lucha grecorromana y libre.": {
    en: "Greco-Roman and freestyle wrestling.",
    sr: "Grčko-rimsko i slobodno rvanje.",
  },
  "Senderismo, alpinismo y BTT.": {
    en: "Hiking, mountaineering and MTB.",
    sr: "Planinarenje, alpinizam i brdski biciklizam.",
  },
  "Aprendizaje, perfeccionamiento y competición.": {
    en: "Learning, advanced training and competition.",
    sr: "Učenje, usavršavanje i takmičenje.",
  },
  "Coro polifónico del club.": { en: "Club polyphonic choir.", sr: "Polifoni hor kluba." },
  "Liga interna y escuela técnica.": {
    en: "Internal league and technical school.",
    sr: "Interna liga i tehnička škola.",
  },
  "Pelota mano y paleta.": { en: "Hand pelota and paddle.", sr: "Pelota rukom i palicom." },
  "Aguas tranquilas y travesías.": { en: "Flatwater and touring.", sr: "Mirne vode i ture." },
  "Equipos masculino, femenino y base.": {
    en: "Men's, women's and youth teams.",
    sr: "Muške, ženske i omladinske ekipe.",
  },
  "Escuela y entrenamiento de competición.": {
    en: "School and competition training.",
    sr: "Škola i takmičarski trening.",
  },
  "Pistas de tierra batida y dura.": {
    en: "Clay and hard courts.",
    sr: "Šljakasti i tvrdi tereni.",
  },
  "Recurvo y compuesto, sala y aire libre.": {
    en: "Recurve and compound, indoor and outdoor.",
    sr: "Olimpijski i kompaund luk, sala i otvoreno.",
  },
  "Optimist, Láser y travesías.": { en: "Optimist, Laser and touring.", sr: "Optimist, Laser i ture." },
  "Equipos absolutos y categorías base.": {
    en: "Senior teams and youth categories.",
    sr: "Seniorske ekipe i omladinske kategorije.",
  },

  // ─── Venue descriptions ────────────────────────────────────────────────
  "Sede principal con más de 80.000 m² dedicados al deporte y la actividad social.": {
    en: "Main venue with over 80,000 m² dedicated to sport and social activity.",
    sr: "Glavni objekat sa preko 80.000 m² posvećenih sportu i društvenim aktivnostima.",
  },
  "Local histórico del club en La Arena.": {
    en: "Historic club venue in La Arena.",
    sr: "Istorijski objekat kluba u La Areni.",
  },
  "Sede urbana de Begoña en el corazón de Gijón.": {
    en: "Urban Begoña venue in the heart of Gijón.",
    sr: "Gradski objekat Begonja u srcu Hihona.",
  },
  "Sede del antiguo Centro Asturiano de la Habana.": {
    en: "Former Centro Asturiano de la Habana venue.",
    sr: "Nekadašnji objekat Centro Asturiano de la Habana.",
  },

  // ─── Incident descriptions ─────────────────────────────────────────────
  "Falta una correa TRX, hay 13 puestos operativos.": {
    en: "A TRX strap is missing; 13 stations operational.",
    sr: "Nedostaje jedan TRX kaiš; 13 stanica je u funkciji.",
  },
  "Lumbalgia, parte médico enviado.": {
    en: "Lower back pain, medical note sent.",
    sr: "Bol u donjem delu leđa, lekarski nalaz poslat.",
  },

  // ─── Venue zones ───────────────────────────────────────────────────────
  "Gijón centro": { en: "Gijón center", sr: "Centar Hihona" },
  "La Arena · zona playa": { en: "La Arena · beach area", sr: "La Arena · plažna zona" },
  "Begoña · centro Gijón": { en: "Begoña · Gijón center", sr: "Begonja · centar Hihona" },
  "Mareo · zona exterior": { en: "Mareo · outdoor area", sr: "Mareo · spoljna zona" },

  // ─── Common demo strings ───────────────────────────────────────────────
  Entrenamiento: { en: "Training", sr: "Trening" },
  "Sin sesión hoy": { en: "No session today", sr: "Danas nema sesije" },
  Hoy: { en: "Today", sr: "Danas" },
  Mañana: { en: "Tomorrow", sr: "Sutra" },
  Ayer: { en: "Yesterday", sr: "Juče" },

  // ─── RGCC nav labels ───────────────────────────────────────────────────
  Biblioteca: { en: "Library", sr: "Biblioteka" },
  "Centro Datos": { en: "Data Center", sr: "Centar podataka" },
  Clases: { en: "Classes", sr: "Časovi" },
  Copiloto: { en: "Copilot", sr: "Kopilot" },
  Dashboard: { en: "Dashboard", sr: "Kontrolna tabla" },
  Dirección: { en: "Management", sr: "Uprava" },
  "Entrenamiento Personal": { en: "Personal Training", sr: "Personalni trening" },
  Incidencias: { en: "Incidents", sr: "Incidenti" },
  "Mi Día": { en: "My Day", sr: "Moj dan" },
  Monitores: { en: "Coaches", sr: "Treneri" },
  Quiosco: { en: "Kiosk", sr: "Kiosk" },
  Resumen: { en: "Summary", sr: "Rezime" },
  Salas: { en: "Rooms", sr: "Sale" },
  Secciones: { en: "Sections", sr: "Sekcije" },
  Sedes: { en: "Venues", sr: "Objekti" },
  Socio: { en: "Member", sr: "Član" },
  Sustituciones: { en: "Substitutions", sr: "Zamene" },

  // ─── Medical / fitness status ─────────────────────────────────────────────
  Apto: { en: "Fit", sr: "Sposoban" },
  "No apto": { en: "Not fit", sr: "Nesposoban" },
  "En revisión": { en: "Under review", sr: "Na proveri" },

  // ─── Incident types (medical) ─────────────────────────────────────────────
  "Molestia muscular": { en: "Muscle discomfort", sr: "Mišićna nelagodnost" },
  Sobrecarga: { en: "Overload", sr: "Preopterećenje" },
  Contusión: { en: "Bruise", sr: "Nagnječenje" },
  Esguince: { en: "Sprain", sr: "Uganuće" },
  Tendinopatía: { en: "Tendinopathy", sr: "Tendinopatija" },

  // ─── Medical specialties ───────────────────────────────────────────────────
  Fisioterapia: { en: "Physiotherapy", sr: "Fizioterapija" },
  "Medicina deportiva": { en: "Sports medicine", sr: "Sportska medicina" },
  Nutrición: { en: "Nutrition", sr: "Nutricija" },
  Psicología: { en: "Psychology", sr: "Psihologija" },

  // ─── Extra absence reasons ────────────────────────────────────────────────
  Lesión: { en: "Injury", sr: "Povreda" },
  Estudios: { en: "Studies", sr: "Studije" },
  Trabajo: { en: "Work", sr: "Posao" },

  // ─── Display-level statuses ────────────────────────────────────────────────
  Activo: { en: "Active", sr: "Aktivan" },
  Finalizado: { en: "Finished", sr: "Završeno" },
  Pendiente: { en: "Pending", sr: "Na čekanju" },
  Gestionada: { en: "Managed", sr: "Obrađeno" },
  Convocado: { en: "Called up", sr: "Pozvan" },
  Sustitución: { en: "Substitution", sr: "Zamena" },

  // ─── Treatment plan titles ────────────────────────────────────────────────
  "Protocolo tobillo · 4 semanas": { en: "Ankle protocol · 4 weeks", sr: "Protokol za skočni zglob · 4 nedelje" },
  "Readaptación isquiotibial": { en: "Hamstring rehabilitation", sr: "Rehabilitacija zadnje lože" },
  "Recuperación contusión rodilla": { en: "Knee bruise recovery", sr: "Oporavak od nagnječenja kolena" },

  // ─── Appointment request reasons ──────────────────────────────────────────
  "Reconocimiento anual": { en: "Annual check-up", sr: "Godišnji pregled" },
  "Molestia aductor": { en: "Adductor discomfort", sr: "Nelagodnost u aduktoru" },
  "Revisión post-incidencia": { en: "Post-incident review", sr: "Pregled nakon incidenta" },

  // ─── Relative time strings ────────────────────────────────────────────────
  "hoy 09:12": { en: "today 09:12", sr: "danas 09:12" },
  ayer: { en: "yesterday", sr: "juče" },
  "hace 2 días": { en: "2 days ago", sr: "pre 2 dana" },
  "hace 12 min": { en: "12 min ago", sr: "pre 12 min" },
  "hace 2 h": { en: "2 h ago", sr: "pre 2 h" },

  // ─── AI session block titles ──────────────────────────────────────────────
  Calentamiento: { en: "Warm-up", sr: "Zagrevanje" },
  "Bloque técnico": { en: "Technical block", sr: "Tehnički blok" },
  "Ejercicio principal": { en: "Main exercise", sr: "Glavna vežba" },
  Variantes: { en: "Variants", sr: "Varijante" },

  // ─── Notification messages ────────────────────────────────────────────────
  "Nuevo mensaje del entrenador": { en: "New message from coach", sr: "Nova poruka od trenera" },
  "Nueva valoración disponible": { en: "New rating available", sr: "Dostupna nova ocena" },
  "Notas de la sesión del miércoles": { en: "Wednesday session notes", sr: "Beleške sa sesije u sredu" },
  "Cambio de horario: viernes 18:00 → 17:30": {
    en: "Schedule change: Friday 18:00 → 17:30",
    sr: "Promena rasporeda: petak 18:00 → 17:30",
  },

  // ─── Personal absence reason ──────────────────────────────────────────────
  Personal: { en: "Personal", sr: "Lično" },
};

/** Translate a single demo value. Returns the input unchanged when no mapping. */
export function td(value: string | undefined | null, lang: Lang): string {
  if (!value) return value ?? "";
  if (lang === "es") return value;
  const entry = MAP[value];
  if (!entry) return value;
  return lang === "sr" ? entry.sr : entry.en;
}

/** Hook variant. Stable identity per language for downstream memoization. */
export function useTd() {
  const lang = useLang();
  return useCallback((value: string | undefined | null) => td(value, lang), [lang]);
}

/** Translate the schedule strings ("L–V 07:00–23:00 · S–D 08:00–22:00"). */
export function tdSchedule(schedule: string, lang: Lang): string {
  if (lang === "es") return schedule;
  if (lang === "sr") {
    return schedule
      .replace(/L–V/g, "Pon–Pet")
      .replace(/L–J/g, "Pon–Čet")
      .replace(/S–D/g, "Sub–Ned")
      .replace(/\bS\b/g, "Sub")
      .replace(/\bV\b/g, "Pet");
  }
  return schedule
    .replace(/L–V/g, "Mon–Fri")
    .replace(/L–J/g, "Mon–Thu")
    .replace(/S–D/g, "Sat–Sun")
    .replace(/\bS\b/g, "Sat")
    .replace(/\bV\b/g, "Fri");
}
