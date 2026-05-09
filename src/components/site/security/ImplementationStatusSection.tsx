import type { Locale } from "@/lib/site-i18n";
import { SectionHeading } from "../SectionHeading";
import { implementationStatus, STATUS_META, t } from "./data";

export function ImplementationStatusSection({ locale }: { locale: Locale }) {
  return (
    <section className="border-t border-border py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t(locale, { es: "Transparencia", en: "Transparency" })}
          title={t(locale, {
            es: "Estado real de implementación",
            en: "Real implementation status",
          })}
          subtitle={t(locale, {
            es: "Publicamos en abierto qué controles están activos hoy y cuáles entran durante la fase de piloto. La validación se hace con el club, no a su espalda.",
            en: "We publish openly which controls are active today and which enter during the pilot phase. Validation happens with the club, not behind their back.",
          })}
        />
        <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left">
                  {t(locale, { es: "Control", en: "Control" })}
                </th>
                <th className="px-5 py-3 text-left">{t(locale, { es: "Estado", en: "Status" })}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {implementationStatus.map((row) => {
                const meta = STATUS_META[row.status];
                const Icon = meta.icon;
                const title = t(locale, row.title);
                return (
                  <tr key={title}>
                    <td className="px-5 py-4 text-foreground">
                      <p className="font-medium">{title}</p>
                      {row.note && (
                        <p className="mt-1 text-xs text-muted-foreground">{t(locale, row.note)}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 align-top">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.cls}`}
                      >
                        <Icon className="size-3.5" />
                        {locale === "en" ? meta.labelEn : meta.labelEs}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          {t(locale, {
            es: "Esta tabla se actualiza con cada hito de producto. Si necesitas un control concreto antes del despliegue general, podemos priorizarlo dentro del piloto.",
            en: "This table is updated at every product milestone. If you need a specific control before general availability, we can prioritise it within the pilot.",
          })}
        </p>
      </div>
    </section>
  );
}
