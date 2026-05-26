import type { ClubBrand } from "../types";
import logoCnso from "./assets/logo-cnso.png";
import logoMark from "./assets/logo-cnso-mark.png";

// Club Natación Santa Olaya — identidad corporativa extraída de cnsantaolaya.org.
// Azul corporativo del escudo y verde lima de la equipación oficial.
export const cnsoBrand: ClubBrand = {
  name: "Club Natación Santa Olaya",
  shortName: "CNSO",
  defaultLanguage: "es",
  logoFull: logoCnso,
  logoMark,
  primary: "#0D688E",
  accent: "#00B96B",
};
