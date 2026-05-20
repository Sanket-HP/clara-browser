import { useRef, useEffect } from "react";
import { X, Trash2, Sparkles } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { IconButton } from "../common/IconButton";
import type { ChatMessage as ChatMessageType } from "../../types/chat";

interface AiPanelProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onClose: () => void;
  onClear: () => void;
}

export function AiPanel({
  messages,
  isLoading,
  onSendMessage,
  onClose,
  onClear,
}: AiPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-full flex flex-col bg-clara-surface/40 backdrop-blur-xl">
      {/* Header */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-clara-border/30">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-clara-accent to-clara-accent-light flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-medium">Clara AI</span>
          {isLoading && (
            <span className="text-xs text-clara-accent animate-pulse">
              thinking...
            </span>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          <IconButton title="Clear chat" size="sm" onClick={onClear}>
            <Trash2 className="w-3.5 h-3.5" />
          </IconButton>
          <IconButton title="Close" size="sm" onClick={onClose}>
            <X className="w-3.5 h-3.5" />
          </IconButton>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div className="flex gap-3 animate-slide-up">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-clara-accent to-clara-accent-light flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-white animate-spin" />
            </div>
            <div className="glass rounded-xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-clara-accent animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-clara-accent animate-bounce [animation-delay:0.1s]" />
                <div className="w-2 h-2 rounded-full bg-clara-accent animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={onSendMessage} isLoading={isLoading} />
    </div>
  );
}
