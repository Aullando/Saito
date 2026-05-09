import { Link } from "@tanstack/react-router";
import { Building2, CheckCircle2, MinusCircle } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Button } from "@/components/ui/button";
import iso from "@/assets/brand/saito-iso.svg";
import { localizedPath, type Locale } from "@/lib/site-i18n";

export function MultiClubPage({ locale }: { locale: Locale }) {
  const t = (es: string, en: string) => (locale === "en" ? en : es);

  const rows = [
    [t("Sedes y secciones independientes", "Independent venues & sections"), false, true],
    [t("Reporting consolidado", "Consolidated reporting"), false, true],
    [t("Permisos por rol y unidad", "Per-role and per-unit permissions"), true, true],
    [t("Cuotas cruzadas", "Cross-section fees"), false, true],
    [t("Gobierno central", "Central governance"), false, true],
    [t("App de socio única", "Single member app"), true, true],
  ];

  return (
    <main>
      <section className="border-b border-border bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("Multi-club", "Multi-club")}
            title={t("Para clubes históricos y entidades polideportivas", "For historic clubs and multi-sport organisations")}
            subtitle={t(
              "Una arquitectura pensada para clubes con varias sedes, secciones deportivas y equipos directivos.",
              "An architecture for clubs with several venues, sporting sections and leadership teams.",
            )}
          />
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-3xl border border-border bg-card p-8">
            <div className="flex flex-col items-center gap-5">
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-background px-5 py-3 shadow-sm">
                <img src={iso} className="size-5" alt="" /> <span className="text-sm font-semibold">{t("Club matriz", "Parent club")}</span>
              </div>
              <div className="h-6 w-px bg-border" />
              <div className="grid grid-cols-3 gap-3">
                {[t("Sede Norte", "North venue"), t("Sede Centro", "Central venue"), t("Sede Sur", "South venue")].map((s) => (
                  <div key={s} className="rounded-xl border border-border bg-muted px-3 py-2 text-center text-xs font-semibold">
                    <Building2 className="mx-auto mb-1 size-4 text-primary" />
                    {s}
                  </div>
                ))}
              </div>
              <div className="h-6 w-px bg-border" />
              <div className="grid grid-cols-4 gap-2 text-[11px]">
                {["Fútbol", "Pádel", "Tenis", "Vela", "Hockey", "Basket", "Natación", "Gimnasia"].map((s) => (
                  <span key={s} className="rounded-full border border-border bg-background px-2.5 py-1 text-center font-medium text-muted-foreground">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold sm:text-3xl">{t("Lo que cambia frente a un club simple", "What changes vs a single club")}</h3>
            <div className="mt-6 overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">{t("Capacidad", "Capability")}</th>
                    <th className="px-4 py-3 text-center">{t("Club simple", "Single club")}</th>
                    <th className="px-4 py-3 text-center">{t("Multi-club", "Multi-club")}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(([label, a, b]) => (
                    <tr key={String(label)} className="border-t border-border">
                      <td className="px-4 py-3">{label as string}</td>
                      <td className="px-4 py-3 text-center">
                        {a ? <CheckCircle2 className="mx-auto size-4 text-saito-green" /> : <MinusCircle className="mx-auto size-4 text-muted-foreground/50" />}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {b ? <CheckCircle2 className="mx-auto size-4 text-saito-green" /> : <MinusCircle className="mx-auto size-4 text-muted-foreground/50" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("Jerarquía", "Hierarchy")}
            title={t("Una plataforma para los seis niveles del club", "One platform for the six levels of the club")}
            subtitle={t(
              "Desde gobierno hasta familias, cada nivel ve lo que le corresponde y nada más.",
              "From governance to families, each level sees only what concerns them.",
            )}
          />
          <div className="mt-12 space-y-3">
            {[
              { name: "Board", desc: t("Gobierno y estrategia.", "Governance and strategy.") },
              { name: "C-Level", desc: t("Dirección ejecutiva del club.", "Executive direction of the club.") },
              { name: t("BD, Finanzas y Dirección Deportiva", "BD, Finance & Sport Directors"), desc: t("Liderazgo funcional por área.", "Functional leadership per area.") },
              { name: t("Administración y Coordinación", "Administration & Coordination"), desc: t("Operación diaria del club.", "Day-to-day club operations.") },
              { name: t("Entrenadores y Árbitros", "Coaches & Referees"), desc: t("Staff técnico y arbitral.", "Technical and refereeing staff.") },
              { name: t("Deportistas y Familias", "Athletes & Families"), desc: t("Experiencia final del usuario.", "End-user experience.") },
            ].map((lvl, i) => (
              <div
                key={lvl.name}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
                style={{ marginLeft: `${i * 24}px` }}
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{lvl.name}</div>
                  <div className="text-xs text-muted-foreground">{lvl.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-saito-gradient py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold sm:text-3xl">{t("Hablemos de tu estructura", "Let's talk about your structure")}</h3>
          <Button asChild size="lg" className="mt-6 rounded-full bg-white px-6 text-saito-navy hover:bg-white/90">
            <Link to={localizedPath("/contacto", locale) as any}>{t("Pide una demo", "Book a demo")}</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
