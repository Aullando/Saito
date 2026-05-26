import type { ClubModulesConfig, ClubNavItem } from "../types";

/** CNSO enabled modules (orden de presentación en sidebar). */
export const cnsoModules: ClubModulesConfig = {
  enabled: [
    "dashboard",
    "cnso-direccion",
    "cnso-calle-de-agua",
    "cnso-mi-dia",
    "cnso-socio",
    "cnso-sedes",
    "cnso-secciones",
    "cnso-competiciones",
    "cnso-resumen",
    "cnso-tecnicos",
    "cnso-sustituciones",
    "cnso-incidencias",
    "cnso-calles",
    "cnso-vacaciones",
    "cnso-centro-datos",
    "cnso-tecnificacion",
    "cnso-formacion",
    "cnso-plus",
    "cnso-copiloto",
  ],
};

// Reglas de visibilidad CNSO (espejo del patrón SAITO/RGCC):
//  · Dirección / Administración → ADMIN (manager + admin).
//  · Entrenador (mobile-only en sidebar) → ADMIN_COACH para operativa diaria.
//  · Staff médico → solo lo suyo: Secciones (contexto nadadores), Incidencias y Copiloto.
//  · Socio/Atleta (mobile-only) → no aparece en sidebar.
const ADMIN: import("@/lib/types").Role[] = ["sysadmin", "admin", "manager"];
const ADMIN_COACH: import("@/lib/types").Role[] = [...ADMIN, "technical"];
const ADMIN_COACH_MEDICAL: import("@/lib/types").Role[] = [...ADMIN_COACH, "medical"];
const MEDICAL_OPS: import("@/lib/types").Role[] = [...ADMIN, "technical", "medical"];

/** Sidebar items para CNSO. Todos rutean a `/cnso/$slug` (placeholder con vista
 *  específica por slug). */
export const cnsoNavItems: ClubNavItem[] = [
  { module: "dashboard", label: "Dashboard", icon: "LayoutGrid", to: "/dashboard" },
  {
    module: "cnso-direccion",
    label: "Dirección",
    icon: "Briefcase",
    to: "/cnso/$slug",
    slug: "direccion",
    allowedRoles: ADMIN,
  },
  {
    module: "cnso-calle-de-agua",
    label: "Calle de agua",
    icon: "Waves",
    to: "/cnso/$slug",
    slug: "calle-de-agua",
    allowedRoles: ADMIN_COACH,
  },
  {
    module: "cnso-mi-dia",
    label: "Mi Día",
    icon: "Sun",
    to: "/cnso/$slug",
    slug: "mi-dia",
    allowedRoles: ADMIN_COACH,
  },
  {
    module: "cnso-socio",
    label: "Socio",
    icon: "UserCircle",
    to: "/cnso/$slug",
    slug: "socio",
    allowedRoles: ADMIN,
  },
  {
    module: "cnso-sedes",
    label: "Sedes",
    icon: "MapPin",
    to: "/cnso/$slug",
    slug: "sedes",
    allowedRoles: ADMIN,
  },
  {
    module: "cnso-secciones",
    label: "Secciones",
    icon: "Layers",
    to: "/cnso/$slug",
    slug: "secciones",
    allowedRoles: ADMIN_COACH_MEDICAL,
  },
  {
    module: "cnso-competiciones",
    label: "Competiciones",
    icon: "Trophy",
    to: "/cnso/$slug",
    slug: "competiciones",
    allowedRoles: ADMIN_COACH,
  },
  {
    module: "cnso-resumen",
    label: "Resumen",
    icon: "FileBarChart",
    to: "/cnso/$slug",
    slug: "resumen",
    allowedRoles: ADMIN,
  },
  {
    module: "cnso-tecnicos",
    label: "Equipo técnico",
    icon: "Users",
    to: "/cnso/$slug",
    slug: "tecnicos",
    allowedRoles: ADMIN,
  },
  {
    module: "cnso-sustituciones",
    label: "Sustituciones",
    icon: "Repeat",
    to: "/cnso/$slug",
    slug: "sustituciones",
    allowedRoles: ADMIN_COACH,
  },
  {
    module: "cnso-incidencias",
    label: "Incidencias",
    icon: "AlertTriangle",
    to: "/cnso/$slug",
    slug: "incidencias",
    allowedRoles: MEDICAL_OPS,
  },
  {
    module: "cnso-calles",
    label: "Calles & Salas",
    icon: "DoorOpen",
    to: "/cnso/$slug",
    slug: "calles",
    allowedRoles: ADMIN,
  },
  {
    module: "cnso-vacaciones",
    label: "Vacaciones",
    icon: "Palmtree",
    to: "/cnso/$slug",
    slug: "vacaciones",
    allowedRoles: ADMIN_COACH,
  },
  {
    module: "cnso-centro-datos",
    label: "Centro Datos",
    icon: "Database",
    to: "/cnso/$slug",
    slug: "centro-datos",
    allowedRoles: ADMIN,
  },
  {
    module: "cnso-tecnificacion",
    label: "Tecnificación",
    icon: "Dumbbell",
    to: "/cnso/$slug",
    slug: "tecnificacion",
    allowedRoles: ADMIN_COACH,
  },
  {
    module: "cnso-formacion",
    label: "Formación nadadores",
    icon: "BookOpen",
    to: "/cnso/$slug",
    slug: "formacion",
    allowedRoles: ADMIN_COACH,
  },
  {
    module: "cnso-plus",
    label: "CNSO Plus",
    icon: "Sparkles",
    to: "/cnso/$slug",
    slug: "plus",
    allowedRoles: ADMIN,
  },
  {
    module: "cnso-copiloto",
    label: "Copiloto",
    icon: "Bot",
    to: "/cnso/$slug",
    slug: "copiloto",
    allowedRoles: ADMIN_COACH_MEDICAL,
  },
];
