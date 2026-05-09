import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("saito-card p-5", className)}>{children}</div>;
}

export function Pill({
  tone = "default",
  children,
}: {
  tone?: "default" | "success" | "warning" | "danger" | "info";
  children: ReactNode;
}) {
  const tones: Record<string, string> = {
    default: "bg-muted text-foreground",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    danger: "bg-destructive/15 text-destructive",
    info: "bg-primary/12 text-primary",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />;
}

export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="saito-card overflow-hidden p-0">
      <div className="space-y-0">
        {Array.from({ length: rows }).map((_, r) => (
          <div
            key={r}
            className="grid gap-3 border-b border-border px-5 py-3 last:border-b-0"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} className="h-4 w-3/4" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export type Status =
  | "Paid"
  | "Active"
  | "Failed"
  | "Pending"
  | "Fit"
  | "Injured"
  | "Under review"
  | "Unknown"
  | string;

export function StatusPill({ status }: { status: Status }) {
  const map: Record<string, string> = {
    Paid: "bg-success/15 text-success",
    Pagada: "bg-success/15 text-success",
    Active: "bg-primary/12 text-primary",
    Activa: "bg-primary/12 text-primary",
    Activo: "bg-primary/12 text-primary",
    Failed: "bg-destructive/15 text-destructive",
    Fallida: "bg-destructive/15 text-destructive",
    Pending: "bg-warning/15 text-warning",
    Pendiente: "bg-warning/15 text-warning",
    Fit: "bg-success/15 text-success",
    Apto: "bg-success/15 text-success",
    Injured: "bg-destructive/15 text-destructive",
    Lesionado: "bg-destructive/15 text-destructive",
    "Under review": "bg-warning/15 text-warning",
    "En revisión": "bg-warning/15 text-warning",
    Unknown: "bg-muted text-muted-foreground",
    Desconocido: "bg-muted text-muted-foreground",
  };
  const cls = map[status] ?? "bg-muted text-muted-foreground";
  return (
    <span
      className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-medium", cls)}
    >
      {status}
    </span>
  );
}

interface Column<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
}

export function DataTable<T extends { id?: string }>({
  columns,
  data,
  pageSize = 10,
  empty,
}: {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  empty?: ReactNode;
}) {
  const [page, setPage] = useState(1);
  const total = data.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const cur = Math.min(page, pages);
  const start = (cur - 1) * pageSize;
  const rows = data.slice(start, start + pageSize);
  return (
    <div className="saito-card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="saito-table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} className={c.className}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center text-muted-foreground">
                  {empty ?? "Sin datos"}
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr key={r.id ?? i}>
                  {columns.map((c) => (
                    <td key={c.key} className={c.className}>
                      {c.cell(r)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {total > pageSize && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground gap-2">
          <span className="hidden sm:inline">
            Mostrando {start + 1} a {Math.min(start + pageSize, total)} de {total}
          </span>
          <span className="sm:hidden">
            {start + 1}–{Math.min(start + pageSize, total)} / {total}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, cur - 1))}
              disabled={cur === 1}
              className="h-7 rounded-md px-2 text-xs hover:bg-muted disabled:opacity-40"
              aria-label="Anterior"
            >
              ‹
            </button>
            {(() => {
              const win = 5;
              let from = Math.max(1, cur - Math.floor(win / 2));
              const to = Math.min(pages, from + win - 1);
              from = Math.max(1, to - win + 1);
              return Array.from({ length: to - from + 1 }, (_, i) => from + i).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={cn(
                    "h-7 w-7 rounded-md text-xs",
                    cur === n ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  )}
                >
                  {n}
                </button>
              ));
            })()}
            <button
              onClick={() => setPage(Math.min(pages, cur + 1))}
              disabled={cur === pages}
              className="h-7 rounded-md px-2 text-xs hover:bg-muted disabled:opacity-40"
              aria-label="Siguiente"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
