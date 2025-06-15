import { ModelManager } from "../components/ModelManager";

export function ModelManagerPage() {
  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      <header className="p-4 border-b dark:border-gray-800">
        <h1 className="text-xl font-semibold">Model Manager</h1>
      </header>
      <main className="flex-1 overflow-y-auto">
        <ModelManager />
      </main>
    </div>
  );
}
