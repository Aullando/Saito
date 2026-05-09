import { describe, it, expect } from "vitest";
import { getRgccView, getRgccMiDiaView, isRgccAdmin, isRgccCoach } from "./permissions";
import type { Role } from "@/lib/types";

describe("RGCC permissions", () => {
  const cases: Array<{
    role: Role;
    view: ReturnType<typeof getRgccView>;
    miDia: ReturnType<typeof getRgccMiDiaView>;
  }> = [
    { role: "sysadmin", view: "cockpit", miDia: "monitor" },
    { role: "admin", view: "cockpit", miDia: "monitor" },
    { role: "manager", view: "cockpit", miDia: "monitor" },
    { role: "technical", view: "coach", miDia: "monitor" },
    { role: "medical", view: "member", miDia: "member" },
  ];

  it.each(cases)("role $role → view=$view, mi-día=$miDia", ({ role, view, miDia }) => {
    expect(getRgccView([role])).toBe(view);
    expect(getRgccMiDiaView([role])).toBe(miDia);
  });

  it("falls back to member view with no roles", () => {
    expect(getRgccView([])).toBe("member");
    expect(getRgccMiDiaView([])).toBe("member");
  });

  it("admin precedence over coach when both present", () => {
    expect(getRgccView(["technical", "admin"])).toBe("cockpit");
  });

  it("isRgccAdmin / isRgccCoach helpers", () => {
    expect(isRgccAdmin(["admin"])).toBe(true);
    expect(isRgccAdmin(["technical"])).toBe(false);
    expect(isRgccCoach(["technical"])).toBe(true);
    expect(isRgccCoach(["medical"])).toBe(false);
  });
});
