// Helpers centralizados para distinguir modo demo vs producción.
// Las variables se leen de import.meta.env en build time (Vite).
//
// VITE_DEMO_MODE                → "true" para datos demo / seed.
// VITE_SHOW_DATA_SOURCE_BADGE   → "true" para mostrar el badge en la UI.

const truthy = (v: unknown): boolean =>
  typeof v === "string" ? ["true", "1", "yes"].includes(v.toLowerCase()) : Boolean(v);

export function isDemoMode(): boolean {
  // Por defecto demo = true (la app es una demo comercial mientras no se diga lo contrario).
  const raw = import.meta.env.VITE_DEMO_MODE;
  return raw === undefined ? true : truthy(raw);
}

export function isProductionMode(): boolean {
  return !isDemoMode();
}

export function showDataSourceBadge(): boolean {
  // Por defecto visible.
  const raw = import.meta.env.VITE_SHOW_DATA_SOURCE_BADGE;
  return raw === undefined ? true : truthy(raw);
}

export type DataSourceMode = "demo" | "production";

export function getDataSourceMode(): DataSourceMode {
  return isDemoMode() ? "demo" : "production";
}

export function getDataSourceLabel(locale: "es" | "en" | "sr" = "es"): string {
  if (isDemoMode()) {
    if (locale === "en") return "Demo · Demo data";
    if (locale === "sr") return "Demo · Demo podaci";
    return "Demo · Datos demo";
  }
  if (locale === "en") return "Production · Real data";
  if (locale === "sr") return "Produkcija · Stvarni podaci";
  return "Producción · Datos reales";
}
