import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Building2,
  CalendarDays,
  CreditCard,
  HeartPulse,
  MessageSquare,
  Users,
  ClipboardList,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TableProperties,
  Workflow,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardMockup } from "@/components/site/DashboardMockup";
import { ModuleCard } from "@/components/site/ModuleCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { RoleTabs, defaultRolesEs, defaultRolesEn } from "@/components/site/RoleTabs";
import photoMatch from "@/assets/photos/match.jpg";
import heroVisual from "@/assets/site/saito-hero-command-center.png";
import multiclubVisual from "@/assets/site/saito-multiclub-network.png";
import { localizedPath, type Locale } from "@/lib/site-i18n";

interface Props {
  locale: Locale;
}

export function HomePage({ locale }: Props) {
  const t = (es: string, en: string) => (locale === "en" ? en : es);

  const modules = [
    { icon: Users, title: t("Socios y deportistas", "Members & athletes"), description: t("Ficha única, altas, bajas, categorías y fichajes en un solo lugar.", "Single profile, sign-ups, drop-offs, categories and signings in one place.") },
    { icon: CalendarDays, title: t("Calendario y reservas", "Calendar & bookings"), description: t("Entrenamientos, partidos y reserva de instalaciones sin choques.", "Training, matches and facility booking with zero clashes.") },
    { icon: ClipboardList, title: t("Staff y entrenadores", "Staff & coaches"), description: t("Plantillas, asistencias, alineaciones y reportes por jugador.", "Squads, attendance, line-ups and per-player reports.") },
    { icon: CreditCard, title: t("Pagos y cuotas", "Payments & fees"), description: t("Cobros recurrentes, recordatorios automáticos y conciliación.", "Recurring billing, automated reminders and reconciliation.") },
    { icon: MessageSquare, title: t("Comunicación", "Communication"), description: t("Mensajes a equipos, familias y secciones desde un único hilo.", "Messaging to teams, families and sections from a single thread.") },
    { icon: HeartPulse, title: t("Salud y seguimiento", "Health & tracking"), description: t("Historial médico, lesiones y carga de entrenamiento.", "Medical history, injuries and training load.") },
    { icon: Building2, title: t("Instalaciones", "Facilities"), description: t("Pistas, vestuarios, salas y cobros por uso.", "Pitches, locker rooms, halls and pay-per-use.") },
    { icon: Sparkles, title: t("IA por rol", "AI by role"), description: t("Cada perfil ve solo lo que le importa, con respuestas accionables.", "Every role sees only what matters, with actionable answers.") },
  ];

  const benefits = [
    { icon: TableProperties, title: t("Menos hojas de cálculo", "Fewer spreadsheets") },
    { icon: Workflow, title: t("Menos trabajo manual", "Less manual work") },
    { icon: MessageSquare, title: t("Mejor comunicación", "Better communication") },
    { icon: ShieldCheck, title: t("Datos centralizados", "Centralised data") },
    { icon: Users, title: t("Operativa por rol", "Role-based operations") },
  ];

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-saito-radial" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-semibold text-muted-foreground backdrop-blur">
                <Sparkles className="size-3.5 text-primary" />
                {t("IA privada por diseño", "Privacy-by-design AI")}
              </div>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] sm:text-5xl md:text-6xl">
                {t("Gestiona tu club deportivo", "Run your sports club")}
                <br />
                <span className="text-saito-gradient">
                  {t("en una sola plataforma", "from a single platform")}
                </span>
              </h1>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                SAITO · <span className="text-foreground">S</span>port <span className="text-foreground">AI</span> <span className="text-foreground">T</span>raining <span className="text-foreground">O</span>ptimisation
              </p>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                {t(
                  "SAITO unifica socios, calendario, pagos, comunicación e IA por rol. Pensado para clubes que crecen y para entidades multi-sección.",
                  "SAITO unifies members, calendar, payments, communication and role-based AI. Built for clubs that grow and multi-section organisations.",
                )}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="rounded-full px-6">
                  <Link to={localizedPath("/contacto", locale) as any}>
                    {t("Pide una demo", "Book a demo")} <ArrowRight className="ml-1 size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-6">
                  <Link to={localizedPath("/producto", locale) as any}>
                    {t("Ver funcionalidades", "See features")}
                  </Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                {[
                  t("Sin tarjeta", "No card required"),
                  t("Migración asistida", "Assisted migration"),
                  t("Soporte en español", "Support in your language"),
                ].map((f) => (
                  <span key={f} className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5 text-saito-green" /> {f}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            >
              <DashboardMockup />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/40 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {t("Clubes y federaciones que confían en SAITO", "Clubs and federations that trust SAITO")}
          </p>
          <div className="mt-6 grid grid-cols-2 items-center gap-6 opacity-70 sm:grid-cols-3 md:grid-cols-6">
            {["Atlético FC", "RC Norte", "Pádel Pro", "Vela Bay", "Hockey 95", "Basket City"].map((n) => (
              <div key={n} className="text-center text-sm font-semibold tracking-wide text-muted-foreground">
                {n}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("Producto", "Product")}
            title={t("Todo lo que tu club necesita, sin más herramientas", "Everything your club needs, without extra tools")}
            subtitle={t(
              "Módulos integrados, datos compartidos y flujos pensados para el día a día deportivo.",
              "Integrated modules, shared data and workflows designed for daily club life.",
            )}
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map((m, i) => (
              <ModuleCard key={m.title} {...m} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Cinematic visual band */}
      <section className="relative h-[55vh] min-h-[360px] w-full overflow-hidden">
        <img
          src={photoMatch}
          alt={t("Partido del club al atardecer", "Club match at sunset")}
          loading="lazy"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-saito-navy via-saito-navy/40 to-transparent" />
        <div className="relative flex h-full items-end">
          <div className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              {t("Hecho para los clubes que viven el deporte", "Built for clubs that live the game")}
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl">
              {t(
                "Mientras la grada vibra, tu club funciona solo.",
                "While the stands roar, your club just runs.",
              )}
            </h2>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-saito-gradient py-24 text-white">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.12), transparent 50%)" }} aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            invert
            eyebrow={t("IA por rol", "Role-based AI")}
            title={t("Una IA que entiende cómo funciona un club", "An AI that understands how a club works")}
            subtitle={t(
              "Cada perfil ve solo lo que le importa. SAITO aprende de los datos de tu club y propone acciones, no solo gráficos.",
              "Every role sees only what matters. SAITO learns from your club's data and proposes actions, not just charts.",
            )}
          />
          <div className="mt-12">
            <RoleTabs roles={locale === "en" ? defaultRolesEn : defaultRolesEs} />
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {t("Multi-club", "Multi-club")}
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl">
                {t(
                  "Un club matriz. Varias sedes. Muchas secciones.",
                  "One parent club. Several venues. Many sections.",
                )}
              </h2>
              <p className="mt-4 text-muted-foreground">
                {t(
                  "Pensado para entidades como clubes históricos polideportivos: gobierno central, autonomía por sección y datos consolidados sin duplicar trabajo.",
                  "Built for organisations like multi-sport historic clubs: central governance, per-section autonomy and consolidated data without duplicate work.",
                )}
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  t("Permisos por sede, sección y rol.", "Permissions per venue, section and role."),
                  t("Cuotas y descuentos cruzados entre secciones.", "Cross-section fees and discounts."),
                  t("Reporting consolidado y por unidad.", "Consolidated and per-unit reporting."),
                ].map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-saito-green" /> {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-border shadow-xl">
              <img
                src={photoTeam}
                alt={t("Equipo unido en cancha", "Team huddled together")}
                loading="lazy"
                width={1024}
                height={1024}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <div className="flex flex-wrap gap-2">
                  {["Fútbol", "Pádel", "Tenis", "Vela", "Hockey", "Basket", "Natación", "Gimnasia"].map((s) => (
                    <span key={s} className="rounded-full border border-white/30 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("Por qué SAITO", "Why SAITO")}
            title={t("Menos fricción, más deporte", "Less friction, more sport")}
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-5">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <p className="text-sm font-semibold">{b.title}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-saito-gradient py-24 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            {t("Lleva la gestión de tu club al siguiente nivel", "Take your club management to the next level")}
          </h2>
          <p className="mt-4 text-white/80">
            {t(
              "Te acompañamos en la migración y configuración. Empieza la temporada con todo en orden.",
              "We help you migrate and set everything up. Start your season fully sorted.",
            )}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-full bg-white px-6 text-saito-navy hover:bg-white/90">
              <Link to={localizedPath("/contacto", locale) as any}>
                {t("Pide una demo", "Book a demo")} <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-white/30 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white">
              <Link to={localizedPath("/precios", locale) as any}>
                {t("Ver precios", "See pricing")}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
