import type { ClubSeed } from "../types";

// Initial seed for RGCC. `live: true` flags this tenant as a real club, so
// dashboards/queries should never inject SAITO demo data.
// Real sport sections will be loaded from the database; this is just a
// reference of what the org is expected to contain on first onboarding.
export const rgccSeed: ClubSeed = {
  live: true,
  data: {
    sportSections: [
      "Natación",
      "Tenis",
      "Pádel",
      "Hockey hierba",
      "Atletismo",
      "Gimnasia",
      "Baloncesto",
      "Fútbol",
    ],
  },
};
