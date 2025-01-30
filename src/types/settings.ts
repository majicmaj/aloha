export interface Settings {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  messageSound: boolean;
  typingSound: boolean;
}

export const defaultSettings: Settings = {
  theme: 'light',
  soundEnabled: true,
  messageSound: true,
  typingSound: true,
};