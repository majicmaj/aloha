import { Moon, Settings, Sun, Volume2, VolumeX, X } from "lucide-react";
import type { Settings as SettingsType } from "../types/settings";

interface SettingsPanelProps {
  settings: SettingsType;
  onUpdate: (settings: Partial<SettingsType>) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({
  settings,
  onUpdate,
  isOpen,
  onClose,
}: SettingsPanelProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md m-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-1">
            <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Theme</span>
            <button
              onClick={() =>
                onUpdate({
                  theme: settings.theme === "light" ? "dark" : "light",
                })
              }
              className="p-1 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {settings.theme === "light" ? (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">
                Sound Effects
              </span>
              <button
                onClick={() =>
                  onUpdate({ soundEnabled: !settings.soundEnabled })
                }
                className="p-1 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {settings.soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                )}
              </button>
            </div>

            {settings.soundEnabled && (
              <div className="space-y-2 pl-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.messageSound}
                    onChange={(e) =>
                      onUpdate({ messageSound: e.target.checked })
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Message Sounds
                  </span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.typingSound}
                    onChange={(e) =>
                      onUpdate({ typingSound: e.target.checked })
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Typing Sounds
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
