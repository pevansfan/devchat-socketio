import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { getRoom } from "@/lib/api-rooms";
import type { RoomResponse } from "@/types/room-response";
import ChatLayout from "@/components/chat/layout";
import { useAuth } from "@/hooks/useAuth";
import { socket } from "@/lib/api-socket";

import type { Message } from "../../../backend/src/types/message";
import { MessageList } from "@/components/chat/message-group";

interface SocketUser {
  id: string;
  username: string;
}

export default function RoomChat() {
  const { roomId } = useParams<{ roomId: string }>();

  const { user, loading } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");

  const [room, setRoom] = useState<RoomResponse | null>(null);
  const [error, setError] = useState("");

  const [users, setUsers] = useState<SocketUser[]>([]);

  useEffect(() => {
    if (!roomId) {
      return;
    }

    const loadRoom = async () => {
      try {
        const data = await getRoom(roomId);

        setRoom(data);
      } catch (error) {
        console.error("Failed to load room:", error);

        setError("Failed to load room");
      }
    };

    loadRoom();
  }, [roomId]);

  useEffect(() => {
    if (!roomId) {
      return;
    }

    const handleHistory = (history: Message[]) => {
      console.log("📜 Room history:", history);

      setMessages(history);
    };

    const handleNewMessage = (message: Message) => {
      console.log("💬 New message:", message);

      setMessages((currentMessages) => [...currentMessages, message]);
    };

    const handleUsers = (users: SocketUser[]) => {
      console.log("👥 Users:", users);

      setUsers(users);
    };

    const handleRoomError = (message: string) => {
      console.error("❌ Room error:", message);

      setError(message);
    };

    const joinRoom = () => {
      console.log("🔌 Socket connected:", socket.id);
      console.log("🚪 Joining room:", roomId);

      socket.emit("room:join", {
        roomId: String(roomId),
      });
    };

    socket.on("room:history", handleHistory);
    socket.on("message:new", handleNewMessage);
    socket.on("room:users", handleUsers);
    socket.on("room:error", handleRoomError);

    socket.on("connect", joinRoom);

    if (socket.connected) {
      joinRoom();
    }

    return () => {
      socket.off("room:history", handleHistory);
      socket.off("message:new", handleNewMessage);
      socket.off("room:users", handleUsers);
      socket.off("room:error", handleRoomError);
      socket.off("connect", joinRoom);
    };
  }, [roomId]);

  /**
   * Envoie un message dans la room.
   */
  const sendMessage = () => {
    if (!roomId) {
      return;
    }

    const trimmedMessage = message.trim(); // espaces blancs

    if (!trimmedMessage) {
      return;
    }

    socket.emit("message:send", {
      roomId,
      body: trimmedMessage,
    });

    setMessage("");
  };

  /**
   * Gestion de la soumission du formulaire.
   */
  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    sendMessage();
  };

  if (!roomId) {
    return <div>Room ID is missing</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!room) {
    return <div>Room not found</div>;
  }

  return (
    <ChatLayout members={users}>
      <div className="flex h-full min-h-0 flex-col gap-4">
        {/* Informations */}
        {/* <div>
          <h1>Bonjour {user?.user.username}</h1>

          <p>{room.description}</p>

          <p>Room ID: {roomId}</p>

          <p>Utilisateurs connectés : {users.length}</p>
        </div> */}

        <div className="min-h-0 flex-1 overflow-y-auto">
          <MessageList
            messages={messages}
            currentUsername={user?.user.username}
          />
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Écrire un message..."
            className="min-w-0 flex-1 rounded-md border bg-background px-3 py-2"
          />

          <button
            type="submit"
            disabled={!message.trim()}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
          >
            Envoyer
          </button>
        </form>
      </div>
    </ChatLayout>
  );
}
