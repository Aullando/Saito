import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin, UserCheck, TriangleAlert } from "lucide-react";
import { useCurrentUser, useData } from "@/lib/store";

export const Route = createFileRoute("/_app/mobile/calendar")({
  component: MobileCalendar,
});

const INK = "#21324A";
const MUTED = "#66758A";
const SOFT = "#EEF3F8";
const CARD_BORDER = "#DDE6F0";
const COACH = "#00A74D";
const COACH_BG = "#EAF8F0";
const COACH_BORDER = "#AFE5C6";
const ATHL = "#F12F4A";
const ATHL_SOFT = "#FFE7EC";
const ATHL_MID = "#FFC9D1";
const ATHL_STRONG = "#F4889A";

const DOW_ES = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const toIso = (d: Date) => d.toISOString().slice(0, 10);

function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function buildMonthGrid(year: number, month: number): Date[] {
  // Always render 5 rows starting from Monday of the week containing day 1.
  const first = new Date(year, month, 1);
  const start = startOfWeek(first);
  return Array.from({ length: 35 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function MobileCalendar() {
  const user = useCurrentUser();
  const events = useData((s) => s.events);
  const isCoach = user?.role === "technical";
  const accent = isCoach ? COACH : ATHL;
  const accentBg = isCoach ? COACH_BG : ATHL_SOFT;
  const accentBorder = isCoach ? COACH_BORDER : ATHL_MID;

  const [view, setView] = useState<"week" | "month">("month");
  const [cursor, setCursor] = useState<Date>(new Date());
  const [selected, setSelected] = useState<string>(toIso(new Date()));

  const eventsByDate = useMemo(() => {
    const m: Record<string, typeof events> = {};
    events.forEach((e) => ((m[e.date] ||= []).push(e)));
    Object.values(m).forEach((list) =>
      list.sort((a, b) => a.startTime.localeCompare(b.startTime)),
    );
    return m;
  }, [events]);

  const todayIso = toIso(new Date());
  const monthLabel = `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`;
  const dayEvents = eventsByDate[selected] ?? [];

  const goPrev = () => {
    const d = new Date(cursor);
    if (view === "week") d.setDate(d.getDate() - 7);
    else d.setMonth(d.getMonth() - 1);
    setCursor(d);
  };
  const goNext = () => {
    const d = new Date(cursor);
    if (view === "week") d.setDate(d.getDate() + 7);
    else d.setMonth(d.getMonth() + 1);
    setCursor(d);
  };

  // intensity helper for month cells
  const intensityFill = (count: number) => {
    if (count <= 0) return "transparent";
    if (count === 1) return ATHL_SOFT;
    if (count === 2) return ATHL_MID;
    return ATHL_STRONG;
  };

  return (
    <div className="space-y-4">
      {/* Toggle Semana / Mes */}
      <div
        className="grid grid-cols-2 p-1"
        style={{
          background: SOFT,
          borderRadius: 999,
          border: `1px solid ${CARD_BORDER}`,
        }}
      >
        {(["week", "month"] as const).map((v) => {
          const active = view === v;
          return (
            <button
              key={v}
              onClick={() => setView(v)}
              className="flex items-center justify-center"
              style={{
                height: 38,
                borderRadius: 999,
                background: active ? "#FFFFFF" : "transparent",
                color: active ? accent : MUTED,
                fontWeight: 700,
                fontSize: 14,
                boxShadow: active ? "0 2px 6px rgba(33,50,74,0.06)" : "none",
                transition: "all 0.15s",
              }}
            >
              {v === "week" ? "Semana" : "Mes"}
            </button>
          );
        })}
      </div>

      {/* Cabecera mes/semana */}
      <div
        className="flex items-center justify-between"
        style={{
          background: SOFT,
          borderRadius: 14,
          padding: "10px 14px",
        }}
      >
        <button
          aria-label="Anterior"
          onClick={goPrev}
          className="flex h-8 w-8 items-center justify-center rounded-full active:scale-95"
          style={{ color: MUTED }}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span
          className="rounded-full px-4 py-1 text-sm font-semibold capitalize"
          style={{ background: "#9CA9BD", color: "#FFFFFF" }}
        >
          {monthLabel}
        </span>
        <button
          aria-label="Siguiente"
          onClick={goNext}
          className="flex h-8 w-8 items-center justify-center rounded-full active:scale-95"
          style={{ color: MUTED }}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Cabecera días de la semana */}
      <div className="grid grid-cols-7 gap-1 px-1">
        {DOW_ES.map((d) => (
          <div
            key={d}
            className="text-center"
            style={{ color: MUTED, fontSize: 12, fontWeight: 600 }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      {view === "month" ? (
        <MonthGrid
          year={cursor.getFullYear()}
          month={cursor.getMonth()}
          selected={selected}
          today={todayIso}
          accent={accent}
          eventsByDate={eventsByDate}
          intensityFill={intensityFill}
          onSelect={setSelected}
        />
      ) : (
        <WeekGrid
          cursor={cursor}
          selected={selected}
          today={todayIso}
          accent={accent}
          accentBg={accentBg}
          accentBorder={accentBorder}
          eventsByDate={eventsByDate}
          onSelect={setSelected}
        />
      )}

      {/* Detalle del día seleccionado */}
      <DaySummary
        date={selected}
        events={dayEvents}
        isCoach={!!isCoach}
        accent={accent}
        accentBg={accentBg}
      />
    </div>
  );
}

function MonthGrid({
  year,
  month,
  selected,
  today,
  accent,
  eventsByDate,
  intensityFill,
  onSelect,
}: {
  year: number;
  month: number;
  selected: string;
  today: string;
  accent: string;
  eventsByDate: Record<string, { id: string }[]>;
  intensityFill: (n: number) => string;
  onSelect: (iso: string) => void;
}) {
  const grid = useMemo(() => buildMonthGrid(year, month), [year, month]);
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {grid.map((d) => {
        const iso = toIso(d);
        const inMonth = d.getMonth() === month;
        const isSel = iso === selected;
        const isToday = iso === today;
        const count = eventsByDate[iso]?.length ?? 0;
        const fill = inMonth ? intensityFill(count) : "transparent";
        const textColor = isToday ? "#FFFFFF" : inMonth ? "#21324A" : "#B6C0CE";
        return (
          <button
            key={iso}
            onClick={() => onSelect(iso)}
            className="aspect-square active:scale-95"
            style={{
              borderRadius: 12,
              background: isToday ? "#2A3A55" : fill,
              border: isSel ? `1.5px solid ${accent}` : "1px solid transparent",
              color: textColor,
              fontWeight: isToday || isSel ? 700 : 500,
              fontSize: 14,
              transition: "all 0.12s",
            }}
          >
            {d.getDate()}
          </button>
        );
      })}
    </div>
  );
}

function WeekGrid({
  cursor,
  selected,
  today,
  accent,
  accentBg,
  accentBorder,
  eventsByDate,
  onSelect,
}: {
  cursor: Date;
  selected: string;
  today: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
  eventsByDate: Record<string, { id: string }[]>;
  onSelect: (iso: string) => void;
}) {
  const start = startOfWeek(cursor);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {days.map((d) => {
        const iso = toIso(d);
        const isSel = iso === selected;
        const isToday = iso === today;
        const has = (eventsByDate[iso]?.length ?? 0) > 0;
        return (
          <button
            key={iso}
            onClick={() => onSelect(iso)}
            className="aspect-[5/6] flex flex-col items-center justify-center active:scale-95"
            style={{
              borderRadius: 14,
              background: isSel ? accent : isToday ? accentBg : "#FFFFFF",
              color: isSel ? "#FFFFFF" : isToday ? accent : "#21324A",
              border: `1px solid ${isSel ? accent : isToday ? accentBorder : "#E4EAF2"}`,
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 700 }}>{d.getDate()}</span>
            <span
              className="mt-1"
              style={{
                width: 5,
                height: 5,
                borderRadius: 999,
                background: has ? (isSel ? "#FFFFFF" : accent) : "transparent",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}

function DaySummary({
  date,
  events,
  isCoach,
  accent,
  accentBg,
}: {
  date: string;
  events: ReturnType<typeof useData.getState>["events"];
  isCoach: boolean;
  accent: string;
  accentBg: string;
}) {
  const d = new Date(date);
  const label = `${d.getDate()} ${MONTHS[d.getMonth()].toLowerCase()}`;
  const first = events[0];
  const sessionTarget = isCoach ? "/mobile/session" : "/mobile/session-info";

  if (!first) {
    return (
      <section className="space-y-2 pt-1">
        <h2 style={{ color: INK, fontSize: 20, fontWeight: 700 }}>
          {label} <span style={{ color: MUTED }}>|</span> <span style={{ color: MUTED, fontWeight: 600 }}>Sin eventos</span>
        </h2>
        <div
          className="text-center"
          style={{
            background: SOFT,
            borderRadius: 18,
            padding: 28,
            color: MUTED,
            fontStyle: "italic",
            fontSize: 14,
          }}
        >
          Día libre. Disfruta del descanso.
        </div>
      </section>
    );
  }

  const type = first.type.toLowerCase();
  const typeLabel = type.includes("match") || type.includes("partido")
    ? "Partido"
    : type.includes("medic") || type.includes("médic")
      ? "Médico"
      : type.includes("event") || type.includes("evento")
        ? "Evento"
        : "Entrenamiento";

  return (
    <section className="space-y-3 pt-1">
      <h2 style={{ color: INK, fontSize: 20, fontWeight: 700 }}>
        {label} <span style={{ color: MUTED, fontWeight: 500 }}>|</span>{" "}
        <span style={{ color: INK, fontWeight: 700 }}>{typeLabel}</span>
      </h2>
      <div className="flex flex-col gap-1.5" style={{ color: MUTED, fontSize: 13 }}>
        <span className="inline-flex items-center gap-2">
          <Clock className="h-3.5 w-3.5" /> {first.startTime}
        </span>
        {first.location && (
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" /> {first.location}
          </span>
        )}
      </div>

      {!isCoach && (
        <>
          <div
            className="flex items-center gap-2"
            style={{
              background: "#FFFFFF",
              border: `1px solid ${CARD_BORDER}`,
              borderRadius: 14,
              padding: "12px 14px",
              fontSize: 14,
              color: INK,
            }}
          >
            <UserCheck className="h-4 w-4" style={{ color: MUTED }} />
            Has sido convocado
          </div>
          <Link
            to="/mobile/absence"
            className="inline-flex items-center gap-2"
            style={{
              alignSelf: "flex-start",
              background: "#8A98AA",
              color: "#FFFFFF",
              borderRadius: 999,
              padding: "10px 18px",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <TriangleAlert className="h-4 w-4" /> Notificar ausencia
          </Link>
        </>
      )}

      <Link
        to={sessionTarget}
        className="block"
        style={{
          background: SOFT,
          borderRadius: 16,
          padding: 18,
          color: MUTED,
          fontSize: 13,
          fontStyle: "italic",
          textAlign: "center",
        }}
      >
        {isCoach ? "Abrir información de la sesión" : "Aún no hay información sobre la sesión"}
      </Link>

      {/* sutil sello del accent para mantener identidad de rol */}
      <div
        className="mx-auto"
        style={{
          width: 28,
          height: 3,
          background: accent,
          borderRadius: 999,
          opacity: 0.4,
          marginTop: 4,
        }}
      />
      <div style={{ display: "none" }}>{accentBg}</div>
    </section>
  );
}
