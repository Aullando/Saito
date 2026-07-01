import { useLang } from "@/lib/i18n";
import type { CircularStatus } from "@/lib/commLocal";
import type { Conversation, Lang } from "@/lib/types";

export interface CircularItem {
  id: string;
  title: string;
  body: string;
  recipientsLabel: string;
  recipientsCount: number;
  reads: number;
  createdAt: string;
  status: CircularStatus;
  scheduledAt?: string;
  withdrawReason?: string;
  source: "seed" | "local";
}

export const statusLabel = (s: CircularStatus, lang: Lang): string => {
  const es: Record<CircularStatus, string> = {
    draft: "Borrador",
    scheduled: "Programada",
    published: "Publicada",
    archived: "Archivada",
    withdrawn: "Retirada",
  };
  const en: Record<CircularStatus, string> = {
    draft: "Draft",
    scheduled: "Scheduled",
    published: "Published",
    archived: "Archived",
    withdrawn: "Withdrawn",
  };
  return (lang === "es" ? es : en)[s];
};

export const STATUS_STYLES: Record<CircularStatus, string> = {
  draft: "bg-amber-50 text-amber-700 border-amber-200",
  scheduled: "bg-sky-50 text-sky-700 border-sky-200",
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  archived: "bg-slate-100 text-slate-600 border-slate-200",
  withdrawn: "bg-rose-50 text-rose-700 border-rose-200",
};

export const NON_MVP_STATUSES: CircularStatus[] = ["draft", "scheduled", "archived", "withdrawn"];

export function ProposalBadge({ className = "" }: { className?: string }) {
  const lang = useLang();
  return (
    <span
      title={lang === "es" ? "Mejora propuesta (no incluida en el MVP)" : "Proposed enhancement (not included in MVP)"}
      className={`inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-1.5 py-[1px] text-[9px] font-semibold uppercase tracking-wide text-violet-700 ${className}`}
    >
      {lang === "es" ? "Mejora propuesta" : "Proposed"}
    </span>
  );
}

export function StatusBadge({ status }: { status: CircularStatus }) {
  const lang = useLang();
  return (
    <span className="inline-flex items-center gap-1">
      <span
        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[status]}`}
      >
        {statusLabel(status, lang)}
      </span>
      {NON_MVP_STATUSES.includes(status) && <ProposalBadge />}
    </span>
  );
}

export function isMedicalRequest(c: Conversation): boolean {
  return /solicitud de cita médica/i.test(c.title);
}

export function extractRecipientsCount(label: string): number | null {
  const m = label.match(/(\d+)\s+destinatari/);
  return m ? Number(m[1]) : null;
}

export function guessAthleteName(title: string): string | null {
  const m = title.match(/·\s*(.+)$/);
  return m ? m[1].trim() : null;
}
