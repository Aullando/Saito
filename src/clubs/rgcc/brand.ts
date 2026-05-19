import type { ClubBrand } from "../types";
import logoRgcc from "./assets/logo-rgcc.png";
import rgccMascot from "./assets/rgcc-ai.png";

// RGCC se presenta como club participante en SAITO, pero con su propia
// identidad visual: logo oficial del club y mascota como avatar del asistente IA.
export const rgccBrand: ClubBrand = {
  name: "Real Grupo de Cultura Covadonga",
  shortName: "RGCC",
  defaultLanguage: "es",
  logoFull: logoRgcc,
  logoMark: logoRgcc,
  aiAvatar: rgccMascot,
};
