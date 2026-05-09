// Demo fallbacks for the private app.
// When Supabase queries are disabled (no auth/org_id) or return undefined,
// the screens use these mocks so the demo stays navigable without a backend.
// All shapes match the snake_case Supabase row shapes consumed by the app.

import {
  ATHLETES as SEED_ATHLETES,
  SECTIONS as SEED_SECTIONS,
  CATEGORIES as SEED_CATEGORIES,
  GROUPS as SEED_GROUPS,
  EVENTS as SEED_EVENTS,
  PAYMENTS as SEED_PAYMENTS,
  MEDICAL_APPOINTMENTS as SEED_APPTS,
  CONVERSATIONS as SEED_CONVERSATIONS,
  FACILITIES as SEED_FACILITIES,
  DEMO_USERS,
} from "./seed";

const DEMO_ORG_ID = "demo-org";
const today = () => new Date().toISOString().slice(0, 10);

/* ---------- Catalogue ---------- */
export const DEMO_SECTIONS_ROWS = SEED_SECTIONS.map((s) => ({ id: s.id, name: s.name }));

export const DEMO_CATEGORIES_ROWS = SEED_CATEGORIES.map((c) => ({
  id: c.id,
  name: c.name,
  section_id: c.sectionId,
}));

export const DEMO_GROUPS_ROWS = SEED_GROUPS.map((g) => ({
  id: g.id,
  name: g.name,
  section_id: g.sectionId,
  category_id: g.categoryId,
}));

/* ---------- Athletes ---------- */
export const DEMO_ATHLETES_ROWS = SEED_ATHLETES.map((a) => ({
  id: a.id,
  first_name: a.firstName,
  last_name: a.lastName,
  section_id: a.sectionId,
  category_id: a.categoryId,
  status: a.status,
  medical_status: a.medicalStatus,
  performance_status: a.performanceStatus,
}));

export const DEMO_ATHLETE_GROUPS_ROWS = SEED_ATHLETES.flatMap((a) =>
  a.groupIds.map((gid) => ({ athlete_id: a.id, group_id: gid })),
);

export const DEMO_ATHLETES_MIN_ROWS = SEED_ATHLETES.map((a) => ({
  id: a.id,
  first_name: a.firstName,
  last_name: a.lastName,
}));

/* ---------- Calendar ---------- */
export const DEMO_CALENDAR_EVENTS_ROWS = SEED_EVENTS.map((e) => ({
  id: e.id,
  title: e.title,
  event_date: e.date,
  start_time: e.startTime,
  end_time: null as string | null,
  type: e.type,
  section_id: e.sectionId ?? null,
  category_id: e.categoryId ?? null,
  group_id: e.groupId ?? null,
  recurrence: null as null,
}));

/* ---------- Payments ---------- */
export const DEMO_PAYMENTS_ROWS = SEED_PAYMENTS.map((p) => ({
  id: p.id,
  athlete_id: p.athleteId,
  subscription: p.subscription,
  section_id: p.sectionId,
  category_id: p.categoryId,
  amount: p.amount,
  status: p.status,
  payment_date: p.date,
}));

/* ---------- Medical ---------- */
export const DEMO_MEDICAL_APPOINTMENTS_ROWS = (() => {
  // Spread several appointments around the current month so the calendar is alive.
  const out: {
    id: string;
    athlete_id: string;
    staff_id: string | null;
    appointment_date: string;
    appointment_time: string | null;
    reason: string | null;
    status: string;
    notes: string | null;
  }[] = [];
  const now = new Date();
  const days = [3, 6, 9, 12, 15, 18, 21, 24, 27];
  const reasons = [
    "Revisión rutinaria",
    "Seguimiento lesión",
    "Test de esfuerzo",
    "Evaluación tobillo",
    "Reconocimiento médico",
    "Control fisioterapia",
  ];
  const times = ["09:00", "10:30", "12:00", "16:00", "17:30"];
  let id = 1;
  days.forEach((day, i) => {
    const a = SEED_ATHLETES[(i * 3) % SEED_ATHLETES.length];
    const date = new Date(now.getFullYear(), now.getMonth(), day).toISOString().slice(0, 10);
    out.push({
      id: `demo-apt-${id++}`,
      athlete_id: a.id,
      staff_id: "u-med",
      appointment_date: date,
      appointment_time: times[i % times.length],
      reason: reasons[i % reasons.length],
      status: i === 0 ? "Completed" : "Scheduled",
      notes: null,
    });
  });
  // Add seed appointments too
  SEED_APPTS.forEach((a) => {
    out.push({
      id: a.id,
      athlete_id: a.athleteId,
      staff_id: a.staffId,
      appointment_date: a.date,
      appointment_time: a.time,
      reason: a.reason,
      status: a.status,
      notes: a.notes,
    });
  });
  return out;
})();

