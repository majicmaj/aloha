import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getInstalledModels } from "../lib/api";
import { cn } from "../utils/cn";

interface ModelSelectorProps {
  currentModel: string;
  onModelChange: (model: string) => void;
}

export function ModelSelector({
  currentModel,
  onModelChange,
}: ModelSelectorProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["installedModels"],
    queryFn: getInstalledModels,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const { models } = data || {};

  useEffect(() => {
    if (
      models &&
      models.length > 0 &&
      !models.find((model: { name: string }) => model?.name === currentModel)
    ) {
      onModelChange(models[0]?.name);
    }
  }, [models, currentModel, onModelChange]);

  if (error) {
    return (
      <div className="text-xs text-red-500 dark:text-red-400">
        Failed to load
      </div>
    );
  }

  if (!isLoading && models?.length === 0) {
    return (
      <div className="text-xs">
        No models installed.
        <Link to="/models" className="text-blue-500 hover:underline ml-1">
          Add a model
        </Link>
      </div>
    );
  }

  return (
    <div className="relative flex items-center">
      <select
        value={currentModel}
        onChange={(e) => onModelChange(e.target.value)}
        className={cn(
          "appearance-none text-xs rounded-lg pl-2 pr-6 py-1 bg-gray-100 dark:bg-gray-700/50",
          "border border-transparent",
          "text-gray-600 dark:text-gray-300",
          "hover:border-gray-300 dark:hover:border-gray-600",
          "focus:outline-none focus:ring-1 focus:ring-blue-500",
          "transition-colors",
          "disabled:opacity-50"
        )}
        disabled={isLoading}
      >
        {isLoading ? (
          <option>Loading...</option>
        ) : (
          models?.map((model: { name: string }) => (
            <option key={model.name} value={model.name}>
              {model.name}
            </option>
          ))
        )}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none">
        {isLoading ? (
          <Loader2 className="w-3 h-3 text-gray-400 animate-spin" />
        ) : (
          <ChevronDown className="w-3 h-3 text-gray-400" />
        )}
      </div>
    </div>
  );
}
