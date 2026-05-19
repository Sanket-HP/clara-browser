import { useCallback, useState } from "react";
import type { WorkspaceItem } from "../types/workspace";

export function useWorkspace() {
  const [items, setItems] = useState<WorkspaceItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((item: Omit<WorkspaceItem, "id" | "created_at">) => {
    const newItem: WorkspaceItem = {
      ...item,
      id: `ws-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setItems((prev) => [...prev, newItem]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { items, isOpen, addItem, removeItem, toggle };
}
