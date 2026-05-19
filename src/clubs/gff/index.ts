import type { ClubConfig } from "../types";
import { gffBrand } from "./brand";
import { gffModules, gffNavItems } from "./modules";
import { gffSeed } from "./seed";

export const gffClub: ClubConfig = {
  id: "gff-demo",
  brand: gffBrand,
  modules: gffModules,
  navItems: gffNavItems,
  seed: gffSeed,
  workspace: {
    locale: "ar-AE",
    direction: "rtl",
    className: "workspace-gff workspace-rtl",
    weekendDays: [6, 0],
    demoLabel: "مساحة عمل تجريبية · اتحاد وبيانات افتراضية",
  },
};

export { GFFBadge } from "./GFFBadge";
export { GffGuard } from "./GffGuard";
export { gffTranslations } from "./translations";
