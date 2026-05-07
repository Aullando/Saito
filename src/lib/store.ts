import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Organization, Facility, SportSection, Category, Group, Athlete,
  CalendarEvent, Fee, Payment, Conversation, MedicalAppointment, User, Message,
} from "./types";
import {
  DEMO_USERS, ORGANIZATIONS, FACILITIES, SECTIONS, CATEGORIES, GROUPS,
  ATHLETES, EVENTS, FEES, PAYMENTS, CONVERSATIONS, MEDICAL_APPOINTMENTS, ALL_USERS,
} from "./seed";

interface AuthState {
  currentUserId: string | null;
  setUser: (id: string | null) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      currentUserId: null,
      setUser: (id) => set({ currentUserId: id }),
    }),
    { name: "saito-auth" },
  ),
);

export const useCurrentUser = (): User | null => {
  const id = useAuth((s) => s.currentUserId);
  return DEMO_USERS.find((u) => u.id === id) ?? null;
};

interface DataState {
  users: User[];
  organizations: Organization[];
  facilities: Facility[];
  sections: SportSection[];
  categories: Category[];
  groups: Group[];
  athletes: Athlete[];
  events: CalendarEvent[];
  fees: Fee[];
  payments: Payment[];
  conversations: Conversation[];
  appointments: MedicalAppointment[];

  addOrganization: (o: Omit<Organization, "id" | "createdAt" | "updatedAt">) => void;
  toggleOrgAi: (id: string) => void;
  setOrgStatus: (id: string, status: Organization["status"]) => void;

  addUser: (u: Omit<User, "id" | "initials">) => void;
  addFacility: (f: Omit<Facility, "id">) => void;
  addSection: (name: string) => void;
  addAthlete: (a: Omit<Athlete, "id">) => void;
  addEvent: (e: Omit<CalendarEvent, "id">) => void;
  addFee: (f: Omit<Fee, "id">) => void;
  setPaymentStatus: (id: string, status: Payment["status"]) => void;
  addAppointment: (a: Omit<MedicalAppointment, "id">) => void;
  addAppointmentNote: (id: string, note: string) => void;

  sendMessage: (conversationId: string, msg: Omit<Message, "id" | "createdAt">) => void;
  markConversationRead: (id: string) => void;
  addConversation: (c: Omit<Conversation, "id">) => string;

  reset: () => void;
}

const initial = () => ({
  users: ALL_USERS,
  organizations: ORGANIZATIONS,
  facilities: FACILITIES,
  sections: SECTIONS,
  categories: CATEGORIES,
  groups: GROUPS,
  athletes: ATHLETES,
  events: EVENTS,
  fees: FEES,
  payments: PAYMENTS,
  conversations: CONVERSATIONS,
  appointments: MEDICAL_APPOINTMENTS,
});

const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 8)}`;

export const useData = create<DataState>()(
  persist(
    (set) => ({
      ...initial(),

      addOrganization: (o) =>
        set((s) => ({
          organizations: [
            { ...o, id: uid("org"), createdAt: new Date().toISOString().slice(0, 10), updatedAt: new Date().toISOString().slice(0, 10) },
            ...s.organizations,
          ],
        })),
      toggleOrgAi: (id) =>
        set((s) => ({
          organizations: s.organizations.map((o) => (o.id === id ? { ...o, aiEnabled: !o.aiEnabled, updatedAt: new Date().toISOString().slice(0, 10) } : o)),
        })),
      setOrgStatus: (id, status) =>
        set((s) => ({
          organizations: s.organizations.map((o) => (o.id === id ? { ...o, status, updatedAt: new Date().toISOString().slice(0, 10) } : o)),
        })),

      addUser: (u) =>
        set((s) => ({
          users: [...s.users, { ...u, id: uid("u"), initials: u.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() }],
        })),
      addFacility: (f) => set((s) => ({ facilities: [...s.facilities, { ...f, id: uid("f") }] })),
      addSection: (name) => set((s) => ({ sections: [...s.sections, { id: uid("sec"), name, athleteCount: 0 }] })),
      addAthlete: (a) => set((s) => {
        const newA = { ...a, id: uid("ath") };
        return {
          athletes: [...s.athletes, newA],
          sections: s.sections.map((sec) => sec.id === a.sectionId ? { ...sec, athleteCount: sec.athleteCount + 1 } : sec),
        };
      }),
      addEvent: (e) => set((s) => ({ events: [...s.events, { ...e, id: uid("ev") }] })),
      addFee: (f) => set((s) => ({ fees: [...s.fees, { ...f, id: uid(f.kind) }] })),
      setPaymentStatus: (id, status) =>
        set((s) => ({ payments: s.payments.map((p) => (p.id === id ? { ...p, status } : p)) })),
      addAppointment: (a) => set((s) => ({ appointments: [...s.appointments, { ...a, id: uid("apt") }] })),
      addAppointmentNote: (id, note) =>
        set((s) => ({ appointments: s.appointments.map((a) => a.id === id ? { ...a, notes: (a.notes ? a.notes + "\n" : "") + note } : a) })),

      sendMessage: (conversationId, msg) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId
              ? { ...c, messages: [...c.messages, { ...msg, id: uid("m"), createdAt: new Date().toISOString() }] }
              : c,
          ),
        })),
      markConversationRead: (id) =>
        set((s) => ({ conversations: s.conversations.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)) })),
      addConversation: (c) => {
        const id = uid("conv");
        set((s) => ({ conversations: [{ ...c, id }, ...s.conversations] }));
        return id;
      },

      reset: () => set(initial()),
    }),
    { name: "saito-data", version: 2 },
  ),
);
