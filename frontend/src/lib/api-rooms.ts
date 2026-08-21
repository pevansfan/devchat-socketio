import type { RoomResponse } from "@/types/room-response";
import type { Room } from "../../../backend/src/types/room";


const API_URL = "http://localhost:3000/api";

export async function getRooms(): Promise<Room[]> {
  const response = await fetch(`${API_URL}/rooms`);

  if (!response.ok) {
    throw new Error("Impossible de récupérer les rooms");
  }

  return response.json();
}

export const getRoom = async (
  roomId: string,
): Promise<RoomResponse> => {
  const response = await fetch(
    `${API_URL}/rooms/${roomId}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to get room: ${response.status}`);
  }

  return response.json();
};