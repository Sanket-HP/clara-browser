import { X, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import type { Tab as TabType } from "../../types/tab";
import { truncate, extractDomain } from "../../utils/helpers";

interface TabProps {
  tab: TabType;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
}

export function Tab({ tab, onSelect, onClose }: TabProps) {
  return (
    <div
      onClick={() => onSelect(tab.id)}
      className={clsx(
        "group flex items-center gap-2 px-3 py-1.5 rounded-t-lg cursor-pointer",
        "min-w-[120px] max-w-[200px] transition-all duration-200",
        tab.isActive
          ? "bg-clara-surface border-t border-x border-clara-border/50 text-clara-text"
          : "bg-clara-bg/50 text-clara-text-muted hover:bg-clara-surface/50 hover:text-clara-text"
      )}
    >
      {tab.isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-clara-accent flex-shrink-0" />
      ) : (
        <div className="w-3.5 h-3.5 rounded-sm bg-clara-accent/20 flex-shrink-0 flex items-center justify-center">
          <span className="text-[8px] font-bold text-clara-accent">
            {extractDomain(tab.url).charAt(0).toUpperCase()}
          </span>
        </div>
      )}

      <span className="text-xs truncate flex-1">
        {truncate(tab.title, 20)}
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose(tab.id);
        }}
        className="opacity-0 group-hover:opacity-100 hover:bg-clara-card/80 rounded p-0.5 transition-opacity"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
