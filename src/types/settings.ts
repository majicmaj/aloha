export interface Settings {
  theme: "light" | "dark";
  soundEnabled: boolean;
  messageSound: boolean;
  typingSound: boolean;
  autoScroll: boolean;
  systemPrompt: string;
  enableSystemPrompt: boolean;
  titleGenerationMethod: "prompt" | "llm";
}

export const defaultSettings: Settings = {
  theme: "light",
  soundEnabled: true,
  messageSound: true,
  typingSound: true,
  autoScroll: true,
  systemPrompt: "",
  enableSystemPrompt: true,
  titleGenerationMethod: "llm",
};
