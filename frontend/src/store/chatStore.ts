import { create } from "zustand";
import type { ChatMessage } from "../types/chat";

interface ChatStore {
  messages: ChatMessage[];
  conversationId: string | null;
  isLoading: boolean;
  isPanelOpen: boolean;
  addMessage: (message: ChatMessage) => void;
  setLoading: (loading: boolean) => void;
  setConversationId: (id: string) => void;
  togglePanel: () => void;
  setPanelOpen: (open: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm Clara, your AI browser assistant. I can help you navigate the web, research topics, automate tasks, and remember important information. What would you like to do?",
      timestamp: new Date().toISOString(),
    },
  ],
  conversationId: null,
  isLoading: false,
  isPanelOpen: true,

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  setLoading: (isLoading) => set({ isLoading }),

  setConversationId: (conversationId) => set({ conversationId }),

  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),

  setPanelOpen: (isPanelOpen) => set({ isPanelOpen }),

  clearMessages: () =>
    set({
      messages: [
        {
          id: "welcome",
          role: "assistant",
          content: "Chat cleared. How can I help you?",
          timestamp: new Date().toISOString(),
        },
      ],
      conversationId: null,
    }),
}));
