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

  // ─── RGCC exercise categories ─────────────────────────────────────────────
  Fuerza: { en: "Strength", sr: "Snaga" },
  Core: { en: "Core", sr: "Kor" },
  Metabólico: { en: "Metabolic", sr: "Metabolički" },
  Cardio: { en: "Cardio", sr: "Kardio" },
  Movilidad: { en: "Mobility", sr: "Pokretljivost" },
  Prevención: { en: "Prevention", sr: "Prevencija" },
  Reeducación: { en: "Rehab", sr: "Rehabilitacija" },
  "Técnica deportiva": { en: "Sport technique", sr: "Sportska tehnika" },

  // ─── Levels (RGCC + CNSO) ─────────────────────────────────────────────────
  Inicial: { en: "Beginner", sr: "Početni" },
  Intermedio: { en: "Intermediate", sr: "Srednji" },
  Avanzado: { en: "Advanced", sr: "Napredni" },
  Iniciación: { en: "Beginner", sr: "Početni" },
  Perfeccionamiento: { en: "Improvement", sr: "Usavršavanje" },
  Élite: { en: "Elite", sr: "Elitni" },

  // ─── CNSO disciplines ─────────────────────────────────────────────────────
  Waterpolo: { en: "Water polo", sr: "Vaterpolo" },
  Sincro: { en: "Synchro", sr: "Sinhrono plivanje" },
  "Natación Artística": { en: "Artistic Swimming", sr: "Umetničko plivanje" },
  "Aguas Abiertas": { en: "Open Water", sr: "Otvorene vode" },
  "Aguas abiertas": { en: "Open water", sr: "Otvorene vode" },
  Triatlón: { en: "Triathlon", sr: "Triatlon" },
  Saltos: { en: "Diving", sr: "Skokovi u vodu" },

  // ─── CNSO drill categories ────────────────────────────────────────────────
  "Técnica crol": { en: "Freestyle technique", sr: "Tehnika kraula" },
  "Técnica espalda": { en: "Backstroke technique", sr: "Tehnika leđnog" },
  "Técnica braza": { en: "Breaststroke technique", sr: "Tehnika prsnog" },
  "Técnica mariposa": { en: "Butterfly technique", sr: "Tehnika delfin" },
  "Salidas y virajes": { en: "Starts & turns", sr: "Startovi i okreti" },
  Patada: { en: "Kick", sr: "Nožni rad" },
  Tracción: { en: "Pull", sr: "Vučenje" },
  Seco: { en: "Dryland", sr: "Suvi trening" },

  // ─── CNSO competition categories ──────────────────────────────────────────
  Regional: { en: "Regional", sr: "Regionalno" },
  Nacional: { en: "National", sr: "Nacionalno" },
  Internacional: { en: "International", sr: "Međunarodno" },
  Máster: { en: "Masters", sr: "Masters" },
  Trofeo: { en: "Trophy", sr: "Trofej" },

  // ─── CNSO section categories ──────────────────────────────────────────────
  Competición: { en: "Competition", sr: "Takmičenje" },
  Escuela: { en: "School", sr: "Škola" },
  Adultos: { en: "Adults", sr: "Odrasli" },
  Especial: { en: "Special", sr: "Posebno" },
  "Multi-deporte": { en: "Multi-sport", sr: "Multi-sport" },

  // ─── CNSO section names (short reused labels) ─────────────────────────────
  "Primer Equipo": { en: "First Team", sr: "Prvi tim" },
  "Tecnificación CNSO": { en: "CNSO Development", sr: "CNSO razvojni program" },
  "Grupo Máster": { en: "Masters Group", sr: "Masters grupa" },
  "Natación Adaptada": { en: "Adapted Swimming", sr: "Adaptirano plivanje" },
  "Escuela · Prebenjamín": { en: "School · Pre-benjamin", sr: "Škola · pretpočetnici" },
  "Escuela · Benjamín": { en: "School · Benjamin", sr: "Škola · početnici" },
  "Escuela · Alevín": { en: "School · Alevín", sr: "Škola · mlađi kadeti" },
  "Escuela · Infantil": { en: "School · Youth", sr: "Škola · kadeti" },

  // ─── CNSO member levels / statuses ────────────────────────────────────────
  paused: { en: "paused", sr: "pauzirano" },
  inactive: { en: "inactive", sr: "neaktivno" },
  ok: { en: "ok", sr: "ok" },
  limit: { en: "at limit", sr: "na granici" },
  over: { en: "over limit", sr: "preko granice" },
  absent: { en: "absent", sr: "odsutan" },
  assigned: { en: "assigned", sr: "dodeljeno" },
  ready: { en: "ready", sr: "spremno" },
  pending: { en: "pending", sr: "na čekanju" },
  done: { en: "done", sr: "gotovo" },
  manual: { en: "manual", sr: "ručno" },
  ai: { en: "AI", sr: "VI" },
  library: { en: "library", sr: "biblioteka" },

  // ─── CNSO coach specialties (swimming) ────────────────────────────────────
  Crol: { en: "Freestyle", sr: "Kraul" },
  Espalda: { en: "Backstroke", sr: "Leđni" },
  Braza: { en: "Breaststroke", sr: "Prsni" },
  Mariposa: { en: "Butterfly", sr: "Delfin" },
  Estilos: { en: "Medley", sr: "Mešoviti" },
  "Seco · Fuerza": { en: "Dryland · Strength", sr: "Suvi trening · snaga" },

  // ─── CNSO room types & names ──────────────────────────────────────────────
  Calle: { en: "Lane", sr: "Staza" },
  Vaso: { en: "Pool", sr: "Bazen" },
  Foso: { en: "Diving pit", sr: "Bazen za skokove" },
  "Sala Seca": { en: "Dryland room", sr: "Sala za suvi trening" },
  // (Aguas Abiertas defined above)
  "Sala Spinning": { en: "Spinning room", sr: "Spining sala" },
  "Calle 1 (50 m)": { en: "Lane 1 (50 m)", sr: "Staza 1 (50 m)" },
  "Calle 2 (50 m)": { en: "Lane 2 (50 m)", sr: "Staza 2 (50 m)" },
  "Calle 3 (50 m)": { en: "Lane 3 (50 m)", sr: "Staza 3 (50 m)" },
  "Calle 4 (50 m)": { en: "Lane 4 (50 m)", sr: "Staza 4 (50 m)" },
  "Calle 5 (50 m)": { en: "Lane 5 (50 m)", sr: "Staza 5 (50 m)" },
  "Calle 6 (50 m)": { en: "Lane 6 (50 m)", sr: "Staza 6 (50 m)" },
  "Calle 7 (50 m)": { en: "Lane 7 (50 m)", sr: "Staza 7 (50 m)" },
  "Calle 8 (50 m)": { en: "Lane 8 (50 m)", sr: "Staza 8 (50 m)" },
  "Calle 7 + 8": { en: "Lanes 7 + 8", sr: "Staze 7 + 8" },
  "Vaso 25 m": { en: "25 m pool", sr: "Bazen 25 m" },
  "Foso de saltos": { en: "Diving pit", sr: "Bazen za skokove" },
  "Squali Fuerza": { en: "Squali Strength", sr: "Squali snaga" },
  "Squali Movilidad": { en: "Squali Mobility", sr: "Squali pokretljivost" },
  "Squali Spinning": { en: "Squali Spinning", sr: "Squali spining" },
  "Tejerona Vaso 25 m": { en: "Tejerona 25 m pool", sr: "Tejerona bazen 25 m" },
  "San Lorenzo · zona acotada": { en: "San Lorenzo · restricted area", sr: "San Lorenzo · ograđena zona" },

  // ─── CNSO venue services & zones ──────────────────────────────────────────
  "Piscina 50 m": { en: "50 m pool", sr: "Bazen 50 m" },
  "Piscina 25 m": { en: "25 m pool", sr: "Bazen 25 m" },
  "Gimnasio Squali": { en: "Squali gym", sr: "Squali teretana" },
  Vestuarios: { en: "Changing rooms", sr: "Svlačionice" },
  Cafetería: { en: "Cafeteria", sr: "Kafeterija" },
  Recuperación: { en: "Recovery", sr: "Oporavak" },
  "Gijón · Las Mestas": { en: "Gijón · Las Mestas", sr: "Hihon · Las Mestas" },
  "Gijón · Roces": { en: "Gijón · Roces", sr: "Hihon · Roses" },
  "Anexo Las Mestas": { en: "Las Mestas Annex", sr: "Aneks Las Mestas" },
  "Gijón · Playa": { en: "Gijón · Beach", sr: "Hihon · plaža" },

  // ─── CNSO kit ─────────────────────────────────────────────────────────────
  Bañador: { en: "Swimsuit", sr: "Kupaći kostim" },
  Gorro: { en: "Cap", sr: "Kapa" },
  Gafas: { en: "Goggles", sr: "Naočare" },
  Chándal: { en: "Tracksuit", sr: "Trenerka" },
  Polo: { en: "Polo shirt", sr: "Polo majica" },
  Mochila: { en: "Backpack", sr: "Ranac" },
  Toalla: { en: "Towel", sr: "Peškir" },
  "Bañador competición masculino": { en: "Men's competition swimsuit", sr: "Muški takmičarski kupaći" },
  "Bañador competición femenino": { en: "Women's competition swimsuit", sr: "Ženski takmičarski kupaći" },
  "Gorro silicona CNSO": { en: "CNSO silicone cap", sr: "CNSO silikonska kapa" },
  "Gafas competición CNSO": { en: "CNSO competition goggles", sr: "CNSO takmičarske naočare" },
  "Chándal oficial CNSO": { en: "Official CNSO tracksuit", sr: "Zvanična CNSO trenerka" },
  "Polo paseo CNSO": { en: "CNSO casual polo", sr: "CNSO polo za izlazak" },
  "Mochila CNSO": { en: "CNSO backpack", sr: "CNSO ranac" },
  "Toalla microfibra CNSO": { en: "CNSO microfiber towel", sr: "CNSO peškir od mikrofibera" },
  Única: { en: "One size", sr: "Univerzalna" },
  Estándar: { en: "Standard", sr: "Standardna" },
  Junior: { en: "Junior", sr: "Junior" },

  // ─── RGCC · Exercise categories/levels/groups/equipment ───────────────
  Pilates: { en: "Pilates", sr: "Pilates" },
  Pierna: { en: "Legs", sr: "Noge" },
  "Cadena posterior": { en: "Posterior chain", sr: "Zadnja lanac" },
  Pecho: { en: "Chest", sr: "Grudi" },
  Abdomen: { en: "Abs", sr: "Trbuh" },
  "Core profundo": { en: "Deep core", sr: "Duboki core" },
  "Full body": { en: "Full body", sr: "Celo telo" },
  Cardiorrespiratorio: { en: "Cardio-respiratory", sr: "Kardiorespiratorni" },
  "Pierna/Core": { en: "Legs/Core", sr: "Noge/Core" },
  "Pecho/Core": { en: "Chest/Core", sr: "Grudi/Core" },
  Glúteo: { en: "Glutes", sr: "Gluteus" },
  "Core/Agarre": { en: "Core/Grip", sr: "Core/Zahvat" },
  Hombro: { en: "Shoulder", sr: "Rame" },
  Aductores: { en: "Adductors", sr: "Aduktori" },
  Tobillo: { en: "Ankle", sr: "Zglob" },
  Cadera: { en: "Hip", sr: "Kuk" },
  Cuello: { en: "Neck", sr: "Vrat" },
  "Core/Hombro": { en: "Core/Shoulder", sr: "Core/Rame" },
  Isquios: { en: "Hamstrings", sr: "Zadnja loža" },
  Antirrotación: { en: "Anti-rotation", sr: "Anti-rotacija" },
  Diafragma: { en: "Diaphragm", sr: "Dijafragma" },
  Global: { en: "Global", sr: "Globalno" },
  Carrera: { en: "Running", sr: "Trčanje" },
  Kettlebell: { en: "Kettlebell", sr: "Kettlebell" },
  Mancuernas: { en: "Dumbbells", sr: "Bučice" },
  "Banco + mancuernas": { en: "Bench + dumbbells", sr: "Klupa + bučice" },
  Colchoneta: { en: "Mat", sr: "Strunjača" },
  Cuerdas: { en: "Battle ropes", sr: "Konopci" },
  Bike: { en: "Bike", sr: "Bicikl" },
  Springboard: { en: "Springboard", sr: "Springboard" },
  Mixto: { en: "Mixed", sr: "Kombinovano" },
  Esterilla: { en: "Mat", sr: "Prostirka" },
  "Banco + barra": { en: "Bench + bar", sr: "Klupa + šipka" },
  Kettlebells: { en: "Kettlebells", sr: "Kettlebell-i" },
  "Cajón bajo": { en: "Low box", sr: "Niska kutija" },
  "Banda elástica": { en: "Resistance band", sr: "Elastična traka" },
  Banco: { en: "Bench", sr: "Klupa" },
  "Plataforma inestable": { en: "Unstable platform", sr: "Nestabilna platforma" },
  Conos: { en: "Cones", sr: "Čunjevi" },
  Pica: { en: "Bar/Pole", sr: "Štap" },
  "Balón medicinal": { en: "Med ball", sr: "Medicinka" },
  Compañero: { en: "Partner", sr: "Partner" },
  "Polea/Banda": { en: "Pulley/Band", sr: "Katarina/Traka" },
  Banda: { en: "Band", sr: "Traka" },
  Cajón: { en: "Box", sr: "Kutija" },
  Tatami: { en: "Tatami", sr: "Tatami" },

  // ─── RGCC · Exercise names ────────────────────────────────────────────
  "Sentadilla goblet": { en: "Goblet squat", sr: "Goblet čučanj" },
  "Peso muerto rumano": { en: "Romanian deadlift", sr: "Rumunski mrtvo dizanje" },
  "Press banca mancuernas": { en: "Dumbbell bench press", sr: "Bench press sa bučicama" },
  "Remo TRX": { en: "TRX row", sr: "TRX veslanje" },
  "Plancha frontal": { en: "Front plank", sr: "Prednja plank" },
  "Dead bug": { en: "Dead bug", sr: "Dead bug" },
  "Battle rope intervals": { en: "Battle rope intervals", sr: "Battle rope intervali" },
  "Ciclo indoor sprint": { en: "Indoor cycling sprint", sr: "Indoor cikling sprint" },
  "Pilates hundred": { en: "Pilates hundred", sr: "Pilates hundred" },
  "Springboard leg series": { en: "Springboard leg series", sr: "Springboard serija za noge" },
  "TRX chest press": { en: "TRX chest press", sr: "TRX chest press" },
  "TRX atomic push-up": { en: "TRX atomic push-up", sr: "TRX atomski sklek" },
  "Body workout AMRAP": { en: "Body workout AMRAP", sr: "Body workout AMRAP" },
  "Yoga saludo al sol": { en: "Sun salutation yoga", sr: "Joga pozdrav suncu" },
  "Hip thrust": { en: "Hip thrust", sr: "Hip thrust" },
  "Farmer carry": { en: "Farmer carry", sr: "Farmer carry" },
  "Aterrizaje bilateral controlado": { en: "Controlled bilateral landing", sr: "Kontrolisano bilateralno doskočište" },
  "Blunder check escapular": { en: "Scapular blunder check", sr: "Skapularna kontrola" },
  "Circuito adaptado": { en: "Adapted circuit", sr: "Prilagođeni krug" },
  "Copenhagen plank": { en: "Copenhagen plank", sr: "Copenhagen plank" },
  "Equilibrio unipodal tobillo": { en: "Single-leg ankle balance", sr: "Balans na jednoj nozi" },
  "Frenada reactiva": { en: "Reactive braking", sr: "Reaktivno kočenje" },
  "Hip hinge con pica": { en: "Hip hinge with bar", sr: "Hip hinge sa štapom" },
  "Isometría cervical multidirección": { en: "Multi-direction cervical isometrics", sr: "Cervikalna izometrija u više pravaca" },
  "Lanzamiento rotacional con balón": { en: "Rotational med-ball throw", sr: "Rotaciono bacanje medicinke" },
  "Nordic hamstring curl": { en: "Nordic hamstring curl", sr: "Nordijsko savijanje zadnje lože" },
  "Pallof press": { en: "Pallof press", sr: "Pallof press" },
  "Pausa activa cervical": { en: "Cervical active break", sr: "Aktivna pauza za vrat" },
  "Remo con banda elástica": { en: "Band row", sr: "Veslanje sa trakom" },
  "Respiración costo-diafragmática": { en: "Costo-diaphragmatic breathing", sr: "Kosto-dijafragmalno disanje" },
  "Rotadores externos con banda": { en: "External rotators with band", sr: "Spoljni rotatori sa trakom" },
  "Sentadilla a caja": { en: "Box squat", sr: "Čučanj na kutiju" },
  "Skipping técnico": { en: "Technical skipping", sr: "Tehnički skiping" },
  "Split step reactivo": { en: "Reactive split step", sr: "Reaktivni split step" },
  "Caídas controladas (ukemi)": { en: "Controlled falls (ukemi)", sr: "Kontrolisani padovi (ukemi)" },

  // ─── RGCC · Cues ──────────────────────────────────────────────────────
  "Espalda neutra, rodillas alineadas, bajar controlado.": { en: "Neutral back, aligned knees, controlled descent.", sr: "Neutralna leđa, kolena poravnata, kontrolisano spuštanje." },
  "Bisagra de cadera, carga cerca del cuerpo, cuello neutro.": { en: "Hip hinge, load close to body, neutral neck.", sr: "Hip hinge, teret blizu tela, neutralan vrat." },
  "Escápulas retraídas, recorrido completo.": { en: "Retracted scapulae, full range.", sr: "Uvučene lopatice, pun opseg." },
  "Cuerpo en línea, retracción escapular.": { en: "Body in line, scapular retraction.", sr: "Telo u liniji, retrakcija lopatica." },
  "Glúteo activo, sin caer cadera.": { en: "Active glutes, hips not dropping.", sr: "Aktivan gluteus, kukovi ne padaju." },
  "Cae con tobillo, rodilla y cadera alineados.": { en: "Land with ankle, knee and hip aligned.", sr: "Doskoč sa poravnatim zglobom, kolenom i kukom." },
  "Mantén las 3 puntas de contacto en la pica.": { en: "Keep the 3 contact points on the bar.", sr: "Održi 3 tačke kontakta na štapu." },

  // ─── RGCC · Routine names/goals ───────────────────────────────────────
  "EP Fuerza Base": { en: "PT Base Strength", sr: "PT Osnovna Snaga" },
  "Ganancia de fuerza general": { en: "Overall strength gain", sr: "Opšti dobitak snage" },
  "Pilates Springboard Control": { en: "Pilates Springboard Control", sr: "Pilates Springboard Kontrola" },
  "Control lumbo-pélvico y movilidad": { en: "Lumbo-pelvic control and mobility", sr: "Lumbo-pelvična kontrola i pokretljivost" },
  "TRX Full Body": { en: "TRX Full Body", sr: "TRX Celo Telo" },
  "Trabajo global con autocarga": { en: "Full body bodyweight work", sr: "Globalni rad sa sopstvenom težinom" },
  "Ciclo + Core Express": { en: "Cycling + Core Express", sr: "Cikling + Core Express" },
  "Cardio interválico con core": { en: "Interval cardio with core", sr: "Intervalni kardio sa core" },

  // ─── RGCC · Workouts / PT notes ───────────────────────────────────────
  "Fuerza glúteo · semana 3": { en: "Glute strength · week 3", sr: "Snaga gluteusa · nedelja 3" },
  "Reforzar cadena posterior con foco en hip thrust": { en: "Strengthen posterior chain focusing on hip thrust", sr: "Ojačati zadnju lanac sa fokusom na hip thrust" },
  "Hip thrust con barra": { en: "Barbell hip thrust", sr: "Hip thrust sa šipkom" },
  "Pausa 1s arriba": { en: "1s pause at top", sr: "Pauza od 1s na vrhu" },
  "Cuida la zona lumbar. Si aparece molestia, regresa a goblet.": { en: "Care for the lower back. If discomfort appears, return to goblet.", sr: "Pazi na donji deo leđa. Ako dođe do nelagodnosti, vrati se na goblet." },
  "Cardio + core express": { en: "Cardio + core express", sr: "Kardio + core express" },
  "30 min mantenimiento metabólico": { en: "30 min metabolic maintenance", sr: "30 min metabolički rad" },
  "Bici suave 10 min": { en: "Easy bike 10 min", sr: "Lagan bicikl 10 min" },
  "Bici intervalos": { en: "Bike intervals", sr: "Intervali na biciklu" },
  "Pendiente valoración inicial.": { en: "Pending initial assessment.", sr: "Očekuje se početna procena." },

  // ─── RGCC · Member activities / goals / notes ─────────────────────────
  "EP Fuerza": { en: "PT Strength", sr: "PT Snaga" },
  "Ciclo + Core": { en: "Cycling + Core", sr: "Cikling + Core" },
  "Pilates Springboard": { en: "Pilates Springboard", sr: "Pilates Springboard" },
  "Body Workout": { en: "Body Workout", sr: "Body Workout" },
  Funcional: { en: "Functional", sr: "Funkcionalni" },
  "Recomposición y fuerza glúteo.": { en: "Body recomposition and glute strength.", sr: "Rekompozicija tela i snaga gluteusa." },
  "Pérdida de grasa, mejora cardio.": { en: "Fat loss, cardio improvement.", sr: "Gubitak masti, poboljšanje kardio." },
  "Tono y movilidad.": { en: "Tone and mobility.", sr: "Tonus i pokretljivost." },
  "Control postural y rehabilitación lumbar.": { en: "Postural control and lumbar rehab.", sr: "Posturalna kontrola i lumbalna rehabilitacija." },
  "Rendimiento metabólico.": { en: "Metabolic performance.", sr: "Metabolički učinak." },
  "Volver tras lesión hombro.": { en: "Return after shoulder injury.", sr: "Povratak nakon povrede ramena." },
  "Iniciación a fuerza.": { en: "Introduction to strength.", sr: "Uvod u snagu." },
  "Mejora postural.": { en: "Postural improvement.", sr: "Posturalno poboljšanje." },
  "Lumbalgia crónica leve. Adaptar peso muerto.": { en: "Mild chronic low back pain. Adapt deadlift.", sr: "Blaga hronična lumbalgija. Prilagoditi mrtvo dizanje." },
  "HTA controlada.": { en: "Controlled hypertension.", sr: "Kontrolisana hipertenzija." },
  "Hernia L4-L5 estable.": { en: "Stable L4-L5 hernia.", sr: "Stabilna hernija L4-L5." },
  "Reincorporación gradual.": { en: "Gradual return.", sr: "Postepeni povratak." },

  // ─── RGCC · Coach specialties ─────────────────────────────────────────
  "Ciclo Indoor": { en: "Indoor Cycling", sr: "Indoor Cikling" },

  // ─── RGCC · Section descriptions ──────────────────────────────────────

  // ─── RGCC · Venues ────────────────────────────────────────────────────
  Piscina: { en: "Pool", sr: "Bazen" },
  Vestuario: { en: "Locker room", sr: "Svlačionica" },
  Sauna: { en: "Sauna", sr: "Sauna" },
  "Sala polivalente": { en: "Multipurpose room", sr: "Višenamenska sala" },
  "Pistas exteriores": { en: "Outdoor courts", sr: "Otvoreni tereni" },

  // ─── RGCC · Incidents / absences ──────────────────────────────────────
  Salud: { en: "Health", sr: "Zdravlje" },
  "Sobrecarga lumbar tras sesión de funcional. Pendiente prueba de imagen.": { en: "Lumbar overload after functional session. Imaging pending.", sr: "Lumbalno preopterećenje nakon funkcionalne sesije. Snimanje na čekanju." },
  "Sin peso muerto ni saltos 10 días. Cardio bajo impacto permitido.": { en: "No deadlift or jumps for 10 days. Low-impact cardio allowed.", sr: "Bez mrtvog dizanja i skokova 10 dana. Kardio niskog uticaja dozvoljen." },
  "Esguince grado II tobillo izquierdo en pádel. Inmovilización 3 semanas.": { en: "Grade II left ankle sprain playing padel. 3-week immobilisation.", sr: "Uganuće II stepena levog zgloba u padelu. Imobilizacija 3 nedelje." },
  "Baja en clases con impacto. Apto sólo para piscina y bici estática.": { en: "Off high-impact classes. Only pool and stationary bike allowed.", sr: "Van časova sa udarom. Samo bazen i sobni bicikl dozvoljeni." },

  // ─── RGCC · Kit categories ────────────────────────────────────────────
  Chaqueta: { en: "Jacket", sr: "Jakna" },
  Camiseta: { en: "T-shirt", sr: "Majica" },
  Pantalón: { en: "Trousers", sr: "Pantalone" },
  Bermuda: { en: "Bermuda shorts", sr: "Bermude" },
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

/**
 * Pick a localized field from a seed record: prefers `<field>_<lang>` when
 * present, otherwise falls back to `<field>` (base language of the seed).
 */
export function pickField<T extends Record<string, unknown>>(
  item: T,
  field: string,
  lang: Lang,
): string {
  if (lang !== "es") {
    const alt = item[`${field}_${lang}`];
    if (typeof alt === "string" && alt.length > 0) return alt;
  }
  const base = item[field];
  return typeof base === "string" ? base : "";
}

/** Hook variant of pickField, bound to the current user's language. */
export function useTdField() {
  const lang = useLang();
  return useCallback(
    <T extends Record<string, unknown>>(item: T, field: string) =>
      pickField(item, field, lang),
    [lang],
  );
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
