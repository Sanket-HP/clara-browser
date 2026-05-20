import { X, Layers, ExternalLink, Trash2 } from "lucide-react";
import { IconButton } from "../common/IconButton";
import { GlassCard } from "../common/GlassCard";
import type { WorkspaceItem } from "../../types/workspace";
import { formatTimestamp } from "../../utils/helpers";

interface WorkspacePanelProps {
  items: WorkspaceItem[];
  onRemoveItem: (id: string) => void;
  onClose: () => void;
}

export function WorkspacePanel({
  items,
  onRemoveItem,
  onClose,
}: WorkspacePanelProps) {
  return (
    <div className="h-full flex flex-col bg-clara-surface/40 backdrop-blur-xl">
      <div className="h-12 flex items-center justify-between px-4 border-b border-clara-border/30">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-clara-accent" />
          <span className="text-sm font-medium">Workspace</span>
          <span className="text-xs text-clara-text-muted">
            {items.length} items
          </span>
        </div>
        <IconButton title="Close" size="sm" onClick={onClose}>
          <X className="w-3.5 h-3.5" />
        </IconButton>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {items.length === 0 ? (
          <div className="text-center py-12 text-clara-text-muted">
            <Layers className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No workspace items yet</p>
            <p className="text-xs mt-1">
              Saved research and bookmarks appear here
            </p>
          </div>
        ) : (
          items.map((item) => (
            <GlassCard key={item.id} className="p-3 group">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">
                    {item.title}
                  </h4>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-clara-accent hover:underline flex items-center gap-1 mt-0.5"
                    >
                      {item.url}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {item.notes && (
                    <p className="text-xs text-clara-text-muted mt-1 line-clamp-2">
                      {item.notes}
                    </p>
                  )}
                  {item.tags.length > 0 && (
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] bg-clara-accent/10 text-clara-accent-light rounded px-1.5 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <IconButton
                  title="Remove"
                  size="sm"
                  variant="danger"
                  className="opacity-0 group-hover:opacity-100"
                  onClick={() => onRemoveItem(item.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </IconButton>
              </div>
              <p className="text-[10px] text-clara-text-muted mt-2">
                {formatTimestamp(item.created_at)}
              </p>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}
