import { formatDistanceToNow } from "date-fns";
import {
  Brain,
  ChevronDown,
  ChevronRight,
  Copy,
  Flower,
  User,
} from "lucide-react";
import { useState } from "react";
import type { Message } from "../types/chat";
import ProseMarkdown from "./ProseMarkdown";
import { TypingIndicator } from "./TypingIndicator";

interface ChatMessageProps {
  message: Message;
  isTyping?: boolean;
}

const copyCode = (code: string) => {
  navigator.clipboard.writeText(code);
};

export function ChatMessage({ message, isTyping }: ChatMessageProps) {
  const isUser = message.role === "user";
  const [isThinkingExpanded, setIsThinkingExpanded] = useState(true);

  // Extract thinking content if present
  const thinkStartIndex = message.content.indexOf("<think>");
  const thinkEndIndex = message.content.indexOf("</think>");

  let thinkingContent: string | null = null;
  let mainContent = message.content;

  if (thinkStartIndex !== -1) {
    if (thinkEndIndex === -1) {
      // No closing </think>, treat everything after <think> as thinking content
      thinkingContent = message.content.substring(thinkStartIndex + 7).trim();
      mainContent = ""; // No main content since everything is in <think>
    } else {
      // Normal case: Extract <think> content
      thinkingContent = message.content
        .substring(thinkStartIndex + 7, thinkEndIndex)
        .trim();
      mainContent = message.content.replace(/<think>.*<\/think>/s, "").trim();
    }
  }

  return (
    <div
      className={`chat-message flex gap-2 p-2 lg:p-4 ${
        isUser ? "justify-end" : ""
      }`}
    >
      {!isUser && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-6 h-6 flex items-center justify-center transform rotate-12 transition-transform hover:rotate-0">
            <Flower className="w-6 h-6 text-black dark:text-white" />
          </div>
        </div>
      )}

      <div
        className={`flex flex-col ${
          isUser ? "items-end" : "items-start"
        } max-w-[90%] lg:max-w-[85%] overflow-auto`}
      >
        {!isUser && thinkingContent && (
          <div className="mb-2 w-full">
            <button
              onClick={() => setIsThinkingExpanded(!isThinkingExpanded)}
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              {isThinkingExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <Brain className="w-4 h-4" />
              <span>Thinking Process</span>
            </button>
            {isThinkingExpanded && (
              <div className="prose prose-sm dark:prose-invert max-w-none mt-2 p-3 rounded-xl bg-white border-2 border-dashed border-gray-300 dark:border-gray-700 dark:bg-gray-800/0 text-sm text-gray-600 dark:text-gray-400">
                <ProseMarkdown mainContent={thinkingContent} isUser={isUser} />
              </div>
            )}
          </div>
        )}

        <div
          className={`rounded-3xl px-4 py-3 ${
            isUser
              ? "bg-gradient-to-r from-gray-900 to-black dark:from-blue-700 dark:to-blue-800 message-bubble-user dark:message-bubble-user-dark"
              : "bg-gradient-to-r from-gray-200 to-gray-300 dark:to-gray-900/0 dark:from-gray-900/0 dark:px-0 message-bubble-assistant"
          }`}
        >
          <div className={`prose prose-sm dark:prose-invert}`}>
            <div className="prose prose-sm dark:prose-invert overflow-auto max-w-none text-sm">
              <ProseMarkdown mainContent={mainContent} isUser={isUser} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-1 mt-0.5">
          {isTyping && !isUser && (
            <div className="">
              <TypingIndicator />
            </div>
          )}
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {isUser ? "You" : "Model"}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </span>
          <button
            onClick={() => copyCode(mainContent)}
            className="mt-1 dark:text-gray-300 flex items-center justify-center w-6 h-6 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 active:bg-blue-500/50 transition-colors"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-6 h-6 rounded-2xl flex items-center justify-center transform -rotate-12 transition-transform hover:rotate-0">
            <User className="w-6 h-6 text-black dark:text-white" />
          </div>
        </div>
      )}
    </div>
  );
}
