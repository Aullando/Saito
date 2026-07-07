import { Sparkles, ShieldCheck, Euro } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";

type Suggestion = {
  icon: LucideIcon;
  tone: "warning" | "info" | "success";
  title: string;
  body: string;
  primaryLabel: string;
  primaryTo: string;
};

export function CopilotoCard({
  title = "Copiloto",
  poweredBy = "Gemini",
  tagline = "Propone. Tú confirmas.",
  suggestions,
}: {
  title?: string;
  poweredBy?: string;
  tagline?: string;
  suggestions: Suggestion[];
}) {
  if (suggestions.length === 0) return null;
  return (
    <section
      className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6"
      style={{ borderColor: "#E4EAF2" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-white"
            style={{
              background:
                "conic-gradient(from 210deg, #F12F4A, #FDB113, #00A74D, #0067C9, #8A2BE2, #F12F4A)",
            }}
          >
            <Sparkles className="h-5 w-5" fill="currentColor" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight">{title}</span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                con{" "}
                <span
                  style={{
                    background:
                      "linear-gradient(90deg, #4285F4, #EA4335, #FBBC04, #34A853)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {poweredBy}
                </span>
              </span>
            </div>
          </div>
        </div>
        <span className="hidden text-xs font-medium text-muted-foreground sm:block">
          {tagline}
        </span>
      </div>

      <ul className="mt-4 space-y-2.5">
        {suggestions.map((s, i) => {
          const Icon = s.icon;
          const toneBg =
            s.tone === "warning"
              ? "bg-[#FFF5DF] text-[#B56F00]"
              : s.tone === "success"
                ? "bg-[#EAF8F0] text-[#00843D]"
                : "bg-[#EAF4FF] text-[#0054A4]";
          return (
            <li
              key={i}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card px-4 py-3 md:flex-row md:items-center md:justify-between"
              style={{ borderColor: "#EEF2F7" }}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${toneBg}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{s.title}</div>
                  <div className="mt-0.5 text-xs leading-snug text-muted-foreground">
                    {s.body}
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2 md:pl-2">
                <button
                  type="button"
                  className="rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
                >
                  Descartar
                </button>
                <Link
                  to={s.primaryTo}
                  className="rounded-full px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-95"
                  style={{ background: "var(--primary, #0067C9)" }}
                >
                  {s.primaryLabel}
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// Default set for admin/manager — matches the real SAITO capture wording.
export const DEFAULT_ADMIN_SUGGESTIONS: Suggestion[] = [
  {
    icon: ShieldCheck,
    tone: "warning",
    title: "4 deportistas de Cadete no tienen tutor asignado",
    body: "El consentimiento de menores exige tutor por debajo de los 14 años en España. Puedo preparar las invitaciones de tutela para que las revises antes de enviarlas.",
    primaryLabel: "Revisar tutela",
    primaryTo: "/athletes",
  },
  {
    icon: Euro,
    tone: "info",
    title: "La cuota de julio vence en 4 días para 15 familias",
    body: "Puedo redactar un recordatorio de pago para el Grupo Norte. Se guarda como borrador y decides tú cuándo y a quién se envía.",
    primaryLabel: "Preparar recordatorio",
    primaryTo: "/economic/payments",
  },
];
