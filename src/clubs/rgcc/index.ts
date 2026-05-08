import type { ClubConfig } from "../types";
import { rgccBrand } from "./brand";
import { rgccModules, rgccNavItems } from "./modules";
import { rgccSeed } from "./seed";

export const rgccClub: ClubConfig = {
  id: "rgcc",
  brand: rgccBrand,
  modules: rgccModules,
  navItems: rgccNavItems,
  seed: rgccSeed,
};
