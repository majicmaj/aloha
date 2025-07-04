import { Moon, Sun, Volume2, VolumeX } from "lucide-react";
import type { Settings as SettingsType } from "../types/settings";

interface SettingsPanelProps {
  settings: SettingsType;
  onUpdate: (settings: Partial<SettingsType>) => void;
}

function SettingItem({
  title,
  description,
  children,
  vertical,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  vertical?: boolean;
}) {
  return (
    <div
      className={`bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg flex ${
        vertical ? "flex-col items-start gap-4" : "items-center justify-between"
      }`}
    >
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      <div className={vertical ? "w-full" : ""}>{children}</div>
    </div>
  );
}

export function SettingsPanel({ settings, onUpdate }: SettingsPanelProps) {
  return (
    <div className="space-y-6">
      <SettingItem
        title="Theme"
        description="Choose between light and dark mode"
      >
        <button
          onClick={() =>
            onUpdate({
              theme: settings.theme === "light" ? "dark" : "light",
            })
          }
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {settings.theme === "light" ? (
            <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          ) : (
            <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          )}
        </button>
      </SettingItem>

      <div className="space-y-4">
        <SettingItem
          title="System Prompt"
          description="Enable or disable the system prompt"
        >
          <input
            type="checkbox"
            checked={settings.enableSystemPrompt}
            onChange={(e) => onUpdate({ enableSystemPrompt: e.target.checked })}
            className="rounded h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </SettingItem>
        {settings.enableSystemPrompt && (
          <div className="space-y-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700 ml-4">
            <SettingItem
              title="Custom System Prompt"
              description="The system prompt is sent to the AI for all chats. Changes take effect on the next message."
              vertical
            >
              <textarea
                value={settings.systemPrompt}
                onChange={(e) => onUpdate({ systemPrompt: e.target.value })}
                className="w-full h-32 p-2 rounded-lg bg-gray-100 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="e.g., You are a helpful assistant."
              />
            </SettingItem>
          </div>
        )}
      </div>

      <SettingItem
        title="Title Generation"
        description="Choose how to generate chat titles"
        vertical
      >
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="title-generation"
              value="llm"
              checked={settings.titleGenerationMethod === "llm"}
              onChange={() => onUpdate({ titleGenerationMethod: "llm" })}
              className="rounded-full h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Generate via LLM</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="title-generation"
              value="prompt"
              checked={settings.titleGenerationMethod === "prompt"}
              onChange={() => onUpdate({ titleGenerationMethod: "prompt" })}
              className="rounded-full h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Use first few words of prompt</span>
          </label>
        </div>
      </SettingItem>

      <SettingItem
        title="Auto-Scroll"
        description="Automatically scroll to the latest message"
      >
        <input
          type="checkbox"
          checked={settings.autoScroll}
          onChange={(e) => onUpdate({ autoScroll: e.target.checked })}
          className="rounded h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </SettingItem>

      <div className="space-y-4">
        <SettingItem
          title="Sound Effects"
          description="Enable or disable all sound effects"
        >
          <button
            onClick={() => onUpdate({ soundEnabled: !settings.soundEnabled })}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <VolumeX className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </SettingItem>

        {settings.soundEnabled && (
          <div className="space-y-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700 ml-4">
            <SettingItem
              title="Message Sounds"
              description="Play sound on new messages"
            >
              <input
                type="checkbox"
                checked={settings.messageSound}
                onChange={(e) => onUpdate({ messageSound: e.target.checked })}
                className="rounded h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </SettingItem>
            <SettingItem
              title="Typing Sounds"
              description="Play sound while the assistant is typing"
            >
              <input
                type="checkbox"
                checked={settings.typingSound}
                onChange={(e) => onUpdate({ typingSound: e.target.checked })}
                className="rounded h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </SettingItem>
          </div>
        )}
      </div>
    </div>
  );
}
