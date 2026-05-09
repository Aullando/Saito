import { Link } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Button } from "@/components/ui/button";
import { localizedPath, type Locale } from "@/lib/site-i18n";

export function PricingPage({ locale }: { locale: Locale }) {
  const t = (es: string, en: string) => (locale === "en" ? en : es);

  const plans = [
    {
      name: "Club",
      price: t("Desde 99 € /mes", "From €99 /mo"),
      desc: t("Para clubes que arrancan con una sección.", "For clubs starting with one section."),
      features: [
        t("Hasta 300 socios", "Up to 300 members"),
        t("Módulos esenciales", "Essential modules"),
        t("Soporte por email", "Email support"),
      ],
      cta: t("Empezar", "Get started"),
      highlight: false,
    },
    {
      name: "Pro",
      price: t("Desde 249 € /mes", "From €249 /mo"),
      desc: t(
        "Para clubes consolidados con varios equipos.",
        "For established clubs with several teams.",
      ),
      features: [
        t("Socios ilimitados", "Unlimited members"),
        t("IA por rol incluida", "Role-based AI included"),
        t("Pagos y facturación", "Payments & invoicing"),
        t("Soporte prioritario", "Priority support"),
      ],
      cta: t("Pide una demo", "Book a demo"),
      highlight: true,
    },
    {
      name: "Multi-club",
      price: t("A medida", "Custom"),
      desc: t(
        "Para entidades polideportivas con varias sedes.",
        "For multi-sport organisations with several venues.",
      ),
      features: [
        t("Sedes y secciones ilimitadas", "Unlimited venues & sections"),
        t("Gobierno y permisos avanzados", "Advanced governance & permissions"),
        t("SLA y onboarding dedicado", "SLA & dedicated onboarding"),
      ],
      cta: t("Habla con ventas", "Talk to sales"),
      highlight: false,
    },
  ];

  const faqs = [
    {
      q: t("¿Hay permanencia?", "Is there a contract?"),
      a: t("No. Plan mensual o anual con descuento.", "No. Monthly or annual with discount."),
    },
    {
      q: t("¿Migráis los datos?", "Do you migrate our data?"),
      a: t(
        "Sí. Migración asistida desde Excel o tu sistema actual.",
        "Yes. Assisted migration from Excel or your current system.",
      ),
    },
    {
      q: t("¿Está incluida la IA?", "Is AI included?"),
      a: t(
        "Sí en planes Pro y Multi-club; con cuotas justas de uso.",
        "Yes on Pro and Multi-club plans, with fair usage.",
      ),
    },
  ];

  return (
    <main>
      <section className="border-b border-border bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("Precios", "Pricing")}
            title={t("Planes que crecen con tu club", "Plans that grow with your club")}
            subtitle={t(
              "Sin sorpresas. Habla con nosotros para una propuesta a medida.",
              "No surprises. Talk to us for a tailored quote.",
            )}
          />
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative flex flex-col rounded-3xl border p-7 ${
                p.highlight
                  ? "border-primary bg-saito-navy text-white shadow-xl"
                  : "border-border bg-card"
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-7 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  <Sparkles className="size-3" /> {t("Más elegido", "Most picked")}
                </span>
              )}
              <h3 className="text-xl font-bold">{p.name}</h3>
              <p
                className={`mt-1 text-sm ${p.highlight ? "text-white/70" : "text-muted-foreground"}`}
              >
                {p.desc}
              </p>
              <p className="mt-6 text-3xl font-extrabold">{p.price}</p>
              <ul className="mt-6 flex-1 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check
                      className={`mt-0.5 size-4 shrink-0 ${p.highlight ? "text-saito-green" : "text-saito-green"}`}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={`mt-8 w-full rounded-full ${p.highlight ? "bg-white text-saito-navy hover:bg-white/90" : ""}`}
                variant={p.highlight ? "default" : "outline"}
              >
                <Link to={localizedPath("/contacto", locale) as unknown as never}>{p.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-muted/40 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold sm:text-3xl">
            {t("Preguntas frecuentes", "Frequently asked questions")}
          </h3>
          <dl className="mt-8 space-y-6">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-2xl border border-border bg-card p-5">
                <dt className="font-semibold">{f.q}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </main>
  );
}
