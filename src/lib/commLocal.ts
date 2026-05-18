import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CircularStatus = "draft" | "scheduled" | "published" | "archived" | "withdrawn";

export interface LocalCircular {
  id: string;
  title: string;
  body: string;
  recipientsLabel: string;
  recipientsCount: number;
  reads: number;
  createdAt: string;
  status: CircularStatus;
  scheduledAt?: string;
  withdrawReason?: string;
}

interface CommLocalState {
  // Chats / groups / medical conversations
  hiddenConvs: string[];
  archivedConvs: string[];
  hiddenMsgs: string[];
  // Circulares
  localCirculars: LocalCircular[];
  circularStatus: Record<string, CircularStatus>;
  withdrawReasons: Record<string, string>;
  // Medical requests handled
  handledRequests: string[];

  hideConv: (id: string) => void;
  archiveConv: (id: string) => void;
  unarchiveConv: (id: string) => void;
  hideMsg: (id: string) => void;

  addLocalCircular: (c: Omit<LocalCircular, "id" | "createdAt" | "status" | "reads">) => string;
  deleteLocalCircular: (id: string) => void;
  publishCircular: (id: string) => void;
  archiveCircular: (id: string) => void;
  withdrawCircular: (id: string, reason: string) => void;

  markRequestHandled: (id: string) => void;

  reset: () => void;
}

export const useCommLocal = create<CommLocalState>()(
  persist(
    (set) => ({
      hiddenConvs: [],
      archivedConvs: [],
      hiddenMsgs: [],
      localCirculars: [],
      circularStatus: {},
      withdrawReasons: {},
      handledRequests: [],

      hideConv: (id) =>
        set((s) => ({
          hiddenConvs: s.hiddenConvs.includes(id) ? s.hiddenConvs : [...s.hiddenConvs, id],
          archivedConvs: s.archivedConvs.filter((x) => x !== id),
        })),
      archiveConv: (id) =>
        set((s) => ({
          archivedConvs: s.archivedConvs.includes(id)
            ? s.archivedConvs
            : [...s.archivedConvs, id],
        })),
      unarchiveConv: (id) =>
        set((s) => ({ archivedConvs: s.archivedConvs.filter((x) => x !== id) })),
      hideMsg: (id) =>
        set((s) => ({
          hiddenMsgs: s.hiddenMsgs.includes(id) ? s.hiddenMsgs : [...s.hiddenMsgs, id],
        })),

      addLocalCircular: (c) => {
        const id = `circ-local-${Math.random().toString(36).slice(2, 8)}`;
        const item: LocalCircular = {
          ...c,
          id,
          createdAt: new Date().toISOString(),
          status: "draft",
          reads: 0,
        };
        set((s) => ({ localCirculars: [item, ...s.localCirculars] }));
        return id;
      },
      deleteLocalCircular: (id) =>
        set((s) => ({ localCirculars: s.localCirculars.filter((c) => c.id !== id) })),
      publishCircular: (id) =>
        set((s) => ({
          localCirculars: s.localCirculars.map((c) =>
            c.id === id ? { ...c, status: "published" as const } : c,
          ),
          circularStatus: { ...s.circularStatus, [id]: "published" },
        })),
      archiveCircular: (id) =>
        set((s) => ({
          localCirculars: s.localCirculars.map((c) =>
            c.id === id ? { ...c, status: "archived" as const } : c,
          ),
          circularStatus: { ...s.circularStatus, [id]: "archived" },
        })),
      withdrawCircular: (id, reason) =>
        set((s) => ({
          localCirculars: s.localCirculars.map((c) =>
            c.id === id ? { ...c, status: "withdrawn" as const, withdrawReason: reason } : c,
          ),
          circularStatus: { ...s.circularStatus, [id]: "withdrawn" },
          withdrawReasons: { ...s.withdrawReasons, [id]: reason },
        })),

      markRequestHandled: (id) =>
        set((s) => ({
          handledRequests: s.handledRequests.includes(id)
            ? s.handledRequests
            : [...s.handledRequests, id],
        })),

      reset: () =>
        set({
          hiddenConvs: [],
          archivedConvs: [],
          hiddenMsgs: [],
          localCirculars: [],
          circularStatus: {},
          withdrawReasons: {},
          handledRequests: [],
        }),
    }),
    { name: "saito-comm-local", version: 2 },
  ),
);
