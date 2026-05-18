import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface EventCancellation {
  reason: string;
  cancelledAt: string;
  notified: boolean;
}

interface CalendarLocalState {
  cancellations: Record<string, EventCancellation>;
  // Track operational associations for events (notes, attendance done, comms)
  notes: Record<string, string>;
  hasAttendance: Record<string, boolean>;
  hasCommunication: Record<string, boolean>;

  cancelEvent: (id: string, reason: string, notify: boolean) => void;
  uncancelEvent: (id: string) => void;
  setNote: (id: string, note: string) => void;
  markAttendance: (id: string, value: boolean) => void;
  markCommunication: (id: string, value: boolean) => void;
  reset: () => void;
}

export const useCalendarLocal = create<CalendarLocalState>()(
  persist(
    (set) => ({
      cancellations: {},
      notes: {},
      hasAttendance: {},
      hasCommunication: {},

      cancelEvent: (id, reason, notify) =>
        set((s) => ({
          cancellations: {
            ...s.cancellations,
            [id]: { reason, cancelledAt: new Date().toISOString(), notified: notify },
          },
          hasCommunication: notify
            ? { ...s.hasCommunication, [id]: true }
            : s.hasCommunication,
        })),
      uncancelEvent: (id) =>
        set((s) => {
          const next = { ...s.cancellations };
          delete next[id];
          return { cancellations: next };
        }),
      setNote: (id, note) =>
        set((s) => ({ notes: { ...s.notes, [id]: note } })),
      markAttendance: (id, value) =>
        set((s) => ({ hasAttendance: { ...s.hasAttendance, [id]: value } })),
      markCommunication: (id, value) =>
        set((s) => ({ hasCommunication: { ...s.hasCommunication, [id]: value } })),
      reset: () =>
        set({
          cancellations: {},
          notes: {},
          hasAttendance: {},
          hasCommunication: {},
        }),
    }),
    { name: "saito-calendar-local", version: 1 },
  ),
);
