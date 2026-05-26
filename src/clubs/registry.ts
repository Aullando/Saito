import type { ClubConfig, ClubModuleId } from "./types";
import { saitoClub } from "./saito";
import { rgccClub } from "./rgcc";
import { gffClub } from "./gff";
import { cnsoClub } from "./cnso";

export const CLUBS: Record<string, ClubConfig> = {
  [saitoClub.id]: saitoClub,
  [rgccClub.id]: rgccClub,
  [gffClub.id]: gffClub,
  [cnsoClub.id]: cnsoClub,
};

export const DEFAULT_CLUB_ID = saitoClub.id;

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
