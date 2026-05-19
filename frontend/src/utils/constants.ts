export const APP_NAME = "Clara";
export const APP_VERSION = "0.1.0";
export const DEFAULT_SEARCH_ENGINE = "https://www.google.com/search?q=";
export const NEW_TAB_URL = "clara://newtab";

export const AI_MODELS = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI" },
  { id: "gpt-4-turbo", name: "GPT-4 Turbo", provider: "OpenAI" },
] as const;

export const SEARCH_ENGINES = [
  { id: "google", name: "Google", url: "https://www.google.com/search?q=" },
  { id: "bing", name: "Bing", url: "https://www.bing.com/search?q=" },
  {
    id: "duckduckgo",
    name: "DuckDuckGo",
    url: "https://duckduckgo.com/?q=",
  },
] as const;

export const SUGGESTED_COMMANDS = [
  "Research AI internships",
  "Summarize this website",
  "Open YouTube and search for machine learning tutorials",
  "Remember that my favorite language is TypeScript",
  "What do you remember about me?",
  "Navigate to github.com",
] as const;
