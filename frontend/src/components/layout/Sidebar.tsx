import {
  Globe,
  MessageSquare,
  Layers,
  Settings,
  Mic,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { IconButton } from "../common/IconButton";
import { useChatStore } from "../../store/chatStore";
import { useSettingsStore } from "../../store/settingsStore";

interface SidebarProps {
  onToggleWorkspace: () => void;
  isWorkspaceOpen: boolean;
}

export function Sidebar({ onToggleWorkspace, isWorkspaceOpen }: SidebarProps) {
  const togglePanel = useChatStore((s) => s.togglePanel);
  const isPanelOpen = useChatStore((s) => s.isPanelOpen);
  const toggleSettings = useSettingsStore((s) => s.toggleSettings);

  return (
    <div className="w-14 bg-clara-surface/50 backdrop-blur-xl border-r border-clara-border/30 flex flex-col items-center py-3 gap-1">
      <div className="mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-clara-accent to-clara-accent-light flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      </div>

      <IconButton
        title="Browser"
        variant={!isPanelOpen && !isWorkspaceOpen ? "accent" : "ghost"}
        onClick={() => {
          if (isPanelOpen) togglePanel();
          if (isWorkspaceOpen) onToggleWorkspace();
        }}
      >
        <Globe className="w-5 h-5" />
      </IconButton>

      <IconButton
        title="AI Assistant"
        variant={isPanelOpen ? "accent" : "ghost"}
        onClick={togglePanel}
      >
        <MessageSquare className="w-5 h-5" />
      </IconButton>

      <IconButton
        title="Workspace"
        variant={isWorkspaceOpen ? "accent" : "ghost"}
        onClick={onToggleWorkspace}
      >
        <Layers className="w-5 h-5" />
      </IconButton>

      <IconButton title="Research" variant="ghost">
        <BookOpen className="w-5 h-5" />
      </IconButton>

      <div className="flex-1" />

      <IconButton title="Voice Command" variant="ghost">
        <Mic className="w-5 h-5" />
      </IconButton>

      <IconButton title="Settings" onClick={toggleSettings}>
        <Settings className="w-5 h-5" />
      </IconButton>
    </div>
  );
}
