export type AgentRole =
  | "orchestrator"
  | "navigation"
  | "research"
  | "memory"
  | "automation"
  | "decision";

export type TaskStatus = "pending" | "running" | "completed" | "failed";

export interface AgentResult {
  agent: AgentRole;
  status: TaskStatus;
  output: string;
  actions: string[];
  metadata: Record<string, string>;
}
