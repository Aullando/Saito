import { describe, it, expect } from "vitest";
import { rgccSeed, RGCC_SESSIONS, RGCC_VENUES, RGCC_MEMBERS, RGCC_COACHES } from "./seed";

describe("RGCC seed", () => {
  it("is marked as live and has data buckets", () => {
    expect(rgccSeed.live).toBe(true);
    expect(rgccSeed.data).toBeDefined();
  });

  it("every session is tagged clubId rgcc", () => {
    expect(RGCC_SESSIONS.length).toBeGreaterThan(0);
    for (const s of RGCC_SESSIONS) expect(s.clubId).toBe("rgcc");
  });

  it("venues, members and coaches are non-empty and tagged", () => {
    expect(RGCC_VENUES.length).toBeGreaterThan(0);
    expect(RGCC_MEMBERS.length).toBeGreaterThan(0);
    expect(RGCC_COACHES.length).toBeGreaterThan(0);
    for (const v of RGCC_VENUES) expect(v.clubId).toBe("rgcc");
  });

  it("session venueIds reference existing venues", () => {
    const ids = new Set(RGCC_VENUES.map((v) => v.id));
    for (const s of RGCC_SESSIONS) expect(ids.has(s.venueId)).toBe(true);
  });
});
