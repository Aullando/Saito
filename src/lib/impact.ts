/**
 * Modelo de estimación de impacto SAITO.
 * Basado en benchmarks del sector deportivo y SaaS de gestión.
 * Todas las cifras son orientativas — el impacto real depende de la activación.
 */

export interface ImpactInputs {
  socios: number;
  secciones: number;
  horasSemana: number;
  cuotaMedia: number;
  vendeBonos: boolean;
  eventosAnio: number;
  patrocinadores: number;
  vendeMerch: boolean;
}

export interface ImpactResult {
  ahorroTiempo: number;
  ahorroMorosidad: number;
  ahorroMes: number;

  ingresoBonos: number;
  ingresoEventos: number;
  ingresoMerch: number;
  valorPatrocinio: number;
  ingresoMes: number;

  impactoMes: number;
  impactoAnio: number;

  horasMes: number;
  aperturaApp: number; // %
  impresionesPatrocinadores: number;
}

const COSTE_HORA_STAFF = 18;          // €/h coste empresa admin deportivo
const REDUCCION_TRABAJO = 0.6;        // 60% del trabajo manual recuperable
const MOROSIDAD_RECUPERABLE = 0.05;   // 5% del facturado mensual
const PCT_SOCIOS_BONOS = 0.10;        // 10% socios compran bonos/mes
const PRECIO_BONO_MEDIO = 35;         // €
const ASISTENCIA_EVENTO = 80;         // asistentes medios
const PRECIO_ENTRADA = 8;             // €
const UPLIFT_VENTA_DIGITAL = 1.4;     // +40% vs venta manual
const PCT_SOCIOS_MERCH = 0.15;        // 15% compra merch/temporada
const TICKET_MERCH = 45;              // €
const COMPRAS_MERCH_AÑO = 2;          // veces/año
const IMPRESIONES_POR_SOCIO_MES = 18; // vistas in-app/mes
const CPM_PATROCINIO = 8;             // €/1000 impresiones

export function calculateImpact(input: ImpactInputs): ImpactResult {
  const {
    socios,
    horasSemana,
    cuotaMedia,
    vendeBonos,
    eventosAnio,
    patrocinadores,
    vendeMerch,
  } = input;

  // 1. AHORROS
  const horasMes = horasSemana * 4;
  const ahorroTiempo = horasMes * COSTE_HORA_STAFF * REDUCCION_TRABAJO;
  const ahorroMorosidad = socios * cuotaMedia * MOROSIDAD_RECUPERABLE;
  const ahorroMes = ahorroTiempo + ahorroMorosidad;

  // 2. INGRESOS NUEVOS via Copiloto
  const ingresoBonos = vendeBonos
    ? socios * PCT_SOCIOS_BONOS * PRECIO_BONO_MEDIO
    : 0;

  const ingresoEventos =
    (eventosAnio * ASISTENCIA_EVENTO * PRECIO_ENTRADA * UPLIFT_VENTA_DIGITAL) / 12;

  const ingresoMerch = vendeMerch
    ? (socios * PCT_SOCIOS_MERCH * TICKET_MERCH * COMPRAS_MERCH_AÑO) / 12
    : 0;

  const impresionesPatrocinadores = socios * IMPRESIONES_POR_SOCIO_MES;
  const valorPatrocinio =
    patrocinadores > 0
      ? (impresionesPatrocinadores * CPM_PATROCINIO * patrocinadores) / 1000
      : 0;

  const ingresoMes = ingresoBonos + ingresoEventos + ingresoMerch + valorPatrocinio;

  // 3. ENGAGEMENT
  const aperturaApp = 75; // benchmark push notifications

  const impactoMes = ahorroMes + ingresoMes;
  const impactoAnio = impactoMes * 12;

  return {
    ahorroTiempo,
    ahorroMorosidad,
    ahorroMes,
    ingresoBonos,
    ingresoEventos,
    ingresoMerch,
    valorPatrocinio,
    ingresoMes,
    impactoMes,
    impactoAnio,
    horasMes: horasMes * REDUCCION_TRABAJO,
    aperturaApp,
    impresionesPatrocinadores,
  };
}

export const defaultInputs: ImpactInputs = {
  socios: 250,
  secciones: 2,
  horasSemana: 12,
  cuotaMedia: 35,
  vendeBonos: true,
  eventosAnio: 12,
  patrocinadores: 3,
  vendeMerch: true,
};

export function formatEuro(n: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}
