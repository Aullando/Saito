// Pure role-resolution helpers for RGCC module screens.
// Centralised so the rgcc.* routes and tests share the same logic.
import type { Role } from "@/lib/types";

export type RgccView = "cockpit" | "coach" | "member";

const ADMIN_ROLES: Role[] = ["sysadmin", "admin", "manager"];

export function isRgccAdmin(roles: Role[]): boolean {
  return roles.some((r) => ADMIN_ROLES.includes(r));
}

export function isRgccCoach(roles: Role[]): boolean {
  return roles.includes("technical");
}

/**
 * Decide which RGCC sub-view to render for the given roles.
 *
 * Precedence:
 *   sysadmin/admin/manager → cockpit (full operational view)
 *   technical              → coach (own classes / EP only)
 *   medical / member / no role → member (read-only socio view)
 *
 * The medical role intentionally falls into the member view: medical staff
 * should not manage classes or EP sessions.
 */
export function getRgccView(roles: Role[]): RgccView {
  if (isRgccAdmin(roles)) return "cockpit";
  if (isRgccCoach(roles)) return "coach";
  return "member";
}

/**
 * Special-case for "Mi Día": both monitors and admins see the monitor agenda
 * (admins also get a link back to the cockpit).
 */
export function getRgccMiDiaView(roles: Role[]): "monitor" | "member" {
  if (isRgccAdmin(roles) || isRgccCoach(roles)) return "monitor";
  return "member";
}
