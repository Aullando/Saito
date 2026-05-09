import { Database, Sparkles } from "lucide-react";
import {
  showDataSourceBadge,
  isDemoMode,
  getDataSourceLabel,
} from "@/lib/appMode";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** "fixed" se ancla en la esquina inferior derecha; "inline" lo deja en flujo normal. */
  variant?: "fixed" | "inline";
  locale?: "es" | "en";
};

/**
 * Badge persistente que indica si la UI está mostrando datos demo o reales.
 * Se controla con las env vars VITE_DEMO_MODE y VITE_SHOW_DATA_SOURCE_BADGE.
 */
export function DataSourceBadge({ className, variant = "inline", locale = "es" }: Props) {
  if (!showDataSourceBadge()) return null;

  const demo = isDemoMode();
  const label = getDataSourceLabel(locale);
  const Icon = demo ? Sparkles : Database;

  const base =
    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium leading-none whitespace-nowrap select-none";
  const tone = demo
    ? "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300"
    : "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";

  if (variant === "fixed") {
    return (
      <div
        className={cn(
          "pointer-events-none fixed bottom-3 left-3 z-40 print:hidden",
          className,
        )}
        aria-live="polite"
      >
        <span className={cn(base, tone, "shadow-sm backdrop-blur")}>
          <Icon className="h-3 w-3" aria-hidden />
          {label}
        </span>
      </div>
    );
  }

  return (
    <span
      className={cn(base, tone, className)}
      role="status"
      aria-label={label}
      title={label}
    >
      <Icon className="h-3 w-3" aria-hidden />
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{demo ? "Demo" : "Prod"}</span>
    </span>
  );
}
