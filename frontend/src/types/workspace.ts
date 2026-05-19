export interface WorkspaceItem {
  id: string;
  title: string;
  url?: string;
  notes: string;
  tags: string[];
  created_at: string;
}

export interface WorkspaceState {
  items: WorkspaceItem[];
  isOpen: boolean;
}
