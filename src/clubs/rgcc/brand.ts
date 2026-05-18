import type { ClubBrand } from "../types";

// RGCC se presenta como CLUB PARTICIPANTE en SAITO.
// Sin overrides de logo/colores/avatar IA: hereda toda la identidad visual de SAITO
// (logo SAITO, paleta SAITO por rol, avatar IA SAITO). Solo se conserva el nombre
// del club para etiquetado en la UI (selector de club, breadcrumb, fixtures).
export const rgccBrand: ClubBrand = {
  name: "Real Grupo de Cultura Covadonga",
  shortName: "RGCC",
  defaultLanguage: "es",
};
