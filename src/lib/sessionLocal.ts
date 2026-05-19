import { create } from "zustand";
import { persist } from "zustand/middleware";

// Demo store: in-memory + localStorage. Comparte cambios entre perfiles
// (no se resetea al cambiar). Sin backend real, sin RLS.

export type AttStatus = "present" | "late" | "absent";

export interface NotifiedAbsence {
  id: string;
  sessionId: string;
  athleteId: string;
  athleteName: string;
  reason: string;
  comment?: string;
  createdAt: string;
}

export interface CallupRecord {
  sessionId: string;
  athleteIds: string[];
  createdAt: string;
}

export interface SessionNote {
  id: string;
  sessionId: string;
  text: string;
  privateNote: boolean;
  createdAt: string;
}

export interface SessionRating {
  sessionId: string;
  rpe: number;
  recovery: number;
  comment?: string;
  createdAt: string;
}

export interface AISessionBlock {
  id: string;
  sessionId: string;
  title: string;
  detail?: string;
  createdAt: string;
}

export interface AppointmentRequest {
  id: string;
  athleteId: string;
  athleteName: string;
  specialty: string;
  reason: string;
  preferredDate?: string;
  status: "pending" | "scheduled" | "rejected";
  createdAt: string;
}

export interface PostSessionFeedback {
  id: string;
  sessionId: string;
  athleteId: string;
  athleteName: string;
  rpe: number;
  text?: string;
  createdAt: string;
}

interface SessionLocalState {
  attendance: Record<string, Record<string, AttStatus>>; // sessionId -> athleteId -> status
  absences: NotifiedAbsence[];
  callups: Record<string, CallupRecord>; // sessionId -> last callup
  notes: SessionNote[];
  ratings: Record<string, SessionRating>; // sessionId -> rating
  aiBlocks: AISessionBlock[];
  appointmentRequests: AppointmentRequest[];
  feedbacks: PostSessionFeedback[];

  saveAttendance: (sessionId: string, statusByAthlete: Record<string, AttStatus>) => void;
  notifyAbsence: (data: Omit<NotifiedAbsence, "id" | "createdAt">) => void;
  saveCallup: (sessionId: string, athleteIds: string[]) => void;
  addNote: (sessionId: string, text: string, privateNote: boolean) => void;
  saveRating: (sessionId: string, rpe: number, recovery: number, comment?: string) => void;
  acceptAIBlock: (sessionId: string, title: string, detail?: string) => void;
  requestAppointment: (data: Omit<AppointmentRequest, "id" | "createdAt" | "status">) => void;
  resolveAppointmentRequest: (id: string, status: "scheduled" | "rejected") => void;
  sendFeedback: (data: Omit<PostSessionFeedback, "id" | "createdAt">) => void;
  reset: () => void;
}

const empty = {
  attendance: {},
  absences: [],
  callups: {},
  notes: [],
  ratings: {},
  aiBlocks: [],
  appointmentRequests: [],
  feedbacks: [],
};

const newId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const useSessionLocal = create<SessionLocalState>()(
  persist(
    (set) => ({
      ...empty,
      saveAttendance: (sessionId, statusByAthlete) =>
        set((s) => ({
          attendance: { ...s.attendance, [sessionId]: statusByAthlete },
        })),
      notifyAbsence: (data) =>
        set((s) => ({
          absences: [
            { ...data, id: newId("abs"), createdAt: new Date().toISOString() },
            ...s.absences,
          ],
        })),
      saveCallup: (sessionId, athleteIds) =>
        set((s) => ({
          callups: {
            ...s.callups,
            [sessionId]: {
              sessionId,
              athleteIds,
              createdAt: new Date().toISOString(),
            },
          },
        })),
      addNote: (sessionId, text, privateNote) =>
        set((s) => ({
          notes: [
            {
              id: newId("note"),
              sessionId,
              text,
              privateNote,
              createdAt: new Date().toISOString(),
            },
            ...s.notes,
          ],
        })),
      saveRating: (sessionId, rpe, recovery, comment) =>
        set((s) => ({
          ratings: {
            ...s.ratings,
            [sessionId]: {
              sessionId,
              rpe,
              recovery,
              comment,
              createdAt: new Date().toISOString(),
            },
          },
        })),
      acceptAIBlock: (sessionId, title, detail) =>
        set((s) => ({
          aiBlocks: [
            {
              id: newId("ai"),
              sessionId,
              title,
              detail,
              createdAt: new Date().toISOString(),
            },
            ...s.aiBlocks,
          ],
        })),
      requestAppointment: (data) =>
        set((s) => ({
          appointmentRequests: [
            {
              ...data,
              id: newId("apt"),
              status: "pending",
              createdAt: new Date().toISOString(),
            },
            ...s.appointmentRequests,
          ],
        })),
      resolveAppointmentRequest: (id, status) =>
        set((s) => ({
          appointmentRequests: s.appointmentRequests.map((r) =>
            r.id === id ? { ...r, status } : r,
          ),
        })),
      sendFeedback: (data) =>
        set((s) => ({
          feedbacks: [
            { ...data, id: newId("fb"), createdAt: new Date().toISOString() },
            ...s.feedbacks,
          ],
        })),
      reset: () => set({ ...empty }),
    }),
    { name: "saito-session-local" },
  ),
);
