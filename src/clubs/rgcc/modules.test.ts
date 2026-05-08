import { describe, it, expect } from "vitest";
import { rgccNavItems } from "./modules";
import type { Role } from "@/lib/types";

function visibleFor(role: Role) {
  return rgccNavItems
    .filter((n) => !n.allowedRoles || n.allowedRoles.includes(role))
    .map((n) => n.module);
}

describe("RGCC sidebar visibility per role", () => {
  it("admin sees full operational menu", () => {
    const v = visibleFor("admin");
    expect(v).toContain("rgcc-direccion");
    expect(v).toContain("rgcc-monitores");
    expect(v).toContain("rgcc-centro-datos");
    expect(v).toContain("rgcc-mi-dia");
  });

  it("technical (coach) sees Mi Día + ops shared but NOT Dirección/Monitores/Centro Datos", () => {
    const v = visibleFor("technical");
    expect(v).toContain("rgcc-mi-dia");
    expect(v).toContain("rgcc-clases");
    expect(v).toContain("rgcc-incidencias");
    expect(v).toContain("rgcc-sustituciones");
    expect(v).not.toContain("rgcc-direccion");
    expect(v).not.toContain("rgcc-monitores");
    expect(v).not.toContain("rgcc-centro-datos");
    expect(v).not.toContain("rgcc-resumen");
    expect(v).not.toContain("rgcc-salas");
  });

  it("medical only sees socio-style modules (no class management)", () => {
    const v = visibleFor("medical");
    expect(v).toContain("rgcc-socio");
    expect(v).toContain("rgcc-biblioteca");
    expect(v).toContain("rgcc-clases"); // member view
    expect(v).not.toContain("rgcc-mi-dia");
    expect(v).not.toContain("rgcc-monitores");
    expect(v).not.toContain("rgcc-sustituciones");
    expect(v).not.toContain("rgcc-incidencias");
    expect(v).not.toContain("rgcc-centro-datos");
  });

  it("sysadmin sees everything", () => {
    expect(visibleFor("sysadmin").length).toBe(rgccNavItems.length);
  });
});
