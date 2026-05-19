import type { ClubBrand } from "../types";
import gffBadge from "./assets/gff-badge.svg";

// Gulf Football Federation (demo). Identidad visual scopeada al workspace GFF
// — no aplicamos primary/accent globales para no alterar el header/sidebar
// de SAITO. El verde/dorado se aplica vía clases CSS dentro del workspace.
export const gffBrand: ClubBrand = {
  name: "Gulf Football Federation",
  shortName: "GFF",
  defaultLanguage: "en",
  logoFull: gffBadge,
  logoMark: gffBadge,
  aiAvatar: gffBadge,
};
