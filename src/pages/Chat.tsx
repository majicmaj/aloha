import { useMutation } from "@tanstack/react-query";
import { Flower, Menu } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSound from "use-sound";
import { v4 as uuidv4 } from "uuid";
import { ChatInput } from "../components/ChatInput";
import { ChatMessage } from "../components/ChatMessage";
import { ModelSelector } from "../components/ModelSelector";
import { useSettings } from "../hooks/useSettings";
import { generateChatResponse, generateTitle } from "../lib/api";
import { db } from "../lib/db";
import type { Message } from "../types/chat";

// Sound effects from mixkit.co (free for commercial use)
const MESSAGE_SENT_SOUND =
  "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3";
const TYPING_SOUND =
  "https://assets.mixkit.co/active_storage/sfx/2357/2357-preview.mp3";

interface ChatProps {
  toggleSidebar: () => void;
}

export function Chat({ toggleSidebar }: ChatProps) {
  const { id: chatId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentModel, setCurrentModel] = useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const { settings } = useSettings();

  useEffect(() => {
    if (chatId) {
      db.chats.get(chatId).then((chat) => {
        if (chat) {
          setMessages(chat.messages);
        }
      });
    } else {
      setMessages([]);
    }
  }, [chatId]);

  const [playMessageSound] = useSound(MESSAGE_SENT_SOUND, {
    volume: 0.2,
    soundEnabled: settings.soundEnabled && settings.messageSound,
  });

  const [playTypingSound] = useSound(TYPING_SOUND, {
    volume: 0.2,
    soundEnabled: settings.soundEnabled && settings.typingSound,
  });

  const mutation = useMutation<
    { content: string },
    Error,
    { content: string; userMessage: Message; chatId: string }
  >({
    mutationFn: async ({ userMessage }) => {
      const apiMessages = [...messages, userMessage].map(
        ({ role, content }) => ({
          role,
          content,
        })
      );

      return new Promise((resolve, reject) => {
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
          .then(() => resolve({ content: currentMessage }))
          .catch(reject);
      });
    },
    onSuccess: async (data, variables) => {
      if (settings.soundEnabled && settings.messageSound) {
        playMessageSound();
      }

      const { content: assistantContent } = data;
      const { userMessage, chatId } = variables;

      const assistantMessage: Message = {
        role: "assistant",
        content: assistantContent,
        timestamp: new Date(),
      };

      const chat = await db.chats.get(chatId);
      if (chat) {
        const finalMessages = [...chat.messages, userMessage, assistantMessage];
        await db.chats.update(chatId, {
          messages: finalMessages,
          updatedAt: new Date(),
        });

        if (chat.title === "New Chat") {
          const title = await generateTitle(currentModel, userMessage.content);
          await db.chats.update(chatId, { title });
        }
      }
    },
  });

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      role: "user",
      content,
      timestamp: new Date(),
    };

    let idToUse = chatId;
    if (!idToUse) {
      const newChatId = uuidv4();
      await db.chats.add({
        id: newChatId,
        title: "New Chat",
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      navigate(`/chat/${newChatId}`, { replace: true });
      idToUse = newChatId;
    }

    setMessages((prev) => [...prev, userMessage]);

    if (settings.soundEnabled && settings.messageSound) {
      playMessageSound();
    }

    mutation.mutate({ content, userMessage, chatId: idToUse });

    if (settings.soundEnabled && settings.typingSound) {
      playTypingSound();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-white to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <header className="bg-white/80 dark:bg-gray-900/75 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-2">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
            title="Toggle Sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="max-w-64">
            <ModelSelector
              currentModel={currentModel}
              onModelChange={setCurrentModel}
            />
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
    </div>
  );
}
