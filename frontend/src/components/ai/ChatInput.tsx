import { useState, useCallback, type KeyboardEvent } from "react";
import { Send, Mic, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSend = useCallback(() => {
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput("");
  }, [input, isLoading, onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div className="p-3 border-t border-clara-border/30">
      <div className="glass rounded-xl flex items-end gap-2 p-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Clara anything..."
          rows={1}
          className="flex-1 bg-transparent text-sm text-clara-text placeholder:text-clara-text-muted resize-none focus:outline-none min-h-[36px] max-h-[120px] py-1.5 px-2"
        />

        <div className="flex items-center gap-1 flex-shrink-0 pb-0.5">
          <button
            className="p-1.5 rounded-lg text-clara-text-muted hover:text-clara-text hover:bg-clara-card/60 transition-colors"
            title="Voice input (coming soon)"
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-1.5 rounded-lg bg-clara-accent text-white hover:bg-clara-accent/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Send message"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
