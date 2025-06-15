export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  model?: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}
