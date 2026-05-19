// Tenant / Club configuration layer.

export type ClubModuleId =
  // SAITO core modules
  | "dashboard"
  | "club"
  | "calendar"
  | "athletes"
  | "economic"
  | "communication"
  | "medical"
  | "settings"
  // RGCC modules
  | "rgcc-direccion"
  | "rgcc-clases"
  | "rgcc-mi-dia"
  | "rgcc-socio"
  | "rgcc-sedes"
  | "rgcc-secciones"
  | "rgcc-resumen"
  | "rgcc-monitores"
  | "rgcc-sustituciones"
  | "rgcc-incidencias"
  | "rgcc-salas"
  | "rgcc-vacaciones"
  | "rgcc-centro-datos"
  | "rgcc-pt"
  | "rgcc-biblioteca"
  | "rgcc-quiosco"
  | "rgcc-copiloto"
  // GFF modules
  | "gff-national-teams"
  | "gff-calendar"
  | "gff-clubs"
  | "gff-development"
  | "gff-reporting"
  | "gff-administration";

export interface ClubBrand {
  name: string;
  shortName: string;
  logoFull?: string;
  logoMark?: string;
  aiAvatar?: string;
  primary?: string;
  accent?: string;
  defaultLanguage: "es" | "en";
}

export interface ClubModulesConfig {
  enabled: ClubModuleId[];
}

/** Per-club nav item. If a club provides `navItems`, the sidebar uses them
 *  instead of the default SAITO role-based menu. */
export interface ClubNavItem {
  module: ClubModuleId;
  label: string;
  /** lucide-react icon name */
  icon: string;
  /** Route. Use "/rgcc/$slug" for placeholder modules (uses `slug`). */
  to: string;
  slug?: string;
  indent?: boolean;
  /** If set, only these roles see this nav item. Omit = visible to all. */
  allowedRoles?: import("@/lib/types").Role[];
}

export interface ClubSeed {
  live: boolean;
  data?: unknown;
}

export interface ClubConfig {
  id: string;
  brand: ClubBrand;
  modules: ClubModulesConfig;
  navItems?: ClubNavItem[];
  seed: ClubSeed;
}
