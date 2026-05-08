// RGCC identity layer — resuelve la identidad operativa de un usuario SAITO
// dentro del club RGCC, sin depender de profile.full_name como clave.
//
// Mapeo demo (overrides explícitos por user.id):
//   - u-tec        → coach "Sheila"
//   - u-ath-nadia  → coach "Maria A C"
//   - u-med        → member RGCC-04212 (Marta Fernández)
//
// Para el resto de usuarios:
//   - sysadmin/admin/manager → kind "admin",  alcance "coordinacion"
//   - technical              → kind "coach",  alcance "monitor"
//   - medical / resto        → kind "member", alcance "socio"
import type { Role } from "@/lib/types";
import { RGCC_MEMBERS, RGCC_COACHES } from "./seed";

export type RgccScope = "coordinacion" | "monitor" | "socio";
export type RgccKind = "admin" | "coach" | "member";

export type RgccIdentity = {
  kind: RgccKind;
  scope: RgccScope;
  /** Display name preferido para el club (no para escribir queries). */
  displayName: string;
  /** Sólo para kind="coach". Nombre canónico del monitor en RGCC. */
  coachName?: string;
  /** Sólo para kind="member". Número de socio canónico. */
  memberNumber?: string;
  /** Sólo para kind="member". Nombre del socio (Marta Fernández, etc.). */
  memberName?: string;
};

type RgccUserLike = { id: string; email?: string | null } | null | undefined;

const ADMIN_ROLES: Role[] = ["sysadmin", "admin", "manager"];

/** Mapeo demo determinista por user.id → identidad RGCC. */
const DEMO_OVERRIDES: Record<string, Partial<RgccIdentity>> = {
  "u-tec": { kind: "coach", scope: "monitor", coachName: "Sheila", displayName: "Sheila" },
  "u-ath-nadia": { kind: "coach", scope: "monitor", coachName: "Maria A C", displayName: "Maria A C" },
  "u-med": {
    kind: "member",
    scope: "socio",
    memberNumber: "RGCC-04212",
    memberName: "Marta Fernández",
    displayName: "Marta Fernández",
  },
};

function resolveByRole(roles: Role[]): { kind: RgccKind; scope: RgccScope } {
  if (roles.some((r) => ADMIN_ROLES.includes(r))) {
    return { kind: "admin", scope: "coordinacion" };
  }
  if (roles.includes("technical")) {
    return { kind: "coach", scope: "monitor" };
  }
  return { kind: "member", scope: "socio" };
}

export function resolveRgccIdentity(user: RgccUserLike, roles: Role[]): RgccIdentity {
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

  // Sin override: para coach intentamos primer monitor del seed; para socio,
  // primer socio del seed. Esto evita usar full_name como clave pero deja una
  // identidad utilizable en demo.
  if (base.kind === "coach") {
    const fallback = RGCC_COACHES[0]?.name ?? "Monitor";
    return {
      kind: "coach",
      scope: "monitor",
      coachName: fallback,
      displayName: fallback,
    };
  }
  if (base.kind === "member") {
    const m = RGCC_MEMBERS[0];
    const fullName = m ? `${m.firstName} ${m.lastName}`.trim() : "Socio";
    return {
      kind: "member",
      scope: "socio",
      memberNumber: m?.memberNumber ?? "RGCC-00000",
      memberName: fullName,
      displayName: fullName,
    };
  }
  return {
    kind: "admin",
    scope: "coordinacion",
    displayName: user?.email ?? "Coordinación",
  };
}
