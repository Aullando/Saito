import type { Lang } from "./types";
import { useCurrentUser } from "./store";

type Dict = Record<string, { en: string; es: string }>;

export const STR: Dict = {
  // sidebar
  organizations: { en: "Organizations", es: "Organizaciones" },
  profile_settings: { en: "Profile & Settings", es: "Perfil y configuración" },
  club_organization: { en: "Club & Organization", es: "Club y Organización" },
  calendar: { en: "Calendar", es: "Calendario" },
  athletes: { en: "Athletes", es: "Deportistas" },
  economic_management: { en: "Economic Management", es: "Gestión económica" },
  fees_rates: { en: "Fees and Rates", es: "Cuotas y tasas" },
  payment_status: { en: "Payment Status", es: "Estado de pagos" },
  communication: { en: "Communication", es: "Comunicación" },
  logout: { en: "Log out", es: "Cerrar sesión" },

  // common
  search: { en: "Search", es: "Buscar" },
  status: { en: "Status", es: "Estado" },
  section: { en: "Section", es: "Sección" },
  category: { en: "Category", es: "Categoría" },
  groups: { en: "Groups", es: "Grupos" },
  group: { en: "Group", es: "Grupo" },
  name: { en: "Name", es: "Nombre" },
  amount: { en: "Amount", es: "Importe" },
  date: { en: "Date", es: "Fecha" },
  actions: { en: "Actions", es: "Acciones" },
  view_profile: { en: "View profile", es: "Ver ficha" },
  add: { en: "Add", es: "Añadir" },
  cancel: { en: "Cancel", es: "Cancelar" },
  save: { en: "Save", es: "Guardar" },
  today: { en: "Today", es: "Hoy" },
  clear_filters: { en: "Clear filters", es: "Limpiar filtros" },
  all_sections: { en: "All sections", es: "Todas las secciones" },
  all_categories: { en: "All categories", es: "Todas las categorías" },
  all_groups: { en: "All groups", es: "Todos los grupos" },
  all_statuses: { en: "All statuses", es: "Todos los estados" },
  all_quotas: { en: "All quotas", es: "Todas las cuotas" },

  // login
  log_in: { en: "Log In", es: "Iniciar sesión" },
  email: { en: "Email", es: "Email" },
  password: { en: "Password", es: "Contraseña" },
  forgot_password: { en: "Forgot your password?", es: "¿Olvidaste tu contraseña?" },
  continue: { en: "Continue", es: "Continuar" },
  demo_users: { en: "Demo users", es: "Usuarios demo" },
  funded_eu: {
    en: "Project co-funded by the European Union. Demo content for evaluation purposes.",
    es: "Proyecto cofinanciado por la Unión Europea. Contenido demo para evaluación.",
  },

  // misc
  athletes_management: { en: "Athletes Management", es: "Gestión de Deportistas" },
  new_athlete: { en: "New Athlete", es: "Nuevo Deportista" },
  new_organization: { en: "New organization", es: "Nueva organización" },
  new_user: { en: "New User", es: "Nueva alta" },
  new_section: { en: "New Section", es: "Nueva sección" },
  new_circular: { en: "New circular", es: "Nueva circular" },
  add_fee: { en: "Add fee", es: "Añadir cuota" },
  users_permissions: { en: "Users and Permissions", es: "Usuarios y permisos" },
  facilities: { en: "Facilities", es: "Instalaciones" },
  organization_chart: { en: "Organization Chart", es: "Organigrama" },
  sports_sections: { en: "Sports Sections", es: "Secciones deportivas" },
  managers: { en: "Managers", es: "Gerentes" },
  medical_staff: { en: "Medical Staff", es: "Staff médico" },
  technical_staff: { en: "Technical Staff", es: "Staff técnico" },
  view_all: { en: "View All", es: "Ver todos" },
  fees: { en: "Fees", es: "Cuotas" },
  other_rates: { en: "Other rates", es: "Otras tasas" },
  fee_name: { en: "Fee name", es: "Nombre de cuota" },
  rate_name: { en: "Rate name", es: "Nombre de tasa" },
  frequency: { en: "Frequency", es: "Frecuencia" },
  period: { en: "Period", es: "Periodo" },
  applies_to: { en: "Applies to", es: "Aplica a" },
  payment_date: { en: "Payment date", es: "Fecha de pago" },
  athlete: { en: "Athlete", es: "Deportista" },
  subscription: { en: "Subscription", es: "Cuota" },
  view_invoice: { en: "View invoice", es: "Ver factura" },
  mark_paid: { en: "Mark as paid", es: "Marcar como pagado" },
  export_csv: { en: "Export CSV", es: "Exportar CSV" },
  inbox: { en: "Inbox", es: "Bandeja de entrada" },
  send: { en: "Send", es: "Enviar" },
  type_message: { en: "Type a message…", es: "Escribe un mensaje…" },
  medical_calendar: { en: "Medical Calendar", es: "Calendario médico" },
  add_appointment: { en: "Add appointment", es: "Añadir cita" },
  select_athlete: { en: "Select athlete", es: "Seleccionar atleta" },
  add_medical_note: { en: "Add medical note", es: "Añadir nota médica" },
  medical_status: { en: "Medical status", es: "Estado médico" },
  performance: { en: "Performance", es: "Rendimiento" },
  notifications: { en: "Notifications", es: "Notificaciones" },
  language: { en: "Language", es: "Idioma" },
  change_password: { en: "Change Password", es: "Cambiar contraseña" },
  settings: { en: "Settings", es: "Ajustes" },
  no_athletes: { en: "No athletes match the filters.", es: "No hay deportistas que cumplan los filtros." },
  no_payments: { en: "No payments match the selected filters.", es: "No hay pagos que cumplan los filtros." },
  more: { en: "more", es: "más" },
};

export const useT = () => {
  const u = useCurrentUser();
  const lang: Lang = u?.language ?? "en";
  return (key: keyof typeof STR) => STR[key]?.[lang] ?? String(key);
};

export const t = (key: keyof typeof STR, lang: Lang) => STR[key]?.[lang] ?? String(key);
