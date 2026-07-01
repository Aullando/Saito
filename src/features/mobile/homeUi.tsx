import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronDown, Clock, MapPin, Star, X } from "lucide-react";
import { useTr } from "@/lib/i18n";
import { useData } from "@/lib/store";

export const INK = "#21324A";
export const MUTED = "#66758A";
export const SOFT_BG = "#EEF3F8";
export const CARD_BORDER = "#DDE6F0";
export const ATHL = "#F12F4A";
export const COACH = "#00A74D";
export const SHADOW = "0 4px 16px rgba(33, 50, 74, 0.06)";

export type Ev = ReturnType<typeof useData.getState>["events"][number] | undefined;

export function TodayCard({
  event,
  ctaLabel,
  ctaTo,
  accent,
}: {
  event: Ev;
  ctaLabel: string;
  ctaTo: string;
  accent: string;
}) {
  const tr = useTr();
  const title = event ? event.title || tr("Entrenamiento", "Training") : tr("Sin sesión hoy", "No session today");
  return (
    <section style={{ background: SOFT_BG, borderRadius: 18, padding: 18 }}>
      <h2 style={{ color: INK, fontSize: 20, fontWeight: 700 }}>
        {tr("Hoy", "Today")}: <span style={{ fontWeight: 700 }}>{title}</span>
      </h2>
      {event && (
        <div className="mt-1.5 space-y-1" style={{ color: MUTED, fontSize: 13 }}>
          <div className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {event.startTime}
          </div>
          {event.location && (
            <div className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> {event.location}
            </div>
          )}
        </div>
      )}
      <Link
        to={ctaTo}
        className="mt-4 flex items-center justify-between active:scale-[0.98]"
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
        <span>{ctaLabel}</span>
        <span
          className="flex items-center justify-center"
          style={{ width: 36, height: 36, borderRadius: 999, background: "#FFFFFF", color: accent }}
        >
          <ArrowRight className="h-4 w-4" />
        </span>
      </Link>
    </section>
  );
}

export function Stars({ value, color }: { value: number; color: string }) {
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

export function RatingCard({
  athleteName,
  onSubmit,
}: {
  athleteName: string;
  onSubmit: (value: number, text: string) => void;
}) {
  const tr = useTr();
  const [value, setValue] = useState(3);
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: 16,
        padding: 14,
        minWidth: 270,
        flexShrink: 0,
        boxShadow: SHADOW,
      }}
    >
      <div style={{ color: INK, fontSize: 14, fontWeight: 700 }}>{athleteName}</div>
      <div className="mt-2 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button key={i} onClick={() => setValue(i)} aria-label={tr(`${i} estrellas`, `${i} stars`)}>
            <Star
              className="h-6 w-6"
              style={{ color: COACH, fill: i <= value ? COACH : "transparent" }}
            />
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, 240))}
        rows={2}
        placeholder={tr(
          `Escribe feedback sobre el rendimiento de ${athleteName.split(" ")[0]}...`,
          `Write feedback on ${athleteName.split(" ")[0]}'s performance...`,
        )}
        className="mt-3 w-full resize-none outline-none"
        style={{
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 12,
          padding: "10px 12px",
          fontSize: 13,
          color: INK,
        }}
      />
      <button
        disabled={sent}
        onClick={() => {
          onSubmit(value, text);
          setSent(true);
          setTimeout(() => setSent(false), 1800);
          setText("");
        }}
        className="mt-2 w-full active:scale-[0.98]"
        style={{
          background: COACH,
          color: "#FFFFFF",
          height: 40,
          borderRadius: 999,
          fontSize: 13,
          fontWeight: 700,
          opacity: sent ? 0.7 : 1,
        }}
      >
        {sent ? tr("Enviada ✓", "Sent ✓") : tr("Enviar valoración", "Send rating")}
      </button>
    </div>
  );
}

export function AbsenceModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  const tr = useTr();
  const reasons = [
    tr("Enfermedad", "Illness"),
    tr("Lesión", "Injury"),
    tr("Estudios", "Studies"),
    tr("Trabajo", "Work"),
    tr("Personal", "Personal"),
    tr("Otro", "Other"),
  ];
  const [reason, setReason] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  return (
    <div className="absolute inset-0 z-30 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div className="w-full rounded-t-2xl bg-background p-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold">{tr("Notificar ausencia", "Report absence")}</h3>
          <button onClick={onClose} className="text-muted-foreground" aria-label={tr("Cerrar", "Close")}>
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {tr("Motivo", "Reason")}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {reasons.map((r) => {
            const active = reason === r;
            return (
              <button
                key={r}
                onClick={() => setReason(r)}
                className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                  active ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card text-foreground"
                }`}
              >
                {r}
              </button>
            );
          })}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, 300))}
          rows={3}
          placeholder={tr("Comentario opcional para el entrenador", "Optional comment for the coach")}
          className="mt-3 w-full resize-none rounded-xl border border-border bg-card p-2.5 text-sm outline-none focus:border-primary"
        />
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={onClose}
            className="rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-semibold text-foreground"
          >
            {tr("Cancelar", "Cancel")}
          </button>
          <button
            disabled={!reason}
            onClick={onConfirm}
            className="flex items-center justify-center gap-1 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            <Check className="h-4 w-4" /> {tr("Confirmar", "Confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}

export function GroupSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const tr = useTr();
  const [open, setOpen] = useState(false);
  const options = [
    tr("Cadete - Grupo A", "U16 - Group A"),
    tr("Cadete - Grupo B", "U16 - Group B"),
    tr("Juvenil A", "U18 A"),
    tr("Infantil A", "U14 A"),
  ];
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between"
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
        {value}
        <ChevronDown
          className="h-4 w-4"
          style={{ color: MUTED, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
        />
      </button>
      {open && (
        <ul
          className="absolute left-0 right-0 z-20 mt-1 overflow-hidden"
          style={{ background: "#FFFFFF", border: `1px solid ${CARD_BORDER}`, borderRadius: 14, boxShadow: SHADOW }}
        >
          {options.map((opt) => (
            <li key={opt}>
              <button
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left"
                style={{
                  fontSize: 13,
                  color: opt === value ? COACH : INK,
                  fontWeight: opt === value ? 700 : 500,
                  background: opt === value ? "#EAF8F0" : "transparent",
                }}
              >
                {opt}
                {opt === value && <Check className="h-3.5 w-3.5" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
