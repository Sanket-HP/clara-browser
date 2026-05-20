import { X, Brain, Search, Mic, Database, Sparkles, Monitor } from "lucide-react";
import { useSettingsStore } from "../../store/settingsStore";
import { IconButton } from "../common/IconButton";
import { GlassCard } from "../common/GlassCard";
import { AI_MODELS, SEARCH_ENGINES, APP_VERSION } from "../../utils/constants";

interface SettingsPageProps {
  onClose: () => void;
}

function ToggleSwitch({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-10 h-5 rounded-full transition-colors ${
        enabled ? "bg-clara-accent" : "bg-clara-border"
      }`}
    >
      <div
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export function SettingsPage({ onClose }: SettingsPageProps) {
  const {
    aiModel,
    searchEngine,
    voiceEnabled,
    memoryEnabled,
    autoSummarise,
    setAiModel,
    setSearchEngine,
    toggleVoice,
    toggleMemory,
    toggleAutoSummarise,
  } = useSettingsStore();

  return (
    <div className="flex-1 overflow-y-auto bg-clara-bg p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold gradient-text">Settings</h1>
            <p className="text-sm text-clara-text-muted mt-1">
              Configure Clara v{APP_VERSION}
            </p>
          </div>
          <IconButton onClick={onClose} title="Close settings">
            <X className="w-5 h-5" />
          </IconButton>
        </div>

        {/* AI Model */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-5 h-5 text-clara-accent" />
            <h2 className="text-sm font-semibold">AI Model</h2>
          </div>
          <select
            value={aiModel}
            onChange={(e) => setAiModel(e.target.value)}
            className="input-field w-full"
          >
            {AI_MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name} ({model.provider})
              </option>
            ))}
          </select>
        </GlassCard>

        {/* Search Engine */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-5 h-5 text-clara-accent" />
            <h2 className="text-sm font-semibold">Search Engine</h2>
          </div>
          <select
            value={searchEngine}
            onChange={(e) => setSearchEngine(e.target.value)}
            className="input-field w-full"
          >
            {SEARCH_ENGINES.map((engine) => (
              <option key={engine.id} value={engine.id}>
                {engine.name}
              </option>
            ))}
          </select>
        </GlassCard>

        {/* Feature Toggles */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-clara-accent" />
            <h2 className="text-sm font-semibold">Features</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-clara-text-muted" />
                <div>
                  <p className="text-sm">Voice Commands</p>
                  <p className="text-xs text-clara-text-muted">
                    Enable voice input for hands-free control
                  </p>
                </div>
              </div>
              <ToggleSwitch enabled={voiceEnabled} onToggle={toggleVoice} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-clara-text-muted" />
                <div>
                  <p className="text-sm">Memory</p>
                  <p className="text-xs text-clara-text-muted">
                    Store context and preferences across sessions
                  </p>
                </div>
              </div>
              <ToggleSwitch enabled={memoryEnabled} onToggle={toggleMemory} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-clara-text-muted" />
                <div>
                  <p className="text-sm">Auto-Summarise</p>
                  <p className="text-xs text-clara-text-muted">
                    Automatically summarise pages when opened
                  </p>
                </div>
              </div>
              <ToggleSwitch
                enabled={autoSummarise}
                onToggle={toggleAutoSummarise}
              />
            </div>
          </div>
        </GlassCard>

        {/* About */}
        <GlassCard className="text-center">
          <p className="text-sm text-clara-text-muted">
            Clara AI Browser v{APP_VERSION}
          </p>
          <p className="text-xs text-clara-text-muted mt-1">
            Next-generation autonomous browsing experience
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
