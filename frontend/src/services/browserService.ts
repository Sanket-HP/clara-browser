import { api } from "./api";

interface BrowserAction {
  action: string;
  selector?: string;
  value?: string;
  url?: string;
}

interface BrowserActionResponse {
  success: boolean;
  results: Record<string, string | boolean>[];
  session_id: string;
  screenshot_url?: string;
}

export const browserService = {
  executeActions: (
    actions: BrowserAction[],
    sessionId?: string
  ): Promise<BrowserActionResponse> =>
    api.post<BrowserActionResponse>("/browser/actions", {
      actions,
      session_id: sessionId,
    }),

  getStatus: (): Promise<{ status: string; engine: string }> =>
    api.get("/browser/status"),
};
