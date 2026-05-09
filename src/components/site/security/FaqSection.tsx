import { KeyRound } from "lucide-react";
import type { Locale } from "@/lib/site-i18n";
import { SectionHeading } from "../SectionHeading";
import { faqs, t } from "./data";

export function FaqSection({ locale }: { locale: Locale }) {
  return (
    <section className="border-t border-border bg-muted/30 py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t(locale, { es: "Preguntas frecuentes", en: "FAQ" })}
          title={t(locale, {
            es: "Lo que más nos preguntan sobre seguridad",
            en: "Top security questions",
          })}
        />
        <div className="mt-10 space-y-4">
          {faqs.map((f) => {
            const q = t(locale, f.q);
            return (
              <details
                key={q}
                className="group rounded-2xl border border-border bg-card p-5 transition-colors open:bg-card"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base font-semibold text-foreground">
                  <span>{q}</span>
                  <KeyRound className="mt-1 size-4 shrink-0 text-primary transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t(locale, f.a)}
                </p>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}
