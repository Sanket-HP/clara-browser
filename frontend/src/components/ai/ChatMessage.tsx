import { Bot, User } from "lucide-react";
import { clsx } from "clsx";
import type { ChatMessage as ChatMessageType } from "../../types/chat";
import { formatTimestamp } from "../../utils/helpers";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={clsx(
        "flex gap-3 animate-slide-up",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={clsx(
          "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
          isUser
            ? "bg-clara-accent/20 text-clara-accent"
            : "bg-gradient-to-br from-clara-accent to-clara-accent-light text-white"
        )}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5" />
        ) : (
          <Bot className="w-3.5 h-3.5" />
        )}
      </div>

      <div
        className={clsx(
          "max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-clara-accent/15 text-clara-text border border-clara-accent/20"
            : "glass text-clara-text"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>

        {message.actions && message.actions.length > 0 && (
          <div className="mt-2 pt-2 border-t border-clara-border/30">
            <p className="text-xs text-clara-text-muted mb-1">Actions:</p>
            {message.actions.map((action, i) => (
              <span
                key={i}
                className="inline-block text-xs bg-clara-accent/10 text-clara-accent-light rounded px-1.5 py-0.5 mr-1 mb-1"
              >
                {action}
              </span>
            ))}
          </div>
        )}

        <p className="text-[10px] text-clara-text-muted mt-1.5 flex items-center gap-1">
          {formatTimestamp(message.timestamp)}
          {message.agentUsed && (
            <span className="text-clara-accent">
              {" "}
              via {message.agentUsed}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
