import {
  UseMutationResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Download, Loader2, Trash2, Search, ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { RECOMMENDED_MODELS } from "../constants/models";
import { deleteModel, getInstalledModels, pullModel } from "../lib/api";
import { GetModelsResponse } from "../types/ollama";

type Model = GetModelsResponse["models"][0];

function ModelCard({
  modelName,
  installedModels,
  pullMutation,
  deleteMutation,
}: {
  modelName: string;
  installedModels: Model[];
  pullMutation: UseMutationResult<void, Error, string, unknown>;
  deleteMutation: UseMutationResult<void, Error, string, unknown>;
}) {
  const isInstalled = installedModels.some((m) => m.name === modelName);
  const isPulling =
    pullMutation.isPending && pullMutation.variables === modelName;

  const modelData = installedModels.find((m) => m.name === modelName);

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {modelName}
        </h3>
        {isInstalled && modelData && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Size: {Math.round(modelData.size / 1024 / 1024 / 1024)}GB
          </p>
        )}
      </div>
      <div className="mt-6">
        {isInstalled ? (
          <button
            onClick={() => deleteMutation.mutate(modelName)}
            disabled={
              deleteMutation.isPending && deleteMutation.variables === modelName
            }
            className="w-full py-2 px-4 rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-medium transition hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {deleteMutation.isPending &&
            deleteMutation.variables === modelName ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Trash2 className="w-5 h-5" />
            )}
            Delete
          </button>
        ) : (
          <button
            onClick={() => pullMutation.mutate(modelName)}
            disabled={isPulling}
            className="w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-medium transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPulling ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            Install
          </button>
        )}
      </div>
    </div>
  );
}

export function ModelManager() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const {
    data: installedData,
    isLoading: loadingInstalled,
    error: errorInstalled,
  } = useQuery({
    queryKey: ["installedModels"],
    queryFn: getInstalledModels,
    staleTime: 1000 * 60, // 1 minute
  });

  const pullMutation = useMutation<void, Error, string>({
    mutationFn: pullModel,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["installedModels"] }),
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: deleteModel,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["installedModels"] }),
  });

  const installedModels = (installedData as GetModelsResponse)?.models || [];

  const availableModels = useMemo(() => {
    const installedModelNames = new Set(
      installedModels.map((m: Model) => m.name)
    );
    let models = RECOMMENDED_MODELS.filter(
      (modelName: string) => !installedModelNames.has(modelName)
    );

    if (searchTerm) {
      models = models.filter((modelName: string) =>
        modelName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy === "name") {
      models.sort((a: string, b: string) => a.localeCompare(b));
    }

    return models;
  }, [installedModels, searchTerm, sortBy]);

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Available Models
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Download and manage your local models.
        </p>
      </div>

      {loadingInstalled ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : errorInstalled ? (
        <div className="text-red-500 dark:text-red-400 text-center py-10">
          Failed to load models. Make sure Ollama is running.
        </div>
      ) : (
        <>
          {/* Installed Models */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Installed Models
            </h2>
            {installedModels.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {installedModels.map((model: Model) => (
                  <ModelCard
                    key={model.name}
                    modelName={model.name}
                    installedModels={installedModels}
                    pullMutation={pullMutation}
                    deleteMutation={deleteMutation}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No models installed.
              </p>
            )}
          </div>

          {/* Available Models */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Available Models
            </h2>

            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search models..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                >
                  <option value="name">Sort by Name</option>
                </select>
                <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {availableModels.map((modelName: string) => (
                <ModelCard
                  key={modelName}
                  modelName={modelName}
                  installedModels={installedModels}
                  pullMutation={pullMutation}
                  deleteMutation={deleteMutation}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
