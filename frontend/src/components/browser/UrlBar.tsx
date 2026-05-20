import { useState, useCallback, type KeyboardEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Shield,
  Search,
  Loader2,
} from "lucide-react";
import { IconButton } from "../common/IconButton";

interface UrlBarProps {
  url: string;
  isLoading: boolean;
  onNavigate: (url: string) => void;
}

export function UrlBar({ url, isLoading, onNavigate }: UrlBarProps) {
  const [input, setInput] = useState(url);
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onNavigate(input);
        (e.target as HTMLInputElement).blur();
      }
    },
    [input, onNavigate]
  );

  const displayUrl = isFocused ? input : url;

  return (
    <div className="h-12 bg-clara-surface/60 backdrop-blur-md border-b border-clara-border/20 flex items-center px-3 gap-2">
      <IconButton title="Back" size="sm">
        <ArrowLeft className="w-4 h-4" />
      </IconButton>
      <IconButton title="Forward" size="sm">
        <ArrowRight className="w-4 h-4" />
      </IconButton>
      <IconButton title="Reload" size="sm">
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <RotateCw className="w-4 h-4" />
        )}
      </IconButton>

      <div className="flex-1 flex items-center glass rounded-full px-4 py-1.5 gap-2 group focus-within:glow-border transition-all">
        {url.startsWith("https") ? (
          <Shield className="w-4 h-4 text-clara-success flex-shrink-0" />
        ) : (
          <Search className="w-4 h-4 text-clara-text-muted flex-shrink-0" />
        )}
        <input
          type="text"
          value={displayUrl}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            setInput(url);
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Search or enter URL..."
          className="flex-1 bg-transparent text-sm text-clara-text placeholder:text-clara-text-muted focus:outline-none"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
