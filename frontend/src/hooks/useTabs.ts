import { useCallback } from "react";
import { useTabStore } from "../store/tabStore";

export function useTabs() {
  const { tabs, activeTabId, addTab, closeTab, setActiveTab, updateTab, navigateTab } =
    useTabStore();

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? null;

  const handleNavigate = useCallback(
    (input: string) => {
      if (!activeTabId) return;

      let url = input.trim();
      if (!url) return;

      const isUrl =
        url.includes(".") || url.startsWith("http") || url.startsWith("clara://");

      if (!isUrl) {
        url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
      } else if (!url.startsWith("http") && !url.startsWith("clara://")) {
        url = `https://${url}`;
      }

      navigateTab(activeTabId, url);
    },
    [activeTabId, navigateTab]
  );

  return {
    tabs,
    activeTab,
    activeTabId,
    addTab,
    closeTab,
    setActiveTab,
    updateTab,
    navigateTab: handleNavigate,
  };
}
