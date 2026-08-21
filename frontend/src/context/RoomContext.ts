import { createContext } from "react";

import type { RoomResponse } from "@/types/room-response";

export interface RoomContextType {
  rooms: RoomResponse[];
  loading: boolean;
  refreshRooms: () => Promise<void>;
}

export const RoomContext =
  createContext<RoomContextType | undefined>(undefined);