import type { ClubModulesConfig } from "../types";

// RGCC starts with the core operational modules. Medical/settings remain
// available; trim here if the real club doesn't want them yet.
export const rgccModules: ClubModulesConfig = {
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
};
