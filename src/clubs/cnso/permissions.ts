import type { Role } from "@/lib/types";

export type CnsoView = "direccion" | "tecnico" | "socio";

const ADMIN_ROLES: Role[] = ["sysadmin", "admin", "manager"];

export function isCnsoAdmin(roles: Role[]): boolean {
  return roles.some((r) => ADMIN_ROLES.includes(r));
}

export function isCnsoCoach(roles: Role[]): boolean {
  return roles.includes("technical");
}

export function getCnsoView(roles: Role[]): CnsoView {
  if (isCnsoAdmin(roles)) return "direccion";
  if (isCnsoCoach(roles)) return "tecnico";
  return "socio";
}
