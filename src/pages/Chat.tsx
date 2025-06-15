import { useMutation } from "@tanstack/react-query";
import { Flower, Menu } from "lucide-react";
import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSound from "use-sound";
import { v4 as uuidv4 } from "uuid";
import { ChatInput } from "../components/ChatInput";
import { ChatMessage } from "../components/ChatMessage";
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
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollState = useRef({ atBottom: true });
  const activeChatIdRef = useRef(chatId);
  const { settings } = useSettings();

  useEffect(() => {
    activeChatIdRef.current = chatId;
  }, [chatId]);

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

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const atBottom =
        container.scrollHeight - container.clientHeight <=
        container.scrollTop + 10;
      scrollState.current.atBottom = atBottom;
    }
  };

  useLayoutEffect(() => {
    if (settings.autoScroll && scrollState.current.atBottom) {
      messagesEndRef.current?.scrollIntoView();
    }
  }, [messages, settings.autoScroll]);

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
    {
      userMessage: Message;
      messages: Message[];
      chatId: string;
      signal: AbortSignal;
    }
  >({
    mutationFn: async ({ messages, signal, chatId: mutationChatId }) => {
      const apiMessages = messages.map(({ role, content }) => ({
        role,
        content,
      }));

      return new Promise((resolve, reject) => {
        let currentMessage = "";

        generateChatResponse(
          apiMessages,
          currentModel,
          (newChunk: string) => {
            currentMessage += newChunk;

            if (activeChatIdRef.current === mutationChatId) {
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
                      content: currentMessage,
                      timestamp: new Date(),
                      model: currentModel,
                    },
                  ];
                }
              });
            }
          },
          signal
        )
          .then(() => resolve({ content: currentMessage }))
          .catch(reject);
      });
    },
    onSuccess: async (data, variables) => {
      if (settings.soundEnabled && settings.messageSound) {
        playMessageSound();
      }

      const { content: assistantContent } = data;
      const { chatId } = variables;

      const assistantMessage: Message = {
        role: "assistant",
        content: assistantContent,
        timestamp: new Date(),
        model: currentModel,
      };

      const chat = await db.chats.get(chatId);
      if (chat) {
        const finalMessages = [...chat.messages, assistantMessage];
        await db.chats.update(chatId, {
          messages: finalMessages,
          updatedAt: new Date(),
        });

        if (chat.title === "New Chat") {
          let title: string;
          if (settings.titleGenerationMethod === "prompt") {
            title = variables.userMessage.content
              .split(" ")
              .slice(0, 5)
              .join(" ");
          } else {
            title = await generateTitle(
              currentModel,
              variables.userMessage.content
            );
          }
          await db.chats.update(chatId, { title: title || "New chat" });
        }
      }
    },
    onSettled: () => {
      abortControllerRef.current = null;
    },
  });

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      role: "user",
      content,
      timestamp: new Date(),
    };

    let idToUse = chatId;
    let newMessages: Message[] = [];

    if (!idToUse) {
      setMessages([]);
      const newChatId = uuidv4();
      newMessages = [userMessage];
      await db.chats.add({
        id: newChatId,
        title: "New Chat",
        messages: newMessages,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      navigate(`/chat/${newChatId}`, { replace: true });
      idToUse = newChatId;
    } else {
      const chat = await db.chats.get(idToUse);
      if (chat) {
        newMessages = [...chat.messages, userMessage];
        await db.chats.update(idToUse, {
          messages: newMessages,
        });
      }
    }

    setMessages(newMessages);

    if (settings.soundEnabled && settings.messageSound) {
      playMessageSound();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const messagesForApi =
      settings.enableSystemPrompt && settings.systemPrompt
        ? [
            {
              role: "system" as const,
              content: settings.systemPrompt,
              timestamp: new Date(),
            },
            ...newMessages,
          ]
        : newMessages;

    mutation.mutate({
      userMessage,
      messages: messagesForApi,
      chatId: idToUse,
      signal: controller.signal,
    });

    if (settings.soundEnabled && settings.typingSound) {
      playTypingSound();
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-white to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <header className="bg-white/80 dark:bg-gray-900/75 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto px-3 py-2 lg:hidden flex items-center gap-2">
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div
        className="flex-1 overflow-y-auto"
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
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

      <ChatInput
        onSend={handleSendMessage}
        disabled={mutation.isPending}
        currentModel={currentModel}
        onModelChange={setCurrentModel}
        onStop={handleStop}
      />
    </div>
  );
}
