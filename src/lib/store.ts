import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Organization,
  Facility,
  SportSection,
  Category,
  Group,
  Athlete,
  CalendarEvent,
  Fee,
  Payment,
  Conversation,
  MedicalAppointment,
  User,
  Message,
} from "./types";
import {
  DEMO_USERS,
  ORGANIZATIONS,
  FACILITIES,
  SECTIONS,
  CATEGORIES,
  GROUPS,
  ATHLETES,
  EVENTS,
  FEES,
  PAYMENTS,
  CONVERSATIONS,
  MEDICAL_APPOINTMENTS,
  ALL_USERS,
} from "./seed";

interface AuthState {
  currentUserId: string | null;
  avatars: Record<string, string>;
  mobileNavOpen: boolean;
  sidebarCollapsed: boolean;
  langOverride: "es" | "en" | null;
  setUser: (id: string | null) => void;
  setAvatar: (id: string, dataUrl: string) => void;
  removeAvatar: (id: string) => void;
  setMobileNavOpen: (open: boolean) => void;
  setSidebarCollapsed: (v: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setLangOverride: (lang: "es" | "en" | null) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      currentUserId: null,
      avatars: {},
      mobileNavOpen: false,
      sidebarCollapsed: false,
      langOverride: null,
      setUser: (id) => set({ currentUserId: id, mobileNavOpen: false }),
      setAvatar: (id, dataUrl) => set((s) => ({ avatars: { ...s.avatars, [id]: dataUrl } })),
      removeAvatar: (id) =>
        set((s) => {
          const { [id]: _, ...rest } = s.avatars;
          return { avatars: rest };
        }),
      setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      toggleSidebarCollapsed: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setLangOverride: (lang) => set({ langOverride: lang }),
    }),
    {
      name: "saito-auth",
      partialize: (s) => ({
        currentUserId: s.currentUserId,
        avatars: s.avatars,
        sidebarCollapsed: s.sidebarCollapsed,
        langOverride: s.langOverride,
      }),
    },
  ),
);

export const useUserAvatar = (id?: string | null) =>
  useAuth((s) => (id ? s.avatars[id] : undefined));

import { useAuth as useRealAuth } from "./auth";

