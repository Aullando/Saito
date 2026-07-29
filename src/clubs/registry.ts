import type { ClubConfig, ClubModuleId } from "./types";
import { saitoClub } from "./saito";
import { rgccClub } from "./rgcc";
import { gffClub } from "./gff";

// CNSO ha sido eliminado. RGCC y GFF permanecen registrados (rutas y código
// activos) pero ocultos de los selectores visibles — solo SAITO se expone.
export const CLUBS: Record<string, ClubConfig> = {
  [saitoClub.id]: saitoClub,
  [rgccClub.id]: rgccClub,
  [gffClub.id]: gffClub,
};

export const DEFAULT_CLUB_ID = saitoClub.id;
/** Clubes visibles en la UI (selectores). El resto se resuelven vía slug de org. */
export const VISIBLE_CLUB_IDS: string[] = [saitoClub.id];

/**
 * Resolve a club config by its stable id (which matches the org slug in DB).
 * Falls back to the SAITO default so the app never crashes on an unknown tenant.
 */
export function getClubConfig(id: string | null | undefined): ClubConfig {
  if (!id) return CLUBS[DEFAULT_CLUB_ID];
  return CLUBS[id] ?? CLUBS[DEFAULT_CLUB_ID];
}

export function isModuleEnabled(club: ClubConfig, mod: ClubModuleId): boolean {
  return club.modules.enabled.includes(mod);
}

export type { ClubConfig, ClubModuleId } from "./types";
