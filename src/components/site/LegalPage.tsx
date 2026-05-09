import type { Locale } from "@/lib/site-i18n";
import { SectionHeading } from "./SectionHeading";

type Section = { title: string; body: string[] };

interface Props {
  locale: Locale;
  eyebrow: string;
  title: string;
  updated: string;
  sections: Section[];
}

export function LegalPage({ locale, eyebrow, title, updated, sections }: Props) {
  const updatedLabel = locale === "en" ? "Last updated" : "Última actualización";
  return (
    <main>
      <section className="border-b border-border bg-muted/40 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            subtitle={`${updatedLabel}: ${updated}`}
          />
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-3xl space-y-10 px-4 sm:px-6 lg:px-8">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-xl font-semibold text-foreground">{s.title}</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {s.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
