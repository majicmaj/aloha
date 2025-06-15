import { SettingsPanel } from "../components/SettingsPanel";
import { useSettings } from "../hooks/useSettings";

export function SettingsPage() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="p-6 h-full flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">
            Customize your experience
          </p>
        </div>
        <SettingsPanel settings={settings} onUpdate={updateSettings} />
      </div>
    </div>
  );
}
