import { Link } from "@tanstack/react-router";
import { Sparkles, ShieldCheck, Cpu } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { RoleTabs, defaultRolesEs, defaultRolesEn } from "./RoleTabs";
import { Button } from "@/components/ui/button";
import { localizedPath, type Locale } from "@/lib/site-i18n";

export function AIPage({ locale }: { locale: Locale }) {
  const t = (es: string, en: string) => (locale === "en" ? en : es);
  return (
    <main>
      <section className="bg-saito-gradient py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold">
            <Sparkles className="size-3.5" /> {t("Powered by Gemini", "Powered by Gemini")}
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold sm:text-5xl md:text-6xl">
            {t("Una IA que conoce tu club", "An AI that knows your club")}
          </h1>
          <p className="mt-5 max-w-2xl text-white/80">
            {t(
              "SAITO entiende los datos de tu organización y entrega respuestas accionables a cada rol: dirección, cuerpo técnico, servicio médico y socios.",
              "SAITO understands your data and delivers actionable answers to every role: leadership, coaching, medical and members.",
            )}
          </p>
        </div>
      </section>

      <section className="bg-saito-navy py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RoleTabs roles={locale === "en" ? defaultRolesEn : defaultRolesEs} />
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("Cómo funciona", "How it works")}
            title={t("Datos de tu club, en tu contexto", "Your data, in your context")}
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { i: Cpu, t: t("Modelos Gemini", "Gemini models"), d: t("Respuestas rápidas y multimodales sobre los datos de tu club.", "Fast, multimodal answers over your club data.") },
              { i: ShieldCheck, t: t("Privacidad por diseño", "Privacy by design"), d: t("Aislamiento por club, permisos por rol y trazabilidad de uso.", "Per-club isolation, role-based permissions and usage audit.") },
              { i: Sparkles, t: t("Acciones, no solo respuestas", "Actions, not just answers"), d: t("Genera comunicaciones, crea convocatorias y propone planes.", "Drafts comms, creates call-ups and proposes plans.") },
            ].map((b) => {
              const I = b.i;
              return (
                <div key={b.t} className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <I className="size-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{b.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b.d}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold sm:text-3xl">{t("Prueba la IA con datos de tu club", "Try the AI with your club's data")}</h3>
          <Button asChild size="lg" className="mt-6 rounded-full px-6">
            <Link to={localizedPath("/contacto", locale) as any}>{t("Pide una demo", "Book a demo")}</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
