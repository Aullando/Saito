// CNSO mobile workspace — pantallas adaptadas a NATACIÓN para el entrenador
// y el nadador del Club Natación Santa Olaya. Mirror del patrón GFF, pero en
// español y centrado en piscina, calles, series y marcas personales.
import { useMemo } from "react";
import {
  Clock,
  MapPin,
  Check,
  Sparkles,
  Activity,
  Trophy,
  Waves,
  HeartPulse,
  TrendingUp,
  CalendarPlus,
  Timer,
} from "lucide-react";
import { useCurrentUser } from "@/lib/store";
import { CNSO_MEMBERS, CNSO_COACHES } from "./seed/people";
import { CNSO_SESSIONS } from "./seed/sessions";
import { CNSO_COMPETITIONS } from "./seed/competitions";
import { CNSO_VENUES } from "./seed/venues";

// ----- Paleta CNSO ----------------------------------------------------------
const INK = "#0A2540";
const MUTED = "#5B6B82";
const SOFT_BG = "#EAF3F8";
const CARD_BORDER = "#D8E4EE";
const CNSO_BLUE = "#0D688E";
const CNSO_BLUE_SOFT = "#E0EEF5";
const CNSO_LIME = "#00B96B";
const CNSO_LIME_SOFT = "#DEF6EA";
const ALERT = "#E11D48";

const today = () => new Date().toISOString().slice(0, 10);
const todayDate = today();

