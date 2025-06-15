import { useMutation } from "@tanstack/react-query";
import { Flower, Settings as SettingsIcon } from "lucide-react";
import React, { useState } from "react";
import useSound from "use-sound";
import { ChatInput } from "../components/ChatInput";
import { ChatMessage } from "../components/ChatMessage";
import { ModelSelector } from "../components/ModelSelector";
import { SettingsPanel } from "../components/SettingsPanel";
import { useSettings } from "../hooks/useSettings";
import { generateChatResponse } from "../lib/api";
import type { Message } from "../types/chat";

// Sound effects from mixkit.co (free for commercial use)
const MESSAGE_SENT_SOUND =
  "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3";
const TYPING_SOUND =
  "https://assets.mixkit.co/active_storage/sfx/2357/2357-preview.mp3";

export function Chat() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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

  const mutation = useMutation({
    mutationFn: async (content: string) => {
      const apiMessages = messages.map(({ role, content }) => ({
        role,
        content,
      }));
      apiMessages.push({ role: "user", content });

      return new Promise<void>((resolve, reject) => {
        let currentMessage = "";

        generateChatResponse(apiMessages, currentModel, (newChunk: string) => {
          currentMessage += newChunk;

          setMessages((prevMessages) => {
            const lastMessage = prevMessages[prevMessages.length - 1];

            if (lastMessage?.role === "assistant") {
              return [
                ...prevMessages.slice(0, -1),
                {
                  ...lastMessage,
                  content: currentMessage,
                },
              ];
            } else {
              return [
                ...prevMessages,
                {
                  role: "assistant",
                  content: newChunk,
                  timestamp: new Date(),
                },
              ];
            }
          });
        })
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-white to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <header className="bg-white/80 dark:bg-gray-900/75 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-2 justify-between">
          <div className="max-w-64">
            <ModelSelector
              currentModel={currentModel}
              onModelChange={setCurrentModel}
            />
          </div>
          <div className="flex items-center gap-1 lg:gap-4">
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
            <ChatMessage
              key={index}
              message={message}
              isTyping={mutation.isPending && index === messages.length - 1}
            />
          ))}
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
    </div>
  );
}
