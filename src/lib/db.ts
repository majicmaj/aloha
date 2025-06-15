import Dexie, { Table } from "dexie";
import { Message } from "../types/chat";

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export class AlohaDatabase extends Dexie {
  chats!: Table<Chat>;

  constructor() {
    super("AlohaDatabase");
    this.version(1).stores({
      chats: "++id, title, createdAt, updatedAt",
    });
  }
}

export const db = new AlohaDatabase();
