// GFF-scoped string table. Keys are stable; values may be in Arabic or English
// depending on the surface. Used inside the GFF workspace only.
export const gffTranslations = {
  workspaceLabel: {
    ar: "مساحة عمل تجريبية · اتحاد وبيانات افتراضية",
    en: "Demo workspace · Fictional federation and data",
  },
  badgeArabic: "اتحاد كرة القدم الخليجي",
  badgeEnglish: "GULF FOOTBALL FEDERATION",
} as const;

export type GffTranslationKey = keyof typeof gffTranslations;
