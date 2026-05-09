import { useMemo, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Euro,
  Clock,
  TrendingUp,
  Megaphone,
  Ticket,
  Shirt,
  Sparkles,
  Info,
  ArrowRight,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/motion/Reveal";
import {
  calculateImpact,
  defaultInputs,
  formatEuro,
  type ImpactInputs,
} from "@/lib/impact";
import { localizedPath, type Locale } from "@/lib/site-i18n";

interface Props {
  locale: Locale;
}

/** Número animado con tween corto cada vez que cambia el target. */
function AnimatedEuro({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    const duration = 500;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const current = from + (to - from) * eased;
      setDisplay(current);
      if (p < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <>{formatEuro(display)}</>;
}

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    const duration = 500;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const current = from + (to - from) * eased;
      setDisplay(current);
      if (p < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <>
      {Math.round(display).toLocaleString("es-ES")}
      {suffix}
    </>
  );
}

export function ImpactCalculator({ locale }: Props) {
  const t = (es: string, en: string) => (locale === "en" ? en : es);
  const [inputs, setInputs] = useState<ImpactInputs>(defaultInputs);

  const result = useMemo(() => calculateImpact(inputs), [inputs]);

  const update = <K extends keyof ImpactInputs>(key: K, value: ImpactInputs[K]) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  return (
    <section className="border-t border-border bg-gradient-to-b from-background via-muted/30 to-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("Calculadora de impacto", "Impact calculator")}
          title={t("Tu impacto real con SAITO", "Your real impact with SAITO")}
          subtitle={t(
            "Mueve los controles según tu club. La estimación se actualiza en vivo: ahorro, ingresos nuevos vía copiloto y engagement.",
            "Move the controls to match your club. The estimate updates live: savings, new copilot-driven revenue, and engagement.",
          )}
        />

        <Reveal className="mt-12 grid gap-8 lg:grid-cols-5">
          {/* ============= CALCULADORA ============= */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h3 className="mb-6 text-lg font-bold">
                {t("Datos de tu club", "Your club data")}
              </h3>

              <div className="space-y-6">
                {/* Socios */}
                <SliderRow
                  icon={<Users className="size-4" />}
                  label={t("Socios / deportistas", "Members / athletes")}
                  value={inputs.socios}
                  display={inputs.socios.toLocaleString("es-ES")}
                  min={30}
                  max={3000}
                  step={10}
                  onChange={(v) => update("socios", v)}
                />

                {/* Secciones */}
                <SliderRow
                  icon={<Sparkles className="size-4" />}
                  label={t("Secciones deportivas", "Sport sections")}
                  value={inputs.secciones}
                  display={String(inputs.secciones)}
                  min={1}
                  max={15}
                  step={1}
                  onChange={(v) => update("secciones", v)}
                />

                {/* Horas semana */}
                <SliderRow
                  icon={<Clock className="size-4" />}
                  label={t("Horas/semana en gestión manual", "Hours/week on manual admin")}
                  value={inputs.horasSemana}
                  display={`${inputs.horasSemana} h`}
                  min={2}
                  max={60}
                  step={1}
                  onChange={(v) => update("horasSemana", v)}
                />

                {/* Cuota media */}
                <SliderRow
                  icon={<Euro className="size-4" />}
                  label={t("Cuota media mensual", "Average monthly fee")}
                  value={inputs.cuotaMedia}
                  display={`${inputs.cuotaMedia} €`}
                  min={10}
                  max={150}
                  step={1}
                  onChange={(v) => update("cuotaMedia", v)}
                />

                {/* Eventos al año */}
                <SliderRow
                  icon={<Ticket className="size-4" />}
                  label={t("Eventos con entrada / año", "Ticketed events / year")}
                  value={inputs.eventosAnio}
                  display={String(inputs.eventosAnio)}
                  min={0}
                  max={60}
                  step={1}
                  onChange={(v) => update("eventosAnio", v)}
                />

                {/* Patrocinadores */}
                <SliderRow
                  icon={<Megaphone className="size-4" />}
                  label={t("Patrocinadores activos", "Active sponsors")}
                  value={inputs.patrocinadores}
                  display={String(inputs.patrocinadores)}
                  min={0}
                  max={20}
                  step={1}
                  onChange={(v) => update("patrocinadores", v)}
                />

                {/* Toggles */}
                <div className="grid gap-3 pt-2 sm:grid-cols-2">
                  <ToggleRow
                    icon={<Sparkles className="size-4" />}
                    label={t("Vendes bonos / clases sueltas", "Sell vouchers / drop-ins")}
                    checked={inputs.vendeBonos}
                    onChange={(v) => update("vendeBonos", v)}
                  />
                  <ToggleRow
                    icon={<Shirt className="size-4" />}
                    label={t("Vendes equipaciones / merch", "Sell kits / merch")}
                    checked={inputs.vendeMerch}
                    onChange={(v) => update("vendeMerch", v)}
                  />
                </div>
              </div>

              <details className="mt-6 text-xs text-muted-foreground">
                <summary className="flex cursor-pointer items-center gap-1.5 font-medium text-foreground/80 hover:text-foreground">
                  <Info className="size-3.5" />
                  {t("¿Cómo lo calculamos?", "How we calculate this")}
                </summary>
                <div className="mt-3 space-y-1 leading-relaxed">
                  <p>
                    <strong>{t("Ahorro tiempo:", "Time savings:")}</strong>{" "}
                    {t(
                      "horas/semana × 4 × 18 €/h × 60% recuperable.",
                      "hours/week × 4 × €18/h × 60% recoverable.",
                    )}
                  </p>
                  <p>
                    <strong>{t("Morosidad:", "Overdue fees:")}</strong>{" "}
                    {t(
                      "5% del facturado mensual recuperado con pasarela + recordatorios.",
                      "5% of monthly billing recovered via gateway + reminders.",
                    )}
                  </p>
                  <p>
                    <strong>{t("Bonos:", "Vouchers:")}</strong>{" "}
                    {t("10% de socios × 35 € de ticket medio.", "10% of members × €35 average ticket.")}
                  </p>
                  <p>
                    <strong>{t("Eventos:", "Events:")}</strong>{" "}
                    {t(
                      "asistencia media 80 × 8 € × +40% uplift venta digital.",
                      "avg attendance 80 × €8 × +40% digital uplift.",
                    )}
                  </p>
                  <p>
                    <strong>{t("Merch:", "Merch:")}</strong>{" "}
                    {t("15% socios × 45 € × 2 compras/año.", "15% members × €45 × 2 purchases/year.")}
                  </p>
                  <p>
                    <strong>{t("Patrocinio:", "Sponsorship:")}</strong>{" "}
                    {t(
                      "18 impresiones in-app/socio × 8 € CPM × nº patrocinadores.",
                      "18 in-app impressions/member × €8 CPM × sponsors.",
                    )}
                  </p>
                  <p className="pt-2 italic">
                    {t(
                      "Estimación orientativa basada en benchmarks del sector. El resultado real depende de la activación.",
                      "Indicative estimate based on industry benchmarks. Actual results depend on activation.",
                    )}
                  </p>
                </div>
              </details>
            </div>
          </div>

          {/* ============= TARJETA RESULTADO ============= */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
                {/* Bloque AHORRO */}
                <div className="border-b border-border p-6">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    <Euro className="size-3.5" />
                    {t("Ahorro mensual", "Monthly savings")}
                  </div>
                  <div className="mt-2 text-3xl font-extrabold sm:text-4xl">
                    <AnimatedEuro value={result.ahorroMes} />
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {t("Tiempo + reducción de morosidad", "Time + overdue reduction")}
                  </div>
                </div>

                {/* Bloque INGRESOS */}
                <div className="border-b border-border p-6">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    <TrendingUp className="size-3.5" />
                    {t("Ingresos nuevos / mes", "New revenue / month")}
                  </div>
                  <div className="mt-2 text-3xl font-extrabold text-saito-green sm:text-4xl">
                    <AnimatedEuro value={result.ingresoMes} />
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span>{t("Bonos", "Vouchers")}</span>
                    <span className="text-right text-foreground">
                      <AnimatedEuro value={result.ingresoBonos} />
                    </span>
                    <span>{t("Eventos", "Events")}</span>
                    <span className="text-right text-foreground">
                      <AnimatedEuro value={result.ingresoEventos} />
                    </span>
                    <span>{t("Merch", "Merch")}</span>
                    <span className="text-right text-foreground">
                      <AnimatedEuro value={result.ingresoMerch} />
                    </span>
                    <span>{t("Patrocinio", "Sponsorship")}</span>
                    <span className="text-right text-foreground">
                      <AnimatedEuro value={result.valorPatrocinio} />
                    </span>
                  </div>
                </div>

                {/* Bloque ENGAGEMENT */}
                <div className="border-b border-border p-6">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    <Megaphone className="size-3.5" />
                    {t("Engagement", "Engagement")}
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-2xl font-extrabold">
                        <AnimatedNumber value={result.aperturaApp} suffix="%" />
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {t("Apertura mensajes app", "App message open rate")}
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold">
                        <AnimatedNumber value={result.impresionesPatrocinadores} />
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {t("Impactos patrocinadores/mes", "Sponsor impressions/mo")}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Clock className="size-3" />
                    <AnimatedNumber value={result.horasMes} suffix={t(" h recuperadas/mes", " h recovered/mo")} />
                  </div>
                </div>

                {/* Bloque IMPACTO TOTAL */}
                <motion.div
                  className="bg-gradient-to-br from-primary/10 via-primary/5 to-saito-green/10 p-6"
                  initial={false}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    <Sparkles className="size-3.5 text-primary" />
                    {t("Impacto total anual", "Total annual impact")}
                  </div>
                  <div className="mt-2 text-4xl font-extrabold text-saito-gradient sm:text-5xl">
                    <AnimatedEuro value={result.impactoAnio} />
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {t(
                      "SAITO se paga sola: el copiloto activa ingresos que cubren la suscripción en las primeras semanas.",
                      "SAITO pays for itself: the copilot drives revenue that covers the subscription within weeks.",
                    )}
                  </p>
                  <Button asChild size="lg" className="shimmer-btn mt-5 w-full rounded-full">
                    <Link to={localizedPath("/contacto", locale) as unknown as never}>
                      {t("Quiero este impacto en mi club", "I want this impact in my club")}
                      <ArrowRight className="ml-1 size-4" />
                    </Link>
                  </Button>
                </motion.div>
              </div>

              <p className="mt-3 text-center text-[11px] italic text-muted-foreground">
                {t(
                  "Estimación orientativa. Pide una demo para una proyección real con tus datos.",
                  "Indicative estimate. Book a demo for a real projection with your data.",
                )}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============= Subcomponentes ============= */

interface SliderRowProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}

function SliderRow({ icon, label, value, display, min, max, step, onChange }: SliderRowProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium">
          <span className="text-muted-foreground">{icon}</span>
          {label}
        </label>
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold tabular-nums">
          {display}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0])}
      />
    </div>
  );
}

interface ToggleRowProps {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function ToggleRow({ icon, label, checked, onChange }: ToggleRowProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-border bg-background/60 px-3 py-2.5 transition hover:border-primary/40">
      <span className="flex items-center gap-2 text-sm font-medium">
        <span className="text-muted-foreground">{icon}</span>
        {label}
      </span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}
