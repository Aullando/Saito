import { useClub } from "@/clubs/ClubProvider";

// ============================================================================
// GFF translations. Each key maps to { ar, en }. Arabic is the primary
// language inside the GFF workspace; English/transliteration is the fallback.
// ============================================================================

export const gffTranslations = {
  workspaceLabel: {
    ar: "مساحة عمل تجريبية · اتحاد وبيانات افتراضية",
    en: "Demo workspace · Fictional federation and data",
  },
  badgeArabic: { ar: "اتحاد كرة القدم الخليجي", en: "اتحاد كرة القدم الخليجي" },
  badgeEnglish: { ar: "GULF FOOTBALL FEDERATION", en: "GULF FOOTBALL FEDERATION" },
} as const;

export type GffWorkspaceKey = keyof typeof gffTranslations;

// Federation-wide string table, used across the GFF workspace surfaces.
export const federationTranslations = {
  dashboard: { ar: "لوحة التحكم", en: "Dashboard" },
  nationalTeams: { ar: "المنتخبات الوطنية", en: "National teams" },
  seniorTeam: { ar: "المنتخب الأول", en: "Senior team" },
  u23Team: { ar: "المنتخب الأولمبي (تحت 23)", en: "Olympic team (U-23)" },
  internationalCalendar: { ar: "التقويم الدولي", en: "International calendar" },
  affiliatedClubs: { ar: "الأندية المنتسبة", en: "Affiliated clubs" },
  development: { ar: "التطوير", en: "Development" },
  reporting: { ar: "التقارير", en: "Reporting" },
  administration: { ar: "الإدارة", en: "Administration" },
  squad: { ar: "القائمة", en: "Squad" },
  staff: { ar: "الجهاز الفني", en: "Staff" },
  matches: { ar: "المباريات", en: "Matches" },
  statistics: { ar: "الإحصائيات", en: "Statistics" },
  upcomingMatches: { ar: "المباريات القادمة", en: "Upcoming matches" },
  recentMatches: { ar: "المباريات الأخيرة", en: "Recent matches" },
  fifaRanking: { ar: "تصنيف الفيفا", en: "FIFA ranking" },
  afcRanking: { ar: "تصنيف الاتحاد الآسيوي", en: "AFC ranking" },
  registeredPlayers: { ar: "اللاعبون المسجلون", en: "Registered players" },
  affiliatedClubsCount: { ar: "عدد الأندية المنتسبة", en: "Affiliated clubs" },
  youthPlayers: { ar: "لاعبو الناشئين", en: "Youth players" },
  certifiedCoaches: { ar: "المدربون المعتمدون", en: "Certified coaches" },
  affiliatedAcademies: { ar: "الأكاديميات المنتسبة", en: "Affiliated academies" },
  goalsScored: { ar: "الأهداف المسجلة", en: "Goals scored" },
  goalsConceded: { ar: "الأهداف المستقبلة", en: "Goals conceded" },
  wins: { ar: "انتصارات", en: "Wins" },
  draws: { ar: "تعادلات", en: "Draws" },
  losses: { ar: "خسائر", en: "Losses" },
  captain: { ar: "القائد", en: "Captain" },
  headCoach: { ar: "المدرب الرئيسي", en: "Head coach" },
  position: { ar: "المركز", en: "Position" },
  age: { ar: "العمر", en: "Age" },
  home: { ar: "مستضيف", en: "Home" },
  away: { ar: "ضيف", en: "Away" },
  neutral: { ar: "ملعب محايد", en: "Neutral" },
  victory: { ar: "فوز", en: "Victory" },
  draw: { ar: "تعادل", en: "Draw" },
  defeat: { ar: "خسارة", en: "Defeat" },
  friendly: { ar: "مباراة ودية", en: "Friendly" },
  qualifier: { ar: "تصفيات", en: "Qualifier" },
  topScorer: { ar: "الهداف", en: "Top scorer" },
  topAssister: { ar: "صانع الأهداف", en: "Top assister" },
  viewAll: { ar: "عرض الكل", en: "View all" },
  next: { ar: "التالي", en: "Next" },
  previous: { ar: "السابق", en: "Previous" },
  goalkeeper: { ar: "حارس مرمى", en: "Goalkeeper" },
  defender: { ar: "مدافع", en: "Defender" },
  midfielder: { ar: "لاعب وسط", en: "Midfielder" },
  forward: { ar: "مهاجم", en: "Forward" },
  president: { ar: "الرئيس", en: "President" },
  generalSecretary: { ar: "الأمين العام", en: "General Secretary" },
  founded: { ar: "تأسس", en: "Founded" },
} as const;

export type FederationTranslationKey = keyof typeof federationTranslations;
export type FederationLang = "ar" | "en";

/**
 * Hook that returns a translator scoped to the GFF workspace.
 * Defaults to Arabic (primary language inside the GFF workspace);
 * falls back to English if a key has no Arabic value.
 */
export function useGffTranslation() {
  const { club } = useClub();
  const dir = club.workspace?.direction ?? "ltr";
  // Inside the GFF workspace (RTL), default to Arabic. In any other context,
  // fall back to English so leaked usage doesn't render mojibake.
  const lang: FederationLang = club.id === "gff-demo" || dir === "rtl" ? "ar" : "en";

  function t(key: FederationTranslationKey, override?: FederationLang): string {
    const entry = federationTranslations[key];
    const chosen = override ?? lang;
    return entry[chosen] ?? entry.en;
  }

  function tw(key: GffWorkspaceKey, override?: FederationLang): string {
    const entry = gffTranslations[key];
    const chosen = override ?? lang;
    return entry[chosen] ?? entry.en;
  }

  return { t, tw, lang, dir };
}
