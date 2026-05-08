import type { ClubBrand } from "../types";
import logoFull from "./assets/logo-rgcc.svg";
import logoMark from "./assets/logo-rgcc.svg";
import aiAvatar from "./assets/rgcc-ai.png";

export const rgccBrand: ClubBrand = {
  name: "Real Grupo de Cultura Covadonga",
  shortName: "RGCC",
  // Covadonga's traditional colors: deep blue + gold.
  primary: "oklch(0.42 0.15 255)",
  accent: "oklch(0.78 0.14 85)",
  defaultLanguage: "es",
  logoFull,
  logoMark,
  aiAvatar,
};
