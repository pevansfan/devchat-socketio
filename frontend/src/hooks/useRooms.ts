import { useContext } from "react";

import { RoomContext } from "@/context/RoomContext";

export function useRooms() {
  const context = useContext(RoomContext);

  if (!context) {
    throw new Error(
      "useRooms must be used inside RoomProvider",
    );
  }

  return context;
}