import { ArrowUp } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";
import { ModelSelector } from "./ModelSelector";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  currentModel: string;
  onModelChange: (model: string) => void;
}

export function ChatInput({
  onSend,
  disabled,
  currentModel,
  onModelChange,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4 bg-white/70 dark:bg-gray-950/70 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div
          className={cn(
            "relative flex items-end rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800",
            "focus-within:ring-2 focus-within:ring-blue-500"
          )}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Ask anything..."
            className="w-full bg-transparent p-3 pr-20 resize-none focus:outline-none max-h-48 text-base"
            rows={1}
          />
          <button
            type="submit"
            disabled={disabled || !input.trim()}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 grid place-items-center rounded-full bg-blue-600 text-white transition-colors",
              "hover:bg-blue-700",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800",
              "disabled:bg-gray-300 disabled:dark:bg-gray-600 disabled:cursor-not-allowed"
            )}
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
        <div className="flex justify-between items-center mt-2 px-2">
          <ModelSelector
            currentModel={currentModel}
            onModelChange={onModelChange}
          />
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Shift + Enter for new line
          </p>
        </div>
      </form>
    </div>
  );
}
