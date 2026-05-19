// GFF mobile workspace — Arabic / RTL screens for the national-team coach
// (مدرب المنتخب) and the national-team player (لاعب المنتخب). Mirrors the
// pattern of the desktop <GffWorkspace>: a single component with several
// "views" that mobile route files short-circuit to when the active club is
// gff-demo. WorkspaceFrame already sets dir="rtl" + lang="ar" on the
// surrounding wrapper, so we just author content in Arabic.
import { useMemo, useState, type ReactNode } from "react";
import {
  Clock,
  MapPin,
  TriangleAlert,
  CalendarPlus,
  Check,
  X,
  Star,
  Sparkles,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Activity,
  Trophy,
  Send,
  Users,
  HeartPulse,
  TrendingUp,
  ArrowLeft,
  Bell,
} from "lucide-react";
import { useCurrentUser } from "@/lib/store";
import { gffPlayers, gffStaff, gffMatches, gffTeams, gffStats } from "./seed";

// ----- Palette ---------------------------------------------------------------
const INK = "#21324A";
const MUTED = "#66758A";
const SOFT_BG = "#EEF3F8";
const CARD_BORDER = "#DDE6F0";
const GFF_GREEN = "#0A6B4F";
const GFF_GREEN_SOFT = "#E4F1EC";
const GFF_GOLD = "#D4AF37";
const GFF_GOLD_SOFT = "#FAF1D9";
const COACH = GFF_GREEN;
const ATHL = "#F12F4A";
const SHADOW = "0 4px 16px rgba(33, 50, 74, 0.06)";

const SR = "gff-senior-men";
const U23 = "gff-u23-men";

// Wrap latin / number content so an RTL paragraph keeps it left-to-right.
function N({ children }: { children: ReactNode }) {
  return <bdi className="tabular-nums">{children}</bdi>;
}

function fmtDateAr(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

// ============================================================================
// HOME
// ============================================================================

export function GffMobileHome() {
  const user = useCurrentUser();
  const isCoach = user?.role === "technical";
  return isCoach ? <CoachHome /> : <PlayerHome />;
}

function TodayCard({
  titleAr,
  timeLabel,
  venueAr,
  ctaAr,
  accent,
}: {
  titleAr: string;
  timeLabel: string;
  venueAr: string;
  ctaAr: string;
  accent: string;
}) {
  return (
    <section style={{ background: SOFT_BG, borderRadius: 18, padding: 18 }}>
      <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: MUTED }}>
        اليوم
      </div>
      <h2 className="mt-1" style={{ color: INK, fontSize: 20, fontWeight: 700 }}>
        {titleAr}
      </h2>
      <div className="mt-2 space-y-1" style={{ color: MUTED, fontSize: 13 }}>
        <div className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" /> <N>{timeLabel}</N>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" /> {venueAr}
        </div>
      </div>
      <button
        className="mt-4 flex w-full items-center justify-between active:scale-[0.98]"
        style={{
          height: 52,
          borderRadius: 999,
          background: accent,
          color: "#FFFFFF",
          padding: "0 8px 0 22px",
          fontSize: 15,
          fontWeight: 700,
        }}
      >
        <span>{ctaAr}</span>
        <span
          className="flex items-center justify-center"
          style={{ width: 36, height: 36, borderRadius: 999, background: "#FFFFFF", color: accent }}
        >
          {/* In RTL the arrow visually points to the start. */}
          <ArrowLeft className="h-4 w-4" />
        </span>
      </button>
    </section>
  );
}

