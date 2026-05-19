import { useState } from "react";
import { TitleBar } from "./TitleBar";
import { Sidebar } from "./Sidebar";
import { TabBar } from "../tabs/TabBar";
import { UrlBar } from "../browser/UrlBar";
import { BrowserView } from "../browser/BrowserView";
import { AiPanel } from "../ai/AiPanel";
import { WorkspacePanel } from "../workspace/WorkspacePanel";
import { SettingsPage } from "../settings/SettingsPage";
import { AnimatedPanel } from "../common/AnimatedPanel";
import { useTabs } from "../../hooks/useTabs";
import { useAiChat } from "../../hooks/useAiChat";
import { useWorkspace } from "../../hooks/useWorkspace";
import { useSettingsStore } from "../../store/settingsStore";

export function AppShell() {
  const {
    tabs,
    activeTab,
    addTab,
    closeTab,
    setActiveTab,
    navigateTab,
  } = useTabs();

  const {
    messages,
    isLoading,
    isPanelOpen,
    sendMessage,
    togglePanel,
    clearMessages,
  } = useAiChat();

  const workspace = useWorkspace();
  const isSettingsOpen = useSettingsStore((s) => s.isSettingsOpen);
  const toggleSettings = useSettingsStore((s) => s.toggleSettings);
  const [_workspaceOpen, setWorkspaceOpen] = useState(false);

  const handleToggleWorkspace = () => {
    setWorkspaceOpen((prev) => !prev);
    workspace.toggle();
  };

  return (
    <div className="h-screen flex flex-col bg-clara-bg overflow-hidden">
      <TitleBar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onToggleWorkspace={handleToggleWorkspace}
          isWorkspaceOpen={workspace.isOpen}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <TabBar
            tabs={tabs}
            onAddTab={() => addTab()}
            onCloseTab={closeTab}
            onSelectTab={setActiveTab}
          />

          <UrlBar
            url={activeTab?.url ?? ""}
            isLoading={activeTab?.isLoading ?? false}
            onNavigate={navigateTab}
          />

          <div className="flex-1 flex overflow-hidden relative">
            {isSettingsOpen ? (
              <SettingsPage onClose={toggleSettings} />
            ) : (
              <BrowserView tab={activeTab} />
            )}

            <AnimatedPanel
              isOpen={isPanelOpen}
              direction="right"
              className="w-96 border-l border-clara-border/30 flex-shrink-0"
            >
              <AiPanel
                messages={messages}
                isLoading={isLoading}
                onSendMessage={sendMessage}
                onClose={togglePanel}
                onClear={clearMessages}
              />
            </AnimatedPanel>

            <AnimatedPanel
              isOpen={workspace.isOpen}
              direction="right"
              className="w-80 border-l border-clara-border/30 flex-shrink-0"
            >
              <WorkspacePanel
                items={workspace.items}
                onRemoveItem={workspace.removeItem}
                onClose={handleToggleWorkspace}
              />
            </AnimatedPanel>
          </div>
        </div>
      </div>
    </div>
  );
}
