import { Plus } from "lucide-react";
import { Tab } from "./Tab";
import type { Tab as TabType } from "../../types/tab";

interface TabBarProps {
  tabs: TabType[];
  onAddTab: () => void;
  onCloseTab: (id: string) => void;
  onSelectTab: (id: string) => void;
}

export function TabBar({ tabs, onAddTab, onCloseTab, onSelectTab }: TabBarProps) {
  return (
    <div className="h-9 bg-clara-bg/80 backdrop-blur-sm border-b border-clara-border/20 flex items-end px-2 gap-0.5">
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          tab={tab}
          onSelect={onSelectTab}
          onClose={onCloseTab}
        />
      ))}

      <button
        onClick={onAddTab}
        className="p-1.5 rounded-lg text-clara-text-muted hover:text-clara-text hover:bg-clara-card/40 transition-colors ml-1 mb-0.5"
        title="New Tab"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
