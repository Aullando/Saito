import type { ClubModulesConfig, ClubNavItem } from "../types";

/** RGCC enabled modules (in display order). */
export const rgccModules: ClubModulesConfig = {
  enabled: [
    "dashboard",
    "rgcc-direccion",
    "rgcc-clases",
    "rgcc-mi-dia",
    "rgcc-socio",
    "rgcc-sedes",
    "rgcc-secciones",
    "rgcc-resumen",
    "rgcc-monitores",
    "rgcc-sustituciones",
    "rgcc-incidencias",
    "rgcc-salas",
    "rgcc-vacaciones",
    "rgcc-centro-datos",
    "rgcc-pt",
    "rgcc-biblioteca",
    "rgcc-quiosco",
    "rgcc-copiloto",
  ],
};

/** Sidebar items for RGCC. Modules without a real route fall back to the
 *  `/rgcc/$slug` ComingSoon placeholder. */
export const rgccNavItems: ClubNavItem[] = [
  { module: "dashboard",          label: "Dashboard",              icon: "LayoutGrid",  to: "/dashboard" },
  { module: "rgcc-direccion",     label: "Dirección",              icon: "Briefcase",   to: "/rgcc/$slug", slug: "direccion" },
  { module: "rgcc-clases",        label: "Clases",                 icon: "GraduationCap", to: "/rgcc/clases" },
  { module: "rgcc-mi-dia",        label: "Mi Día",                 icon: "Sun",         to: "/rgcc/mi-dia" },
  { module: "rgcc-socio",         label: "Socio",                  icon: "UserCircle",  to: "/rgcc/$slug", slug: "socio" },
  { module: "rgcc-sedes",         label: "Sedes",                  icon: "MapPin",      to: "/rgcc/$slug", slug: "sedes" },
  { module: "rgcc-secciones",     label: "Secciones",              icon: "Layers",      to: "/rgcc/$slug", slug: "secciones" },
  { module: "rgcc-resumen",       label: "Resumen",                icon: "FileBarChart", to: "/rgcc/$slug", slug: "resumen" },
  { module: "rgcc-monitores",     label: "Monitores",              icon: "Users",       to: "/rgcc/$slug", slug: "monitores" },
  { module: "rgcc-sustituciones", label: "Sustituciones",          icon: "Repeat",      to: "/rgcc/$slug", slug: "sustituciones" },
  { module: "rgcc-incidencias",   label: "Incidencias",            icon: "AlertTriangle", to: "/rgcc/$slug", slug: "incidencias" },
  { module: "rgcc-salas",         label: "Salas",                  icon: "DoorOpen",    to: "/rgcc/$slug", slug: "salas" },
  { module: "rgcc-vacaciones",    label: "Vacaciones",             icon: "Palmtree",    to: "/rgcc/$slug", slug: "vacaciones" },
  { module: "rgcc-centro-datos",  label: "Centro Datos",           icon: "Database",    to: "/rgcc/$slug", slug: "centro-datos" },
  { module: "rgcc-pt",            label: "Entrenamiento Personal", icon: "Dumbbell",    to: "/rgcc/$slug", slug: "entrenamiento-personal" },
  { module: "rgcc-biblioteca",    label: "Biblioteca",             icon: "BookOpen",    to: "/rgcc/$slug", slug: "biblioteca" },
  { module: "rgcc-quiosco",       label: "Quiosco",                icon: "Newspaper",   to: "/rgcc/$slug", slug: "quiosco" },
  { module: "rgcc-copiloto",      label: "Copiloto",               icon: "Bot",         to: "/rgcc/$slug", slug: "copiloto" },
];
