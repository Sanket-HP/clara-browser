import { useCallback } from "react";
import { useChatStore } from "../store/chatStore";
import { chatService } from "../services/chatService";

export function useAiChat() {
  const {
    messages,
    isLoading,
    isPanelOpen,
    conversationId,
    addMessage,
    setLoading,
    setConversationId,
    togglePanel,
    clearMessages,
  } = useChatStore();

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage = {
        id: `msg-${Date.now()}`,
        role: "user" as const,
        content,
        timestamp: new Date().toISOString(),
      };
      addMessage(userMessage);
      setLoading(true);

      try {
        const response = await chatService.sendMessage({
          message: content,
          conversation_id: conversationId ?? undefined,
        });

        if (response.conversation_id) {
          setConversationId(response.conversation_id);
        }

        addMessage({
          id: `msg-${Date.now()}-reply`,
          role: "assistant",
          content: response.reply,
          timestamp: new Date().toISOString(),
          agentUsed: response.agent_used,
          actions: response.actions_taken,
        });
      } catch (error) {
        addMessage({
          id: `msg-${Date.now()}-error`,
          role: "assistant",
          content: `I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. The backend server may not be running.`,
          timestamp: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    },
    [isLoading, conversationId, addMessage, setLoading, setConversationId]
  );

  return {
    messages,
    isLoading,
    isPanelOpen,
    sendMessage,
    togglePanel,
    clearMessages,
  };
}
