import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { getInstalledModels } from "../lib/api";

interface ModelSelectorProps {
  currentModel: string;
  onModelChange: (model: string) => void;
}

export function ModelSelector({
  currentModel,
  onModelChange,
}: ModelSelectorProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["models"],
    queryFn: getInstalledModels,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const { models } = data || {};

  useEffect(() => {
    if (
      models &&
      !models.find((model: { name: string }) => model?.name === currentModel)
    ) {
      onModelChange(models[0]?.name);
    }
    // eslint-disable-next-line
  }, [models, currentModel]);

  if (error) {
    return (
      <div className="text-sm text-red-500 dark:text-red-400">
        Failed to load models
      </div>
    );
  }

  return (
    <div className="relative">
      <select
        value={currentModel}
        onChange={(e) => onModelChange(e.target.value)}
        className="appearance-none w-full pl-3 pr-10 py-2 rounded-xl bg-white dark:bg-gray-800 
                 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? (
          <option>Loading models...</option>
        ) : (
          models?.map((model: { name: string }) => (
            <option key={model.name} value={model.name}>
              {model.name}
            </option>
          ))
        )}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        {isLoading ? (
          <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </div>
    </div>
  );
}
