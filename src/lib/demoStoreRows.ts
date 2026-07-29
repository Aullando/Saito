// Hooks que traducen el store Zustand (camelCase) a las filas snake_case
// que consumen las pantallas — para que crear/borrar/actualizar en demo se
// vea reflejado al instante en las tablas.

import { useData } from "./store";
import type {
  AthleteRow,
  SectionRow,
  CategoryRow,
  GroupRow,
  AthleteGroupRow,
} from "@/features/athletes/data";

export function useDemoAthletesRows(): {
  athletes: AthleteRow[];
  sections: SectionRow[];
  categories: CategoryRow[];
  groups: GroupRow[];
  athleteGroups: AthleteGroupRow[];
} {
  const athletes = useData((s) => s.athletes);
  const sections = useData((s) => s.sections);
  const categories = useData((s) => s.categories);
  const groups = useData((s) => s.groups);
  return {
    athletes: athletes.map((a) => ({
      id: a.id,
      first_name: a.firstName,
      last_name: a.lastName,
      section_id: a.sectionId,
      category_id: a.categoryId,
      status: a.status,
      medical_status: a.medicalStatus,
      performance_status: a.performanceStatus,
    })),
    sections: sections.map((s) => ({ id: s.id, name: s.name })),
    categories: categories.map((c) => ({ id: c.id, name: c.name, section_id: c.sectionId })),
    groups: groups.map((g) => ({
      id: g.id,
      name: g.name,
      section_id: g.sectionId,
      category_id: g.categoryId,
    })),
    athleteGroups: athletes.flatMap((a) => a.groupIds.map((gid) => ({ athlete_id: a.id, group_id: gid }))),
  };
}

export interface DemoPaymentRow {
  id: string;
  athlete_id: string | null;
  subscription: string | null;
  section_id: string | null;
  category_id: string | null;
  amount: number;
  status: "Paid" | "Active" | "Failed" | "Pending";
  payment_date: string | null;
}

export function useDemoPaymentRows(): DemoPaymentRow[] {
  const payments = useData((s) => s.payments);
  return payments.map((p) => ({
    id: p.id,
    athlete_id: p.athleteId,
    subscription: p.subscription,
    section_id: p.sectionId,
    category_id: p.categoryId,
    amount: p.amount,
    status: p.status,
    payment_date: p.date,
  }));
}

export interface DemoFeeRow {
  id: string;
  name: string;
  amount: number;
  frequency: string;
  period_start: string | null;
  period_end: string | null;
  payment_date: string | null;
  applies_to_group_ids: string[] | null;
  section_id: string | null;
  kind: "fee" | "rate";
}

export function useDemoFeeRows(): DemoFeeRow[] {
  const fees = useData((s) => s.fees);
  return fees.map((f) => ({
    id: f.id,
    name: f.name,
    amount: f.amount,
    frequency: f.frequency,
    period_start: f.periodStart ?? null,
    period_end: f.periodEnd ?? null,
    payment_date: f.paymentDate ?? null,
    applies_to_group_ids: f.appliesToGroupIds ?? null,
    section_id: f.sectionId,
    kind: f.kind,
  }));
}

export interface DemoAppointmentRow {
  id: string;
  athlete_id: string;
  staff_id: string | null;
  appointment_date: string;
  appointment_time: string | null;
  reason: string | null;
  status: string;
  notes: string | null;
}

export function useDemoAppointmentRows(): DemoAppointmentRow[] {
  const appts = useData((s) => s.appointments);
  return appts.map((a) => ({
    id: a.id,
    athlete_id: a.athleteId,
    staff_id: a.staffId,
    appointment_date: a.date,
    appointment_time: a.time,
    reason: a.reason,
    status: a.status,
    notes: a.notes,
  }));
}

export interface DemoOrgRow {
  id: string;
  name: string;
  slug: string;
  language: string;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export function useDemoOrgRows(): DemoOrgRow[] {
  const orgs = useData((s) => s.organizations);
  return orgs.map((o) => ({
    id: o.id,
    name: o.name,
    slug: o.slug ?? o.id,
    language: o.language ?? "es",
    logo_url: o.logoUrl ?? null,
    created_at: o.createdAt,
    updated_at: o.updatedAt,
  }));
}
