import { CheckCircle2 } from "lucide-react";
import type { Locale } from "@/lib/site-i18n";
import { SectionHeading } from "../SectionHeading";
import { roadmap, t } from "./data";

export function RoadmapSection({ locale }: { locale: Locale }) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t(locale, { es: "Hoja de ruta de confianza", en: "Trust roadmap" })}
          title={t(locale, {
            es: "Cómo crece nuestra postura de seguridad",
            en: "How our security posture grows",
          })}
        />
        <ol className="mt-10 space-y-6">
          {roadmap.map((r, i) => {
            const phase = t(locale, r.phase);
            return (
              <li key={phase} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  {i < roadmap.length - 1 && <span className="mt-2 w-px flex-1 bg-border" />}
                </div>
                <div className="pb-2">
                  <h3 className="text-base font-semibold text-foreground">{phase}</h3>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {r.items.map((it) => {
                      const text = t(locale, it);
                      return (
                        <li key={text} className="flex gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-saito-green" />
                          <span>{text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
