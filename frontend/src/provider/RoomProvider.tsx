import { useEffect, useState, type ReactNode } from "react";

import { getRooms } from "@/lib/api-rooms";
import { RoomContext } from "@/context/RoomContext";
import type { RoomResponse } from "@/types/room-response";

interface RoomProviderProps {
  children: ReactNode;
}

export function RoomProvider({ children }: RoomProviderProps) {
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshRooms = async () => {
    try {
      const data = await getRooms();

      setRooms(data);
    } catch (error) {
      console.error("Failed to get rooms:", error);
      setRooms([]);
    }
  };

  useEffect(() => {
    const loadRooms = async () => {
      await refreshRooms();
      setLoading(false);
    };

    loadRooms();
  }, []);

  return (
    <RoomContext.Provider
      value={{
        rooms,
        loading,
        refreshRooms,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}
