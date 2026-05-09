import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { localizedPath, type Locale } from "@/lib/site-i18n";
import { t } from "./data";

export function CtaSection({ locale }: { locale: Locale }) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {t(locale, { es: "¿Quieres ver cómo lo aplicamos en tu club?", en: "Want to see how we apply this to your club?" })}
        </h2>
        <p className="mt-3 text-muted-foreground">
          {t(locale, {
            es: "Te enseñamos los controles y la configuración con tus datos en una demo personalizada.",
            en: "We'll walk you through the controls and configuration with your own data in a tailored demo.",
          })}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="rounded-full px-6">
            <Link to={localizedPath("/contacto", locale) as any}>
              {t(locale, { es: "Solicitar demo", en: "Book a demo" })}
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-6">
            <Link to={localizedPath("/producto", locale) as any}>
              {t(locale, { es: "Ver producto", en: "See product" })}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
