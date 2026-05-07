export type Role = "sysadmin" | "admin" | "manager" | "technical" | "medical";
export type Lang = "en" | "es";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  language: Lang;
  initials: string;
  specialty?: string;
  licenseNumber?: string;
  area?: string;
}

export interface Organization {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  status: "Active" | "Inactive";
  aiEnabled: boolean;
}

export interface Facility {
  id: string;
  name: string;
  location: string;
  sportSections: string[];
  status: "Active" | "Inactive";
  photoUrl?: string;
  address?: string;
  capacity?: number;
  sports?: string[];
  nextActivity?: string;
}

export interface SportSection {
  id: string;
  name: string;
  athleteCount: number;
  staffCount?: number;
  managerCount?: number;
}

export interface Category {
  id: string;
  name: string;
  sectionId: string;
}

export interface Group {
  id: string;
  name: string;
  sectionId: string;
  categoryId: string;
}

export type AthleteStatus = "Active" | "Inactive" | "Pending";
export type MedicalStatus = "Fit" | "Injured" | "Under review" | "Unknown";

export interface Athlete {
  id: string;
  firstName: string;
  lastName: string;
  sectionId: string;
  categoryId: string;
  groupIds: string[];
  status: AthleteStatus;
  medicalStatus: MedicalStatus;
  performanceStatus: "High" | "Medium" | "Low";
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  title: string;
  sectionId?: string;
  categoryId?: string;
  groupId?: string;
  athleteId?: string;
  staffId?: string;
  roleInGroup?: string;
  type: "training" | "match" | "medical" | "meeting";
  recurrence?: { freq: "weekly"; until: string };
  exceptions?: string[];
}

export interface Fee {
  id: string;
  name: string;
  amount: number;
  frequency: "Daily" | "Monthly" | "Quarterly" | "Annual" | "One-time";
  periodStart?: string;
  periodEnd?: string;
  appliesToGroupIds: string[];
  sectionId: string;
  kind: "fee" | "rate";
  paymentDate?: string;
}

export type PaymentStatus = "Paid" | "Active" | "Failed" | "Pending";

export interface Payment {
  id: string;
  athleteId: string;
  subscription: string;
  sectionId: string;
  categoryId: string;
  amount: number;
  status: PaymentStatus;
  date: string;
}

export interface Message {
  id: string;
  authorId: string;
  authorRole: Role;
  targetLabel: string;
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  type: "circular" | "direct" | "group";
  participants: string[]; // user ids
  unreadCount: number;
  messages: Message[];
}

export interface MedicalAppointment {
  id: string;
  athleteId: string;
  staffId: string;
  date: string;
  time: string;
  reason: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  notes: string;
}
