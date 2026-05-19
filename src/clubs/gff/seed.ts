import type { ClubSeed } from "../types";

// ============================================================================
// Gulf Football Federation — fictional demo dataset.
// All names, clubs, matches and people are invented. No real federation,
// player or staff is represented. No external photos or logos are referenced.
// ============================================================================

export interface GffFederation {
  id: string;
  type: "federation";
  nameAr: string;
  nameLatin: string;
  shortName: string;
  shortNameAr: string;
  countryAr: string;
  countryLatin: string;
  headquartersAr: string;
  headquartersLatin: string;
  founded: number;
  presidentAr: string;
  presidentLatin: string;
  generalSecretaryAr: string;
  generalSecretaryLatin: string;
  mottoAr: string;
  mottoLatin: string;
  affiliatedClubs: number;
  registeredPlayers: number;
  youthPlayers: number;
  affiliatedAcademies: number;
  certifiedCoaches: number;
}

export const gffFederation: GffFederation = {
  id: "gff-demo",
  type: "federation",
  nameAr: "اتحاد كرة القدم الخليجي",
  nameLatin: "Gulf Football Federation",
  shortName: "GFF",
  shortNameAr: "الاتحاد",
  countryAr: "منطقة الخليج",
  countryLatin: "Gulf Region",
  headquartersAr: "مدينة الخليج",
  headquartersLatin: "Madinat Al-Khaleej",
  founded: 1974,
  presidentAr: "الشيخ عبدالله المنصوري",
  presidentLatin: "Sheikh Abdullah Al-Mansoori",
  generalSecretaryAr: "خالد الهاشمي",
  generalSecretaryLatin: "Khalid Al-Hashimi",
  mottoAr: "نحلق عالياً",
  mottoLatin: "Flying higher",
  affiliatedClubs: 16,
  registeredPlayers: 8400,
  youthPlayers: 340,
  affiliatedAcademies: 22,
  certifiedCoaches: 156,
};

// ---------------------------------------------------------------------------
// Teams
// ---------------------------------------------------------------------------

export interface GffTeam {
  id: string;
  nameAr: string;
  nameLatin: string;
  nicknameAr?: string;
  nicknameLatin?: string;
  category: string;
  headCoachAr: string;
  headCoachLatin: string;
  fifaRanking?: number;
  afcRanking?: number;
}

export const gffTeams: GffTeam[] = [
  {
    id: "gff-senior-men",
    nameAr: "المنتخب الوطني الأول",
    nameLatin: "Senior National Team",
    nicknameAr: "الصقور",
    nicknameLatin: "Al-Suqour",
    category: "Senior Men",
    headCoachAr: "كارلوس مينديز",
    headCoachLatin: "Carlos Mendes",
    fifaRanking: 67,
    afcRanking: 9,
  },
  {
    id: "gff-u23-men",
    nameAr: "المنتخب الأولمبي",
    nameLatin: "Olympic Team (U-23)",
    category: "Under-23 Men",
    headCoachAr: "أحمد الملا",
    headCoachLatin: "Ahmed Al-Mulla",
    afcRanking: 14,
  },
];

// ---------------------------------------------------------------------------
// Players
// ---------------------------------------------------------------------------

export interface GffPlayer {
  id: string;
  teamId: string;
  nameAr: string;
  nameLatin: string;
  number: number;
  age: number;
  position: string;
  positionAr: string;
  isCaptain?: boolean;
  note?: string;
}

const SR = "gff-senior-men";
const U23 = "gff-u23-men";

