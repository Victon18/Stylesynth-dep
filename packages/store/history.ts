import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";

export type HistoryItem = {
  id: string;
  url: string;
  createdAt: number;
};

type HistoryState = {
  items: HistoryItem[];
  add: (url: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      items: [],
      add: (url: string) => {
        const item: HistoryItem = {
          id: nanoid(),
          url,
          createdAt: Date.now(),
        };
        set((s) => ({ items: [item, ...s.items] }));
      },
      remove: (id: string) => {
        set((s) => ({ items: s.items.filter((i) => i.id !== id) }));
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: "couture-gallary",
    }
  )
);

