import type { Locale } from "@/lib/site-i18n";
import { SectionHeading } from "../SectionHeading";
import { t } from "./data";

export function WhyItMattersSection({ locale }: { locale: Locale }) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t(locale, { es: "Por qué importa", en: "Why it matters" })}
          title={t(locale, {
            es: "Un club gestiona mucho más que partidos",
            en: "A club manages much more than matches",
          })}
        />
        <div className="mt-8 space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>
            {t(locale, {
              es: "Un club deportivo gestiona menores, pagos recurrentes, comunicaciones a familias, lesiones, citas médicas, restricciones deportivas y datos de contacto sensibles. Todo eso convive en la misma plataforma y exige decisiones explícitas sobre quién puede ver qué.",
              en: "A sports club manages minors, recurring payments, family communications, injuries, medical appointments, sport restrictions and sensitive contact data. All of that lives in the same platform and demands explicit decisions about who can see what.",
            })}
          </p>
          <p>
            {t(locale, {
              es: "SAITO se diseña asumiendo este contexto: protección por defecto, separación clara entre roles y trazabilidad de las acciones que importan.",
              en: "SAITO is designed assuming this context: protection by default, clear separation between roles and traceability for the actions that matter.",
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
