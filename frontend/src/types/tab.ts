export interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  isLoading: boolean;
  isActive: boolean;
}

export interface TabState {
  tabs: Tab[];
  activeTabId: string | null;
}
