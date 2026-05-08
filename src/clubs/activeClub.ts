import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CLUBS, DEFAULT_CLUB_ID } from "./registry";

interface ActiveClubState {
  /** Manual override of the active club id. Null = follow user's organization. */
  overrideClubId: string | null;
  switchClub: (id: string | null) => void;
}

export const useActiveClubStore = create<ActiveClubState>()(
  persist(
    (set) => ({
      overrideClubId: null,
      switchClub: (id) =>
        set({ overrideClubId: id && CLUBS[id] ? id : null }),
    }),
    { name: "saito-active-club" },
  ),
);

export const AVAILABLE_CLUBS = Object.values(CLUBS);
export { DEFAULT_CLUB_ID };
