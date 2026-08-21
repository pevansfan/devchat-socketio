import { useEffect } from "react";
import { useNavigate } from "react-router";

import { getCurrentUser } from "@/lib/api-auth";

export default function Test() {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectToRoom = async () => {
      try {
        const { user, roomId } = await getCurrentUser();

        console.log("Connected user:", user);
        console.log("Room ID:", roomId);

        navigate(`/rooms/${roomId}`, {
          replace: true,
        });
      } catch (error) {
        console.error("Failed to get current user:", error);

        navigate("/login", {
          replace: true,
        });
      }
    };

    redirectToRoom();
  }, [navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p>Connecting...</p>
    </main>
  );
}