function fmtDateEs(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

function getDemoMember() {
  // Marta Fernández — nadadora élite (espalda) por defecto
  return CNSO_MEMBERS[0];
}
function getDemoCoach() {
  return CNSO_COACHES[0]; // Iván Méndez
}

// ============================================================================
// HOME — saludo + próxima sesión + competición + marcas
// ============================================================================
export function CnsoMobileHome() {
  const user = useCurrentUser();
  const isCoach = user?.role === "technical" || user?.role === "manager";
  const member = getDemoMember();
  const coach = getDemoCoach();
  const todaySessions = useMemo(
    () => CNSO_SESSIONS.filter((s) => s.date === todayDate).slice(0, 3),
    [],
  );
  const nextComp = CNSO_COMPETITIONS[0];

  return (
    <div className="space-y-3">
      <header
        style={{
          background: `linear-gradient(135deg, ${CNSO_BLUE} 0%, #0A4E6E 100%)`,
          borderRadius: 18,
          padding: 16,
          color: "#fff",
        }}
      >
        <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">
          {isCoach ? "Entrenador" : "Nadador/a"} · CNSO
        </div>
        <h1 className="mt-1 text-xl font-bold tracking-tight">
          Hola, {isCoach ? coach.name.split(" ")[0] : member.firstName}
        </h1>
        <p className="mt-1 text-[13px] opacity-90">
          {isCoach
            ? `${todaySessions.length} sesiones hoy en Las Mestas`
            : `${member.activity} · grupo de ${coach.name}`}
        </p>
      </header>

      <section
        style={{
          background: "#fff",
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 16,
          padding: 14,
        }}
      >
        <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: MUTED }}>
          Próxima sesión
        </div>
        <div className="mt-1 text-sm font-bold" style={{ color: INK }}>
          {todaySessions[0]?.activity ?? "Sin sesiones hoy"}
        </div>
        {todaySessions[0] && (
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[12px]" style={{ color: MUTED }}>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {todaySessions[0].time}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {todaySessions[0].roomLabel}
            </span>
            <span className="inline-flex items-center gap-1">
              <Timer className="h-3.5 w-3.5" /> {todaySessions[0].durationMin}′
            </span>
          </div>
        )}
      </section>

      <section
        style={{
          background: CNSO_LIME_SOFT,
          border: `1px solid ${CNSO_LIME}33`,
          borderRadius: 16,
          padding: 14,
        }}
      >
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: "#066b3f" }}>
          <Trophy className="h-3.5 w-3.5" /> Próxima competición
        </div>
        <div className="mt-1 text-sm font-bold" style={{ color: INK }}>
          {nextComp.name}
        </div>
        <div className="mt-0.5 text-[12px]" style={{ color: MUTED }}>
          {fmtDateEs(nextComp.date)} · {nextComp.venue}
        </div>
      </section>

      {!isCoach && (
        <section
          style={{
            background: "#fff",
            border: `1px solid ${CARD_BORDER}`,
            borderRadius: 16,
            padding: 14,
          }}
        >
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: MUTED }}>
            <Waves className="h-3.5 w-3.5" /> Marcas personales
          </div>
          <ul className="mt-2 space-y-1.5 text-[13px]" style={{ color: INK }}>
            {member.bestTimes.slice(0, 3).map((m) => (
              <li key={m.event} className="flex items-center justify-between">
                <span>{m.event}</span>
                <span className="font-bold tabular-nums" style={{ color: CNSO_BLUE }}>
                  {m.time}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

// ============================================================================
// SESSION — sesión de hoy, serie estilo natación (calle 1, m, RIT, descanso)
// ============================================================================
export function CnsoMobileSession() {
  const user = useCurrentUser();
  const isCoach = user?.role === "technical" || user?.role === "manager";
  const todaySessions = useMemo(
    () => CNSO_SESSIONS.filter((s) => s.date === todayDate),
    [],
  );
  const session = todaySessions[0] ?? CNSO_SESSIONS[0];
  const venue = CNSO_VENUES.find((v) => v.id === session.venueId);

  return (
    <div className="space-y-3">
      <header>
        <h1 className="text-xl font-bold tracking-tight" style={{ color: INK }}>
          Sesión de hoy
        </h1>
        <p className="text-sm" style={{ color: MUTED }}>
          {session.activity}
        </p>
      </header>

      <section
        style={{
          background: CNSO_BLUE_SOFT,
          borderRadius: 18,
          padding: 16,
          border: `1px solid ${CNSO_BLUE}22`,
        }}
      >
        <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: CNSO_BLUE }}>
          Objetivo del día
        </div>
        <p className="mt-1 text-sm font-semibold" style={{ color: INK }}>
          {session.activity.includes("Velocidad")
            ? "Series cortas de máxima intensidad · arranques explosivos y virajes"
            : session.activity.includes("Tecnificación")
              ? "Drills de técnica · respiración bilateral y patada ondulatoria"
              : "Aeróbico extensivo · control de pulsaciones y eficiencia técnica"}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-[12px]" style={{ color: CNSO_BLUE }}>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {session.time} · {session.durationMin}′
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {venue?.name} · {session.roomLabel}
          </span>
        </div>
      </section>

      <section
        style={{
          background: "#fff",
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 16,
          padding: 14,
        }}
      >
        <div className="text-sm font-bold" style={{ color: INK }}>
          Estructura del set
        </div>
        <ol className="mt-2 space-y-2 text-[13px]" style={{ color: INK }}>
          <SetRow label="Calentamiento" detail="400 crol suave + 4×50 técnica" />
          <SetRow label="Pre-set" detail="8×50 progresivos R:0:50" />
          <SetRow label="Set principal" detail="6×200 ritmo 200 m R:3:00" highlight />
          <SetRow label="Velocidad" detail="8×25 arrancada R:0:40" />
          <SetRow label="Vuelta a la calma" detail="200 suave estilos" />
        </ol>
        <div className="mt-3 text-[11px]" style={{ color: MUTED }}>
          Total: 3 200 m · Zona aeróbica + láctico
        </div>
      </section>

      {isCoach ? (
        <section
          style={{
            background: "#fff",
            border: `1px solid ${CARD_BORDER}`,
            borderRadius: 16,
            padding: 14,
          }}
        >
          <div className="text-sm font-bold" style={{ color: INK }}>
            Calle {session.roomLabel} · convocados
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {CNSO_MEMBERS.filter((m) => m.coachName === session.primaryCoach)
              .slice(0, 10)
              .map((m) => (
                <span
                  key={m.id}
                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                  style={{ background: CNSO_BLUE_SOFT, color: CNSO_BLUE }}
                >
                  {m.firstName} {m.lastName[0]}.
                </span>
              ))}
          </div>
        </section>
      ) : (
        <section
          style={{
            background: "#fff",
            border: `1px solid ${CARD_BORDER}`,
            borderRadius: 16,
            padding: 14,
          }}
        >
          <div className="text-sm font-bold" style={{ color: INK }}>
            Mi posición
          </div>
          <p className="mt-1 text-[13px]" style={{ color: INK }}>
            Calle <strong>{session.roomLabel}</strong> · andén central · turno{" "}
            <strong>2.º</strong>
          </p>
          <p className="mt-1 text-[12px]" style={{ color: MUTED }}>
            Trae bañador de entreno, gorro CNSO, palas y pull-buoy.
          </p>
        </section>
      )}
    </div>
  );
}

function SetRow({ label, detail, highlight }: { label: string; detail: string; highlight?: boolean }) {
  return (
    <li
      style={{
        background: highlight ? CNSO_LIME_SOFT : "transparent",
        borderRadius: 10,
        padding: highlight ? "8px 10px" : 0,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold">{label}</span>
        <span className="text-[12px] tabular-nums" style={{ color: MUTED }}>
          {detail}
        </span>
      </div>
    </li>
  );
}

// ============================================================================
// HEALTH — apto / restricciones / cita médica
// ============================================================================
export function CnsoMobileHealth() {
  return (
    <div className="space-y-3">
      <header>
        <h1 className="text-xl font-bold tracking-tight" style={{ color: INK }}>
          Salud
        </h1>
        <p className="text-sm" style={{ color: MUTED }}>
          Estado deportivo y plan de readaptación
        </p>
      </header>

      <section
        style={{
          background: CNSO_LIME_SOFT,
          borderRadius: 18,
          padding: 16,
          border: `1px solid ${CNSO_LIME}33`,
        }}
      >
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4" style={{ color: "#066b3f" }} />
          <span className="text-sm font-bold" style={{ color: "#066b3f" }}>
            Apto para entrenar
          </span>
        </div>
        <p className="mt-1 text-[12px]" style={{ color: "#066b3f" }}>
          Reconocimiento federativo vigente · próxima revisión en 3 meses.
        </p>
      </section>

      <section
        style={{
          background: "#fff",
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 16,
          padding: 14,
        }}
      >
        <div className="text-sm font-bold" style={{ color: INK }}>
          Restricciones operativas
        </div>
        <ul className="mt-2 space-y-1.5 text-[13px]" style={{ color: INK }}>
          <li className="flex items-center justify-between">
            <span>Evitar series de mariposa máximas</span>
            <span style={{ color: MUTED }}>1 semana</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Trabajo de hombro con goma suave</span>
            <span style={{ color: MUTED }}>2×/sem</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Patada vertical limitada a 3′</span>
            <span style={{ color: MUTED }}>2 semanas</span>
          </li>
        </ul>
      </section>

      <section
        style={{
          background: "#fff",
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 16,
          padding: 14,
        }}
      >
        <div className="flex items-center gap-2 text-sm font-bold" style={{ color: INK }}>
          <HeartPulse className="h-4 w-4" style={{ color: CNSO_BLUE }} /> Equipo médico CNSO
        </div>
        <p className="mt-1 text-[12px]" style={{ color: MUTED }}>
          Dr. M. Lavandera (medicina deportiva) · L. Granda (fisioterapia)
        </p>
      </section>

      <button
        className="flex w-full items-center justify-center gap-2"
        style={{
          height: 48,
          borderRadius: 999,
          background: CNSO_BLUE,
          color: "#FFFFFF",
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        <CalendarPlus className="h-4 w-4" /> Solicitar cita médica
      </button>
    </div>
  );
}

// ============================================================================
// PERFORMANCE — marcas personales, progresión y ranking
// ============================================================================
export function CnsoMobilePerformance() {
  const member = getDemoMember();
  const events = member.bestTimes;
  const totalKm = 142; // demo de temporada
  const sessions = 96;
  const podiums = 4;

  return (
    <div className="space-y-3">
      <header>
        <h1 className="text-xl font-bold tracking-tight" style={{ color: INK }}>
          Mi rendimiento
        </h1>
        <p className="text-sm" style={{ color: MUTED }}>
          Temporada en curso · {member.activity}
        </p>
      </header>

      <div className="grid grid-cols-3 gap-2">
        <StatCard label="Km nadados" value={totalKm} color={CNSO_BLUE} />
        <StatCard label="Sesiones" value={sessions} color={CNSO_LIME} />
        <StatCard label="Podios" value={podiums} color="#D4A017" />
      </div>

      <section
        style={{
          background: "#fff",
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 16,
          padding: 14,
        }}
      >
        <div className="flex items-center gap-2 text-[12px] font-semibold" style={{ color: MUTED }}>
          <Waves className="h-3.5 w-3.5" /> Marcas personales
        </div>
        <ul className="mt-2 space-y-2 text-[13px]" style={{ color: INK }}>
          {events.map((e) => (
            <li key={e.event} className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{e.event}</div>
                <div className="text-[11px]" style={{ color: MUTED }}>
                  {fmtDateEs(e.date)}
                </div>
              </div>
              <span className="text-base font-extrabold tabular-nums" style={{ color: CNSO_BLUE }}>
                {e.time}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section
        style={{
          background: "#fff",
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 16,
          padding: 14,
        }}
      >
        <div className="flex items-center gap-2 text-[12px] font-semibold" style={{ color: MUTED }}>
          <TrendingUp className="h-3.5 w-3.5" /> Ranking del club
        </div>
        <ul className="mt-2 space-y-1.5 text-[13px]" style={{ color: INK }}>
          <li className="flex items-center justify-between">
            <span>{events[0]?.event ?? "Prueba principal"}</span>
            <span className="font-bold">#2 CNSO</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Ranking autonómico</span>
            <span className="font-bold">#7 Asturias</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Ranking nacional categoría</span>
            <span className="font-bold">#48</span>
          </li>
        </ul>
      </section>

      <section
        style={{
          background: CNSO_BLUE_SOFT,
          borderRadius: 16,
          padding: 14,
        }}
      >
        <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider" style={{ color: CNSO_BLUE }}>
          <Sparkles className="h-3.5 w-3.5" /> Foco del mes
        </div>
        <p className="mt-1 text-sm font-semibold" style={{ color: INK }}>
          {member.goal}
        </p>
      </section>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: 14,
        padding: 12,
        textAlign: "center",
      }}
    >
      <div className="text-[11px]" style={{ color: MUTED }}>
        {label}
      </div>
      <div className="mt-1 text-2xl font-extrabold tabular-nums" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

// ============================================================================
// TEAM — grupo / convocatoria del entrenador con nadadores
// ============================================================================
export function CnsoMobileTeam() {
  const user = useCurrentUser();
  const isCoach = user?.role === "technical" || user?.role === "manager";
  const coach = getDemoCoach();
  const myGroup = CNSO_MEMBERS.filter((m) => m.coachName === coach.name);
  const list = isCoach ? myGroup : CNSO_MEMBERS.slice(0, 8);

  return (
    <div className="space-y-3">
      <header>
        <h1 className="text-xl font-bold tracking-tight" style={{ color: INK }}>
          {isCoach ? "Mi grupo" : "Compañeros de calle"}
        </h1>
        <p className="text-sm" style={{ color: MUTED }}>
          {list.length} nadadores · {isCoach ? coach.specialty : "Primer Equipo"}
        </p>
      </header>

      <section
        style={{
          background: "#fff",
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 16,
          padding: 6,
        }}
      >
        <ul className="divide-y" style={{ borderColor: CARD_BORDER }}>
          {list.map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold" style={{ color: INK }}>
                  {m.firstName} {m.lastName}
                </div>
                <div className="truncate text-[11px]" style={{ color: MUTED }}>
                  {m.activity}
                </div>
              </div>
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                style={{
                  background:
                    m.level === "Élite"
                      ? CNSO_BLUE_SOFT
                      : m.level === "Competición"
                        ? CNSO_LIME_SOFT
                        : SOFT_BG,
                  color:
                    m.level === "Élite"
                      ? CNSO_BLUE
                      : m.level === "Competición"
                        ? "#066b3f"
                        : MUTED,
                }}
              >
                {m.level}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section
        style={{
          background: CNSO_BLUE_SOFT,
          borderRadius: 16,
          padding: 14,
        }}
      >
        <div className="flex items-center gap-2 text-[12px] font-semibold" style={{ color: CNSO_BLUE }}>
          <Activity className="h-3.5 w-3.5" /> Próxima convocatoria
        </div>
        <p className="mt-1 text-sm font-semibold" style={{ color: INK }}>
          {CNSO_COMPETITIONS[0].name}
        </p>
        <p className="mt-0.5 text-[11px]" style={{ color: MUTED }}>
          {fmtDateEs(CNSO_COMPETITIONS[0].date)} · {CNSO_COMPETITIONS[0].venue}
        </p>
      </section>
    </div>
  );
}
