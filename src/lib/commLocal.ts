import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CommLocalState {
  hiddenConvs: string[];
  archivedConvs: string[];
  hiddenMsgs: string[];
  hideConv: (id: string) => void;
  archiveConv: (id: string) => void;
  unarchiveConv: (id: string) => void;
  hideMsg: (id: string) => void;
  reset: () => void;
}

export const useCommLocal = create<CommLocalState>()(
  persist(
    (set) => ({
      hiddenConvs: [],
      archivedConvs: [],
      hiddenMsgs: [],
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
      reset: () => set({ hiddenConvs: [], archivedConvs: [], hiddenMsgs: [] }),
    }),
    { name: "saito-comm-local", version: 1 },
  ),
);