export const gffPlayers: GffPlayer[] = [
  // ----- Senior goalkeepers -----
  { id: "p-sr-1", teamId: SR, nameLatin: "Khalid Al-Mansoori", nameAr: "خالد المنصوري", number: 1, age: 29, position: "Goalkeeper", positionAr: "حارس مرمى", note: "Capitán suplente" },
  { id: "p-sr-22", teamId: SR, nameLatin: "Yousef Al-Hashimi", nameAr: "يوسف الهاشمي", number: 22, age: 27, position: "Goalkeeper", positionAr: "حارس مرمى" },
  { id: "p-sr-23", teamId: SR, nameLatin: "Mubarak Al-Ketbi", nameAr: "مبارك الكتبي", number: 23, age: 31, position: "Goalkeeper", positionAr: "حارس مرمى" },
  // ----- Senior defenders -----
  { id: "p-sr-2", teamId: SR, nameLatin: "Omar Al-Nuaimi", nameAr: "عمر النعيمي", number: 2, age: 31, position: "Right back", positionAr: "ظهير أيمن" },
  { id: "p-sr-3", teamId: SR, nameLatin: "Hamdan Al-Shamsi", nameAr: "حمدان الشامسي", number: 3, age: 28, position: "Left back", positionAr: "ظهير أيسر" },
  { id: "p-sr-4", teamId: SR, nameLatin: "Saif Al-Dhaheri", nameAr: "سيف الظاهري", number: 4, age: 26, position: "Centre back", positionAr: "قلب دفاع" },
  { id: "p-sr-5", teamId: SR, nameLatin: "Rashid Al-Suwaidi", nameAr: "راشد السويدي", number: 5, age: 30, position: "Centre back", positionAr: "قلب دفاع" },
  { id: "p-sr-15", teamId: SR, nameLatin: "Nasser Al-Rumaithi", nameAr: "ناصر الرميثي", number: 15, age: 24, position: "Centre back", positionAr: "قلب دفاع" },
  { id: "p-sr-16", teamId: SR, nameLatin: "Majed Al-Owais", nameAr: "ماجد العويس", number: 16, age: 27, position: "Left back", positionAr: "ظهير أيسر" },
  { id: "p-sr-17", teamId: SR, nameLatin: "Tariq Al-Khaja", nameAr: "طارق الخاجة", number: 17, age: 25, position: "Centre back", positionAr: "قلب دفاع" },
  { id: "p-sr-18", teamId: SR, nameLatin: "Walid Al-Mazrouei", nameAr: "وليد المزروعي", number: 18, age: 29, position: "Right back", positionAr: "ظهير أيمن" },
  // ----- Senior midfielders -----
  { id: "p-sr-6", teamId: SR, nameLatin: "Mohammed Al-Falasi", nameAr: "محمد الفلاسي", number: 6, age: 30, position: "Defensive midfielder", positionAr: "محور دفاعي" },
  { id: "p-sr-10", teamId: SR, nameLatin: "Ahmed Al-Zaabi", nameAr: "أحمد الزعابي", number: 10, age: 27, position: "Attacking midfielder", positionAr: "صانع ألعاب", isCaptain: true },
  { id: "p-sr-8", teamId: SR, nameLatin: "Adel Al-Junaibi", nameAr: "عادل الجنيبي", number: 8, age: 25, position: "Central midfielder", positionAr: "لاعب وسط" },
  { id: "p-sr-14", teamId: SR, nameLatin: "Faris Al-Marri", nameAr: "فارس المري", number: 14, age: 28, position: "Central midfielder", positionAr: "لاعب وسط" },
  { id: "p-sr-20", teamId: SR, nameLatin: "Khalifa Al-Hammadi", nameAr: "خليفة الحمادي", number: 20, age: 26, position: "Central midfielder", positionAr: "لاعب وسط" },
  { id: "p-sr-21", teamId: SR, nameLatin: "Salem Al-Ahbabi", nameAr: "سالم الأحبابي", number: 21, age: 23, position: "Attacking midfielder", positionAr: "صانع ألعاب" },
  // ----- Senior forwards -----
  { id: "p-sr-9", teamId: SR, nameLatin: "Sultan Al-Marri", nameAr: "سلطان المري", number: 9, age: 28, position: "Striker", positionAr: "مهاجم" },
  { id: "p-sr-7", teamId: SR, nameLatin: "Hassan Al-Ali", nameAr: "حسن العلي", number: 7, age: 25, position: "Right winger", positionAr: "جناح أيمن" },
  { id: "p-sr-11", teamId: SR, nameLatin: "Yahya Al-Ghassani", nameAr: "يحيى الغساني", number: 11, age: 26, position: "Left winger", positionAr: "جناح أيسر" },
  { id: "p-sr-19", teamId: SR, nameLatin: "Bandar Al-Otaibi", nameAr: "بندر العتيبي", number: 19, age: 24, position: "Striker", positionAr: "مهاجم" },
  { id: "p-sr-13", teamId: SR, nameLatin: "Marwan Al-Sabousi", nameAr: "مروان السابوسي", number: 13, age: 22, position: "Right winger", positionAr: "جناح أيمن" },
  { id: "p-sr-12", teamId: SR, nameLatin: "Jasem Al-Kindi", nameAr: "جاسم الكندي", number: 12, age: 29, position: "Left winger", positionAr: "جناح أيسر" },

  // ----- U23 -----
  { id: "p-u23-1", teamId: U23, nameLatin: "Saeed Al-Mahri", nameAr: "سعيد المهري", number: 1, age: 22, position: "Goalkeeper", positionAr: "حارس مرمى" },
  { id: "p-u23-12", teamId: U23, nameLatin: "Abdulrahman Al-Beloushi", nameAr: "عبدالرحمن البلوشي", number: 12, age: 20, position: "Goalkeeper", positionAr: "حارس مرمى" },
  { id: "p-u23-2", teamId: U23, nameLatin: "Mohammed Al-Yammahi", nameAr: "محمد اليماحي", number: 2, age: 22, position: "Defender", positionAr: "مدافع" },
  { id: "p-u23-3", teamId: U23, nameLatin: "Khalifa Al-Mehairbi", nameAr: "خليفة المهيربي", number: 3, age: 21, position: "Defender", positionAr: "مدافع" },
  { id: "p-u23-4", teamId: U23, nameLatin: "Salem Al-Hosani", nameAr: "سالم الحوسني", number: 4, age: 20, position: "Defender", positionAr: "مدافع", isCaptain: true },
  { id: "p-u23-5", teamId: U23, nameLatin: "Yousef Al-Naqbi", nameAr: "يوسف النقبي", number: 5, age: 22, position: "Defender", positionAr: "مدافع" },
  { id: "p-u23-15", teamId: U23, nameLatin: "Abdullah Al-Shehhi", nameAr: "عبدالله الشحي", number: 15, age: 19, position: "Defender", positionAr: "مدافع" },
  { id: "p-u23-16", teamId: U23, nameLatin: "Hamad Al-Khoory", nameAr: "حمد الخوري", number: 16, age: 21, position: "Defender", positionAr: "مدافع" },
  { id: "p-u23-6", teamId: U23, nameLatin: "Zayed Al-Ameri", nameAr: "زايد العامري", number: 6, age: 22, position: "Midfielder", positionAr: "لاعب وسط" },
  { id: "p-u23-8", teamId: U23, nameLatin: "Rashed Al-Tunaiji", nameAr: "راشد التنيجي", number: 8, age: 21, position: "Midfielder", positionAr: "لاعب وسط" },
  { id: "p-u23-10", teamId: U23, nameLatin: "Mansoor Al-Dhaheri", nameAr: "منصور الظاهري", number: 10, age: 20, position: "Midfielder", positionAr: "لاعب وسط" },
  { id: "p-u23-14", teamId: U23, nameLatin: "Khaled Al-Rashidi", nameAr: "خالد الراشدي", number: 14, age: 19, position: "Midfielder", positionAr: "لاعب وسط" },
  { id: "p-u23-18", teamId: U23, nameLatin: "Omar Al-Marzooqi", nameAr: "عمر المرزوقي", number: 18, age: 22, position: "Midfielder", positionAr: "لاعب وسط" },
  { id: "p-u23-7", teamId: U23, nameLatin: "Ali Al-Hammadi", nameAr: "علي الحمادي", number: 7, age: 20, position: "Forward", positionAr: "مهاجم" },
  { id: "p-u23-9", teamId: U23, nameLatin: "Ibrahim Al-Habsi", nameAr: "إبراهيم الحبسي", number: 9, age: 21, position: "Forward", positionAr: "مهاجم" },
  { id: "p-u23-11", teamId: U23, nameLatin: "Saif Al-Junaibi", nameAr: "سيف الجنيبي", number: 11, age: 19, position: "Forward", positionAr: "مهاجم" },
  { id: "p-u23-17", teamId: U23, nameLatin: "Mubarak Al-Ketbi Jr", nameAr: "مبارك الكتبي", number: 17, age: 18, position: "Forward", positionAr: "مهاجم" },
  { id: "p-u23-19", teamId: U23, nameLatin: "Rakan Al-Falasi", nameAr: "راكان الفلاسي", number: 19, age: 22, position: "Forward", positionAr: "مهاجم" },
  { id: "p-u23-13", teamId: U23, nameLatin: "Hazza Al-Mansouri", nameAr: "هزاع المنصوري", number: 13, age: 20, position: "Forward", positionAr: "مهاجم" },
  { id: "p-u23-20", teamId: U23, nameLatin: "Yahya Al-Suwaidi", nameAr: "يحيى السويدي", number: 20, age: 21, position: "Forward", positionAr: "مهاجم" },
];

