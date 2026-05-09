import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Users,
  KeyRound,
  Activity,
  Baby,
  HeartPulse,
  Brain,
  Eye,
  UserCheck,
  Sliders,
  FileCheck2,
  Scale,
  Building2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./SectionHeading";
import { localizedPath, type Locale } from "@/lib/site-i18n";
import securityVisual from "@/assets/site/saito-security-trust-clean.png";

interface Props {
  locale: Locale;
}

export function SecurityPage({ locale }: Props) {
  const t = (es: string, en: string) => (locale === "en" ? en : es);

  const principles = [
    { icon: Building2, title: t("Datos aislados por club", "Per-club data isolation"), desc: t("Cada club opera en su propio espacio lógico. Las consultas se aíslan a nivel de organización para que los datos nunca se mezclen entre entidades.", "Each club operates in its own logical space. Queries are scoped per organisation so data never crosses entities.") },
    { icon: Users, title: t("Permisos por rol", "Role-based permissions"), desc: t("Admin, manager, técnico, médico y familias. Cada rol ve solo lo que necesita para hacer su trabajo.", "Admin, manager, technical, medical and family. Each role only sees what they need to do their job.") },
    { icon: Lock, title: t("Cifrado en tránsito y en reposo", "Encryption in transit and at rest"), desc: t("TLS para todo el tráfico y cifrado en reposo en la base de datos y el almacenamiento de archivos.", "TLS for all traffic and at-rest encryption for the database and file storage.") },
    { icon: Activity, title: t("Registro de accesos sensibles", "Sensitive-access logging"), desc: t("Las acciones sobre datos médicos, menores y pagos quedan registradas para auditoría interna del club.", "Actions on medical data, minors and payments are logged for the club's internal audit trail.") },
    { icon: Baby, title: t("Control específico para menores", "Specific controls for minors"), desc: t("Marcado de menores, gestión de tutores y restricciones por edad para comunicaciones y consentimientos.", "Minor flagging, guardian management and age-based restrictions for communications and consents.") },
    { icon: HeartPulse, title: t("Módulo de salud con acceso restringido", "Health module with restricted access"), desc: t("El historial médico, las lesiones y las citas solo son visibles para el rol médico y para quien el club autorice expresamente.", "Medical history, injuries and appointments are only visible to the medical role and to those the club expressly authorises.") },
  ];

  const ai = [
    { icon: Brain, title: t("No entrenamos modelos generales con tus datos", "We do not train general models with your data"), desc: t("Los datos del club no se usan para entrenar modelos compartidos con otros clientes ni con terceros.", "Club data is not used to train models shared with other customers or third parties.") },
    { icon: Eye, title: t("La IA solo ve lo que tú puedes ver", "AI only sees what you can see"), desc: t("Las respuestas se generan con el contexto al que el usuario ya tiene permiso. Sin atajos por encima de los permisos.", "Responses are generated only with context the user already has permission to access. No shortcuts past role permissions.") },
    { icon: UserCheck, title: t("Supervisión humana en lo sensible", "Human review for sensitive output"), desc: t("Las respuestas que afectan a salud, menores o decisiones económicas se presentan como propuesta para revisión humana.", "Output affecting health, minors or financial decisions is surfaced as a proposal for human review.") },
    { icon: AlertTriangle, title: t("La IA no diagnostica ni sustituye a profesionales", "AI does not diagnose or replace professionals"), desc: t("No emite diagnósticos médicos, no autoriza altas deportivas y no sustituye el juicio clínico ni técnico.", "It does not issue medical diagnoses, does not authorise return-to-play and does not replace clinical or technical judgement.") },
    { icon: Sliders, title: t("Configurable por módulo", "Configurable per module"), desc: t("La IA puede limitarse, restringirse a determinados roles o desactivarse módulo a módulo desde la configuración del club.", "AI can be limited, restricted to specific roles or disabled module by module from the club's settings.") },
  ];

  const compliance = [
    { title: t("RGPD y LOPDGDD", "GDPR and LOPDGDD"), desc: t("Diseñado para alinearse con el Reglamento (UE) 2016/679 y la legislación española de protección de datos.", "Designed to align with Regulation (EU) 2016/679 and Spanish data-protection law.") },
    { title: t("Datos de salud como categoría especial", "Health data as a special category"), desc: t("Los datos médicos se tratan como categoría especial del art. 9 RGPD, con accesos restringidos y bases legales específicas.", "Medical data is treated as a special category under GDPR Art. 9, with restricted access and specific legal bases.") },
    { title: t("Menores y tutores", "Minors and guardians"), desc: t("Identificación de menores, gestión de tutores legales y consentimientos cuando la base legal lo requiere.", "Minor identification, legal-guardian management and consent capture when required by the applicable legal basis.") },
    { title: t("Evaluación de impacto (EIPD)", "Data Protection Impact Assessment (DPIA)"), desc: t("Plantillas y soporte para la EIPD de los módulos sensibles (salud, menores, comunicación masiva).", "Templates and support for DPIAs on sensitive modules (health, minors, mass communication).") },
    { title: t("Contratos de encargado del tratamiento", "Data Processing Agreements"), desc: t("Firmamos un contrato de encargado del tratamiento con cada cliente para los datos que tratamos por su cuenta.", "We sign a Data Processing Agreement with every customer for the data we process on their behalf.") },
    { title: t("Gestión de subencargados", "Sub-processor management"), desc: t("Lista pública de subencargados (hosting, email, IA) y procedimiento de notificación ante cambios.", "Public list of sub-processors (hosting, email, AI) and a notification procedure when they change.") },
    { title: t("Brechas y derechos RGPD", "Breaches and GDPR rights"), desc: t("Procedimiento documentado de respuesta a brechas y atención de derechos de acceso, rectificación, supresión, portabilidad y oposición.", "Documented breach-response procedure and handling of access, rectification, erasure, portability and objection rights.") },
    { title: t("ENS como objetivo institucional", "ENS as an institutional target"), desc: t("Controles preparados para alinearse con el Esquema Nacional de Seguridad como objetivo para despliegues con clientes públicos o institucionales.", "Controls prepared to align with Spain's National Security Framework (ENS) as a target for public or institutional deployments.") },
  ];

  const roadmap = [
    {
      phase: t("Base RGPD", "GDPR baseline"),
      items: [
        t("Cifrado, control de acceso por rol y registro de accesos sensibles.", "Encryption, role-based access control and sensitive-access logging."),
        t("Contrato de encargado del tratamiento y subencargados publicados.", "Data Processing Agreement and published sub-processors."),
      ],
    },
    {
      phase: t("Módulos sensibles", "Sensitive modules"),
      items: [
        t("Plantillas de EIPD para salud, menores y comunicación.", "DPIA templates for health, minors and communications."),
        t("Restricción granular del módulo médico y trazabilidad reforzada.", "Granular restriction of the medical module and enhanced traceability."),
      ],
    },
    {
      phase: t("Enterprise", "Enterprise"),
      items: [
        t("SSO, política de retención por club y exportaciones auditables.", "SSO, per-club retention policy and auditable exports."),
        t("Hoja de ruta de certificación alineada con ISO 27001.", "Certification roadmap aligned with ISO 27001."),
      ],
    },
    {
      phase: t("Despliegues avanzados", "Advanced deployments"),
      items: [
        t("Controles preparados para alinearse con ENS para clientes institucionales.", "Controls prepared to align with ENS for institutional customers."),
        t("Opciones de residencia de datos y despliegues dedicados.", "Data residency options and dedicated deployments."),
      ],
    },
  ];

  const faqs = [
    {
      q: t("¿SAITO usa datos del club para entrenar modelos?", "Does SAITO use club data to train models?"),
      a: t("No. Los datos del club no se utilizan para entrenar modelos generales ni se comparten con otros clientes.", "No. Club data is not used to train general models and is not shared with other customers."),
    },
    {
      q: t("¿Puede un entrenador ver datos médicos completos?", "Can a coach see full medical records?"),
      a: t("No por defecto. El módulo de salud está restringido al rol médico y a quienes el club autorice expresamente. El resto de roles solo ve disponibilidad o restricciones deportivas, no historial clínico.", "Not by default. The health module is restricted to the medical role and to those the club explicitly authorises. Other roles only see availability or sport restrictions, not clinical history."),
    },
    {
      q: t("¿SAITO diagnostica lesiones?", "Does SAITO diagnose injuries?"),
      a: t("No. SAITO no diagnostica, no autoriza altas médicas y no sustituye al criterio del personal sanitario. La IA puede ayudar a registrar y resumir información, siempre bajo supervisión humana.", "No. SAITO does not diagnose, does not authorise return-to-play and does not replace medical judgement. AI can help record and summarise information, always under human review."),
    },
    {
      q: t("¿Qué pasa con los menores?", "What about minors?"),
      a: t("Los menores se marcan explícitamente y se vinculan a tutores legales. Las comunicaciones y consentimientos siguen reglas específicas por edad y base legal aplicable.", "Minors are explicitly flagged and linked to legal guardians. Communications and consents follow specific rules based on age and the applicable legal basis."),
    },
    {
      q: t("¿Tenéis ISO 27001 o ENS?", "Are you ISO 27001 or ENS certified?"),
      a: t("No declaramos certificaciones que no tenemos obtenidas. Nuestros controles están diseñados para alinearse con ISO 27001 y ENS, y publicamos una hoja de ruta de certificación para clientes que lo requieran.", "We do not claim certifications we have not obtained. Our controls are designed to align with ISO 27001 and ENS, and we publish a certification roadmap for customers who need it."),
    },
  ];

  const STATUS_META = {
    active: {
      labelEs: "Activo",
      labelEn: "Active",
      icon: CheckCircle2,
      cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    },
    pilot: {
      labelEs: "En piloto",
      labelEn: "In pilot",
      icon: Activity,
      cls: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    },
    planned: {
      labelEs: "Planificado",
      labelEn: "Planned",
      icon: Circle,
      cls: "bg-muted text-muted-foreground",
    },
  } as const;

  const implementationStatus: { title: string; status: keyof typeof STATUS_META; note?: string }[] = [
    { title: t("Aislamiento de datos por organización (RLS)", "Per-organisation data isolation (RLS)"), status: "active", note: t("Políticas a nivel de base de datos por organization_id.", "Database-level policies scoped by organization_id.") },
    { title: t("Cifrado en tránsito (TLS)", "Encryption in transit (TLS)"), status: "active" },
    { title: t("Cifrado en reposo (base de datos y almacenamiento)", "Encryption at rest (database and storage)"), status: "active", note: t("Provisto por la infraestructura gestionada de Supabase.", "Provided by Supabase managed infrastructure.") },
    { title: t("Permisos por rol en la aplicación", "Application-level role permissions"), status: "pilot", note: t("Roles definidos y aplicados en backend; UI por rol en validación durante el piloto.", "Roles defined and enforced in the backend; per-role UI under validation during the pilot.") },
    { title: t("Autenticación con sesión persistente y MFA opcional", "Authenticated sessions with optional MFA"), status: "pilot", note: t("La autenticación productiva entra al inicio del piloto del primer club.", "Production authentication enters at the start of the first club pilot.") },
    { title: t("Registro de accesos a datos sensibles", "Sensitive-data access logging"), status: "pilot", note: t("Activo en el módulo médico y de pagos durante el piloto.", "Active for the medical and payments modules during the pilot.") },
    { title: t("Restricción del módulo médico", "Medical module restriction"), status: "pilot" },
    { title: t("Marcado de menores y vinculación a tutores", "Minor flagging and guardian linkage"), status: "pilot" },
    { title: t("IA con scoping por rol", "Role-scoped AI"), status: "active", note: t("La IA solo recibe el contexto autorizado para el rol en cada consulta.", "AI only receives the context authorised for the role on each query.") },
    { title: t("Contrato de encargado del tratamiento (DPA)", "Data Processing Agreement (DPA)"), status: "pilot", note: t("Plantilla disponible; firma se incluye en el onboarding del piloto.", "Template available; signature is included in the pilot onboarding.") },
    { title: t("Lista pública de subencargados", "Public sub-processor list"), status: "planned" },
    { title: t("Procedimiento documentado de respuesta a brechas", "Documented breach-response procedure"), status: "pilot" },
    { title: t("Atención de derechos RGPD (acceso, supresión, portabilidad)", "GDPR rights handling (access, erasure, portability)"), status: "pilot" },
    { title: t("SSO empresarial", "Enterprise SSO"), status: "planned" },
    { title: t("Política de retención configurable por club", "Per-club configurable retention policy"), status: "planned" },
    { title: t("Alineación ISO 27001 / ENS", "ISO 27001 / ENS alignment"), status: "planned", note: t("Hoja de ruta publicada; sin certificación obtenida a la fecha.", "Roadmap published; no certification obtained to date.") },
  ];

  return (
    <main>
      {/* Hero */}
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
                {t("Seguridad y privacidad", "Security & privacy")}
              </span>
              <div className="mt-4 inline-flex items-start gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-left text-xs leading-relaxed text-amber-900 dark:text-amber-200">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>
                  {t(
                    "Esta página describe el modelo de seguridad y privacidad sobre el que SAITO está siendo construido y validado en piloto. Los controles marcados como “Activo” están operativos hoy; los marcados como “En piloto” o “Planificado” se completan antes del despliegue general.",
                    "This page describes the security and privacy model SAITO is being built and validated against during piloting. Controls marked “Active” are operational today; those marked “In pilot” or “Planned” are completed before general availability.",
                  )}
                </span>
              </div>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {t(
                  "Privacidad y seguridad diseñadas para clubes deportivos",
                  "Privacy and security built for sports clubs",
                )}
              </h1>
              <p className="mt-5 text-lg text-muted-foreground">
                {t(
                  "SAITO protege datos de jugadores, familias, entrenadores y equipos con control de acceso, trazabilidad e IA privada por diseño.",
                  "SAITO protects data on players, families, coaches and teams with access control, traceability and privacy-by-design AI.",
                )}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="rounded-full px-6">
                  <Link to={localizedPath("/contacto", locale) as any}>
                    {t("Solicitar demo", "Book a demo")}
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-6">
                  <Link to={localizedPath("/producto", locale) as any}>
                    {t("Ver producto", "See product")}
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
                alt={t("Seguridad y trazabilidad en SAITO", "Security and traceability in SAITO")}
                width={1800}
                height={1125}
                className="h-full w-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 1. Por qué importa */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("Por qué importa", "Why it matters")}
            title={t("Un club gestiona mucho más que partidos", "A club manages much more than matches")}
          />
          <div className="mt-8 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              {t(
                "Un club deportivo gestiona menores, pagos recurrentes, comunicaciones a familias, lesiones, citas médicas, restricciones deportivas y datos de contacto sensibles. Todo eso convive en la misma plataforma y exige decisiones explícitas sobre quién puede ver qué.",
                "A sports club manages minors, recurring payments, family communications, injuries, medical appointments, sport restrictions and sensitive contact data. All of that lives in the same platform and demands explicit decisions about who can see what.",
              )}
            </p>
            <p>
              {t(
                "SAITO se diseña asumiendo este contexto: protección por defecto, separación clara entre roles y trazabilidad de las acciones que importan.",
                "SAITO is designed assuming this context: protection by default, clear separation between roles and traceability for the actions that matter.",
              )}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Principios */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("Principios de seguridad", "Security principles")}
            title={t("Controles preparados desde el primer día", "Controls ready from day one")}
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((p) => (
              <div key={p.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <p.icon className="size-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. IA privada por diseño */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("IA privada por diseño", "Privacy-by-design AI")}
            title={t("Una IA con permisos, límites y supervisión", "AI with permissions, limits and oversight")}
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {ai.map((p) => (
              <div key={p.title} className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <p.icon className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Cumplimiento */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("Cumplimiento y normativa", "Compliance & regulation")}
            title={t("Diseñado para alinearse con el marco europeo y español", "Designed to align with the EU and Spanish framework")}
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {compliance.map((c) => (
              <div key={c.title} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="size-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">{c.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            <Scale className="mr-1.5 inline size-3.5 align-text-bottom" />
            {t(
              "No declaramos certificaciones que no tenemos obtenidas. Las menciones a ISO 27001 o ENS se refieren a controles preparados para alinearse con esos marcos y a una hoja de ruta de certificación.",
              "We do not claim certifications we have not obtained. References to ISO 27001 or ENS refer to controls prepared to align with those frameworks and to a certification roadmap.",
            )}
          </p>
        </div>
      </section>

      {/* 5. Roadmap */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("Hoja de ruta de confianza", "Trust roadmap")}
            title={t("Cómo crece nuestra postura de seguridad", "How our security posture grows")}
          />
          <ol className="mt-10 space-y-6">
            {roadmap.map((r, i) => (
              <li key={r.phase} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  {i < roadmap.length - 1 && <span className="mt-2 w-px flex-1 bg-border" />}
                </div>
                <div className="pb-2">
                  <h3 className="text-base font-semibold text-foreground">{r.phase}</h3>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {r.items.map((it) => (
                      <li key={it} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-saito-green" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("Preguntas frecuentes", "FAQ")}
            title={t("Lo que más nos preguntan sobre seguridad", "Top security questions")}
          />
          <div className="mt-10 space-y-4">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-border bg-card p-5 transition-colors open:bg-card"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base font-semibold text-foreground">
                  <span>{f.q}</span>
                  <KeyRound className="mt-1 size-4 shrink-0 text-primary transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Estado de implementación */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("Transparencia", "Transparency")}
            title={t("Estado real de implementación", "Real implementation status")}
            subtitle={t(
              "Publicamos en abierto qué controles están activos hoy y cuáles entran durante la fase de piloto. La validación se hace con el club, no a su espalda.",
              "We publish openly which controls are active today and which enter during the pilot phase. Validation happens with the club, not behind their back.",
            )}
          />
          <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 text-left">{t("Control", "Control")}</th>
                  <th className="px-5 py-3 text-left">{t("Estado", "Status")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {implementationStatus.map((row) => {
                  const meta = STATUS_META[row.status];
                  const Icon = meta.icon;
                  return (
                    <tr key={row.title}>
                      <td className="px-5 py-4 text-foreground">
                        <p className="font-medium">{row.title}</p>
                        {row.note && (
                          <p className="mt-1 text-xs text-muted-foreground">{row.note}</p>
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
            {t(
              "Esta tabla se actualiza con cada hito de producto. Si necesitas un control concreto antes del despliegue general, podemos priorizarlo dentro del piloto.",
              "This table is updated at every product milestone. If you need a specific control before general availability, we can prioritise it within the pilot.",
            )}
          </p>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("¿Quieres ver cómo lo aplicamos en tu club?", "Want to see how we apply this to your club?")}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {t(
              "Te enseñamos los controles y la configuración con tus datos en una demo personalizada.",
              "We'll walk you through the controls and configuration with your own data in a tailored demo.",
            )}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-full px-6">
              <Link to={localizedPath("/contacto", locale) as any}>
                {t("Solicitar demo", "Book a demo")}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-6">
              <Link to={localizedPath("/producto", locale) as any}>
                {t("Ver producto", "See product")}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
