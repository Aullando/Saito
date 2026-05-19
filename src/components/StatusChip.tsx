import { cn } from "@/lib/utils";

export type StatusTone = "success" | "warning" | "danger" | "info" | "muted";

const TONE_CLASS: Record<StatusTone, string> = {
  success: "chip chip-success",
  warning: "chip chip-warning",
  danger: "chip chip-danger",
  info: "chip chip-info",
  muted: "chip chip-muted",
};

/**
 * Map common SAITO statuses (es/en) to a tone. Falls back to muted.
 */
function inferTone(label: string): StatusTone {
  const s = label.toLowerCase().trim();
  if (
    [
      "pagado",
      "paid",
      "apto",
      "activo",
      "active",
      "completado",
      "completed",
      "confirmado",
      "confirmada",
      "gestionada",
      "resuelta",
      "alta",
    ].includes(s)
  )
    return "success";
  if (
    [
      "pendiente",
      "pending",
      "en revisión",
      "en revision",
      "en curso",
      "scheduled",
      "abierta",
      "activa",
    ].includes(s)
  )
    return "warning";
  if (
    ["no apto", "vencido", "overdue", "cancelado", "cancelled", "rechazado", "rejected"].includes(s)
  )
    return "danger";
  if (["finalizado", "finished", "cerrada", "—"].includes(s)) return "muted";
  return "info";
}

export function StatusChip({
  children,
  tone,
  className,
}: {
  children: string;
  tone?: StatusTone;
  className?: string;
}) {
  const finalTone = tone ?? inferTone(children);
  return <span className={cn(TONE_CLASS[finalTone], className)}>{children}</span>;
}