/* ---------- Facilities ---------- */
export const DEMO_FACILITIES_ROWS = SEED_FACILITIES.map((f) => ({
  id: f.id,
  name: f.name,
  address: f.address ?? null,
  location: f.location,
  capacity: f.capacity ?? null,
  sports: f.sports ?? [],
  photo_url: f.photoUrl ?? null,
  status: f.status,
}));

/* ---------- Communication ---------- */
export const DEMO_PROFILES_MIN_ROWS = DEMO_USERS.map((u) => ({
  id: u.id,
  full_name: u.name,
  email: u.email,
}));

export const DEMO_ORG_USERS_ROWS = DEMO_USERS.map((u) => ({
  id: u.id,
  full_name: u.name,
  email: u.email,
  roles: [u.role],
}));

export const DEMO_CONVERSATIONS_ROWS = SEED_CONVERSATIONS.map((c) => ({
  id: c.id,
  title: c.title,
  type: c.type,
  created_at: c.messages[0]?.createdAt ?? new Date().toISOString(),
}));

export function demoMessagesFor(conversationId: string) {
  const c = SEED_CONVERSATIONS.find((x) => x.id === conversationId);
  if (!c) return [];
  return c.messages.map((m) => ({
    id: m.id,
    author_id: m.authorId,
    conversation_id: c.id,
    content: m.content,
    created_at: m.createdAt,
  }));
}

/* ---------- Dashboard pre-aggregated ---------- */

const monthStart = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
};

export const DEMO_DASHBOARD_STATS = (() => {
  const t = today();
  const ms = monthStart();
  const eventsToday = DEMO_CALENDAR_EVENTS_ROWS.filter((e) => e.event_date === t)
    .slice(0, 6)
    .map((e) => ({
      id: e.id,
      title: e.title,
      start_time: e.start_time,
      end_time: e.end_time,
      type: e.type,
    }));
  const monthRevenue = DEMO_PAYMENTS_ROWS
    .filter((p) => p.status === "Paid" && (p.payment_date ?? "") >= ms)
    .reduce((s, p) => s + Number(p.amount ?? 0), 0);
  const pending = DEMO_PAYMENTS_ROWS.filter((p) => p.status === "Pending");
  const pendingAmount = pending.reduce((s, p) => s + Number(p.amount ?? 0), 0);
  const upcomingAppts = DEMO_MEDICAL_APPOINTMENTS_ROWS
    .filter((a) => a.appointment_date >= t)
    .slice(0, 5)
    .map((a) => ({
      id: a.id,
      appointment_date: a.appointment_date,
      appointment_time: a.appointment_time,
      reason: a.reason,
      athlete_id: a.athlete_id,
    }));
  const injured = DEMO_ATHLETES_ROWS.filter((a) => a.medical_status === "Injured").length;
  const activeAth = DEMO_ATHLETES_ROWS.filter((a) => a.status === "Active").length;
  return {
    athletesTotal: DEMO_ATHLETES_ROWS.length,
    athletesActive: activeAth,
    injured,
    sectionsCount: DEMO_SECTIONS_ROWS.length,
    eventsToday,
    pendingCount: pending.length,
    pendingAmount,
    monthRevenue: monthRevenue || 4820,
    upcomingAppts,
    conversationsCount: DEMO_CONVERSATIONS_ROWS.length,
  };
})();

export const DEMO_DASHBOARD_CHARTS = (() => {
  const now = new Date();
  const monthLabels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const revenueSeries = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const base = 3200 + (i * 480) + ((i * 137) % 600);
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: monthLabels[d.getMonth()],
      revenue: base,
      pending: 320 + ((i * 91) % 400),
    };
  });
  const eventsSeries = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (29 - i));
    const dow = d.getDay();
    const count = dow === 0 || dow === 6 ? 2 + (i % 2) : 6 + ((i * 3) % 6);
    return { date: d.toISOString().slice(5, 10), count };
  });
  const typeData = [
    { name: "training", value: 92 },
    { name: "match", value: 14 },
    { name: "medical", value: 9 },
    { name: "meeting", value: 6 },
  ];
  const medCount: Record<string, number> = {};
  DEMO_ATHLETES_ROWS.forEach((a) => {
    medCount[a.medical_status] = (medCount[a.medical_status] ?? 0) + 1;
  });
  const medData = Object.entries(medCount).map(([name, value]) => ({ name, value }));
  return { revenueSeries, eventsSeries, typeData, medData };
})();

/** Returns `data` if present, otherwise the demo fallback when there's no real org context. */
export function withDemo<T>(data: T | undefined, hasOrg: boolean, fallback: T): T {
  if (data !== undefined) return data;
  return hasOrg ? data ?? fallback : fallback;
}

export const DEMO_ORG_ID_VALUE = DEMO_ORG_ID;
