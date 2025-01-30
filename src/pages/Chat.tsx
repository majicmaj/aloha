import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Database, Flower, Settings as SettingsIcon } from "lucide-react";
import React, { useState } from "react";
import useSound from "use-sound";
import { ChatInput } from "../components/ChatInput";
import { ChatMessage } from "../components/ChatMessage";
import { ModelManager } from "../components/ModelManager";
import { ModelSelector } from "../components/ModelSelector";
import { SettingsPanel } from "../components/SettingsPanel";
import { TypingIndicator } from "../components/TypingIndicator";
import { useSettings } from "../hooks/useSettings";
import { generateChatResponse } from "../lib/api";
import type { Message } from "../types/chat";

// Sound effects from mixkit.co (free for commercial use)
const MESSAGE_SENT_SOUND =
  "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3";
const TYPING_SOUND =
  "https://assets.mixkit.co/active_storage/sfx/2357/2357-preview.mp3";

export function Chat() {
  const queryClient = useQueryClient();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isModelManagerOpen, setIsModelManagerOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const { settings, updateSettings } = useSettings();

  const [playMessageSound] = useSound(MESSAGE_SENT_SOUND, {
    volume: 0.2,
    soundEnabled: settings.soundEnabled && settings.messageSound,
  });
  const [playTypingSound] = useSound(TYPING_SOUND, {
    volume: 0.2,
    soundEnabled: settings.soundEnabled && settings.typingSound,
  });

  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  // React.useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

  const mutation = useMutation({
    mutationFn: async (content: string) => {
      const apiMessages = messages.map(({ role, content }) => ({
        role,
        content,
      }));
      apiMessages.push({ role: "user", content });

      return new Promise<void>((resolve, reject) => {
        let currentMessage = "";
        let thinkingContent = "";
        const inThinkingMode = false;

        generateChatResponse(
          apiMessages,
          currentModel,
          (newChunk, isThinking) => {
            if (isThinking) {
              thinkingContent += newChunk;
            } else {
              currentMessage += newChunk;
            }

            setMessages((prevMessages) => {
              const lastMessage = prevMessages[prevMessages.length - 1];

              if (lastMessage?.role === "assistant") {
                return [
                  ...prevMessages.slice(0, -1),
                  {
                    ...lastMessage,
                    content: currentMessage,
                    thinkingContent: thinkingContent, // Store separately
                  },
                ];
              } else {
                return [
                  ...prevMessages,
                  {
                    role: "assistant",
                    content: newChunk,
                    thinkingContent,
                    timestamp: new Date(),
                  },
                ];
              }
            });
          }
        )
          .then(resolve)
          .catch(reject);
      });
    },
    onSuccess: () => {
      if (settings.soundEnabled && settings.messageSound) {
        playMessageSound();
      }
    },
  });

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    if (settings.soundEnabled && settings.messageSound) {
      playMessageSound();
    }
    mutation.mutate(content);
    if (settings.soundEnabled && settings.typingSound) {
      playTypingSound();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="w-48">
            <ModelSelector
              currentModel={currentModel}
              onModelChange={setCurrentModel}
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsModelManagerOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Manage Models"
            >
              <Database className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <SettingsIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto py-6">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          {mutation.isPending && <TypingIndicator />}
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-[calc(100vh-12rem)] text-gray-400 dark:text-gray-500">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 grid place-items-center mx-auto">
                  <Flower className="w-12 h-12 dark:text-white text-black" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  Aloha
                </p>
                <p className="text-sm">
                  Type your message below to begin chatting
                </p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <ChatInput onSend={handleSendMessage} disabled={mutation.isPending} />

      <SettingsPanel
        settings={settings}
        onUpdate={updateSettings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <ModelManager
        isOpen={isModelManagerOpen}
        onClose={() => setIsModelManagerOpen(false)}
      />
    </div>
  );
}
