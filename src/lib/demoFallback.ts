// Helpers para servir datos demo SOLO cuando estamos en modo demo.
// En producción nunca devuelven seed silenciosamente: si la query no trajo
// datos, retornan el "vacío productivo" (`[]` o el valor neutral indicado),
// para que la pantalla muestre estados vacíos / errores en lugar de mock.
//
// Ver src/lib/appMode.ts para la lógica de detección del modo.

import { isDemoMode } from "./appMode";

/**
 * Devuelve `data` si existe; en su defecto:
 *   - en demo mode → `demoFallback` (datos seed visibles).
 *   - en producción → `productionEmpty` (estado vacío seguro).
 *
 * Úsalo en pantallas reales para no mostrar mock como si fueran datos reales.
 */
export function demoOr<T>(
  data: T | undefined | null,
  demoFallback: T,
  productionEmpty: T,
): T {
  if (data !== undefined && data !== null) return data;
  return isDemoMode() ? demoFallback : productionEmpty;
}

/** Atajo para arrays: el vacío productivo es `[]`. */
export function demoOrEmpty<T>(data: T[] | undefined | null, demoFallback: T[]): T[] {
  return demoOr(data, demoFallback, [] as T[]);
}

/**
 * Equivalente "vacío" de los stats del dashboard, para producción.
 * Mantiene la misma forma para no tener que ramificar el render entero.
 */
export const EMPTY_DASHBOARD_STATS = {
  athletesTotal: 0,
  athletesActive: 0,
  injured: 0,
  sectionsCount: 0,
  eventsToday: [] as Array<{
    id: string;
    title: string;
    start_time: string | null;
    end_time: string | null;
    type: string;
  }>,
  pendingCount: 0,
  pendingAmount: 0,
  monthRevenue: 0,
  upcomingAppts: [] as Array<{
    id: string;
    appointment_date: string;
    appointment_time: string | null;
    reason: string | null;
    athlete_id: string;
  }>,
  conversationsCount: 0,
};

export const EMPTY_DASHBOARD_CHARTS = {
  revenueSeries: [] as Array<{ key: string; label: string; revenue: number; pending: number }>,
  eventsSeries: [] as Array<{ date: string; count: number }>,
  typeData: [] as Array<{ name: string; value: number }>,
  medData: [] as Array<{ name: string; value: number }>,
};
