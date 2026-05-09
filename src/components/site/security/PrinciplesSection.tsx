import type { Locale } from "@/lib/site-i18n";
import { SectionHeading } from "../SectionHeading";
import { principles, t } from "./data";

export function PrinciplesSection({ locale }: { locale: Locale }) {
  return (
    <section className="border-t border-border bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t(locale, { es: "Principios de seguridad", en: "Security principles" })}
          title={t(locale, {
            es: "Controles preparados desde el primer día",
            en: "Controls ready from day one",
          })}
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((p) => {
            const title = t(locale, p.title);
            return (
              <div key={title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <p.icon className="size-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(locale, p.desc)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
