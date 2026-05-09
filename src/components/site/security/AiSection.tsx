import type { Locale } from "@/lib/site-i18n";
import { SectionHeading } from "../SectionHeading";
import { ai, t } from "./data";

export function AiSection({ locale }: { locale: Locale }) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t(locale, { es: "IA privada por diseño", en: "Privacy-by-design AI" })}
          title={t(locale, {
            es: "Una IA con permisos, límites y supervisión",
            en: "AI with permissions, limits and oversight",
          })}
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {ai.map((p) => {
            const title = t(locale, p.title);
            return (
              <div
                key={title}
                className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <p.icon className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {t(locale, p.desc)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
