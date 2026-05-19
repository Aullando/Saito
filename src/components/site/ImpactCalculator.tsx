import { useMemo, useState, useEffect, useRef } from "react";
import { calculateImpact, INPUTS_DEFAULT, CONSTANTES, type ImpactInputs } from "@/lib/impact";
import { localizedPath, type Locale } from "@/lib/site-i18n";

interface Props {
  locale: Locale;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const formatEuro = (n: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);

const formatNumber = (n: number) =>
  new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 }).format(n);

function useAnimatedNumber(target: number, duration = 500) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    fromRef.current = value;
    startRef.current = null;

    const tick = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const elapsed = t - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = fromRef.current + (target - fromRef.current) * eased;
      setValue(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return value;
}

const AnimatedEuro = ({ value }: { value: number }) => {
  const v = useAnimatedNumber(value);
  return <>{formatEuro(v)}</>;
};

const AnimatedNumber = ({ value }: { value: number }) => {
  const v = useAnimatedNumber(value);
  return <>{formatNumber(v)}</>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Subcomponentes UI
// ─────────────────────────────────────────────────────────────────────────────

function SliderField({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <label className="text-foreground/80">{label}</label>
        <span className="rounded-md bg-foreground/5 px-2 py-0.5 font-mono text-xs">
          {formatNumber(value)}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="impact-range w-full accent-saito-green"
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  min = 0,
  suffix = "€",
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <label className="text-foreground/80">{label}</label>
      <div className="flex items-center gap-1">
        <input
          type="number"
          inputMode="numeric"
          min={min}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="h-10 w-28 rounded-md border border-foreground/10 bg-background px-2 py-1 text-right font-mono text-sm"
        />
        <span className="text-xs text-foreground/60">{suffix}</span>
      </div>
    </div>
  );
}

function ToggleField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between text-sm">
      <span className="text-foreground/80">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative h-5 w-9 rounded-full transition-colors ${
          value ? "bg-saito-green" : "bg-foreground/20"
        }`}
        aria-pressed={value}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
            value ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </button>
    </label>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────────────────────

export function ImpactCalculator({ locale }: Props) {
  const t = (es: string, en: string) => (locale === "en" ? en : es);
  const [inputs, setInputs] = useState<ImpactInputs>(INPUTS_DEFAULT);
  const [showFormulas, setShowFormulas] = useState(false);

  const result = useMemo(() => calculateImpact(inputs), [inputs]);

  const update = <K extends keyof ImpactInputs>(key: K, value: ImpactInputs[K]) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16 md:py-24">
      <div className="mb-10 max-w-2xl">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <p className="font-mono text-xs uppercase tracking-wider text-saito-green">
            {t("Calculadora de impacto", "Impact calculator")}
          </p>
          <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400">
            {t("Beta · en pruebas", "Beta · testing")}
          </span>
        </div>
        <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
          {t("Cuánto vale SAITO en tu club", "What SAITO is worth in your club")}
        </h2>
        <p className="mt-3 text-foreground/70">
          {t(
            "Mueve los sliders. La estimación se actualiza en vivo. Las constantes son conservadoras y las fórmulas están abiertas — sin trampas.",
            "Move the sliders. The estimate updates live. Constants are conservative and formulas are open — no tricks.",
          )}
        </p>
        <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-xs text-amber-700 dark:text-amber-300">
          {t(
            "⚠️ Esta calculadora está en fase de pruebas. Los resultados son estimaciones orientativas y pueden ajustarse a medida que recogemos datos reales de clubs piloto.",
            "⚠️ This calculator is in beta. Results are indicative estimates and may be refined as we gather real data from pilot clubs.",
          )}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_400px] md:gap-12">
        {/* INPUTS */}
        <div className="space-y-8">
          <div className="space-y-5 rounded-2xl border border-foreground/10 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">
              {t("Tu club", "Your club")}
            </h3>
            <SliderField
              label={t("Socios", "Members")}
              value={inputs.socios}
              min={50}
              max={2000}
              step={10}
              onChange={(v) => update("socios", v)}
            />
            <SliderField
              label={t("Cuota media mensual", "Avg monthly fee")}
              value={inputs.cuotaMedia}
              min={10}
              max={150}
              suffix=" €"
              onChange={(v) => update("cuotaMedia", v)}
            />
            <SliderField
              label={t(
                "Horas/semana de gestión (personal remunerado)",
                "Hours/week of admin (paid staff)",
              )}
              value={inputs.horasGestionSemana}
              min={0}
              max={60}
              suffix=" h"
              onChange={(v) => update("horasGestionSemana", v)}
            />
            <SliderField
              label={t("% socios que pagan tarde", "% of members paying late")}
              value={inputs.porcentajeMorosidad}
              min={0}
              max={25}
              suffix=" %"
              onChange={(v) => update("porcentajeMorosidad", v)}
            />
            <SliderField
              label={t("% bajas anuales (churn)", "% annual churn")}
              value={inputs.porcentajeChurnAnual}
              min={0}
              max={40}
              suffix=" %"
              onChange={(v) => update("porcentajeChurnAnual", v)}
            />
            <NumberField
              label={t(
                "Coste mensual de herramientas que SAITO sustituye",
                "Monthly cost of tools SAITO replaces",
              )}
              value={inputs.herramientasSustituidas}
              onChange={(v) => update("herramientasSustituidas", v)}
            />
          </div>

          <div className="space-y-5 rounded-2xl border border-foreground/10 p-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">
                {t("Oportunidades del copiloto", "Copilot opportunities")}
              </h3>
              <p className="mt-1 text-xs text-foreground/50">
                {t(
                  "Activa solo lo que aplica a tu club.",
                  "Enable only what applies to your club.",
                )}
              </p>
            </div>

            <ToggleField
              label={t("Vendo bonos / clases sueltas", "I sell vouchers / drop-ins")}
              value={inputs.vendeBonos}
              onChange={(v) => update("vendeBonos", v)}
            />
            {inputs.vendeBonos && (
              <NumberField
                label={t("Ticket medio del bono", "Avg voucher price")}
                value={inputs.ticketBonoMedio}
                onChange={(v) => update("ticketBonoMedio", v)}
              />
            )}

            <ToggleField
              label={t("Ya vendo entradas a eventos online", "I already sell event tickets online")}
              value={inputs.vendeEntradasOnline}
              onChange={(v) => update("vendeEntradasOnline", v)}
            />
            {inputs.vendeEntradasOnline && (
              <>
                <SliderField
                  label={t("Eventos al año", "Events per year")}
                  value={inputs.eventosAnio}
                  min={0}
                  max={20}
                  onChange={(v) => update("eventosAnio", v)}
                />
                <SliderField
                  label={t("Asistencia media por evento", "Avg attendance per event")}
                  value={inputs.asistenciaMediaEvento}
                  min={20}
                  max={500}
                  step={10}
                  onChange={(v) => update("asistenciaMediaEvento", v)}
                />
                <NumberField
                  label={t("Precio entrada", "Ticket price")}
                  value={inputs.precioEntradaEvento}
                  onChange={(v) => update("precioEntradaEvento", v)}
                />
              </>
            )}

            <ToggleField
              label={t("Vendo equipaciones / merch", "I sell kits / merch")}
              value={inputs.vendeMerch}
              onChange={(v) => update("vendeMerch", v)}
            />
            {inputs.vendeMerch && (
              <NumberField
                label={t("Ticket medio de merch", "Avg merch ticket")}
                value={inputs.ticketMerchMedio}
                onChange={(v) => update("ticketMerchMedio", v)}
              />
            )}

            <ToggleField
              label={t("Tengo patrocinadores", "I have sponsors")}
              value={inputs.facturaPatrocinio}
              onChange={(v) => update("facturaPatrocinio", v)}
            />
            {inputs.facturaPatrocinio && (
              <NumberField
                label={t("Facturación anual de patrocinio", "Annual sponsorship revenue")}
                value={inputs.facturacionPatrocinioAnual}
                onChange={(v) => update("facturacionPatrocinioAnual", v)}
              />
            )}
          </div>
        </div>

        {/* RESULTADO */}
        <div className="md:sticky md:top-24 md:self-start">
          <div className="space-y-4">
            <div className="rounded-2xl border border-foreground/10 p-5">
              <div className="mb-3 flex items-baseline justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
                  {t("Ahorro", "Savings")}
                </h4>
                <span className="font-mono text-lg font-semibold">
                  <AnimatedEuro value={result.ahorro.total} />
                  <span className="ml-1 text-xs text-foreground/50">/{t("mes", "mo")}</span>
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-foreground/70">
                <li className="flex justify-between">
                  <span>{t("Tiempo de equipo", "Team time")}</span>
                  <span className="font-mono">
                    <AnimatedEuro value={result.ahorro.tiempoStaff} />
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>{t("Morosidad recuperada", "Overdue recovered")}</span>
                  <span className="font-mono">
                    <AnimatedEuro value={result.ahorro.morosidad} />
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>{t("Bajas evitadas", "Churn avoided")}</span>
                  <span className="font-mono">
                    <AnimatedEuro value={result.ahorro.churn} />
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>{t("Herramientas sustituidas", "Tools replaced")}</span>
                  <span className="font-mono">
                    <AnimatedEuro value={result.ahorro.herramientas} />
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-saito-green/30 bg-saito-green/5 p-5">
              <div className="mb-3 flex items-baseline justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-saito-green">
                  {t("Ingresos vía copiloto", "Copilot-driven revenue")}
                </h4>
                <span className="font-mono text-lg font-semibold text-saito-green">
                  {t("hasta", "up to")} <AnimatedEuro value={result.ingresos.total} />
                  <span className="ml-1 text-xs opacity-70">/{t("mes", "mo")}</span>
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-foreground/70">
                <li className="flex justify-between">
                  <span>{t("Bonos y clases", "Vouchers & classes")}</span>
                  <span className="font-mono">
                    <AnimatedEuro value={result.ingresos.bonos} />
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>{t("Eventos con uplift", "Events uplift")}</span>
                  <span className="font-mono">
                    <AnimatedEuro value={result.ingresos.eventos} />
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>{t("Equipaciones / merch", "Kits / merch")}</span>
                  <span className="font-mono">
                    <AnimatedEuro value={result.ingresos.merch} />
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>{t("Patrocinio revalorizado", "Sponsorship revalued")}</span>
                  <span className="font-mono">
                    <AnimatedEuro value={result.ingresos.patrocinio} />
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-foreground/10 p-5">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground/60">
                {t("Engagement", "Engagement")}
              </h4>
              <ul className="space-y-1.5 text-xs text-foreground/70">
                <li className="flex justify-between">
                  <span>{t("Impactos directos a socios", "Direct member impressions")}</span>
                  <span className="font-mono">
                    <AnimatedNumber value={result.engagement.impactosMes} />/{t("mes", "mo")}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>{t("Lectura de mensajes", "Message read rate")}</span>
                  <span className="font-mono">{result.engagement.porcentajeLectura}%</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl bg-foreground p-6 text-background">
              <p className="font-mono text-xs uppercase tracking-wider opacity-60">
                {t("Impacto total estimado", "Total estimated impact")}
              </p>
              <p className="mt-2 text-2xl font-semibold leading-tight">
                <AnimatedEuro value={result.totales.minMes} /> –{" "}
                <AnimatedEuro value={result.totales.maxMes} />
                <span className="ml-1 text-base opacity-60">/{t("mes", "mo")}</span>
              </p>
              <p className="mt-1 text-xs opacity-60">
                {t(
                  "Mínimo en ahorro real, máximo con copiloto activo.",
                  "Minimum is real savings, maximum is with copilot active.",
                )}
              </p>

              <div className="mt-4 border-t border-background/15 pt-4">
                <p className="text-xs opacity-60">{t("Anualizado", "Annualized")}</p>
                <p className="font-mono text-base font-semibold">
                  <AnimatedEuro value={result.totales.minAnio} /> –{" "}
                  <AnimatedEuro value={result.totales.maxAnio} />
                </p>
              </div>

              <a
                href={localizedPath("/contacto", locale)}
                className="mt-5 block w-full rounded-xl bg-saito-green px-4 py-3 text-center text-sm font-semibold text-foreground transition-colors hover:bg-saito-green/90"
              >
                {t("Quiero este impacto en mi club →", "I want this impact in my club →")}
              </a>
            </div>

            <button
              type="button"
              onClick={() => setShowFormulas((v) => !v)}
              className="w-full text-left text-xs text-foreground/50 underline-offset-2 hover:underline"
            >
              {showFormulas
                ? t("Ocultar", "Hide")
                : t("¿Cómo lo calculamos?", "How we calculate this")}
            </button>

            {showFormulas && (
              <div className="space-y-2 rounded-xl border border-foreground/10 bg-foreground/5 p-4 font-mono text-[11px] leading-relaxed text-foreground/70">
                <p>
                  <strong>{t("Coste/h staff:", "Staff €/h:")}</strong> {CONSTANTES.COSTE_HORA_STAFF}
                  €
                </p>
                <p>
                  <strong>{t("Horas recuperables:", "Recoverable hours:")}</strong>{" "}
                  {CONSTANTES.PORCENTAJE_HORAS_RECUPERABLES * 100}%
                </p>
                <p>
                  <strong>{t("Morosidad recuperable:", "Overdue recoverable:")}</strong>{" "}
                  {CONSTANTES.PORCENTAJE_MOROSIDAD_RECUPERABLE * 100}%
                </p>
                <p>
                  <strong>{t("Reducción de churn:", "Churn reduction:")}</strong>{" "}
                  {CONSTANTES.PORCENTAJE_REDUCCION_CHURN * 100}%
                </p>
                <p>
                  <strong>{t("Conversión bonos:", "Voucher conversion:")}</strong>{" "}
                  {CONSTANTES.CONVERSION_BONOS_MENSUAL * 100}%
                </p>
                <p>
                  <strong>{t("Uplift eventos online:", "Online events uplift:")}</strong>{" "}
                  {CONSTANTES.UPLIFT_EVENTOS_ONLINE * 100}%
                </p>
                <p>
                  <strong>{t("Compradores merch:", "Merch buyers:")}</strong>{" "}
                  {CONSTANTES.PORCENTAJE_SOCIOS_COMPRAN_MERCH * 100}% ×{" "}
                  {CONSTANTES.COMPRAS_MERCH_POR_SOCIO_ANIO}
                </p>
                <p>
                  <strong>{t("Revalorización patrocinio:", "Sponsorship revalue:")}</strong> +
                  {CONSTANTES.REVALORIZACION_PATROCINIO * 100}%
                </p>
                <p className="mt-3 not-italic text-foreground/50">
                  {t(
                    "Estimación orientativa basada en benchmarks del sector. La conversión real depende de la activación.",
                    "Indicative estimate based on industry benchmarks. Actual results depend on activation.",
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
