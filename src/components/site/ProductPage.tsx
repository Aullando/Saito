import { Link } from "@tanstack/react-router";
import {
  Building2,
  CalendarDays,
  CreditCard,
  HeartPulse,
  MessageSquare,
  Users,
  ClipboardList,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Button } from "@/components/ui/button";
import { localizedPath, type Locale } from "@/lib/site-i18n";

interface Item {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
}

export function ProductPage({ locale }: { locale: Locale }) {
  const t = (es: string, en: string) => (locale === "en" ? en : es);

  const items: Item[] = [
    {
      id: "socios",
      icon: Users,
      title: t("Socios y deportistas", "Members & athletes"),
      description: t(
        "Ficha única con datos personales, deportivos y económicos. Altas online, renovaciones automáticas y segmentación.",
        "Single profile with personal, sporting and financial data. Online sign-ups, auto renewals and segmentation.",
      ),
      features: [
        t("Formularios personalizables y firma digital.", "Custom forms and e-signature."),
        t("Importación masiva desde Excel.", "Bulk Excel import."),
        t("Filtros por categoría, edad o estado.", "Filters by category, age or status."),
      ],
    },
    {
      id: "calendario",
      icon: CalendarDays,
      title: t("Calendario y reservas", "Calendar & bookings"),
      description: t(
        "Entrenamientos, partidos y eventos sincronizados. Reserva de pistas, vestuarios y salas con reglas por sección.",
        "Training, matches and events all synced. Booking of pitches, locker rooms and halls with per-section rules.",
      ),
      features: [
        t("Detección automática de choques.", "Automatic clash detection."),
        t("Recordatorios por email y push.", "Email and push reminders."),
        t("Calendarios compartidos por equipo.", "Shared calendars per team."),
      ],
    },
    {
      id: "staff",
      icon: ClipboardList,
      title: t("Staff y entrenadores", "Staff & coaches"),
      description: t(
        "Plantillas, asistencias, convocatorias y notas técnicas en un solo flujo.",
        "Squads, attendance, call-ups and coaching notes in a single flow.",
      ),
      features: [
        t("App móvil para el cuerpo técnico.", "Mobile app for the coaching staff."),
        t("Histórico de rendimiento por jugador.", "Player performance history."),
        t("Plantillas de entrenamiento reutilizables.", "Reusable training templates."),
      ],
    },
    {
      id: "pagos",
      icon: CreditCard,
      title: t("Pagos y cuotas", "Payments & fees"),
      description: t(
        "Cobros recurrentes con tarjeta o SEPA, conciliación automática y recordatorios de impagos.",
        "Recurring card or SEPA charges, automated reconciliation and overdue reminders.",
      ),
      features: [
        t("Reglas de descuento por familia o sección.", "Family or section discount rules."),
        t("Facturación y exportación contable.", "Invoicing and accounting export."),
        t("Panel de tesorería en tiempo real.", "Real-time treasury dashboard."),
      ],
    },
    {
      id: "comunicacion",
      icon: MessageSquare,
      title: t("Comunicación", "Communication"),
      description: t(
        "Mensajes a equipos, familias y secciones desde un único hilo, con plantillas y trazabilidad.",
        "Messages to teams, families and sections from a single thread, with templates and audit trail.",
      ),
      features: [
        t("Segmentación por rol y categoría.", "Segmentation by role and category."),
        t("Adjuntos y consentimientos.", "Attachments and consents."),
        t("Notificaciones push de la app.", "App push notifications."),
      ],
    },
    {
      id: "salud",
      icon: HeartPulse,
      title: t("Salud y seguimiento", "Health & tracking"),
      description: t(
        "Historial médico, lesiones, revisiones y carga de entrenamiento con permisos clínicos.",
        "Medical history, injuries, check-ups and training load with clinical permissions.",
      ),
      features: [
        t("Protocolos de retorno al juego.", "Return-to-play protocols."),
        t("Alertas por sobrecarga.", "Overload alerts."),
        t("Acceso restringido al equipo médico.", "Restricted access for medical staff."),
      ],
    },
    {
      id: "instalaciones",
      icon: Building2,
      title: t("Instalaciones", "Facilities"),
      description: t(
        "Gestión de pistas, vestuarios y salas, incluyendo cobros por uso y aforos.",
        "Manage pitches, locker rooms and halls, including pay-per-use and capacities.",
      ),
      features: [
        t("Reglas de prioridad por sección.", "Priority rules per section."),
        t("Bloqueos por mantenimiento.", "Maintenance blocks."),
        t("Estadísticas de ocupación.", "Occupancy statistics."),
      ],
    },
    {
      id: "ia",
      icon: Sparkles,
      title: t("IA por rol", "Role-based AI"),
      description: t(
        "Asistente que entiende los datos del club y propone acciones según el perfil del usuario.",
        "Assistant that understands club data and proposes actions per user role.",
      ),
      features: [
        t("Resúmenes automáticos por sección.", "Automatic per-section summaries."),
        t("Detección de patrones de baja.", "Churn pattern detection."),
        t("Borradores de comunicación.", "Communication drafts."),
      ],
    },
  ];

  return (
    <main>
      <section className="border-b border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("Producto", "Product")}
            title={t("Una plataforma. Todos los módulos del club.", "One platform. All your club modules.")}
            subtitle={t(
              "Cada bloque está pensado para resolver un trabajo real del día a día. Y todos comparten datos.",
              "Each block solves a real day-to-day job. And they all share data.",
            )}
          />
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {items.map((it) => (
              <a
                key={it.id}
                href={`#${it.id}`}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground hover:border-primary hover:text-primary"
              >
                {it.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-5xl space-y-20 px-4 sm:px-6 lg:px-8">
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <article key={it.id} id={it.id} className="grid items-center gap-10 md:grid-cols-2">
                <div className={i % 2 ? "md:order-2" : ""}>
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="mt-4 text-2xl font-bold sm:text-3xl">{it.title}</h3>
                  <p className="mt-3 text-muted-foreground">{it.description}</p>
                  <ul className="mt-5 space-y-2">
                    {it.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-saito-green" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`rounded-3xl border border-border bg-card p-6 ${i % 2 ? "md:order-1" : ""}`}>
                  <div className="aspect-[4/3] rounded-2xl bg-saito-gradient p-6">
                    <div className="flex h-full w-full flex-col justify-between rounded-xl bg-white/5 p-4 text-white backdrop-blur">
                      <Icon className="size-7" />
                      <p className="text-sm font-semibold">{it.title}</p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border bg-muted/40 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold sm:text-3xl">{t("¿Quieres verlo en tu club?", "Want to see it in your club?")}</h3>
          <p className="mt-3 text-muted-foreground">{t("Te enseñamos SAITO con tus categorías y secciones.", "We'll show you SAITO with your own categories and sections.")}</p>
          <Button asChild size="lg" className="mt-6 rounded-full px-6">
            <Link to={localizedPath("/contacto", locale) as any}>{t("Pide una demo", "Book a demo")}</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
