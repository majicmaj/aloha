import { Menu } from "lucide-react";
import { ModelManager } from "../components/ModelManager";

interface ModelManagerPageProps {
  toggleSidebar: () => void;
}

export function ModelManagerPage({ toggleSidebar }: ModelManagerPageProps) {
  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      <header className="p-4 border-b dark:border-gray-800 flex items-center gap-2">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
          title="Toggle Sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">Model Manager</h1>
      </header>
      <main className="flex-1 overflow-y-auto">
        <ModelManager />
      </main>
    </div>
  );
}
