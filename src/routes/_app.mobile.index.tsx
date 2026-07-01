import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  TriangleAlert,
  Activity,
  CalendarPlus,
  ChevronDown,
  X,
  Star,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useCurrentUser, useData } from "@/lib/store";
import { useSessionLocal } from "@/lib/sessionLocal";
import { useClub } from "@/clubs/ClubProvider";
import { GffMobileHome } from "@/clubs/gff/GffMobileWorkspace";
import { CnsoMobileHome } from "@/clubs/cnso/CnsoMobileWorkspace";
import { useTr } from "@/lib/i18n";
import {
  ATHL,
  AbsenceModal,
  CARD_BORDER,
  COACH,
  Ev,
  GroupSelector,
  INK,
  MUTED,
  RatingCard,
  SHADOW,
  SOFT_BG,
  Stars,
  TodayCard,
} from "@/features/mobile/homeUi";

const DEMO_SESSION_ID = "session-today";

export const Route = createFileRoute("/_app/mobile/")({
  component: MobileHome,
});

function MobileHome() {
  const { club } = useClub();
  if (club.id === "gff-demo") return <GffMobileHome />;
  if (club.id === "cnso") return <CnsoMobileHome />;
  return <DefaultMobileHome />;
}

function DefaultMobileHome() {
  const user = useCurrentUser();
  const events = useData((s) => s.events);
  const today = new Date().toISOString().slice(0, 10);
  const isCoach = user?.role === "technical";

  const todayEvent = useMemo(() => events.find((e) => e.date === today), [events, today]);

  return isCoach ? <CoachHome event={todayEvent} /> : <AthleteHome event={todayEvent} />;
}


