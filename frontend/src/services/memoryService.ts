import { api } from "./api";

interface MemoryEntry {
  id: string;
  content: string;
  metadata: Record<string, string>;
  timestamp: string;
}

interface MemoryQueryResponse {
  results: MemoryEntry[];
  query: string;
}

export const memoryService = {
  store: (
    content: string,
    metadata?: Record<string, string>,
    category?: string
  ): Promise<MemoryEntry> =>
    api.post<MemoryEntry>("/memory/store", {
      content,
      metadata: metadata ?? {},
      category: category ?? "general",
    }),

  query: (
    query: string,
    topK = 5,
    category?: string
  ): Promise<MemoryQueryResponse> =>
    api.post<MemoryQueryResponse>("/memory/query", {
      query,
      top_k: topK,
      category,
    }),

  clear: (category?: string): Promise<{ deleted: number; category: string }> =>
    api.delete(`/memory/clear${category ? `?category=${category}` : ""}`),
};
