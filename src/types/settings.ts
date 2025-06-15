export interface Settings {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  messageSound: boolean;
  typingSound: boolean;
  autoScroll: boolean;
}

export const defaultSettings: Settings = {
  theme: 'light',
  soundEnabled: true,
  messageSound: true,
  typingSound: true,
  autoScroll: true,
};