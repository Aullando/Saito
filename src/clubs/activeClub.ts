import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CLUBS, DEFAULT_CLUB_ID, VISIBLE_CLUB_IDS } from "./registry";

interface ActiveClubState {
  /** Manual override of the active club id. Null = follow user's organization. */
  overrideClubId: string | null;
  switchClub: (id: string | null) => void;
}

/** Only visible clubs are allowed as override. Legacy IDs (rgcc/gff-demo/cnso)
 *  persisted in localStorage from previous demos are forced back to null so the
 *  active club falls through to the SAITO default. Hidden club code stays put
 *  for potential reactivation — this only blocks *activation* via stale override. */
function normalizeOverride(id: string | null): string | null {
  if (!id) return null;
  if (!CLUBS[id]) return null;
  if (!VISIBLE_CLUB_IDS.includes(id)) return null;
  return id;
}

export const useActiveClubStore = create<ActiveClubState>()(
  persist(
    (set) => ({
      overrideClubId: null,
      switchClub: (id) => set({ overrideClubId: normalizeOverride(id) }),
    }),
    {
      name: "saito-active-club",
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const normalized = normalizeOverride(state.overrideClubId);
        if (normalized !== state.overrideClubId) {
          state.overrideClubId = normalized;
        }
      },
    },
  ),
);

export const AVAILABLE_CLUBS = Object.values(CLUBS);
export { DEFAULT_CLUB_ID };
