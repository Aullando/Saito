import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { localizedPath, type Locale } from "@/lib/site-i18n";
import securityVisual from "@/assets/site/saito-security-trust-clean.png";
import { t } from "./data";
import { PilotBanner } from "./PilotBanner";

export function HeroSection({ locale }: { locale: Locale }) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 via-background to-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="size-3.5 text-primary" />
              {t(locale, { es: "Seguridad y privacidad", en: "Security & privacy" })}
            </span>
            <PilotBanner locale={locale} />
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {t(locale, {
                es: "Privacidad y seguridad diseñadas para clubes deportivos",
                en: "Privacy and security built for sports clubs",
              })}
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              {t(locale, {
                es: "SAITO protege datos de jugadores, familias, entrenadores y equipos con control de acceso, trazabilidad e IA privada por diseño.",
                en: "SAITO protects data on players, families, coaches and teams with access control, traceability and privacy-by-design AI.",
              })}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="rounded-full px-6">
                <Link to={localizedPath("/contacto", locale) as any}>
                  {t(locale, { es: "Solicitar demo", en: "Book a demo" })}
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-6">
                <Link to={localizedPath("/producto", locale) as any}>
                  {t(locale, { es: "Ver producto", en: "See product" })}
                </Link>
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl"
          >
            <img
              src={securityVisual}
              alt={t(locale, { es: "Seguridad y trazabilidad en SAITO", en: "Security and traceability in SAITO" })}
              width={1800}
              height={1125}
              className="h-full w-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
