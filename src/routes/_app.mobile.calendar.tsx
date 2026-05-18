import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Dumbbell,
  Trophy,
  CalendarDays,
  Stethoscope,
} from "lucide-react";
import { useCurrentUser, useData } from "@/lib/store";

export const Route = createFileRoute("/_app/mobile/calendar")({
  component: MobileCalendar,
});

const COACHING = "#00A74D";
const COACHING_BG = "#EAF8F0";
const COACHING_BORDER = "#AFE5C6";
const INK = "#21324A";
const MUTED = "#66758A";
const SOFT = "#EEF3F8";
const CARD_BORDER = "#DDE6F0";
const SHADOW = "0 4px 16px rgba(33, 50, 74, 0.06)";

const DOW = ["L", "M", "X", "J", "V", "S", "D"];
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const toIso = (d: Date) => d.toISOString().slice(0, 10);

function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // L=0
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}

function eventStyle(type: string) {
  const t = type.toLowerCase();
  if (t.includes("partido") || t.includes("competic") || t.includes("match")) {
    return { color: "#C71F36", bg: "#FFF0F3", border: "#FFC9D1", icon: Trophy };
  }
  if (t.includes("médic") || t.includes("medic") || t.includes("fisio")) {
    return { color: "#B56F00", bg: "#FFF5DF", border: "#FFE0A3", icon: Stethoscope };
  }
  if (t.includes("evento") || t.includes("event")) {
    return { color: "#21324A", bg: "#EEF3F8", border: "#DDE6F0", icon: CalendarDays };
  }
  return { color: "#00843D", bg: COACHING_BG, border: COACHING_BORDER, icon: Dumbbell };
}

