import type { ChatRequest, ChatResponse } from "../types/chat";
import { api } from "./api";

export const chatService = {
  sendMessage: (request: ChatRequest): Promise<ChatResponse> =>
    api.post<ChatResponse>("/chat/", request),

  classifyIntent: (
    message: string
  ): Promise<{ category: string; entity: string; action: string }> =>
    api.post("/chat/classify", { message }),
};
