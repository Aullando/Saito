// RGCC seed — aggregator. All entities are tagged with clubId: "rgcc"
// and live in /seed/*. Source: covadonga-hub demo data, mapped to the
// SAITO domain (sessions, members, coaches, venues, library, etc.).

import type { ClubSeed } from "../types";
import { RGCC_VENUES, RGCC_ROOMS } from "./seed/venues";
import { RGCC_SECTIONS } from "./seed/sections";
import { RGCC_COACHES, RGCC_MEMBERS } from "./seed/people";
import {
  RGCC_SESSIONS, RGCC_INCIDENTS, RGCC_ABSENCES,
} from "./seed/sessions";
import {
  RGCC_EXERCISES, RGCC_ROUTINES, RGCC_PT_SESSIONS, RGCC_WORKOUTS, RGCC_KIT,
} from "./seed/library";

export const rgccSeed: ClubSeed = {
  live: true,
  data: {
    venues: RGCC_VENUES,
    rooms: RGCC_ROOMS,
    sections: RGCC_SECTIONS,
    coaches: RGCC_COACHES,
    members: RGCC_MEMBERS,
    sessions: RGCC_SESSIONS,
    incidents: RGCC_INCIDENTS,
    absences: RGCC_ABSENCES,
    exercises: RGCC_EXERCISES,
    routines: RGCC_ROUTINES,
    ptSessions: RGCC_PT_SESSIONS,
    workouts: RGCC_WORKOUTS,
    kit: RGCC_KIT,
  },
};

// Re-exports so consumers can `import { RGCC_SESSIONS } from "@/clubs/rgcc/seed"`.
export * from "./seed/venues";
export * from "./seed/sections";
export * from "./seed/people";
export * from "./seed/sessions";
export * from "./seed/library";
