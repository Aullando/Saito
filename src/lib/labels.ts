// Labels compartidos para módulo económico.
type Lang = "es" | "en" | "sr";

export function paymentLabel(status: string, lang: Lang = "es"): string {
  const map: Record<string, { es: string; en: string; sr: string }> = {
    Paid: { es: "Pagado", en: "Paid", sr: "Plaćeno" },
    Pending: { es: "Pendiente", en: "Pending", sr: "Na čekanju" },
    Overdue: { es: "Vencido", en: "Overdue", sr: "Dospelo" },
    Refunded: { es: "Reembolsado", en: "Refunded", sr: "Refundirano" },
    Cancelled: { es: "Cancelado", en: "Cancelled", sr: "Otkazano" },
    Active: { es: "Activa", en: "Active", sr: "Aktivno" },
    Failed: { es: "Fallida", en: "Failed", sr: "Neuspešno" },
  };
  return map[status]?.[lang] ?? status;
}

export function frequencyLabel(
  input: string | { frequency?: string },
  lang: Lang = "es",
): string {
  const key = typeof input === "string" ? input : (input.frequency ?? "");
  const map: Record<string, { es: string; en: string; sr: string }> = {
    Monthly: { es: "Mensual", en: "Monthly", sr: "Mesečno" },
    Quarterly: { es: "Trimestral", en: "Quarterly", sr: "Kvartalno" },
    Biannual: { es: "Semestral", en: "Biannual", sr: "Polugodišnje" },
    Annual: { es: "Anual", en: "Annual", sr: "Godišnje" },
    OneOff: { es: "Único", en: "One-off", sr: "Jednokratno" },
    "One-time": { es: "Único", en: "One-time", sr: "Jednokratno" },
  };
  return map[key]?.[lang] ?? key;
}
