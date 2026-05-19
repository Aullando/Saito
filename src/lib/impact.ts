// ============================================================================
// SAITO Impact Calculator — lógica pura
// ----------------------------------------------------------------------------
// Calcula el impacto económico estimado de SAITO en un club a partir de
// inputs declarativos. Tres palancas:
//   1. AHORRO        → defensivo, dinero que el club deja de gastar/perder.
//   2. INGRESOS      → ofensivo, oportunidades que el copiloto destapa.
//   3. ENGAGEMENT    → métrica intangible, NUNCA convertida a euros sumables.
//
// Filosofía:
//   - Constantes conservadoras y defendibles (ver comentarios por línea).
//   - Inputs del propio club siempre que es posible (ticket, % morosidad...)
//     para que el resultado sea suyo, no nuestro.
//   - Toggles para opt-out (un club sin merch ve esa línea a 0 €).
// ============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────────────────────

export interface ImpactInputs {
  // Datos básicos del club
  socios: number;
  cuotaMedia: number; // €/mes
  horasGestionSemana: number; // horas/sem de personal REMUNERADO en gestión

  // Estado actual del club (para cálculos sobre su propia base)
  porcentajeMorosidad: number; // 0-100
  porcentajeChurnAnual: number; // 0-100

  // Ingresos vía copiloto (cada uno toggleable)
  vendeBonos: boolean;
  ticketBonoMedio: number; // €

  vendeEntradasOnline: boolean; // afecta uplift de eventos
  eventosAnio: number;
  asistenciaMediaEvento: number;
  precioEntradaEvento: number; // €

  vendeMerch: boolean;
  ticketMerchMedio: number; // €

  facturaPatrocinio: boolean;
  facturacionPatrocinioAnual: number; // €

  // Herramientas que SAITO sustituye (suma directa de costes/mes)
  herramientasSustituidas: number; // €/mes
}

