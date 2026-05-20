import { create } from "zustand";
import type { Tab } from "../types/tab";

interface TabStore {
  tabs: Tab[];
  activeTabId: string | null;
  addTab: (url?: string, title?: string) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTab: (id: string, updates: Partial<Tab>) => void;
  navigateTab: (id: string, url: string) => void;
}

let tabCounter = 0;

const createTabId = (): string => {
  tabCounter += 1;
  return `tab-${Date.now()}-${tabCounter}`;
};

export const useTabStore = create<TabStore>((set) => ({
  tabs: [
    {
      id: "tab-default",
      title: "New Tab",
      url: "clara://newtab",
      isLoading: false,
      isActive: true,
    },
  ],
  activeTabId: "tab-default",

  addTab: (url = "clara://newtab", title = "New Tab") => {
    const id = createTabId();
    set((state) => ({
      tabs: [
        ...state.tabs.map((t) => ({ ...t, isActive: false })),
        { id, title, url, isLoading: false, isActive: true },
      ],
      activeTabId: id,
    }));
  },

  closeTab: (id) =>
    set((state) => {
      const remaining = state.tabs.filter((t) => t.id !== id);
      if (remaining.length === 0) {
        const newTab: Tab = {
          id: createTabId(),
          title: "New Tab",
          url: "clara://newtab",
          isLoading: false,
          isActive: true,
        };
        return { tabs: [newTab], activeTabId: newTab.id };
      }
      const wasActive = state.activeTabId === id;
      if (wasActive) {
        const last = remaining[remaining.length - 1];
        return {
          tabs: remaining.map((t) => ({
            ...t,
            isActive: t.id === last.id,
          })),
          activeTabId: last.id,
        };
      }
      return { tabs: remaining };
    }),

  setActiveTab: (id) =>
    set((state) => ({
      tabs: state.tabs.map((t) => ({ ...t, isActive: t.id === id })),
      activeTabId: id,
    })),

  updateTab: (id, updates) =>
    set((state) => ({
      tabs: state.tabs.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),

  navigateTab: (id, url) =>
    set((state) => ({
      tabs: state.tabs.map((t) =>
        t.id === id ? { ...t, url, isLoading: true } : t
      ),
    })),
}));
