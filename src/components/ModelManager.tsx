import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Loader2, Trash2, X } from "lucide-react";
import { useState } from "react";
import { RECOMMENDED_MODELS } from "../constants/models";
import { deleteModel, getInstalledModels, pullModel } from "../lib/api";

interface ModelManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Model {
  name: string;
  size: number;
  description?: string;
  author?: string;
  license?: string;
  tags?: string[];
  url?: string;
}

export function ModelManager({ isOpen, onClose }: ModelManagerProps) {
  const queryClient = useQueryClient();
  const [selectedModel, setSelectedModel] = useState("");

  // Query to get installed models
  const {
    data: installedData,
    isLoading: loadingInstalled,
    error: errorInstalled,
  } = useQuery({
    queryKey: ["installedModels"],
    queryFn: getInstalledModels,
    staleTime: 1000 * 60, // 1 minute
  });

  const pullMutation = useMutation({
    mutationFn: pullModel,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["installedModels"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteModel,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["installedModels"] }),
  });

  if (!isOpen) return null;

  const installedModels = installedData?.models || [];

  // Filter out already installed models from available models
  const availableModels = RECOMMENDED_MODELS.filter(
    (model) => !installedModels.some((m: Model) => m.name === model)
  );

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl m-4">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Model Management
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Installed Models */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Installed Models
              </h3>
              <div className="space-y-3">
                {loadingInstalled ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                  </div>
                ) : errorInstalled ? (
                  <div className="text-red-500 dark:text-red-400">
                    Failed to load models
                  </div>
                ) : installedModels.length === 0 ? (
                  <div className="text-gray-500 dark:text-gray-400">
                    No models installed
                  </div>
                ) : (
                  installedModels.map((model: Model) => (
                    <div
                      key={model.name}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {model.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Size: {Math.round(model.size / 1024 / 1024 / 1024)}GB
                        </p>
                      </div>
                      <button
                        onClick={() => deleteMutation.mutate(model.name)}
                        disabled={deleteMutation.isPending}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        {deleteMutation.isPending ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Available Models */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Available Models
              </h3>
              <div className="space-y-4">
                <div className="relative">
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a model to install...</option>
                    {availableModels.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() =>
                    selectedModel && pullMutation.mutate(selectedModel)
                  }
                  disabled={!selectedModel || pullMutation.isPending}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 text-white font-medium transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {pullMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                  Download Selected Model
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