function PlayerHome() {
  const [absenceNotified, setAbsenceNotified] = useState(false);
  const [improveOpen, setImproveOpen] = useState(false);

  return (
    <div className="space-y-4">
      <TodayCard
        titleAr="حصة تكتيكية — المنتخب الأول"
        timeLabel="18:00"
        venueAr="مدينة الخليج · الملعب الرئيسي"
        ctaAr="معلومات الحصة"
        accent={ATHL}
      />

      {/* Notificar ausencia */}
      {absenceNotified ? (
        <div
          className="flex w-full items-center justify-between px-5"
          style={{
            height: 52,
            borderRadius: 999,
            background: GFF_GREEN_SOFT,
            color: GFF_GREEN,
            border: `1px solid ${GFF_GREEN}33`,
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          <span className="inline-flex items-center gap-2">
            <Check className="h-4 w-4" /> تم إخطار الغياب
          </span>
          <button
            onClick={() => setAbsenceNotified(false)}
            className="text-[12px] font-semibold underline"
          >
            تراجع
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAbsenceNotified(true)}
          className="flex w-full items-center justify-center gap-2 active:scale-[0.98]"
          style={{
            height: 52,
            borderRadius: 999,
            background: "#8A98AA",
            color: "#FFFFFF",
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          <TriangleAlert className="h-4 w-4" /> إخطار الغياب
        </button>
      )}

      {/* Salud */}
      <section className="space-y-2">
        <div
          className="flex items-center gap-2"
          style={{ color: MUTED, fontSize: 14, fontWeight: 600 }}
        >
          <HeartPulse className="h-4 w-4" /> الصحة
        </div>
        <div style={{ background: SOFT_BG, borderRadius: 18, padding: 14 }} className="space-y-2">
          <div
            className="flex items-center justify-between"
            style={{
              background: "#FFFFFF",
              border: `1px solid ${CARD_BORDER}`,
              borderRadius: 14,
              padding: "12px 16px",
              color: INK,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            خطة العلاج
            <span
              className="flex items-center justify-center"
              style={{
                width: 28,
                height: 28,
                borderRadius: 999,
                background: SOFT_BG,
                color: MUTED,
              }}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </span>
          </div>
          <button
            className="flex w-full items-center justify-center gap-2 active:scale-[0.98]"
            style={{
              height: 48,
              borderRadius: 999,
              background: "#8A98AA",
              color: "#FFFFFF",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <CalendarPlus className="h-4 w-4" /> طلب موعد طبي
          </button>
        </div>
      </section>

      {/* Mi rendimiento */}
      <section className="space-y-2">
        <div
          className="flex items-center gap-2"
          style={{ color: MUTED, fontSize: 14, fontWeight: 600 }}
        >
          <Trophy className="h-4 w-4" /> أدائي
        </div>

        <div
          style={{
            background: "#FFFFFF",
            border: `1px solid ${CARD_BORDER}`,
            borderRadius: 16,
            padding: 14,
            boxShadow: SHADOW,
          }}
        >
          <button
            className="flex w-full items-center gap-2"
            onClick={() => setImproveOpen((v) => !v)}
          >
            <Sparkles className="h-4 w-4" style={{ color: ATHL }} />
            <span style={{ color: ATHL, fontSize: 14, fontWeight: 700 }}>طوّر أداءك:</span>
          </button>
          <p className="mt-2" style={{ color: INK, fontSize: 13, lineHeight: "20px" }}>
            ركّز على التحوّل الدفاعي بعد فقدان الكرة. ستخفض <N>0,8</N> ثانية من زمن ردّة الفعل إذا
            فعّلت الضغط المباشر خلال أول <N>6</N> ثوانٍ.
            {improveOpen && (
              <>
                {" "}
                أضف <N>2</N> سرعات قصيرة في الإحماء، وأنهِ التدريب بـ <N>5</N> دقائق من تنفّس
                <N>4-7-8</N>.
              </>
            )}
          </p>
          <div
            className="mt-3 flex items-center justify-center"
            style={{ background: "#FFE7EC", borderRadius: 999, height: 28, color: ATHL }}
          >
            <button onClick={() => setImproveOpen((v) => !v)} aria-label="عرض المزيد">
              <ChevronDown
                className="h-4 w-4"
                style={{
                  transform: improveOpen ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s",
                }}
              />
            </button>
          </div>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            border: `1px solid ${CARD_BORDER}`,
            borderRadius: 16,
            padding: 14,
            boxShadow: SHADOW,
          }}
        >
          <div className="flex items-center justify-between">
            <span style={{ color: MUTED, fontSize: 13 }}>آخر تقييم</span>
            <span style={{ color: MUTED, fontSize: 12 }}>
              <N>22/10/26</N>
            </span>
          </div>
          <div className="mt-1.5">
            <Stars value={3} color={ATHL} />
          </div>
          <p className="mt-2" style={{ color: INK, fontSize: 13, lineHeight: "19px" }}>
            التمريرات الطويلة المتقاطعة ممتازة. يمكنك تطوير التراكيب السريعة مع الجناح.
          </p>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            border: `1px solid ${CARD_BORDER}`,
            borderRadius: 16,
            padding: 14,
            boxShadow: SHADOW,
          }}
        >
          <div className="flex items-center justify-between">
            <span style={{ color: MUTED, fontSize: 13 }}>متوسط التقييم</span>
            <span style={{ color: MUTED, fontSize: 12 }}>
              (آخر <N>30</N> يومًا)
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Star className="h-5 w-5" style={{ color: ATHL, fill: ATHL }} />
            <span style={{ color: INK, fontSize: 22, fontWeight: 700 }}>
              <N>3,45</N>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

function CoachHome() {
  const [absencesOpen, setAbsencesOpen] = useState(true);
  const [group, setGroup] = useState<"sr" | "u23">("sr");

  const absences = [
    { id: "ab1", nameAr: "حمدان الشامسي", reasonAr: "إصابة عضلية" },
    { id: "ab2", nameAr: "سيف الجنيبي", reasonAr: "ارتباط دراسي" },
  ];
  const notFit = [
    { id: "nf1", nameAr: "طارق الخاجة" },
    { id: "nf2", nameAr: "وليد المزروعي" },
  ];
  const ratingPlayers = [
    { id: "r1", nameAr: "أحمد الزعابي" },
    { id: "r2", nameAr: "سلطان المري" },
    { id: "r3", nameAr: "حسن العلي" },
  ];

  return (
    <div className="space-y-4">
      {/* Group selector */}
      <div className="flex gap-2">
        {[
          { id: "sr" as const, ar: "المنتخب الأول" },
          { id: "u23" as const, ar: "تحت 23" },
        ].map((g) => (
          <button
            key={g.id}
            onClick={() => setGroup(g.id)}
            className="flex-1 active:scale-[0.98]"
            style={{
              height: 40,
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 700,
              background: group === g.id ? COACH : "#FFFFFF",
              color: group === g.id ? "#FFFFFF" : INK,
              border: `1px solid ${group === g.id ? COACH : CARD_BORDER}`,
            }}
          >
            {g.ar}
          </button>
        ))}
      </div>

      <TodayCard
        titleAr={group === "sr" ? "تدريب تكتيكي — المنتخب الأول" : "تدريب بدني — المنتخب الأولمبي"}
        timeLabel="18:00"
        venueAr="مدينة الخليج · الملعب الرئيسي"
        ctaAr="معلومات الحصة"
        accent={COACH}
      />

      {/* Absences */}
      <section>
        <button
          onClick={() => setAbsencesOpen((v) => !v)}
          className="flex w-full items-center justify-between"
          style={{
            background: SOFT_BG,
            borderRadius: 14,
            padding: "12px 16px",
            color: INK,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <span className="inline-flex items-center gap-2">
            <TriangleAlert className="h-4 w-4" style={{ color: MUTED }} />
            الغيابات المُبلَّغة
            <span
              style={{
                background: COACH,
                color: "#FFFFFF",
                borderRadius: 999,
                padding: "1px 8px",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              <N>{absences.length}</N>
            </span>
          </span>
          <ChevronDown
            className="h-4 w-4"
            style={{
              color: MUTED,
              transform: absencesOpen ? "rotate(180deg)" : "none",
              transition: "transform 0.2s",
            }}
          />
        </button>
        {absencesOpen && (
          <ul className="mt-2 space-y-1.5">
            {absences.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between"
                style={{
                  background: "#FFFFFF",
                  border: `1px solid ${CARD_BORDER}`,
                  borderRadius: 12,
                  padding: "10px 14px",
                  fontSize: 13,
                  color: INK,
                }}
              >
                <span className="font-medium">{a.nameAr}</span>
                <span style={{ color: MUTED, fontSize: 12 }}>{a.reasonAr}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Not fit */}
      <section
        style={{
          background: "#FFFFFF",
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 14,
          padding: "12px 16px",
        }}
      >
        <div
          className="flex items-center gap-2"
          style={{ color: INK, fontSize: 14, fontWeight: 700 }}
        >
          <X className="h-4 w-4" /> غير جاهزين
        </div>
        <ul className="mt-2 space-y-0.5">
          {notFit.map((a) => (
            <li key={a.id} style={{ color: INK, fontSize: 14 }}>
              {a.nameAr}
            </li>
          ))}
        </ul>
      </section>

      {/* Rate performance */}
      <section className="space-y-2">
        <div
          className="flex items-center gap-2"
          style={{ color: MUTED, fontSize: 14, fontWeight: 600 }}
        >
          <Star className="h-4 w-4" /> تقييم الأداء
        </div>
        <div
          className="flex gap-3 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", marginInline: -4 }}
        >
          {ratingPlayers.map((a) => (
            <CoachRatingCard key={a.id} nameAr={a.nameAr} />
          ))}
        </div>
      </section>
    </div>
  );
}

function CoachRatingCard({ nameAr }: { nameAr: string }) {
  const [value, setValue] = useState(0);
  const [sent, setSent] = useState(false);
  return (
    <div
      className="shrink-0"
      style={{
        width: 240,
        background: "#FFFFFF",
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: 16,
        padding: 14,
        boxShadow: SHADOW,
      }}
    >
      <div style={{ color: INK, fontSize: 14, fontWeight: 700 }}>{nameAr}</div>
      <div className="mt-2 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button key={i} onClick={() => setValue(i)} aria-label={`نجوم ${i}`}>
            <Star
              className="h-6 w-6"
              style={{ color: COACH, fill: i <= value ? COACH : "transparent" }}
            />
          </button>
        ))}
      </div>
      <button
        disabled={value === 0 || sent}
        onClick={() => setSent(true)}
        className="mt-3 flex w-full items-center justify-center gap-2"
        style={{
          height: 38,
          borderRadius: 999,
          background: sent ? GFF_GREEN_SOFT : COACH,
          color: sent ? COACH : "#FFFFFF",
          fontSize: 13,
          fontWeight: 700,
          opacity: value === 0 && !sent ? 0.5 : 1,
        }}
      >
        {sent ? (
          <>
            <Check className="h-4 w-4" /> تم الإرسال
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> إرسال التقييم
          </>
        )}
      </button>
    </div>
  );
}

function Stars({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className="h-5 w-5"
          style={{ color, fill: i <= value ? color : "transparent" }}
        />
      ))}
    </div>
  );
}

// ============================================================================
// CALENDAR
// ============================================================================

const DOW_AR = ["إث", "ث", "أر", "خ", "ج", "س", "أح"];
const MONTHS_AR = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}

function buildMonthGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const start = startOfWeek(first);
  return Array.from({ length: 35 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

const toIso = (d: Date) => d.toISOString().slice(0, 10);

export function GffMobileCalendar() {
  const user = useCurrentUser();
  const isCoach = user?.role === "technical";
  const accent = isCoach ? COACH : ATHL;

  // Build events from upcoming/recent matches + invented training sessions.
  const events = useMemo(() => {
    const evs = gffMatches.map((m) => {
      const team = gffTeams.find((t) => t.id === m.teamId);
      return {
        date: m.date,
        kind: "match" as const,
        titleAr: `${team?.nameAr ?? ""} — ${m.opponentAr}`,
        timeLabel: m.status === "upcoming" ? "20:00" : "—",
        venueAr: m.venueAr ?? m.venueLatin,
        scoreAr:
          m.scoreFor !== undefined && m.scoreAgainst !== undefined
            ? `${m.scoreFor} - ${m.scoreAgainst}`
            : undefined,
        resultAr: m.resultAr,
      };
    });
    // Add a daily training session for the next 14 days, only for this team.
    const myTeam = isCoach ? null : SR;
    const today = new Date();
    for (let i = -2; i < 12; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const day = d.getDay();
      if (day === 5) continue; // Friday rest
      evs.push({
        date: toIso(d),
        kind: "training" as const,
        titleAr: isCoach ? "تدريب — المنتخب الأول" : "تدريب جماعي",
        timeLabel: "18:00",
        venueAr: "مدينة الخليج",
        scoreAr: undefined,
        resultAr: undefined,
        teamId: myTeam,
      } as never);
    }
    return evs;
  }, [isCoach]);

  const eventsByDate = useMemo(() => {
    const m: Record<string, typeof events> = {};
    events.forEach((e) => (m[e.date] ||= []).push(e));
    return m;
  }, [events]);

  const [cursor, setCursor] = useState<Date>(new Date());
  const [selected, setSelected] = useState<string>(toIso(new Date()));
  const todayIso = toIso(new Date());
  const grid = buildMonthGrid(cursor.getFullYear(), cursor.getMonth());
  const dayEvents = eventsByDate[selected] ?? [];

  const goPrev = () => {
    const d = new Date(cursor);
    d.setMonth(d.getMonth() - 1);
    setCursor(d);
  };
  const goNext = () => {
    const d = new Date(cursor);
    d.setMonth(d.getMonth() + 1);
    setCursor(d);
  };

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <button
          onClick={goPrev}
          aria-label="الشهر السابق"
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ background: "#FFFFFF", border: `1px solid ${CARD_BORDER}`, color: INK }}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <h1 className="text-lg font-bold" style={{ color: INK }}>
          {MONTHS_AR[cursor.getMonth()]} <N>{cursor.getFullYear()}</N>
        </h1>
        <button
          onClick={goNext}
          aria-label="الشهر التالي"
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ background: "#FFFFFF", border: `1px solid ${CARD_BORDER}`, color: INK }}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </header>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-[11px]" style={{ color: MUTED }}>
        {DOW_AR.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1">
        {grid.map((d) => {
          const iso = toIso(d);
          const inMonth = d.getMonth() === cursor.getMonth();
          const isToday = iso === todayIso;
          const isSel = iso === selected;
          const has = (eventsByDate[iso] ?? []).length > 0;
          return (
            <button
              key={iso}
              onClick={() => setSelected(iso)}
              className="relative flex flex-col items-center justify-center"
              style={{
                aspectRatio: "1 / 1",
                borderRadius: 12,
                background: isSel ? accent : isToday ? GFF_GOLD_SOFT : "#FFFFFF",
                border: `1px solid ${isSel ? accent : CARD_BORDER}`,
                color: isSel ? "#FFFFFF" : inMonth ? INK : MUTED,
                opacity: inMonth ? 1 : 0.55,
                fontSize: 13,
                fontWeight: isToday || isSel ? 700 : 500,
              }}
            >
              <N>{d.getDate()}</N>
              {has && (
                <span
                  className="absolute"
                  style={{
                    bottom: 4,
                    width: 5,
                    height: 5,
                    borderRadius: 999,
                    background: isSel ? "#FFFFFF" : accent,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Day detail */}
      <section className="space-y-2">
        <div className="text-sm font-bold" style={{ color: INK }}>
          فعاليات يوم <N>{fmtDateAr(selected)}</N>
        </div>
        {dayEvents.length === 0 ? (
          <div
            className="rounded-2xl p-4 text-center text-xs"
            style={{ background: SOFT_BG, color: MUTED }}
          >
            لا توجد فعاليات في هذا اليوم
          </div>
        ) : (
          <ul className="space-y-2">
            {dayEvents.map((e, i) => (
              <li
                key={i}
                style={{
                  background: "#FFFFFF",
                  border: `1px solid ${CARD_BORDER}`,
                  borderRadius: 14,
                  padding: 12,
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                    style={{
                      background: e.kind === "match" ? GFF_GOLD_SOFT : GFF_GREEN_SOFT,
                      color: e.kind === "match" ? "#8a6a14" : GFF_GREEN,
                    }}
                  >
                    {e.kind === "match" ? "مباراة" : "تدريب"}
                  </span>
                  <span className="text-[12px]" style={{ color: MUTED }}>
                    <N>{e.timeLabel}</N>
                  </span>
                </div>
                <div className="mt-1.5 text-sm font-semibold" style={{ color: INK }}>
                  {e.titleAr}
                </div>
                <div
                  className="mt-0.5 inline-flex items-center gap-1 text-[12px]"
                  style={{ color: MUTED }}
                >
                  <MapPin className="h-3.5 w-3.5" /> {e.venueAr}
                </div>
                {e.scoreAr && (
                  <div
                    className="mt-2 inline-block rounded-md px-2 py-0.5 text-xs font-bold"
                    style={{ background: GFF_GREEN_SOFT, color: GFF_GREEN }}
                  >
                    <N>{e.scoreAr}</N> · {e.resultAr}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

// ============================================================================
// TEAM (coach) / HEALTH (athlete)
// ============================================================================

export function GffMobileTeam() {
  const players = gffPlayers.filter((p) => p.teamId === SR).slice(0, 16);
  const staff = gffStaff.filter((s) => s.teamId === SR).slice(0, 4);

  return (
    <div className="space-y-3">
      <header>
        <h1 className="text-xl font-bold tracking-tight" style={{ color: INK }}>
          المنتخب الأول
        </h1>
        <p className="text-sm" style={{ color: MUTED }}>
          <N>{players.length}</N> لاعبًا · <N>{staff.length}</N> من الجهاز الفني
        </p>
      </header>

      <section className="space-y-2">
        <div className="flex items-center gap-2 text-[12px] font-semibold" style={{ color: MUTED }}>
          <Users className="h-3.5 w-3.5" /> اللاعبون
        </div>
        <ul className="space-y-2">
          {players.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-3"
              style={{
                background: "#FFFFFF",
                border: `1px solid ${CARD_BORDER}`,
                borderRadius: 14,
                padding: 12,
              }}
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold"
                style={{ background: GFF_GREEN_SOFT, color: GFF_GREEN }}
              >
                <N>{p.number}</N>
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold" style={{ color: INK }}>
                  {p.nameAr}
                  {p.isCaptain && (
                    <span
                      className="ms-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                      style={{ background: GFF_GOLD_SOFT, color: "#8a6a14" }}
                    >
                      الكابتن
                    </span>
                  )}
                </div>
                <div className="text-[11px]" style={{ color: MUTED }}>
                  {p.positionAr} · <N>{p.age}</N> سنة
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <div className="flex items-center gap-2 text-[12px] font-semibold" style={{ color: MUTED }}>
          <Activity className="h-3.5 w-3.5" /> الجهاز الفني
        </div>
        <ul className="space-y-2">
          {staff.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between"
              style={{
                background: "#FFFFFF",
                border: `1px solid ${CARD_BORDER}`,
                borderRadius: 14,
                padding: 12,
              }}
            >
              <span className="text-sm font-semibold" style={{ color: INK }}>
                {s.nameAr}
              </span>
              <span className="text-[12px]" style={{ color: GFF_GREEN, fontWeight: 600 }}>
                {s.roleAr}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export function GffMobileHealth() {
  return (
    <div className="space-y-3">
      <header>
        <h1 className="text-xl font-bold tracking-tight" style={{ color: INK }}>
          الصحة
        </h1>
        <p className="text-sm" style={{ color: MUTED }}>
          متابعة الحالة البدنية وخطة العلاج
        </p>
      </header>

      <section
        style={{
          background: GFF_GREEN_SOFT,
          borderRadius: 18,
          padding: 16,
          border: `1px solid ${GFF_GREEN}22`,
        }}
      >
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4" style={{ color: GFF_GREEN }} />
          <span className="text-sm font-bold" style={{ color: GFF_GREEN }}>
            جاهز للتدريب
          </span>
        </div>
        <p className="mt-1 text-[12px]" style={{ color: GFF_GREEN }}>
          آخر فحص: <N>{fmtDateAr(toIso(new Date()))}</N>
        </p>
      </section>

      <section
        style={{
          background: "#FFFFFF",
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 16,
          padding: 14,
        }}
      >
        <div className="text-sm font-bold" style={{ color: INK }}>
          خطة العلاج الحالية
        </div>
        <ul className="mt-2 space-y-1.5 text-[13px]" style={{ color: INK }}>
          <li className="flex items-center justify-between">
            <span>تمارين تقوية مرنة</span>
            <span style={{ color: MUTED }}>
              <N>3×/أسبوع</N>
            </span>
          </li>
          <li className="flex items-center justify-between">
            <span>علاج طبيعي</span>
            <span style={{ color: MUTED }}>
              <N>2×/أسبوع</N>
            </span>
          </li>
          <li className="flex items-center justify-between">
            <span>تدليك استشفائي</span>
            <span style={{ color: MUTED }}>بعد كل مباراة</span>
          </li>
        </ul>
      </section>

      <button
        className="flex w-full items-center justify-center gap-2"
        style={{
          height: 48,
          borderRadius: 999,
          background: ATHL,
          color: "#FFFFFF",
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        <CalendarPlus className="h-4 w-4" /> طلب موعد طبي
      </button>
    </div>
  );
}

// ============================================================================
// SESSION (coach) / PERFORMANCE (athlete)
// ============================================================================

export function GffMobileSession() {
  return (
    <div className="space-y-3">
      <header>
        <h1 className="text-xl font-bold tracking-tight" style={{ color: INK }}>
          حصة اليوم
        </h1>
        <p className="text-sm" style={{ color: MUTED }}>
          المنتخب الأول · مدينة الخليج
        </p>
      </header>

      <section style={{ background: GFF_GREEN_SOFT, borderRadius: 18, padding: 16 }}>
        <div
          className="text-[11px] font-bold uppercase tracking-wider"
          style={{ color: GFF_GREEN }}
        >
          الهدف التكتيكي
        </div>
        <p className="mt-1 text-sm font-semibold" style={{ color: INK }}>
          الانتقال السريع بعد فقدان الكرة · الضغط العالي في أول <N>6</N> ثوانٍ
        </p>
      </section>

      <section
        style={{
          background: "#FFFFFF",
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 16,
          padding: 14,
        }}
      >
        <div className="text-sm font-bold" style={{ color: INK }}>
          محاور التدريب
        </div>
        <ol
          className="mt-2 space-y-1.5 text-[13px]"
          style={{ color: INK, listStylePosition: "inside" }}
        >
          <li>
            إحماء ديناميكي — <N>15</N> دقيقة
          </li>
          <li>
            تمرين الضغط الجماعي — <N>20</N> دقيقة
          </li>
          <li>
            لعبة مصغّرة 7 ضد 7 — <N>25</N> دقيقة
          </li>
          <li>
            كرات ثابتة — <N>15</N> دقيقة
          </li>
          <li>
            استشفاء — <N>10</N> دقائق
          </li>
        </ol>
      </section>

      <section
        style={{
          background: "#FFFFFF",
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 16,
          padding: 14,
        }}
      >
        <div className="text-sm font-bold" style={{ color: INK }}>
          المستدعون اليوم
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {gffPlayers
            .filter((p) => p.teamId === SR)
            .slice(0, 18)
            .map((p) => (
              <span
                key={p.id}
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                style={{ background: GFF_GREEN_SOFT, color: GFF_GREEN }}
              >
                <N>{p.number}</N> · {p.nameAr}
              </span>
            ))}
        </div>
      </section>
    </div>
  );
}

export function GffMobilePerformance() {
  const s = gffStats[0];
  return (
    <div className="space-y-3">
      <header>
        <h1 className="text-xl font-bold tracking-tight" style={{ color: INK }}>
          الأداء
        </h1>
        <p className="text-sm" style={{ color: MUTED }}>
          المنتخب الأول — آخر <N>14</N> مباراة
        </p>
      </header>

      <div className="grid grid-cols-3 gap-2">
        <StatCard label="فوز" value={s.wins} color={GFF_GREEN} />
        <StatCard label="تعادل" value={s.draws} color={GFF_GOLD} />
        <StatCard label="خسارة" value={s.losses} color={ATHL} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <StatCard label="أهداف لنا" value={s.goalsFor} color={GFF_GREEN} />
        <StatCard label="أهداف علينا" value={s.goalsAgainst} color={ATHL} />
      </div>

      <section
        style={{
          background: "#FFFFFF",
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 16,
          padding: 14,
        }}
      >
        <div className="flex items-center gap-2 text-[12px] font-semibold" style={{ color: MUTED }}>
          <TrendingUp className="h-3.5 w-3.5" /> الترتيب
        </div>
        <ul className="mt-2 space-y-1.5 text-[13px]" style={{ color: INK }}>
          <li className="flex items-center justify-between">
            <span>ترتيب الفيفا</span>
            <span className="font-bold">
              <N>#{s.fifaRanking}</N>
            </span>
          </li>
          <li className="flex items-center justify-between">
            <span>الترتيب الآسيوي</span>
            <span className="font-bold">
              <N>#{s.afcRanking}</N>
            </span>
          </li>
        </ul>
      </section>

      <section style={{ background: GFF_GOLD_SOFT, borderRadius: 16, padding: 14 }}>
        <div
          className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider"
          style={{ color: "#8a6a14" }}
        >
          <Trophy className="h-3.5 w-3.5" /> الهداف
        </div>
        <p className="mt-1 text-sm font-bold" style={{ color: INK }}>
          {gffPlayers.find((p) => p.nameLatin === s.topScorer)?.nameAr ?? s.topScorer} ·{" "}
          <N>{s.topScorerGoals}</N> أهداف
        </p>
      </section>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: 14,
        padding: 12,
        textAlign: "center",
      }}
    >
      <div className="text-[11px]" style={{ color: MUTED }}>
        {label}
      </div>
      <div className="mt-1 text-2xl font-extrabold" style={{ color }}>
        <N>{value}</N>
      </div>
    </div>
  );
}

// ============================================================================
// MESSAGES
// ============================================================================

interface GffThread {
  id: string;
  titleAr: string;
  subtitleAr: string;
  unread: number;
  messages: { id: string; mine: boolean; authorAr?: string; text: string; time: string }[];
}

const GFF_THREADS_COACH: GffThread[] = [
  {
    id: "t1",
    titleAr: "الجهاز الفني — المنتخب الأول",
    subtitleAr: "8 أعضاء",
    unread: 2,
    messages: [
      {
        id: "m1",
        mine: false,
        authorAr: "د. سالم العتيبة",
        text: "تقرير الفحص الطبي جاهز. هناك ٣ لاعبين تحت المراقبة.",
        time: "09:14",
      },
      {
        id: "m2",
        mine: false,
        authorAr: "محمود الشريف",
        text: "خطة الإحماء معدّلة لتقليل الحمل اليوم.",
        time: "09:32",
      },
      { id: "m3", mine: true, text: "ممتاز. نراكم في الملعب الساعة 17:30 للتحضير.", time: "09:40" },
    ],
  },
  {
    id: "t2",
    titleAr: "المنتخب الأول",
    subtitleAr: "24 لاعبًا",
    unread: 5,
    messages: [
      {
        id: "m1",
        mine: true,
        text: "تذكير: تركيز على الانتقال السريع في تدريب اليوم.",
        time: "08:00",
      },
      { id: "m2", mine: false, authorAr: "أحمد الزعابي", text: "حاضر يا كابتن.", time: "08:12" },
    ],
  },
  {
    id: "t3",
    titleAr: "حمد الرميثي — المدير الرياضي",
    subtitleAr: "محادثة فردية",
    unread: 0,
    messages: [
      {
        id: "m1",
        mine: false,
        authorAr: "حمد الرميثي",
        text: "اجتماع غدًا الساعة 11:00 لمراجعة استدعاءات يونيو.",
        time: "أمس",
      },
    ],
  },
];

const GFF_THREADS_PLAYER: GffThread[] = [
  {
    id: "t1",
    titleAr: "كارلوس مينديز — المدرب الرئيسي",
    subtitleAr: "محادثة فردية",
    unread: 1,
    messages: [
      {
        id: "m1",
        mine: false,
        authorAr: "كارلوس مينديز",
        text: "أداؤك أمام لبنان كان رائعًا. ركّز على التغطية الدفاعية في تدريب اليوم.",
        time: "09:10",
      },
      { id: "m2", mine: true, text: "شكرًا كوتش. سأعمل عليها.", time: "09:22" },
    ],
  },
  {
    id: "t2",
    titleAr: "المنتخب الأول",
    subtitleAr: "24 لاعبًا",
    unread: 5,
    messages: [
      {
        id: "m1",
        mine: false,
        authorAr: "كارلوس مينديز",
        text: "تذكير: تركيز على الانتقال السريع في تدريب اليوم.",
        time: "08:00",
      },
    ],
  },
  {
    id: "t3",
    titleAr: "د. سالم العتيبة — طبيب الفريق",
    subtitleAr: "محادثة فردية",
    unread: 0,
    messages: [
      {
        id: "m1",
        mine: false,
        authorAr: "د. سالم العتيبة",
        text: "نتائج الفحص ممتازة. تابع تمارين التقوية.",
        time: "أمس",
      },
    ],
  },
];

export function GffMobileMessages() {
  const user = useCurrentUser();
  const isCoach = user?.role === "technical";
  const accent = isCoach ? COACH : ATHL;
  const threads = isCoach ? GFF_THREADS_COACH : GFF_THREADS_PLAYER;

  const [openId, setOpenId] = useState<string | null>(null);
  const active = threads.find((t) => t.id === openId);

  if (active) {
    return (
      <div className="flex h-[calc(100vh-12rem)] flex-col">
        <header
          className="flex items-center gap-2 border-b pb-3"
          style={{ borderColor: CARD_BORDER }}
        >
          <button
            onClick={() => setOpenId(null)}
            aria-label="رجوع"
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ background: "#FFFFFF", border: `1px solid ${CARD_BORDER}` }}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-bold" style={{ color: INK }}>
              {active.titleAr}
            </h1>
            <p className="text-[11px]" style={{ color: MUTED }}>
              {active.subtitleAr}
            </p>
          </div>
        </header>
        <div className="flex-1 space-y-2 overflow-y-auto py-3">
          {active.messages.map((m) => (
            <div key={m.id} className={`flex ${m.mine ? "justify-start" : "justify-end"}`}>
              <div
                className="max-w-[80%] rounded-2xl px-3 py-2 text-sm"
                style={{
                  background: m.mine ? accent : "#FFFFFF",
                  color: m.mine ? "#FFFFFF" : INK,
                  border: m.mine ? "none" : `1px solid ${CARD_BORDER}`,
                }}
              >
                {!m.mine && m.authorAr && (
                  <div className="mb-1 text-[10px] font-semibold opacity-70">{m.authorAr}</div>
                )}
                <div className="whitespace-pre-wrap break-words">{m.text}</div>
                <div className="mt-1 text-[10px] opacity-60">
                  <N>{m.time}</N>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 border-t pt-3" style={{ borderColor: CARD_BORDER }}>
          <input
            type="text"
            placeholder="اكتب رسالة…"
            className="flex-1 rounded-full border px-4 py-2 text-sm outline-none"
            style={{ borderColor: CARD_BORDER, background: "#FFFFFF", color: INK }}
          />
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ background: accent, color: "#FFFFFF" }}
            aria-label="إرسال"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <header>
        <h1 className="text-xl font-bold tracking-tight" style={{ color: INK }}>
          الرسائل
        </h1>
        <p className="text-xs" style={{ color: MUTED }}>
          اضغط على محادثة لفتحها
        </p>
      </header>
      <ul className="space-y-2">
        {threads.map((t) => {
          const last = t.messages[t.messages.length - 1];
          return (
            <li key={t.id}>
              <button
                onClick={() => setOpenId(t.id)}
                className="flex w-full items-start gap-3 text-start"
                style={{
                  background: "#FFFFFF",
                  border: `1px solid ${CARD_BORDER}`,
                  borderRadius: 16,
                  padding: 12,
                }}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{ background: GFF_GREEN_SOFT, color: GFF_GREEN }}
                >
                  {t.titleAr.slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-sm font-semibold" style={{ color: INK }}>
                      {t.titleAr}
                    </div>
                    {t.unread > 0 && (
                      <span
                        className="rounded-full px-1.5 text-[10px] font-bold"
                        style={{ background: accent, color: "#FFFFFF" }}
                      >
                        <N>{t.unread}</N>
                      </span>
                    )}
                  </div>
                  {last && (
                    <div className="truncate text-[11px]" style={{ color: MUTED }}>
                      {last.text}
                    </div>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ============================================================================
// PROFILE
// ============================================================================

export function GffMobileProfile() {
  const user = useCurrentUser();
  const isCoach = user?.role === "technical";
  const nameAr = isCoach ? "كارلوس مينديز" : "أحمد الزعابي";
  const roleAr = isCoach
    ? "المدرب الرئيسي · المنتخب الأول"
    : "صانع ألعاب · المنتخب الأول · الرقم 10";
  const accent = isCoach ? COACH : ATHL;
  return (
    <div className="space-y-3">
      <section
        style={{
          background: "#FFFFFF",
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 18,
          padding: 18,
          textAlign: "center",
        }}
      >
        <div
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold"
          style={{ background: GFF_GREEN_SOFT, color: GFF_GREEN }}
        >
          {nameAr.slice(0, 1)}
        </div>
        <div className="mt-3 text-lg font-bold" style={{ color: INK }}>
          {nameAr}
        </div>
        <div className="text-[12px]" style={{ color: MUTED }}>
          {roleAr}
        </div>
        <div
          className="mt-3 inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
          style={{ background: GFF_GOLD_SOFT, color: "#8a6a14" }}
        >
          اتحاد كرة القدم الخليجي
        </div>
      </section>

      <section
        style={{
          background: "#FFFFFF",
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 16,
          padding: 14,
        }}
      >
        <div className="text-sm font-bold" style={{ color: INK }}>
          الإعدادات
        </div>
        <ul className="mt-2 space-y-1 text-[13px]" style={{ color: INK }}>
          <li
            className="flex items-center justify-between border-b py-2"
            style={{ borderColor: CARD_BORDER }}
          >
            <span>اللغة</span>
            <span style={{ color: MUTED }}>العربية</span>
          </li>
          <li
            className="flex items-center justify-between border-b py-2"
            style={{ borderColor: CARD_BORDER }}
          >
            <span>الإشعارات</span>
            <span className="inline-flex items-center gap-1" style={{ color: accent }}>
              <Bell className="h-3.5 w-3.5" /> مفعّلة
            </span>
          </li>
          <li className="flex items-center justify-between py-2">
            <span>المنطقة الزمنية</span>
            <span style={{ color: MUTED }}>
              <N>GMT+4</N>
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}