export const useCurrentUser = (): User | null => {
  const { user, profile, roles } = useRealAuth();
  const langOverride = useAuth((s) => s.langOverride);
  if (!user) return null;
  const role = (roles[0] ?? "admin") as User["role"];
  const name = profile?.full_name || user.email?.split("@")[0] || "User";
  const parts = name.split(" ");
  const initials = (parts[0]?.[0] ?? "?") + (parts[1]?.[0] ?? "");
  const baseLang = (profile?.language as User["language"]) ?? "es";
  return {
    id: user.id,
    name,
    email: user.email ?? "",
    role,
    language: langOverride ?? baseLang,
    initials: initials.toUpperCase(),
  };
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
  deleteUser: (id: string) => void;
  addFacility: (f: Omit<Facility, "id">) => void;
  deleteFacility: (id: string) => void;
  addSection: (name: string) => void;
  deleteSection: (id: string) => void;
  addCategory: (c: Omit<Category, "id">) => void;
  deleteCategory: (id: string) => void;
  addGroup: (g: Omit<Group, "id">) => void;
  deleteGroup: (id: string) => void;
  addAthlete: (a: Omit<Athlete, "id">) => void;
  deleteAthlete: (id: string) => void;
  addEvent: (e: Omit<CalendarEvent, "id">) => void;
  updateEvent: (id: string, patch: Partial<Omit<CalendarEvent, "id">>) => void;
  deleteEvent: (id: string) => void;
  addEventException: (id: string, date: string) => void;
  addFee: (f: Omit<Fee, "id">) => void;
  deleteFee: (id: string) => void;
  setPaymentStatus: (id: string, status: Payment["status"]) => void;
  addAppointment: (a: Omit<MedicalAppointment, "id">) => string;
  deleteAppointment: (id: string) => void;
  addAppointmentNote: (id: string, note: string) => void;
  updateAppointment: (id: string, patch: Partial<Omit<MedicalAppointment, "id">>) => void;
  updateAthlete: (id: string, patch: Partial<Omit<Athlete, "id">>) => void;
  deleteOrganization: (id: string) => void;

  sendMessage: (conversationId: string, msg: Omit<Message, "id" | "createdAt">) => void;
  markConversationRead: (id: string) => void;
  addConversation: (c: Omit<Conversation, "id">) => string;
  deleteConversation: (id: string) => void;

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
            {
              ...o,
              id: uid("org"),
              createdAt: new Date().toISOString().slice(0, 10),
              updatedAt: new Date().toISOString().slice(0, 10),
            },
            ...s.organizations,
          ],
        })),
      toggleOrgAi: (id) =>
        set((s) => ({
          organizations: s.organizations.map((o) =>
            o.id === id
              ? { ...o, aiEnabled: !o.aiEnabled, updatedAt: new Date().toISOString().slice(0, 10) }
              : o,
          ),
        })),
      setOrgStatus: (id, status) =>
        set((s) => ({
          organizations: s.organizations.map((o) =>
            o.id === id ? { ...o, status, updatedAt: new Date().toISOString().slice(0, 10) } : o,
          ),
        })),

      addUser: (u) =>
        set((s) => ({
          users: [
            ...s.users,
            {
              ...u,
              id: uid("u"),
              initials: u.name
                .split(" ")
                .map((p) => p[0])
                .slice(0, 2)
                .join("")
                .toUpperCase(),
            },
          ],
        })),
      deleteUser: (id) => set((s) => ({ users: s.users.filter((u) => u.id !== id) })),
      addFacility: (f) => set((s) => ({ facilities: [...s.facilities, { ...f, id: uid("f") }] })),
      deleteFacility: (id) => set((s) => ({ facilities: s.facilities.filter((f) => f.id !== id) })),
      addSection: (name) =>
        set((s) => ({ sections: [...s.sections, { id: uid("sec"), name, athleteCount: 0 }] })),
      deleteSection: (id) =>
        set((s) => ({
          sections: s.sections.filter((x) => x.id !== id),
          categories: s.categories.filter((c) => c.sectionId !== id),
          groups: s.groups.filter((g) => g.sectionId !== id),
          athletes: s.athletes.filter((a) => a.sectionId !== id),
        })),
      addCategory: (c) => set((s) => ({ categories: [...s.categories, { ...c, id: uid("cat") }] })),
      deleteCategory: (id) =>
        set((s) => ({
          categories: s.categories.filter((c) => c.id !== id),
          groups: s.groups.filter((g) => g.categoryId !== id),
          athletes: s.athletes.filter((a) => a.categoryId !== id),
        })),
      addGroup: (g) => set((s) => ({ groups: [...s.groups, { ...g, id: uid("grp") }] })),
      deleteGroup: (id) =>
        set((s) => ({
          groups: s.groups.filter((g) => g.id !== id),
          athletes: s.athletes.map((a) => ({
            ...a,
            groupIds: a.groupIds.filter((groupId) => groupId !== id),
          })),
        })),
      addAthlete: (a) =>
        set((s) => {
          const newA = { ...a, id: uid("ath") };
          return {
            athletes: [...s.athletes, newA],
            sections: s.sections.map((sec) =>
              sec.id === a.sectionId ? { ...sec, athleteCount: sec.athleteCount + 1 } : sec,
            ),
          };
        }),
      deleteAthlete: (id) =>
        set((s) => {
          const a = s.athletes.find((x) => x.id === id);
          return {
            athletes: s.athletes.filter((x) => x.id !== id),
            sections: a
              ? s.sections.map((sec) =>
                  sec.id === a.sectionId
                    ? { ...sec, athleteCount: Math.max(0, sec.athleteCount - 1) }
                    : sec,
                )
              : s.sections,
            payments: s.payments.filter((p) => p.athleteId !== id),
            appointments: s.appointments.filter((p) => p.athleteId !== id),
          };
        }),
      addEvent: (e) => set((s) => ({ events: [...s.events, { ...e, id: uid("ev") }] })),
      updateEvent: (id, patch) =>
        set((s) => ({
          events: s.events.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        })),
      deleteEvent: (id) => set((s) => ({ events: s.events.filter((e) => e.id !== id) })),
      addEventException: (id, date) =>
        set((s) => ({
          events: s.events.map((e) =>
            e.id === id ? { ...e, exceptions: [...(e.exceptions ?? []), date] } : e,
          ),
        })),
      addFee: (f) => set((s) => ({ fees: [...s.fees, { ...f, id: uid(f.kind) }] })),
      deleteFee: (id) => set((s) => ({ fees: s.fees.filter((f) => f.id !== id) })),
      setPaymentStatus: (id, status) =>
        set((s) => ({ payments: s.payments.map((p) => (p.id === id ? { ...p, status } : p)) })),
      addAppointment: (a) =>
        set((s) => ({ appointments: [...s.appointments, { ...a, id: uid("apt") }] })),
      deleteAppointment: (id) =>
        set((s) => ({ appointments: s.appointments.filter((a) => a.id !== id) })),
      addAppointmentNote: (id, note) =>
        set((s) => ({
          appointments: s.appointments.map((a) =>
            a.id === id ? { ...a, notes: (a.notes ? a.notes + "\n" : "") + note } : a,
          ),
        })),
      deleteOrganization: (id) =>
        set((s) => ({ organizations: s.organizations.filter((o) => o.id !== id) })),

      sendMessage: (conversationId, msg) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: [
                    ...c.messages,
                    { ...msg, id: uid("m"), createdAt: new Date().toISOString() },
                  ],
                }
              : c,
          ),
        })),
      markConversationRead: (id) =>
        set((s) => ({
          conversations: s.conversations.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)),
        })),
      addConversation: (c) => {
        const id = uid("conv");
        set((s) => ({ conversations: [{ ...c, id }, ...s.conversations] }));
        return id;
      },
      deleteConversation: (id) =>
        set((s) => ({ conversations: s.conversations.filter((c) => c.id !== id) })),

      reset: () => set(initial()),
    }),
    { name: "saito-data", version: 9 },
  ),
);
