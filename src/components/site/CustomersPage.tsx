import { Link } from "@tanstack/react-router";
import { Quote } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Button } from "@/components/ui/button";
import customerVisual from "@/assets/site/saito-customer-operations-clean.png";
import { localizedPath, type Locale } from "@/lib/site-i18n";

export function CustomersPage({ locale }: { locale: Locale }) {
  const t = (es: string, en: string) => (locale === "en" ? en : es);

  const cases = [
    {
      club: t("Club polideportivo histórico", "Historic multi-sport club"),
      sport: t("8 secciones · 3 sedes", "8 sections · 3 venues"),
      quote: t(
        "Centralizar socios, cuotas y comunicación nos ha quitado horas de hojas de cálculo cada semana.",
        "Centralising members, fees and comms saved us hours of spreadsheets every week.",
      ),
      author: t("Dirección deportiva", "Sporting director"),
    },
    {
      club: t("Club de fútbol formación", "Youth football club"),
      sport: t("Cantera · 600 jugadores", "Academy · 600 players"),
      quote: t(
        "El cuerpo técnico convoca, pasa lista y reporta desde el móvil. Cero papeles.",
        "Coaches call up, take attendance and report from their phones. Zero paper.",
      ),
      author: t("Coordinador de cantera", "Academy coordinator"),
    },
    {
      club: t("Club de pádel y tenis", "Padel & tennis club"),
      sport: t("Reservas y cobros", "Bookings & billing"),
      quote: t(
        "Las reservas con cobro automático nos liberaron la recepción.",
        "Bookings with auto-billing freed up our reception.",
      ),
      author: t("Gerencia", "Management"),
    },
  ];

  return (
    <main>
      <section className="border-b border-border bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("Clientes", "Customers")}
            title={t(
              "Clubes que ya no vuelven a las hojas de cálculo",
              "Clubs that never go back to spreadsheets",
            )}
          />
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <img
              src={customerVisual}
              alt={t(
                "Club operando con SAITO en su día a día",
                "Club operating with SAITO every day",
              )}
              loading="lazy"
              width={1800}
              height={1125}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="pb-20 pt-8">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {cases.map((c) => (
            <article
              key={c.club}
              className="flex flex-col rounded-3xl border border-border bg-card p-7"
            >
              <Quote className="size-6 text-primary" />
              <p className="mt-4 text-base leading-relaxed">"{c.quote}"</p>
              <div className="mt-6 border-t border-border pt-4">
                <p className="font-semibold">{c.club}</p>
                <p className="text-xs text-muted-foreground">{c.sport}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {c.author}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-saito-gradient py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold sm:text-3xl">
            {t("¿Quieres ser el siguiente caso?", "Want to be the next case?")}
          </h3>
          <Button
            asChild
            size="lg"
            className="mt-6 rounded-full bg-white px-6 text-saito-navy hover:bg-white/90"
          >
            <Link to={localizedPath("/contacto", locale) as any}>
              {t("Pide una demo", "Book a demo")}
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
