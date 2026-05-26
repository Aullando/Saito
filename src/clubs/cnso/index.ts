import type { ClubConfig } from "../types";
import { cnsoBrand } from "./brand";
import { cnsoModules, cnsoNavItems } from "./modules";
import { cnsoSeed } from "./seed";

export const cnsoClub: ClubConfig = {
  id: "cnso",
  brand: cnsoBrand,
  modules: cnsoModules,
  navItems: cnsoNavItems,
  seed: cnsoSeed,
};
