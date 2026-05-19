export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  agentUsed?: string;
  actions?: string[];
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  context?: Record<string, string>;
}

export interface ChatResponse {
  reply: string;
  conversation_id: string;
  agent_used: string;
  actions_taken: string[];
  task_status: string;
}
