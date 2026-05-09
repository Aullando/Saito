import { FileCheck2, Scale } from "lucide-react";
import type { Locale } from "@/lib/site-i18n";
import { SectionHeading } from "../SectionHeading";
import { compliance, t } from "./data";

export function ComplianceSection({ locale }: { locale: Locale }) {
  return (
    <section className="border-t border-border bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t(locale, { es: "Cumplimiento y normativa", en: "Compliance & regulation" })}
          title={t(locale, { es: "Diseñado para alinearse con el marco europeo y español", en: "Designed to align with the EU and Spanish framework" })}
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {compliance.map((c) => {
            const title = t(locale, c.title);
            return (
              <div key={title} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="size-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(locale, c.desc)}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          <Scale className="mr-1.5 inline size-3.5 align-text-bottom" />
          {t(locale, {
            es: "No declaramos certificaciones que no tenemos obtenidas. Las menciones a ISO 27001 o ENS se refieren a controles preparados para alinearse con esos marcos y a una hoja de ruta de certificación.",
            en: "We do not claim certifications we have not obtained. References to ISO 27001 or ENS refer to controls prepared to align with those frameworks and to a certification roadmap.",
          })}
        </p>
      </div>
    </section>
  );
}