/* ─────────────── ATHLETE HOME ─────────────── */
function AthleteHome({ event }: { event: Ev }) {
  const tr = useTr();
  const [absenceOpen, setAbsenceOpen] = useState(false);
  const [absenceNotified, setAbsenceNotified] = useState(false);
  const [improveOpen, setImproveOpen] = useState(false);

  return (
    <div className="space-y-4">
      <TodayCard
        event={event}
        ctaLabel={tr("Información de la sesión", "Session info")}
        ctaTo="/mobile/session-info"
        accent={ATHL}
      />

      {/* Notificar ausencia */}
      {absenceNotified ? (
        <div
          className="flex w-full items-center justify-between px-5"
          style={{
            height: 52,
            borderRadius: 999,
            background: "#EAF8F0",
            color: "#00843D",
            border: "1px solid #AFE5C6",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          <span className="inline-flex items-center gap-2">
            <Check className="h-4 w-4" /> {tr("Ausencia notificada", "Absence notified")}
          </span>
          <button
            onClick={() => setAbsenceNotified(false)}
            className="text-[12px] font-semibold underline"
          >
            {tr("Deshacer", "Undo")}
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAbsenceOpen(true)}
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
          <TriangleAlert className="h-4 w-4" /> {tr("Notificar ausencia", "Report absence")}
        </button>
      )}

      {/* Salud */}
      <section className="space-y-2">
        <div
          className="flex items-center gap-2"
          style={{ color: MUTED, fontSize: 14, fontWeight: 600 }}
        >
          <Activity className="h-4 w-4" /> {tr("Salud", "Health")}
        </div>
        <div
          style={{
            background: SOFT_BG,
            borderRadius: 18,
            padding: 14,
          }}
          className="space-y-2"
        >
          <Link
            to="/mobile/treatment"
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
            {tr("Plan de tratamiento", "Treatment plan")}
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
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
          <Link
            to="/mobile/request-appointment"
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
            <CalendarPlus className="h-4 w-4" /> {tr("Solicitar cita médica", "Request medical appointment")}
          </Link>
        </div>
      </section>

      {/* Mi rendimiento */}
      <section className="space-y-2">
        <div
          className="flex items-center gap-2"
          style={{ color: MUTED, fontSize: 14, fontWeight: 600 }}
        >
          <Trophy className="h-4 w-4" /> {tr("Mi rendimiento", "My performance")}
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
            <span style={{ color: ATHL, fontSize: 14, fontWeight: 700 }}>
              {tr("Mejora tu rendimiento:", "Improve your performance:")}
            </span>
          </button>
          <p className="mt-2" style={{ color: INK, fontSize: 13, lineHeight: "20px" }}>
            {tr("Trabaja la transición tras pérdida. Reduces 0,8 s de reacción defensiva si activas presión inmediata los primeros 6 segundos.", "Work on transition after losing the ball. You cut 0.8s off defensive reaction with immediate press in the first 6 seconds.")}
            {improveOpen && (
              <> {tr("Suma 2 sprints cortos al calentamiento y termina con 5 min de respiración 4-7-8.", "Add 2 short sprints to warm-up and finish with 5 min of 4-7-8 breathing.")}</>
            )}
          </p>
          <div
            className="mt-3 flex items-center justify-center"
            style={{
              background: "#FFE7EC",
              borderRadius: 999,
              height: 28,
              color: ATHL,
            }}
          >
            <button onClick={() => setImproveOpen((v) => !v)} aria-label="Toggle">
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
            <span style={{ color: MUTED, fontSize: 13 }}>{tr("Última valoración", "Last rating")}</span>
            <span style={{ color: MUTED, fontSize: 12 }}>22/10/25</span>
          </div>
          <div className="mt-1.5">
            <Stars value={3} color={ATHL} />
          </div>
          <p className="mt-2" style={{ color: INK, fontSize: 13, lineHeight: "19px" }}>
            {tr("Están funcionando muy bien los pases largos cruzados. Aunque puedes mejorar las combinaciones rápidas con el extremo.", "Your long cross-field passes are working great. You can still improve quick combinations with the winger.")}
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
            <span style={{ color: MUTED, fontSize: 13 }}>{tr("Valoración media", "Average rating")}</span>
            <span style={{ color: MUTED, fontSize: 12 }}>{tr("(últimos 30 días)", "(last 30 days)")}</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Star className="h-5 w-5" style={{ color: ATHL, fill: ATHL }} />
            <span style={{ color: INK, fontSize: 22, fontWeight: 700 }}>3,45</span>
          </div>
        </div>
      </section>

      {absenceOpen && (
        <AbsenceModal
          onClose={() => setAbsenceOpen(false)}
          onConfirm={() => {
            setAbsenceOpen(false);
            setAbsenceNotified(true);
            toast.success(tr("Ausencia notificada al entrenador", "Absence reported to coach"));
          }}
        />
      )}
    </div>
  );
}

/* ─────────────── COACH HOME ─────────────── */
function CoachHome({ event }: { event: Ev }) {
  const tr = useTr();
  const [group, setGroup] = useState(tr("Cadete - Grupo A", "U16 - Group A"));
  const [absencesOpen, setAbsencesOpen] = useState(true);
  const storeAbsences = useSessionLocal((s) => s.absences);
  const saveRating = useSessionLocal((s) => s.saveRating);

  const seedAbsences = [
    { id: "ab1", name: "Lucía García", reason: tr("Enfermedad", "Illness") },
    { id: "ab2", name: "Mario Pérez", reason: tr("Estudios", "Studies") },
  ];
  const liveAbsences = storeAbsences
    .filter((a) => a.sessionId === DEMO_SESSION_ID)
    .map((a) => ({ id: a.id, name: a.athleteName, reason: a.reason }));
  const absences = [...liveAbsences, ...seedAbsences];

  const notFit = [
    { id: "nf1", name: "Pablo Torres Domínguez" },
    { id: "nf2", name: "Héctor Navarro Gómez" },
  ];

  const ratingAthletes = [
    { id: "r1", name: "Alejandro Ruiz Fernández" },
    { id: "r2", name: "Andrés Vega Romero" },
    { id: "r3", name: "Luca Hernández Soto" },
  ];

  return (
    <div className="space-y-4">
      {/* Selector de grupo */}
      <GroupSelector value={group} onChange={setGroup} />

      <TodayCard
        event={event}
        ctaLabel={tr("Información de la sesión", "Session info")}
        ctaTo="/mobile/session"
        accent={COACH}
      />

      {/* Ausencias notificadas */}
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
            {tr("Ausencias notificadas", "Reported absences")}
            {absences.length > 0 && (
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
                {absences.length}
              </span>
            )}
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
                <span className="font-medium">{a.name}</span>
                <span style={{ color: MUTED, fontSize: 12 }}>{a.reason}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* No aptos */}
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
          <X className="h-4 w-4" /> {tr("No aptos", "Not fit")}
        </div>
        <ul className="mt-2 space-y-0.5">
          {notFit.map((a) => (
            <li key={a.id} style={{ color: INK, fontSize: 14 }}>
              {a.name}
            </li>
          ))}
        </ul>
      </section>

      {/* Valoración de rendimiento */}
      <section className="space-y-2">
        <div
          className="flex items-center gap-2"
          style={{ color: MUTED, fontSize: 14, fontWeight: 600 }}
        >
          <Star className="h-4 w-4" /> {tr("Valoración de rendimiento", "Performance rating")}
        </div>
        <div
          className="flex gap-3 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", marginInline: -4 }}
        >
          {ratingAthletes.map((a) => (
            <RatingCard
              key={a.id}
              athleteName={a.name}
              onSubmit={(value, text) => {
                saveRating(DEMO_SESSION_ID, value * 2, 7, text || undefined);
                toast.success(tr(`Valoración enviada a ${a.name.split(" ")[0]}`, `Rating sent to ${a.name.split(" ")[0]}`));
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
