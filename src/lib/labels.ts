// Labels compartidos para módulo económico.
type Lang = "es" | "en";

export function paymentLabel(status: string, lang: Lang = "es"): string {
  const map: Record<string, { es: string; en: string }> = {
    Paid: { es: "Pagado", en: "Paid" },
    Pending: { es: "Pendiente", en: "Pending" },
    Overdue: { es: "Vencido", en: "Overdue" },
    Refunded: { es: "Reembolsado", en: "Refunded" },
    Cancelled: { es: "Cancelado", en: "Cancelled" },
  };
  return map[status]?.[lang] ?? status;
}

export function frequencyLabel(
  input: string | { frequency?: string },
  lang: Lang = "es",
): string {
  const key = typeof input === "string" ? input : (input.frequency ?? "");
  const map: Record<string, { es: string; en: string }> = {
    Monthly: { es: "Mensual", en: "Monthly" },
    Quarterly: { es: "Trimestral", en: "Quarterly" },
    Biannual: { es: "Semestral", en: "Biannual" },
    Annual: { es: "Anual", en: "Annual" },
    OneOff: { es: "Único", en: "One-off" },
  };
  return map[key]?.[lang] ?? key;
}
