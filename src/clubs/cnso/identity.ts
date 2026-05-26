// CNSO identity — resuelve el perfil operativo del usuario dentro del club.
import type { Role } from "@/lib/types";
import { CNSO_MEMBERS, CNSO_COACHES } from "./seed";

export type CnsoScope = "direccion" | "tecnico" | "socio";
export type CnsoKind = "admin" | "coach" | "member";

export type CnsoIdentity = {
  kind: CnsoKind;
  scope: CnsoScope;
  displayName: string;
  coachName?: string;
  memberNumber?: string;
  memberName?: string;
};

type CnsoUserLike = { id: string; email?: string | null } | null | undefined;

const ADMIN_ROLES: Role[] = ["sysadmin", "admin", "manager"];

const DEMO_OVERRIDES: Record<string, Partial<CnsoIdentity>> = {
  "u-tec": { kind: "coach", scope: "tecnico", coachName: "Iván Méndez", displayName: "Iván Méndez" },
  "u-ath-nadia": {
    kind: "coach",
    scope: "tecnico",
    coachName: "Marta Solís",
    displayName: "Marta Solís",
  },
  "u-med": {
    kind: "member",
    scope: "socio",
    memberNumber: "CNSO-04212",
    memberName: "Marta Fernández",
    displayName: "Marta Fernández",
  },
};

function resolveByRole(roles: Role[]): { kind: CnsoKind; scope: CnsoScope } {
  if (roles.some((r) => ADMIN_ROLES.includes(r))) {
    return { kind: "admin", scope: "direccion" };
  }
  if (roles.includes("technical")) return { kind: "coach", scope: "tecnico" };
  return { kind: "member", scope: "socio" };
}

export function resolveCnsoIdentity(user: CnsoUserLike, roles: Role[]): CnsoIdentity {
  const base = resolveByRole(roles);

  if (user?.id && DEMO_OVERRIDES[user.id]) {
    const ov = DEMO_OVERRIDES[user.id];
    return {
      kind: ov.kind ?? base.kind,
      scope: ov.scope ?? base.scope,
      displayName: ov.displayName ?? user.email ?? user.id,
      coachName: ov.coachName,
      memberNumber: ov.memberNumber,
      memberName: ov.memberName,
    };
  }

  if (base.kind === "coach") {
    const fallback = CNSO_COACHES[0]?.name ?? "Entrenador";
    return { kind: "coach", scope: "tecnico", coachName: fallback, displayName: fallback };
  }
  if (base.kind === "member") {
    const m = CNSO_MEMBERS[0];
    const fullName = m ? `${m.firstName} ${m.lastName}`.trim() : "Socio";
    return {
      kind: "member",
      scope: "socio",
      memberNumber: m?.memberNumber ?? "CNSO-00000",
      memberName: fullName,
      displayName: fullName,
    };
  }
  return { kind: "admin", scope: "direccion", displayName: user?.email ?? "Dirección" };
}