// ---------------------------------------------------------------------------
// Staff
// ---------------------------------------------------------------------------

export interface GffStaffMember {
  id: string;
  teamId: string;
  nameLatin: string;
  nameAr: string;
  roleLatin: string;
  roleAr: string;
  nationality: string;
  age: number;
}

export const gffStaff: GffStaffMember[] = [
  // Senior
  { id: "s-sr-1", teamId: SR, nameLatin: "Carlos Mendes", nameAr: "كارلوس مينديز", roleLatin: "Head coach", roleAr: "المدرب الرئيسي", nationality: "Portugal", age: 54 },
  { id: "s-sr-2", teamId: SR, nameLatin: "João Silva", nameAr: "جواو سيلفا", roleLatin: "Assistant coach", roleAr: "المدرب المساعد", nationality: "Portugal", age: 47 },
  { id: "s-sr-3", teamId: SR, nameLatin: "Faisal Al-Awadhi", nameAr: "فيصل العوضي", roleLatin: "Goalkeeper coach", roleAr: "مدرب حراس المرمى", nationality: "GFF", age: 42 },
  { id: "s-sr-4", teamId: SR, nameLatin: "Mahmoud Al-Sharif", nameAr: "محمود الشريف", roleLatin: "Physical coach", roleAr: "المعد البدني", nationality: "GFF", age: 38 },
  { id: "s-sr-5", teamId: SR, nameLatin: "Dr. Salem Al-Otaiba", nameAr: "د. سالم العتيبة", roleLatin: "Team doctor", roleAr: "طبيب الفريق", nationality: "GFF", age: 51 },
  { id: "s-sr-6", teamId: SR, nameLatin: "Layla Al-Hammadi", nameAr: "ليلى الحمادي", roleLatin: "Nutritionist", roleAr: "أخصائي التغذية", nationality: "GFF", age: 34 },
  { id: "s-sr-7", teamId: SR, nameLatin: "Ricardo Pinto", nameAr: "ريكاردو بينتو", roleLatin: "Performance analyst", roleAr: "محلل الأداء", nationality: "Portugal", age: 36 },
  { id: "s-sr-8", teamId: SR, nameLatin: "Hamad Al-Romaithi", nameAr: "حمد الرميثي", roleLatin: "Sporting director", roleAr: "المدير الرياضي", nationality: "GFF", age: 49 },
  // U23
  { id: "s-u23-1", teamId: U23, nameLatin: "Ahmed Al-Mulla", nameAr: "أحمد الملا", roleLatin: "Head coach", roleAr: "المدرب الرئيسي", nationality: "GFF", age: 45 },
  { id: "s-u23-2", teamId: U23, nameLatin: "Bruno Costa", nameAr: "برونو كوستا", roleLatin: "Assistant coach", roleAr: "المدرب المساعد", nationality: "Portugal", age: 40 },
  { id: "s-u23-3", teamId: U23, nameLatin: "Ali Al-Shamsi", nameAr: "علي الشامسي", roleLatin: "Goalkeeper coach", roleAr: "مدرب حراس المرمى", nationality: "GFF", age: 39 },
  { id: "s-u23-4", teamId: U23, nameLatin: "Khalifa Al-Bedwawi", nameAr: "خليفة البدواوي", roleLatin: "Physical coach", roleAr: "المعد البدني", nationality: "GFF", age: 35 },
  { id: "s-u23-5", teamId: U23, nameLatin: "Dr. Hessa Al-Awadhi", nameAr: "د. حصة العوضي", roleLatin: "Team doctor", roleAr: "طبيب الفريق", nationality: "GFF", age: 41 },
];

