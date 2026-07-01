import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { Pill } from "@/components/ui-kit";

export const fmtMoney = (n: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);

export const todayISO = () => new Date().toISOString().slice(0, 10);

export function weekRange() {
  const d = new Date();
  const day = (d.getDay() + 6) % 7; // Monday=0
  const start = new Date(d);
  start.setDate(d.getDate() - day);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

// Deterministic helper to derive a stable fake percentage from an array length
export const stableHash = (n: number, salt = 7) =>
  Math.abs(Math.sin(n * 9301 + salt) * 10000) % 1;

export function eventTone(
  type: string,
): "info" | "success" | "warning" | "danger" | "default" {
  switch (type) {
    case "training":
      return "info";
    case "match":
      return "success";
    case "medical":
      return "warning";
    case "meeting":
      return "default";
    default:
      return "default";
  }
}

export type KpiTone = "default" | "primary" | "info" | "success" | "warning" | "danger";

export function Kpi({
  icon: Icon,
  label,
  value,
  hint,
  tone = "default",
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  tone?: KpiTone;
}) {
  const toneCls: Record<string, string> = {
    default: "bg-muted text-foreground",
    primary: "bg-primary text-primary-foreground",
    info: "bg-primary/10 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    danger: "bg-destructive/15 text-destructive",
  };
  return (
    <div className="rounded-2xl border border-border bg-card p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          <div className="mt-1.5 truncate text-xl font-bold tracking-tight">{value}</div>
          {hint && <div className="mt-0.5 truncate text-[11px] text-muted-foreground">{hint}</div>}
        </div>
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${toneCls[tone]}`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

export function SectionHeader({
  icon: Icon,
  title,
  actionLabel,
  actionTo,
}: {
  icon: LucideIcon;
  title: string;
  actionLabel?: string;
  actionTo?: string;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
        <Icon className="h-4 w-4 text-primary" /> {title}
      </h2>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="text-xs font-medium text-primary hover:underline">
          {actionLabel} →
        </Link>
      )}
    </div>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
      {children}
    </div>
  );
}

export { Pill };
