// Default SAITO tenant: the platform itself + its demo club.
// Keeps every module enabled and stays in "demo" mode.
import type { ClubConfig } from "../types";

export const saitoClub: ClubConfig = {
  id: "saito",
  brand: {
    name: "SAITO",
    shortName: "SAITO",
    defaultLanguage: "es",
  },
  modules: {
    enabled: [
      "dashboard",
      "club",
      "calendar",
      "athletes",
      "economic",
      "communication",
      "medical",
      "settings",
    ],
  },
  seed: { live: false },
};