export interface ImpactBreakdown {
  ahorro: {
    tiempoStaff: number;
    morosidad: number;
    churn: number;
    herramientas: number;
    total: number;
  };
  ingresos: {
    bonos: number;
    eventos: number;
    merch: number;
    patrocinio: number;
    total: number;
  };
  engagement: {
    impactosMes: number;
    porcentajeLectura: number; // 0-100
  };
  totales: {
    minMes: number; // solo ahorro (defendible 100%)
    maxMes: number; // ahorro + ingresos (proyección)
    minAnio: number;
    maxAnio: number;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Constantes (cambiar aquí afecta toda la calculadora)
// ─────────────────────────────────────────────────────────────────────────────

export const CONSTANTES = {
  // Coste empresa real de admin deportivo en España (con SS).
  // Conservador: rango sectorial 22-28 €/h.
  COSTE_HORA_STAFF: 22,

  // % de horas administrativas que una herramienta como SAITO recupera.
  // Conservador: benchmarks SaaS reportan 60-80%, usamos el suelo.
  PORCENTAJE_HORAS_RECUPERABLES: 0.6,

  // % de morosidad que se recupera con pasarela + recordatorios automáticos.
  // Conservador: pasarelas modernas reducen morosidad >70% en clubs amateurs.
  PORCENTAJE_MOROSIDAD_RECUPERABLE: 0.7,

  // Reducción de churn por mejor experiencia (app + pago sin fricción + comms).
  // Conservador: estudios SaaS reportan 20-30% reducción, usamos suelo.
  PORCENTAJE_REDUCCION_CHURN: 0.2,

  // Conversión mensual de socios a compra de bono sugerida por copiloto.
  // Conservador: SaaS de recomendación reporta 3-7%, usamos punto medio bajo.
  CONVERSION_BONOS_MENSUAL: 0.05,

  // Uplift en venta de entradas a eventos cuando el club YA vende online.
  // Si parte de cero, el cálculo no aplica (toggle).
  UPLIFT_EVENTOS_ONLINE: 0.2,

  // % socios que compran merch al año.
  // Conservador: clubs amateurs reportan 8-15%, usamos suelo.
  PORCENTAJE_SOCIOS_COMPRAN_MERCH: 0.1,

  // Compras de merch por socio comprador al año.
  COMPRAS_MERCH_POR_SOCIO_ANIO: 1.5,

  // Revalorización del patrocinio existente cuando el club tiene app activa.
  // Conservador: la visibilidad digital permite subir tarifa 15-25%.
  REVALORIZACION_PATROCINIO: 0.2,

  // Impactos visuales generados por socio al mes en la app.
  // Conservador: 4 aperturas/mes × ~4 vistas útiles. (Antes 18, demasiado.)
  IMPACTOS_APP_POR_SOCIO_MES: 15,

  // Tasa de lectura de mensajes push vs email (~22%).
  PORCENTAJE_LECTURA_PUSH: 75,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Función principal
// ─────────────────────────────────────────────────────────────────────────────

export function calculateImpact(inputs: ImpactInputs): ImpactBreakdown {
  // ---- AHORRO --------------------------------------------------------------

  // Tiempo staff recuperado: h/sem × 4 sem × coste/h × % recuperable
  const tiempoStaff =
    inputs.horasGestionSemana *
    4 *
    CONSTANTES.COSTE_HORA_STAFF *
    CONSTANTES.PORCENTAJE_HORAS_RECUPERABLES;

  // Morosidad recuperada: facturación afectada × % recuperable por SAITO
  const facturadoMes = inputs.socios * inputs.cuotaMedia;
  const morosidadActual = facturadoMes * (inputs.porcentajeMorosidad / 100);
  const morosidad = morosidadActual * CONSTANTES.PORCENTAJE_MOROSIDAD_RECUPERABLE;

  // Churn reducido: socios que se retienen × cuota × 12 / 12 (mensualizado)
  // Es ingreso retenido, pero para el club es indistinguible de ahorro.
  const sociosQueChurnean = inputs.socios * (inputs.porcentajeChurnAnual / 100);
  const sociosRetenidos = sociosQueChurnean * CONSTANTES.PORCENTAJE_REDUCCION_CHURN;
  const churn = (sociosRetenidos * inputs.cuotaMedia * 12) / 12;

  // Herramientas: input directo del club
  const herramientas = inputs.herramientasSustituidas;

  const ahorroTotal = tiempoStaff + morosidad + churn + herramientas;

  // ---- INGRESOS VÍA COPILOTO -----------------------------------------------

  // Bonos / clases sueltas
  const bonos = inputs.vendeBonos
    ? inputs.socios * CONSTANTES.CONVERSION_BONOS_MENSUAL * inputs.ticketBonoMedio
    : 0;

  // Eventos: solo aplica uplift si YA venden online
  const eventos = inputs.vendeEntradasOnline
    ? (inputs.eventosAnio *
        inputs.asistenciaMediaEvento *
        inputs.precioEntradaEvento *
        CONSTANTES.UPLIFT_EVENTOS_ONLINE) /
      12
    : 0;

  // Merch / equipaciones
  const merch = inputs.vendeMerch
    ? (inputs.socios *
        CONSTANTES.PORCENTAJE_SOCIOS_COMPRAN_MERCH *
        inputs.ticketMerchMedio *
        CONSTANTES.COMPRAS_MERCH_POR_SOCIO_ANIO) /
      12
    : 0;

  // Patrocinio: revalorización sobre facturación actual del club
  const patrocinio = inputs.facturaPatrocinio
    ? (inputs.facturacionPatrocinioAnual * CONSTANTES.REVALORIZACION_PATROCINIO) / 12
    : 0;

  const ingresosTotal = bonos + eventos + merch + patrocinio;

  // ---- ENGAGEMENT (métricas, no euros) -------------------------------------

  const impactosMes = inputs.socios * CONSTANTES.IMPACTOS_APP_POR_SOCIO_MES;

  // ---- TOTALES -------------------------------------------------------------

  const minMes = ahorroTotal;
  const maxMes = ahorroTotal + ingresosTotal;

  return {
    ahorro: {
      tiempoStaff: Math.round(tiempoStaff),
      morosidad: Math.round(morosidad),
      churn: Math.round(churn),
      herramientas: Math.round(herramientas),
      total: Math.round(ahorroTotal),
    },
    ingresos: {
      bonos: Math.round(bonos),
      eventos: Math.round(eventos),
      merch: Math.round(merch),
      patrocinio: Math.round(patrocinio),
      total: Math.round(ingresosTotal),
    },
    engagement: {
      impactosMes: Math.round(impactosMes),
      porcentajeLectura: CONSTANTES.PORCENTAJE_LECTURA_PUSH,
    },
    totales: {
      minMes: Math.round(minMes),
      maxMes: Math.round(maxMes),
      minAnio: Math.round(minMes * 12),
      maxAnio: Math.round(maxMes * 12),
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Inputs por defecto — club tipo de referencia
// ─────────────────────────────────────────────────────────────────────────────

export const INPUTS_DEFAULT: ImpactInputs = {
  socios: 250,
  cuotaMedia: 45,
  horasGestionSemana: 15,
  porcentajeMorosidad: 8,
  porcentajeChurnAnual: 12,

  vendeBonos: true,
  ticketBonoMedio: 30,

  vendeEntradasOnline: false,
  eventosAnio: 4,
  asistenciaMediaEvento: 80,
  precioEntradaEvento: 8,

  vendeMerch: true,
  ticketMerchMedio: 35,

  facturaPatrocinio: true,
  facturacionPatrocinioAnual: 6000,

  herramientasSustituidas: 80,
};
