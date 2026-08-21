export interface ChatMessage {
  id: string;
  roomId: string;
  userId: number;
  username: string;
  content: string;
  createdAt: string;
}