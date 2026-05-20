import { create } from "zustand";

interface SettingsState {
  theme: "dark" | "light";
  aiModel: string;
  searchEngine: string;
  voiceEnabled: boolean;
  memoryEnabled: boolean;
  autoSummarise: boolean;
  isSettingsOpen: boolean;
  setTheme: (theme: "dark" | "light") => void;
  setAiModel: (model: string) => void;
  setSearchEngine: (engine: string) => void;
  toggleVoice: () => void;
  toggleMemory: () => void;
  toggleAutoSummarise: () => void;
  toggleSettings: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: "dark",
  aiModel: "gpt-4o",
  searchEngine: "google",
  voiceEnabled: false,
  memoryEnabled: true,
  autoSummarise: true,
  isSettingsOpen: false,

  setTheme: (theme) => set({ theme }),
  setAiModel: (aiModel) => set({ aiModel }),
  setSearchEngine: (searchEngine) => set({ searchEngine }),
  toggleVoice: () => set((s) => ({ voiceEnabled: !s.voiceEnabled })),
  toggleMemory: () => set((s) => ({ memoryEnabled: !s.memoryEnabled })),
  toggleAutoSummarise: () =>
    set((s) => ({ autoSummarise: !s.autoSummarise })),
  toggleSettings: () => set((s) => ({ isSettingsOpen: !s.isSettingsOpen })),
}));
