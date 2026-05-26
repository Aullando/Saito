// CNSO seed — aggregator. All entities tagged with clubId: "cnso".
import type { ClubSeed } from "../types";
import { CNSO_VENUES, CNSO_ROOMS } from "./seed/venues";
import { CNSO_SECTIONS } from "./seed/sections";
import { CNSO_COACHES, CNSO_MEMBERS } from "./seed/people";
import { CNSO_SESSIONS, CNSO_INCIDENTS, CNSO_ABSENCES } from "./seed/sessions";
import {
  CNSO_DRILLS,
  CNSO_SETS,
  CNSO_CLINIC_SESSIONS,
  CNSO_WORKOUTS,
  CNSO_KIT,
} from "./seed/library";
import { CNSO_COMPETITIONS } from "./seed/competitions";

export const cnsoSeed: ClubSeed = {
  live: true,
  data: {
    venues: CNSO_VENUES,
    rooms: CNSO_ROOMS,
    sections: CNSO_SECTIONS,
    coaches: CNSO_COACHES,
    members: CNSO_MEMBERS,
    sessions: CNSO_SESSIONS,
    incidents: CNSO_INCIDENTS,
    absences: CNSO_ABSENCES,
    drills: CNSO_DRILLS,
    sets: CNSO_SETS,
    clinicSessions: CNSO_CLINIC_SESSIONS,
    workouts: CNSO_WORKOUTS,
    kit: CNSO_KIT,
    competitions: CNSO_COMPETITIONS,
  },
};

export * from "./seed/venues";
export * from "./seed/sections";
export * from "./seed/people";
export * from "./seed/sessions";
export * from "./seed/library";
export * from "./seed/competitions";