// ---------------------------------------------------------------------------
// Matches
// ---------------------------------------------------------------------------

export type GffMatchStatus = "recent" | "upcoming";
export type GffMatchResult = "victory" | "draw" | "defeat";

export interface GffMatch {
  id: string;
  teamId: string;
  status: GffMatchStatus;
  opponentLatin: string;
  opponentAr: string;
  competitionLatin: string;
  competitionAr: string;
  venueLatin: string;
  venueAr?: string;
  homeAway: "home" | "away" | "neutral";
  scoreFor?: number;
  scoreAgainst?: number;
  resultLatin?: GffMatchResult;
  resultAr?: string;
  date: string; // ISO
}

export const gffMatches: GffMatch[] = [
  // Senior recent
  { id: "m-sr-r1", teamId: SR, status: "recent", opponentLatin: "Jordan", opponentAr: "الأردن", competitionLatin: "Friendly", competitionAr: "مباراة ودية", venueLatin: "Madinat Al-Khaleej", venueAr: "مدينة الخليج", homeAway: "home", scoreFor: 2, scoreAgainst: 1, resultLatin: "victory", resultAr: "فوز", date: "2026-04-12" },
  { id: "m-sr-r2", teamId: SR, status: "recent", opponentLatin: "Iraq", opponentAr: "العراق", competitionLatin: "AFC Qualifier", competitionAr: "تصفيات آسيوية", venueLatin: "Baghdad", homeAway: "away", scoreFor: 0, scoreAgainst: 0, resultLatin: "draw", resultAr: "تعادل", date: "2026-03-28" },
  { id: "m-sr-r3", teamId: SR, status: "recent", opponentLatin: "Lebanon", opponentAr: "لبنان", competitionLatin: "AFC Qualifier", competitionAr: "تصفيات آسيوية", venueLatin: "Madinat Al-Khaleej", venueAr: "مدينة الخليج", homeAway: "home", scoreFor: 3, scoreAgainst: 1, resultLatin: "victory", resultAr: "فوز", date: "2026-03-21" },
  { id: "m-sr-r4", teamId: SR, status: "recent", opponentLatin: "Australia", opponentAr: "أستراليا", competitionLatin: "Friendly", competitionAr: "مباراة ودية", venueLatin: "Doha", homeAway: "neutral", scoreFor: 1, scoreAgainst: 2, resultLatin: "defeat", resultAr: "خسارة", date: "2026-02-15" },
  { id: "m-sr-r5", teamId: SR, status: "recent", opponentLatin: "Vietnam", opponentAr: "فيتنام", competitionLatin: "AFC Qualifier", competitionAr: "تصفيات آسيوية", venueLatin: "Hanoi", homeAway: "away", scoreFor: 2, scoreAgainst: 0, resultLatin: "victory", resultAr: "فوز", date: "2026-02-01" },
  // Senior upcoming
  { id: "m-sr-u1", teamId: SR, status: "upcoming", opponentLatin: "Uzbekistan", opponentAr: "أوزبكستان", competitionLatin: "AFC Qualifier", competitionAr: "تصفيات آسيوية", venueLatin: "Madinat Al-Khaleej", venueAr: "مدينة الخليج", homeAway: "home", date: "2026-06-05" },
  { id: "m-sr-u2", teamId: SR, status: "upcoming", opponentLatin: "Indonesia", opponentAr: "إندونيسيا", competitionLatin: "AFC Qualifier", competitionAr: "تصفيات آسيوية", venueLatin: "Jakarta", homeAway: "away", date: "2026-06-12" },
  { id: "m-sr-u3", teamId: SR, status: "upcoming", opponentLatin: "Morocco", opponentAr: "المغرب", competitionLatin: "Friendly", competitionAr: "مباراة ودية", venueLatin: "Madinat Al-Khaleej", venueAr: "مدينة الخليج", homeAway: "home", date: "2026-06-20" },
  // U23 recent
  { id: "m-u23-r1", teamId: U23, status: "recent", opponentLatin: "Bahrain U-23", opponentAr: "البحرين تحت 23", competitionLatin: "Friendly", competitionAr: "مباراة ودية", venueLatin: "Madinat Al-Khaleej", venueAr: "مدينة الخليج", homeAway: "home", scoreFor: 2, scoreAgainst: 0, resultLatin: "victory", resultAr: "فوز", date: "2026-04-05" },
  { id: "m-u23-r2", teamId: U23, status: "recent", opponentLatin: "Qatar U-23", opponentAr: "قطر تحت 23", competitionLatin: "AFC U-23 Qualifier", competitionAr: "تصفيات آسيوية تحت 23", venueLatin: "Doha", homeAway: "away", scoreFor: 1, scoreAgainst: 1, resultLatin: "draw", resultAr: "تعادل", date: "2026-03-18" },
  { id: "m-u23-r3", teamId: U23, status: "recent", opponentLatin: "Kuwait U-23", opponentAr: "الكويت تحت 23", competitionLatin: "AFC U-23 Qualifier", competitionAr: "تصفيات آسيوية تحت 23", venueLatin: "Madinat Al-Khaleej", venueAr: "مدينة الخليج", homeAway: "home", scoreFor: 3, scoreAgainst: 2, resultLatin: "victory", resultAr: "فوز", date: "2026-03-04" },
  // U23 upcoming
  { id: "m-u23-u1", teamId: U23, status: "upcoming", opponentLatin: "Oman U-23", opponentAr: "عُمان تحت 23", competitionLatin: "AFC U-23 Qualifier", competitionAr: "تصفيات آسيوية تحت 23", venueLatin: "Madinat Al-Khaleej", venueAr: "مدينة الخليج", homeAway: "home", date: "2026-05-22" },
  { id: "m-u23-u2", teamId: U23, status: "upcoming", opponentLatin: "Thailand U-23", opponentAr: "تايلاند تحت 23", competitionLatin: "AFC U-23 Qualifier", competitionAr: "تصفيات آسيوية تحت 23", venueLatin: "Bangkok", homeAway: "away", date: "2026-06-02" },
];

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

