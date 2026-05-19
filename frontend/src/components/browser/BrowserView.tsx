import { Sparkles, Globe, ArrowRight } from "lucide-react";
import { GlassCard } from "../common/GlassCard";
import { SUGGESTED_COMMANDS } from "../../utils/constants";
import { useChatStore } from "../../store/chatStore";
import type { Tab } from "../../types/tab";

interface BrowserViewProps {
  tab: Tab | null;
}

export function BrowserView({ tab }: BrowserViewProps) {
  const addMessage = useChatStore((s) => s.addMessage);
  const setPanelOpen = useChatStore((s) => s.setPanelOpen);

  const handleCommand = (command: string) => {
    setPanelOpen(true);
    addMessage({
      id: `msg-${Date.now()}`,
      role: "user",
      content: command,
      timestamp: new Date().toISOString(),
    });
  };

  if (!tab || tab.url === "clara://newtab") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-clara-bg">
        <div className="max-w-2xl w-full space-y-8 animate-fade-in">
          {/* Hero */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-clara-accent to-clara-accent-light flex items-center justify-center mx-auto shadow-lg shadow-clara-accent/20">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold gradient-text">Clara</h1>
            <p className="text-clara-text-muted text-lg">
              Your AI-powered autonomous browser
            </p>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SUGGESTED_COMMANDS.map((command) => (
              <GlassCard
                key={command}
                className="flex items-center gap-3 hover:glow-border transition-all group"
                onClick={() => handleCommand(command)}
              >
                <Globe className="w-4 h-4 text-clara-accent flex-shrink-0" />
                <span className="text-sm text-clara-text-muted group-hover:text-clara-text transition-colors flex-1">
                  {command}
                </span>
                <ArrowRight className="w-4 h-4 text-clara-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </GlassCard>
            ))}
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-center gap-6 text-xs text-clara-text-muted">
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-clara-success animate-pulse" />
              AI Engine Online
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-clara-accent animate-pulse" />
              Memory Active
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-clara-warning animate-pulse" />
              Voice Ready
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-clara-surface">
      <div className="flex-1 flex items-center justify-center text-clara-text-muted">
        <div className="text-center space-y-3">
          <Globe className="w-12 h-12 mx-auto text-clara-border" />
          <p className="text-sm">
            Browsing: <span className="text-clara-text">{tab.url}</span>
          </p>
          <p className="text-xs">
            In a full Electron build, this area renders the webview.
          </p>
        </div>
      </div>
    </div>
  );
}
