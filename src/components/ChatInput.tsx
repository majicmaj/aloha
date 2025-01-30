import { ArrowUp } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
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
    <div className="">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder="Type your message... (Shift + Enter for new line)"
              className="w-full min-h-[48px] max-h-[200px] rounded-2xl border border-gray-200 px-4 py-3 bg-white
                     dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:border-gray-700
                       transition-all duration-200 ease-in-out resize-none
                       focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-20 focus:outline-none
                       disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                lineHeight: "1.5",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={disabled || !input.trim()}
            className="h-10 w-10 grid place-items-center rounded-full bg-gray-900 dark:bg-white
                     text-white dark:text-gray-900 font-medium transition-all duration-200 ease-in-out
                     focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-20
                     disabled:opacity-15 disabled:cursor-not-allowed disabled:hover:shadow-none
                     transform hover:-translate-y-0.5 active:translate-y-0 mb-1"
          >
            <ArrowUp className="w-7 h-7" />
          </button>
        </div>
      </form>
    </div>
  );
}