function MobileCalendar() {
  const user = useCurrentUser();
  const events = useData((s) => s.events);
  const [selected, setSelected] = useState<string>(toIso(new Date()));
  const [weekStart, setWeekStart] = useState<Date>(startOfWeek(new Date()));

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    });
  }, [weekStart]);

  const eventsByDate = useMemo(() => {
    const m: Record<string, typeof events> = {};
    events.forEach((e) => ((m[e.date] ||= []).push(e)));
    Object.values(m).forEach((list) =>
      list.sort((a, b) => a.startTime.localeCompare(b.startTime)),
    );
    return m;
  }, [events]);

  const dayEvents = eventsByDate[selected] ?? [];
  const todayIso = toIso(new Date());

  const monthLabel = `${MONTHS[days[0].getMonth()]} ${days[0].getFullYear()}`;
  const isCoach = user?.role === "technical";

  return (
    <div className="space-y-4">
      {/* Header con navegación de semana */}
      <header
        style={{
          background: "#FFFFFF",
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 24,
          padding: 16,
          boxShadow: SHADOW,
        }}
      >
        <div className="flex items-center justify-between">
          <button
            aria-label="Semana anterior"
            onClick={() => {
              const d = new Date(weekStart);
              d.setDate(d.getDate() - 7);
              setWeekStart(d);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full active:scale-95"
            style={{ background: SOFT, color: INK }}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="text-center">
            <div style={{ color: MUTED, fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Calendario
            </div>
            <div style={{ color: INK, fontSize: 16, fontWeight: 700, marginTop: 2 }}>
              {monthLabel}
            </div>
          </div>
          <button
            aria-label="Semana siguiente"
            onClick={() => {
              const d = new Date(weekStart);
              d.setDate(d.getDate() + 7);
              setWeekStart(d);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full active:scale-95"
            style={{ background: SOFT, color: INK }}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={() => {
            const now = new Date();
            setWeekStart(startOfWeek(now));
            setSelected(toIso(now));
          }}
          className="mx-auto mt-3 block rounded-full px-3 py-1 text-[11px] font-semibold active:scale-95"
          style={{ background: COACHING_BG, color: "#00843D" }}
        >
          Hoy
        </button>

        {/* Tira de días */}
        <div className="mt-3 grid grid-cols-7 gap-1">
          {days.map((d, i) => {
            const iso = toIso(d);
            const isSelected = iso === selected;
            const isToday = iso === todayIso;
            const hasEvents = (eventsByDate[iso]?.length ?? 0) > 0;
            return (
              <button
                key={iso}
                onClick={() => setSelected(iso)}
                className="flex flex-col items-center justify-center active:scale-95"
                style={{
                  borderRadius: 14,
                  padding: "8px 0",
                  background: isSelected ? COACHING : isToday ? COACHING_BG : "transparent",
                  color: isSelected ? "#FFFFFF" : isToday ? "#00843D" : INK,
                  border: `1px solid ${isSelected ? COACHING : isToday ? COACHING_BORDER : "transparent"}`,
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.8 }}>
                  {DOW[i]}
                </span>
                <span style={{ fontSize: 16, fontWeight: 700, lineHeight: "20px", marginTop: 2 }}>
                  {d.getDate()}
                </span>
                <span
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: 999,
                    marginTop: 3,
                    background: hasEvents ? (isSelected ? "#FFFFFF" : COACHING) : "transparent",
                  }}
                />
              </button>
            );
          })}
        </div>
      </header>

      {/* Día seleccionado */}
      <section>
        <h2
          style={{
            color: INK,
            fontSize: 15,
            fontWeight: 700,
            textTransform: "capitalize",
          }}
        >
          {new Date(selected).toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </h2>
        <p style={{ color: MUTED, fontSize: 12, marginTop: 2 }}>
          {dayEvents.length === 0
            ? "Sin eventos"
            : `${dayEvents.length} ${dayEvents.length === 1 ? "evento" : "eventos"}`}
        </p>

        {dayEvents.length === 0 ? (
          <div
            className="mt-3 flex flex-col items-center justify-center text-center"
            style={{
              background: "#FFFFFF",
              border: `1px dashed ${CARD_BORDER}`,
              borderRadius: 20,
              padding: 28,
              color: MUTED,
              fontSize: 13,
            }}
          >
            <CalendarDays className="mb-2 h-6 w-6" style={{ color: "#A8B5C7" }} />
            Día libre. Disfruta del descanso.
          </div>
        ) : (
          <ul className="mt-3 space-y-2">
            {dayEvents.map((e) => {
              const st = eventStyle(e.type);
              const Icon = st.icon;
              const target = isCoach ? "/mobile/session" : "/mobile/session-info";
              return (
                <li key={e.id}>
                  <Link
                    to={target}
                    className="flex gap-3 active:scale-[0.99]"
                    style={{
                      background: "#FFFFFF",
                      border: `1px solid ${CARD_BORDER}`,
                      borderRadius: 20,
                      padding: 14,
                      boxShadow: SHADOW,
                    }}
                  >
                    {/* Hora */}
                    <div
                      className="flex shrink-0 flex-col items-center justify-center"
                      style={{
                        width: 56,
                        borderRadius: 14,
                        background: st.bg,
                        color: st.color,
                        border: `1px solid ${st.border}`,
                      }}
                    >
                      <span style={{ fontSize: 15, fontWeight: 700, lineHeight: "18px" }}>
                        {e.startTime}
                      </span>
                      {e.endTime && (
                        <span style={{ fontSize: 10, fontWeight: 500, opacity: 0.8, marginTop: 2 }}>
                          {e.endTime}
                        </span>
                      )}
                    </div>

                    {/* Detalle */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: st.color }} />
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: st.color,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                          }}
                        >
                          {e.type}
                        </span>
                      </div>
                      <div
                        className="mt-1 truncate"
                        style={{ color: INK, fontSize: 15, fontWeight: 700 }}
                      >
                        {e.title}
                      </div>
                      <div
                        className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1"
                        style={{ color: MUTED, fontSize: 12 }}
                      >
                        {e.location && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {e.location}
                          </span>
                        )}
                        {isCoach && (
                          <span className="inline-flex items-center gap-1">
                            <Users className="h-3 w-3" /> Equipo
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {e.startTime}
                          {e.endTime ? `–${e.endTime}` : ""}
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
