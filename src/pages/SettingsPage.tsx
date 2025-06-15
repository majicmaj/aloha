import { Menu } from "lucide-react";
import { SettingsPanel } from "../components/SettingsPanel";
import { useSettings } from "../hooks/useSettings";

interface SettingsPageProps {
  toggleSidebar: () => void;
}

export function SettingsPage({ toggleSidebar }: SettingsPageProps) {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 border-b dark:border-gray-800 flex items-center gap-2">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
          title="Toggle Sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">Settings</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
            Customize your experience
          </p>
          <SettingsPanel settings={settings} onUpdate={updateSettings} />
        </div>
      </main>
    </div>
  );
}