export interface GffTeamStats {
  teamId: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  fifaRanking?: number;
  afcRanking?: number;
  topScorer: string;
  topScorerGoals: number;
  topAssister?: string;
  topAssisterAssists?: number;
}

export const gffStats: GffTeamStats[] = [
  {
    teamId: SR,
    played: 14,
    wins: 8,
    draws: 4,
    losses: 2,
    goalsFor: 24,
    goalsAgainst: 11,
    fifaRanking: 67,
    afcRanking: 9,
    topScorer: "Sultan Al-Marri",
    topScorerGoals: 7,
    topAssister: "Ahmed Al-Zaabi",
    topAssisterAssists: 6,
  },
  {
    teamId: U23,
    played: 8,
    wins: 5,
    draws: 2,
    losses: 1,
    goalsFor: 16,
    goalsAgainst: 7,
    afcRanking: 14,
    topScorer: "Ibrahim Al-Habsi",
    topScorerGoals: 4,
  },
];

// ---------------------------------------------------------------------------
// Affiliated clubs
// ---------------------------------------------------------------------------

export interface GffAffiliatedClub {
  id: string;
  nameLatin: string;
  nameAr: string;
  initialsAr: string;
  color: string;
}

export const gffAffiliatedClubs: GffAffiliatedClub[] = [
  { id: "c-saqr", nameLatin: "Al-Saqr FC", nameAr: "نادي الصقر", initialsAr: "ص", color: "#0A6B4F" },
  { id: "c-noor", nameLatin: "Al-Noor SC", nameAr: "نادي النور", initialsAr: "ن", color: "#D4AF37" },
  { id: "c-bahr", nameLatin: "Al-Bahr United", nameAr: "نادي البحر المتحد", initialsAr: "ب", color: "#1E5A8C" },
  { id: "c-sahra", nameLatin: "Shabab Al-Sahra", nameAr: "شباب الصحراء", initialsAr: "ش", color: "#C67B2A" },
  { id: "c-qamar", nameLatin: "Al-Qamar FC", nameAr: "نادي القمر", initialsAr: "ق", color: "#5B6C8C" },
  { id: "c-najm", nameLatin: "Al-Najm Al-Zahabi", nameAr: "النجم الذهبي", initialsAr: "ذ", color: "#B8902A" },
  { id: "c-nour-kh", nameLatin: "Nour Al-Khaleej", nameAr: "نور الخليج", initialsAr: "خ", color: "#0E8A66" },
  { id: "c-riyadi", nameLatin: "Al-Riyadi", nameAr: "الرياضي", initialsAr: "ر", color: "#A83232" },
  { id: "c-wifaq", nameLatin: "Al-Wifaq", nameAr: "الوفاق", initialsAr: "و", color: "#2E7D32" },
  { id: "c-rimal", nameLatin: "Al-Rimal", nameAr: "الرمال", initialsAr: "ل", color: "#C9A063" },
  { id: "c-nakheel", nameLatin: "Al-Nakheel", nameAr: "النخيل", initialsAr: "خ", color: "#3B7A57" },
  { id: "c-watan", nameLatin: "Shabab Al-Watan", nameAr: "شباب الوطن", initialsAr: "ط", color: "#264653" },
  { id: "c-faisal", nameLatin: "Al-Faisal", nameAr: "الفيصل", initialsAr: "ف", color: "#6A1B9A" },
  { id: "c-sharqi", nameLatin: "Al-Ittihad Al-Sharqi", nameAr: "الاتحاد الشرقي", initialsAr: "إ", color: "#1565C0" },
  { id: "c-jazeera", nameLatin: "Al-Jazeera", nameAr: "الجزيرة", initialsAr: "ج", color: "#00695C" },
  { id: "c-burj", nameLatin: "Al-Burj", nameAr: "البرج", initialsAr: "ج", color: "#37474F" },
];

// ---------------------------------------------------------------------------
// ClubSeed export
// ---------------------------------------------------------------------------

export const gffSeed: ClubSeed = {
  live: false,
  data: {
    federation: gffFederation,
    teams: gffTeams,
    players: gffPlayers,
    staff: gffStaff,
    matches: gffMatches,
    stats: gffStats,
    affiliatedClubs: gffAffiliatedClubs,
  },
};
