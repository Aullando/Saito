// Tenant / Club configuration layer.
// Each club is a tenant of the SAITO platform with its own branding,
// visible modules and (optional) seed data.

export type ClubModuleId =
  | "dashboard"
  | "club"
  | "calendar"
  | "athletes"
  | "economic"
  | "communication"
  | "medical"
  | "settings";

export interface ClubBrand {
  /** Display name shown in topbar / titles */
  name: string;
  /** Short tag (e.g. "RGCC") */
  shortName: string;
  /** Optional logo URL or imported asset path. If omitted → SAITO default logo */
  logoUrl?: string;
  /** Primary brand color in oklch (overrides --primary token at runtime) */
  primary?: string;
  /** Optional accent color in oklch */
  accent?: string;
  /** Default UI language */
  defaultLanguage: "es" | "en";
}

export interface ClubModulesConfig {
  /** Module ids enabled for this club. Order is informational. */
  enabled: ClubModuleId[];
}

export interface ClubSeed {
  /** Marks club as live (real data) vs demo (seed data only) */
  live: boolean;
  /** Optional seed payload — clubs can ship their own demo data */
  data?: unknown;
}

export interface ClubConfig {
  /** Stable id, used as URL slug & DB organization slug */
  id: string;
  brand: ClubBrand;
  modules: ClubModulesConfig;
  seed: ClubSeed;
}
