import { useLang } from "@/lib/i18n";
import type { Lang, CalendarEventType } from "@/lib/types";

export interface DBEvent {
  id: string;
  title: string;
  event_date: string;
  start_time: string | null;
  type: string;
  section_id: string | null;
  category_id: string | null;
  group_id: string | null;
  staff_id?: string | null;
  location?: string | null;
  recurrence: { freq: "weekly"; until: string; exceptions?: string[] } | null;
}

export interface Occurrence {
  event: DBEvent;
  date: string;
}

const pickLang = <T,>(lang: Lang, es: T, en: T, sr: T): T =>
  lang === "es" ? es : lang === "sr" ? sr : en;

export const typeOptions = (lang: Lang): { value: CalendarEventType; label: string }[] => {
  const es = [
    { value: "training" as const, label: "Entrenamiento" },
    { value: "match" as const, label: "Competición" },
    { value: "medical" as const, label: "Cita médica" },
    { value: "club" as const, label: "Evento de club" },
    { value: "payment" as const, label: "Vencimiento de pago" },
  ];
  const en = [
    { value: "training" as const, label: "Training" },
    { value: "match" as const, label: "Competition" },
    { value: "medical" as const, label: "Medical appointment" },
    { value: "club" as const, label: "Club event" },
    { value: "payment" as const, label: "Payment due" },
  ];
  const sr = [
    { value: "training" as const, label: "Trening" },
    { value: "match" as const, label: "Takmičenje" },
    { value: "medical" as const, label: "Medicinski termin" },
    { value: "club" as const, label: "Događaj kluba" },
    { value: "payment" as const, label: "Rok plaćanja" },
  ];
  return pickLang(lang, es, en, sr);
};

export const typeLabel = (type: string, lang: Lang): string => {
  const es: Record<string, string> = {
    training: "Entrenamiento",
    match: "Competición",
    medical: "Cita médica",
    meeting: "Reunión",
    club: "Evento de club",
    payment: "Vencimiento de pago",
  };
  const en: Record<string, string> = {
    training: "Training",
    match: "Competition",
    medical: "Medical appointment",
    meeting: "Meeting",
    club: "Club event",
    payment: "Payment due",
  };
  const sr: Record<string, string> = {
    training: "Trening",
    match: "Takmičenje",
    medical: "Medicinski termin",
    meeting: "Sastanak",
    club: "Događaj kluba",
    payment: "Rok plaćanja",
  };
  return pickLang(lang, es, en, sr)[type] ?? type;
};

export const TYPE_STYLE: Record<string, string> = {
  training: "bg-indigo-50 text-indigo-700 border-indigo-200",
  match: "bg-amber-50 text-amber-700 border-amber-200",
  medical: "bg-rose-50 text-rose-700 border-rose-200",
  meeting: "bg-slate-100 text-slate-700 border-slate-200",
  club: "bg-emerald-50 text-emerald-700 border-emerald-200",
  payment: "bg-sky-50 text-sky-700 border-sky-200",
};

export const ROLE_TYPE_FILTER: Record<string, CalendarEventType[]> = {
  manager: ["training", "match", "medical", "club", "payment"],
  admin: ["club", "payment", "training", "match"],
  medical: ["medical"],
  technical: ["training", "match", "club"],
  athlete: ["training", "match", "medical", "club"],
};

export const roleOptions = (lang: Lang): { value: string; label: string }[] => {
  const es = [
    { value: "all", label: "Todos los roles" },
    { value: "manager", label: "Gestor / Dirección" },
    { value: "admin", label: "Administración" },
    { value: "medical", label: "Staff médico" },
    { value: "technical", label: "Entrenador" },
    { value: "athlete", label: "Atleta" },
  ];
  const en = [
    { value: "all", label: "All roles" },
    { value: "manager", label: "Manager / Direction" },
    { value: "admin", label: "Administration" },
    { value: "medical", label: "Medical staff" },
    { value: "technical", label: "Coach" },
    { value: "athlete", label: "Athlete" },
  ];
  const sr = [
    { value: "all", label: "Sve uloge" },
    { value: "manager", label: "Menadžer / Uprava" },
    { value: "admin", label: "Administracija" },
    { value: "medical", label: "Medicinsko osoblje" },
    { value: "technical", label: "Trener" },
    { value: "athlete", label: "Sportista" },
  ];
  return pickLang(lang, es, en, sr);
};

export function TypeBadge({ type }: { type: string }) {
  const lang = useLang();
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${
        TYPE_STYLE[type] ?? "bg-muted text-muted-foreground border-border"
      }`}
    >
      {typeLabel(type, lang)}
    </span>
  );
}

export function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div className="flex-1">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-sm text-foreground">{children}</div>
      </div>
    </div>
  );
}

export function StatusPill({
  tone,
  children,
}: {
  tone: "muted" | "ok" | "warn" | "danger";
  children: React.ReactNode;
}) {
  const map: Record<typeof tone, string> = {
    muted: "bg-slate-100 text-slate-600 border-slate-200",
    ok: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warn: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${map[tone]}`}
    >
      {children}
    </span>
  );
}

export function buildMonthGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  const dow = (first.getDay() + 6) % 7;
  start.setDate(first.getDate() - dow);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}
