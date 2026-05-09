import { useState } from "react";
import { CheckCircle2, Mail, Phone, Building2 } from "lucide-react";
import { toast } from "sonner";
import { SectionHeading } from "./SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Locale } from "@/lib/site-i18n";

export function ContactPage({ locale }: { locale: Locale }) {
  const t = (es: string, en: string) => (locale === "en" ? en : es);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast.success(t("Solicitud enviada. Te contactamos en breve.", "Request sent. We'll be in touch shortly."));
    }, 700);
  }

  return (
    <main>
      <section className="border-b border-border bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("Contacto", "Contact")}
            title={t("Pide una demo de SAITO", "Book a SAITO demo")}
            subtitle={t(
              "Cuéntanos cómo es tu club y te enseñamos SAITO con tus datos.",
              "Tell us about your club and we'll show you SAITO with your own data.",
            )}
          />
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:px-8">
          <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            {sent ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <CheckCircle2 className="size-10 text-saito-green" />
                <p className="text-lg font-semibold">{t("¡Gracias!", "Thank you!")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("Te contactaremos en menos de 24h laborables.", "We'll contact you within 24 working hours.")}
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">{t("Nombre", "Name")}</Label>
                    <Input id="name" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="club">{t("Club / entidad", "Club / organisation")}</Label>
                    <Input id="club" required />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">{t("Email", "Email")}</Label>
                    <Input id="email" type="email" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">{t("Teléfono", "Phone")}</Label>
                    <Input id="phone" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="msg">{t("Cuéntanos sobre tu club", "Tell us about your club")}</Label>
                  <Textarea id="msg" rows={5} placeholder={t("Secciones, número de socios, herramientas actuales…", "Sections, number of members, current tools…")} />
                </div>
                <Button type="submit" size="lg" className="w-full rounded-full" disabled={loading}>
                  {loading ? t("Enviando…", "Sending…") : t("Enviar solicitud", "Send request")}
                </Button>
              </div>
            )}
          </form>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6">
              <Mail className="size-5 text-primary" />
              <p className="mt-3 text-sm font-semibold">hola@saito.app</p>
              <p className="text-xs text-muted-foreground">{t("Respondemos en 24h laborables.", "We reply within 24 working hours.")}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <Phone className="size-5 text-primary" />
              <p className="mt-3 text-sm font-semibold">+34 900 000 000</p>
              <p className="text-xs text-muted-foreground">{t("Lun-Vie · 9:00 – 18:00", "Mon-Fri · 9:00 – 18:00")}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <Building2 className="size-5 text-primary" />
              <p className="mt-3 text-sm font-semibold">{t("Para clubes y federaciones", "For clubs and federations")}</p>
              <p className="text-xs text-muted-foreground">{t("Onboarding asistido y migración incluida.", "Assisted onboarding and migration included.")}</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
