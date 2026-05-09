import {
  Building2,
  Users,
  Lock,
  Activity,
  Baby,
  HeartPulse,
  Brain,
  Eye,
  UserCheck,
  AlertTriangle,
  Sliders,
  CheckCircle2,
  Circle,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/lib/site-i18n";

export type Bilingual = { es: string; en: string };

export const t = (locale: Locale, b: Bilingual) => (locale === "en" ? b.en : b.es);

export type ImplementationStatus = "active" | "pilot" | "planned";

export const STATUS_META: Record<
  ImplementationStatus,
  { labelEs: string; labelEn: string; icon: LucideIcon; cls: string }
> = {
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
};

export const principles: { icon: LucideIcon; title: Bilingual; desc: Bilingual }[] = [
  { icon: Building2, title: { es: "Datos aislados por club", en: "Per-club data isolation" }, desc: { es: "Cada club opera en su propio espacio lógico. Las consultas se aíslan a nivel de organización para que los datos nunca se mezclen entre entidades.", en: "Each club operates in its own logical space. Queries are scoped per organisation so data never crosses entities." } },
  { icon: Users, title: { es: "Permisos por rol", en: "Role-based permissions" }, desc: { es: "Admin, manager, técnico, médico y familias. Cada rol ve solo lo que necesita para hacer su trabajo.", en: "Admin, manager, technical, medical and family. Each role only sees what they need to do their job." } },
  { icon: Lock, title: { es: "Cifrado en tránsito y en reposo", en: "Encryption in transit and at rest" }, desc: { es: "TLS para todo el tráfico y cifrado en reposo en la base de datos y el almacenamiento de archivos.", en: "TLS for all traffic and at-rest encryption for the database and file storage." } },
  { icon: Activity, title: { es: "Registro de accesos sensibles", en: "Sensitive-access logging" }, desc: { es: "Las acciones sobre datos médicos, menores y pagos quedan registradas para auditoría interna del club.", en: "Actions on medical data, minors and payments are logged for the club's internal audit trail." } },
  { icon: Baby, title: { es: "Control específico para menores", en: "Specific controls for minors" }, desc: { es: "Marcado de menores, gestión de tutores y restricciones por edad para comunicaciones y consentimientos.", en: "Minor flagging, guardian management and age-based restrictions for communications and consents." } },
  { icon: HeartPulse, title: { es: "Módulo de salud con acceso restringido", en: "Health module with restricted access" }, desc: { es: "El historial médico, las lesiones y las citas solo son visibles para el rol médico y para quien el club autorice expresamente.", en: "Medical history, injuries and appointments are only visible to the medical role and to those the club expressly authorises." } },
];

export const ai: { icon: LucideIcon; title: Bilingual; desc: Bilingual }[] = [
  { icon: Brain, title: { es: "No entrenamos modelos generales con tus datos", en: "We do not train general models with your data" }, desc: { es: "Los datos del club no se usan para entrenar modelos compartidos con otros clientes ni con terceros.", en: "Club data is not used to train models shared with other customers or third parties." } },
  { icon: Eye, title: { es: "La IA solo ve lo que tú puedes ver", en: "AI only sees what you can see" }, desc: { es: "Las respuestas se generan con el contexto al que el usuario ya tiene permiso. Sin atajos por encima de los permisos.", en: "Responses are generated only with context the user already has permission to access. No shortcuts past role permissions." } },
  { icon: UserCheck, title: { es: "Supervisión humana en lo sensible", en: "Human review for sensitive output" }, desc: { es: "Las respuestas que afectan a salud, menores o decisiones económicas se presentan como propuesta para revisión humana.", en: "Output affecting health, minors or financial decisions is surfaced as a proposal for human review." } },
  { icon: AlertTriangle, title: { es: "La IA no diagnostica ni sustituye a profesionales", en: "AI does not diagnose or replace professionals" }, desc: { es: "No emite diagnósticos médicos, no autoriza altas deportivas y no sustituye el juicio clínico ni técnico.", en: "It does not issue medical diagnoses, does not authorise return-to-play and does not replace clinical or technical judgement." } },
  { icon: Sliders, title: { es: "Configurable por módulo", en: "Configurable per module" }, desc: { es: "La IA puede limitarse, restringirse a determinados roles o desactivarse módulo a módulo desde la configuración del club.", en: "AI can be limited, restricted to specific roles or disabled module by module from the club's settings." } },
];

export const compliance: { title: Bilingual; desc: Bilingual }[] = [
  { title: { es: "RGPD y LOPDGDD", en: "GDPR and LOPDGDD" }, desc: { es: "Diseñado para alinearse con el Reglamento (UE) 2016/679 y la legislación española de protección de datos.", en: "Designed to align with Regulation (EU) 2016/679 and Spanish data-protection law." } },
  { title: { es: "Datos de salud como categoría especial", en: "Health data as a special category" }, desc: { es: "Los datos médicos se tratan como categoría especial del art. 9 RGPD, con accesos restringidos y bases legales específicas.", en: "Medical data is treated as a special category under GDPR Art. 9, with restricted access and specific legal bases." } },
  { title: { es: "Menores y tutores", en: "Minors and guardians" }, desc: { es: "Identificación de menores, gestión de tutores legales y consentimientos cuando la base legal lo requiere.", en: "Minor identification, legal-guardian management and consent capture when required by the applicable legal basis." } },
  { title: { es: "Evaluación de impacto (EIPD)", en: "Data Protection Impact Assessment (DPIA)" }, desc: { es: "Plantillas y soporte para la EIPD de los módulos sensibles (salud, menores, comunicación masiva).", en: "Templates and support for DPIAs on sensitive modules (health, minors, mass communication)." } },
  { title: { es: "Contratos de encargado del tratamiento", en: "Data Processing Agreements" }, desc: { es: "Firmamos un contrato de encargado del tratamiento con cada cliente para los datos que tratamos por su cuenta.", en: "We sign a Data Processing Agreement with every customer for the data we process on their behalf." } },
  { title: { es: "Gestión de subencargados", en: "Sub-processor management" }, desc: { es: "Lista pública de subencargados (hosting, email, IA) y procedimiento de notificación ante cambios.", en: "Public list of sub-processors (hosting, email, AI) and a notification procedure when they change." } },
  { title: { es: "Brechas y derechos RGPD", en: "Breaches and GDPR rights" }, desc: { es: "Procedimiento documentado de respuesta a brechas y atención de derechos de acceso, rectificación, supresión, portabilidad y oposición.", en: "Documented breach-response procedure and handling of access, rectification, erasure, portability and objection rights." } },
  { title: { es: "ENS como objetivo institucional", en: "ENS as an institutional target" }, desc: { es: "Controles preparados para alinearse con el Esquema Nacional de Seguridad como objetivo para despliegues con clientes públicos o institucionales.", en: "Controls prepared to align with Spain's National Security Framework (ENS) as a target for public or institutional deployments." } },
];

export const roadmap: { phase: Bilingual; items: Bilingual[] }[] = [
  {
    phase: { es: "Base RGPD", en: "GDPR baseline" },
    items: [
      { es: "Cifrado, control de acceso por rol y registro de accesos sensibles.", en: "Encryption, role-based access control and sensitive-access logging." },
      { es: "Contrato de encargado del tratamiento y subencargados publicados.", en: "Data Processing Agreement and published sub-processors." },
    ],
  },
  {
    phase: { es: "Módulos sensibles", en: "Sensitive modules" },
    items: [
      { es: "Plantillas de EIPD para salud, menores y comunicación.", en: "DPIA templates for health, minors and communications." },
      { es: "Restricción granular del módulo médico y trazabilidad reforzada.", en: "Granular restriction of the medical module and enhanced traceability." },
    ],
  },
  {
    phase: { es: "Enterprise", en: "Enterprise" },
    items: [
      { es: "SSO, política de retención por club y exportaciones auditables.", en: "SSO, per-club retention policy and auditable exports." },
      { es: "Hoja de ruta de certificación alineada con ISO 27001.", en: "Certification roadmap aligned with ISO 27001." },
    ],
  },
  {
    phase: { es: "Despliegues avanzados", en: "Advanced deployments" },
    items: [
      { es: "Controles preparados para alinearse con ENS para clientes institucionales.", en: "Controls prepared to align with ENS for institutional customers." },
      { es: "Opciones de residencia de datos y despliegues dedicados.", en: "Data residency options and dedicated deployments." },
    ],
  },
];

export const faqs: { q: Bilingual; a: Bilingual }[] = [
  { q: { es: "¿SAITO usa datos del club para entrenar modelos?", en: "Does SAITO use club data to train models?" }, a: { es: "No. Los datos del club no se utilizan para entrenar modelos generales ni se comparten con otros clientes.", en: "No. Club data is not used to train general models and is not shared with other customers." } },
  { q: { es: "¿Puede un entrenador ver datos médicos completos?", en: "Can a coach see full medical records?" }, a: { es: "No por defecto. El módulo de salud está restringido al rol médico y a quienes el club autorice expresamente. El resto de roles solo ve disponibilidad o restricciones deportivas, no historial clínico.", en: "Not by default. The health module is restricted to the medical role and to those the club explicitly authorises. Other roles only see availability or sport restrictions, not clinical history." } },
  { q: { es: "¿SAITO diagnostica lesiones?", en: "Does SAITO diagnose injuries?" }, a: { es: "No. SAITO no diagnostica, no autoriza altas médicas y no sustituye al criterio del personal sanitario. La IA puede ayudar a registrar y resumir información, siempre bajo supervisión humana.", en: "No. SAITO does not diagnose, does not authorise return-to-play and does not replace medical judgement. AI can help record and summarise information, always under human review." } },
  { q: { es: "¿Qué pasa con los menores?", en: "What about minors?" }, a: { es: "Los menores se marcan explícitamente y se vinculan a tutores legales. Las comunicaciones y consentimientos siguen reglas específicas por edad y base legal aplicable.", en: "Minors are explicitly flagged and linked to legal guardians. Communications and consents follow specific rules based on age and the applicable legal basis." } },
  { q: { es: "¿Tenéis ISO 27001 o ENS?", en: "Are you ISO 27001 or ENS certified?" }, a: { es: "No declaramos certificaciones que no tenemos obtenidas. Nuestros controles están diseñados para alinearse con ISO 27001 y ENS, y publicamos una hoja de ruta de certificación para clientes que lo requieran.", en: "We do not claim certifications we have not obtained. Our controls are designed to align with ISO 27001 and ENS, and we publish a certification roadmap for customers who need it." } },
];

export const implementationStatus: { title: Bilingual; status: ImplementationStatus; note?: Bilingual }[] = [
  { title: { es: "Aislamiento de datos por organización (RLS)", en: "Per-organisation data isolation (RLS)" }, status: "active", note: { es: "Políticas a nivel de base de datos por organization_id.", en: "Database-level policies scoped by organization_id." } },
  { title: { es: "Cifrado en tránsito (TLS)", en: "Encryption in transit (TLS)" }, status: "active" },
  { title: { es: "Cifrado en reposo (base de datos y almacenamiento)", en: "Encryption at rest (database and storage)" }, status: "active", note: { es: "Provisto por la infraestructura gestionada de Supabase.", en: "Provided by Supabase managed infrastructure." } },
  { title: { es: "Permisos por rol en la aplicación", en: "Application-level role permissions" }, status: "pilot", note: { es: "Roles definidos y aplicados en backend; UI por rol en validación durante el piloto.", en: "Roles defined and enforced in the backend; per-role UI under validation during the pilot." } },
  { title: { es: "Autenticación con sesión persistente y MFA opcional", en: "Authenticated sessions with optional MFA" }, status: "pilot", note: { es: "La autenticación productiva entra al inicio del piloto del primer club.", en: "Production authentication enters at the start of the first club pilot." } },
  { title: { es: "Registro de accesos a datos sensibles", en: "Sensitive-data access logging" }, status: "pilot", note: { es: "Activo en el módulo médico y de pagos durante el piloto.", en: "Active for the medical and payments modules during the pilot." } },
  { title: { es: "Restricción del módulo médico", en: "Medical module restriction" }, status: "pilot" },
  { title: { es: "Marcado de menores y vinculación a tutores", en: "Minor flagging and guardian linkage" }, status: "pilot" },
  { title: { es: "IA con scoping por rol", en: "Role-scoped AI" }, status: "active", note: { es: "La IA solo recibe el contexto autorizado para el rol en cada consulta.", en: "AI only receives the context authorised for the role on each query." } },
  { title: { es: "Contrato de encargado del tratamiento (DPA)", en: "Data Processing Agreement (DPA)" }, status: "pilot", note: { es: "Plantilla disponible; firma se incluye en el onboarding del piloto.", en: "Template available; signature is included in the pilot onboarding." } },
  { title: { es: "Lista pública de subencargados", en: "Public sub-processor list" }, status: "planned" },
  { title: { es: "Procedimiento documentado de respuesta a brechas", en: "Documented breach-response procedure" }, status: "pilot" },
  { title: { es: "Atención de derechos RGPD (acceso, supresión, portabilidad)", en: "GDPR rights handling (access, erasure, portability)" }, status: "pilot" },
  { title: { es: "SSO empresarial", en: "Enterprise SSO" }, status: "planned" },
  { title: { es: "Política de retención configurable por club", en: "Per-club configurable retention policy" }, status: "planned" },
  { title: { es: "Alineación ISO 27001 / ENS", en: "ISO 27001 / ENS alignment" }, status: "planned", note: { es: "Hoja de ruta publicada; sin certificación obtenida a la fecha.", en: "Roadmap published; no certification obtained to date." } },
];
