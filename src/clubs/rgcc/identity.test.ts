// Tests para la capa de identidad RGCC y el contexto de IA por alcance.
import { describe, it, expect } from "vitest";
import { resolveRgccIdentity } from "./identity";
import { buildRgccContextFromIdentity } from "./aiContext";
import type { Role } from "@/lib/types";

describe("resolveRgccIdentity", () => {
  it("u-tec resuelve a coach Sheila", () => {
    const id = resolveRgccIdentity({ id: "u-tec", email: "x@x" }, ["technical"] as Role[]);
    expect(id.kind).toBe("coach");
    expect(id.scope).toBe("monitor");
    expect(id.coachName).toBe("Sheila");
  });

  it("u-ath-nadia resuelve a coach Maria A C", () => {
    const id = resolveRgccIdentity({ id: "u-ath-nadia", email: "x@x" }, ["technical"] as Role[]);
    expect(id.coachName).toBe("Maria A C");
  });

  it("u-med resuelve a member RGCC-04212 (Marta Fernández)", () => {
    const id = resolveRgccIdentity({ id: "u-med", email: "x@x" }, ["medical"] as Role[]);
    expect(id.kind).toBe("member");
    expect(id.scope).toBe("socio");
    expect(id.memberNumber).toBe("RGCC-04212");
    expect(id.memberName).toBe("Marta Fernández");
  });

  it("admin/manager/sysadmin → coordinacion", () => {
    expect(resolveRgccIdentity({ id: "x", email: "" }, ["admin"]).scope).toBe("coordinacion");
    expect(resolveRgccIdentity({ id: "x", email: "" }, ["manager"]).scope).toBe("coordinacion");
    expect(resolveRgccIdentity({ id: "x", email: "" }, ["sysadmin"]).scope).toBe("coordinacion");
  });
});

describe("buildRgccContextFromIdentity", () => {
  it("monitor (u-tec) NO recibe contexto global (clasesHoy/monitores/sociosTotales)", () => {
    const id = resolveRgccIdentity({ id: "u-tec", email: "" }, ["technical"]);
    const ctx = buildRgccContextFromIdentity(id) as Record<string, unknown>;
    expect(ctx.alcance).toBe("monitor");
    expect("clasesHoy" in ctx).toBe(false);
    expect("monitores" in ctx).toBe(false);
    expect("sociosTotales" in ctx).toBe(false);
    // sí debe tener su agenda personal
    expect("misClasesHoy" in ctx).toBe(true);
  });

  it("socio (u-med) NO recibe monitores ni workouts de otros socios", () => {
    const id = resolveRgccIdentity({ id: "u-med", email: "" }, ["medical"]);
    const ctx = buildRgccContextFromIdentity(id) as Record<string, unknown>;
    expect(ctx.alcance).toBe("socio");
    expect("monitores" in ctx).toBe(false);
    expect("clasesHoy" in ctx).toBe(false);
    const myWorkouts = ctx.misWorkouts as { memberNumber: string }[];
    expect(myWorkouts.length).toBeGreaterThan(0);
    for (const w of myWorkouts) {
      expect(w.memberNumber).toBe("RGCC-04212");
    }
  });

  it("coordinacion recibe cockpit completo", () => {
    const id = resolveRgccIdentity({ id: "u-admin", email: "" }, ["admin"]);
    const ctx = buildRgccContextFromIdentity(id) as Record<string, unknown>;
    expect(ctx.alcance).toBe("coordinacion");
    expect(Array.isArray(ctx.monitores)).toBe(true);
    expect(typeof ctx.sociosTotales).toBe("number");
  });
});
