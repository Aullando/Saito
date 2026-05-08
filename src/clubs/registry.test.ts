import { describe, it, expect } from "vitest";
import { CLUBS, DEFAULT_CLUB_ID, getClubConfig, isModuleEnabled } from "./registry";
import { rgccNavItems } from "./rgcc/modules";

describe("Club registry & switcher", () => {
  it("registers SAITO and RGCC", () => {
    expect(Object.keys(CLUBS).sort()).toEqual(["rgcc", "saito"]);
    expect(DEFAULT_CLUB_ID).toBe("saito");
  });

  it("getClubConfig falls back to SAITO for unknown ids", () => {
    expect(getClubConfig(null).id).toBe("saito");
    expect(getClubConfig("ghost-club").id).toBe("saito");
    expect(getClubConfig("rgcc").id).toBe("rgcc");
  });

  it("RGCC has its own modules and SAITO does not", () => {
    expect(isModuleEnabled(CLUBS.rgcc, "rgcc-clases")).toBe(true);
    expect(isModuleEnabled(CLUBS.rgcc, "rgcc-mi-dia")).toBe(true);
    expect(isModuleEnabled(CLUBS.saito, "rgcc-clases")).toBe(false);
    expect(isModuleEnabled(CLUBS.saito, "calendar")).toBe(true);
  });
});

describe("RGCC navigation", () => {
  it("every nav item targets an enabled module", () => {
    const enabled = new Set(CLUBS.rgcc.modules.enabled);
    for (const item of rgccNavItems) {
      expect(enabled.has(item.module)).toBe(true);
    }
  });

  it("Clases and Mi Día are reachable through dedicated routes", () => {
    const clases = rgccNavItems.find((n) => n.module === "rgcc-clases");
    const miDia = rgccNavItems.find((n) => n.module === "rgcc-mi-dia");
    expect(clases?.to).toBe("/rgcc/clases");
    expect(miDia?.to).toBe("/rgcc/mi-dia");
  });
});
