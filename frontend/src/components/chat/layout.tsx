import { useParams } from "react-router";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import ChatBar from "./chat-bar";
import MembersBar from "./members-bar";
import type { Member } from "./members-bar";

import { useRooms } from "@/hooks/useRooms";

export default function ChatLayout({
  children,
  members = [],
}: {
  children: React.ReactNode;
  members?: Member[];
}) {
  const { roomId } = useParams();

  const { rooms, loading } = useRooms();

  const currentRoom = rooms.find((room) => String(room.id) === roomId);

  return (
    <SidebarProvider className="w-full">
      <AppSidebar />

      <main className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        <ChatBar
          roomName={loading ? "Loading..." : (currentRoom?.name ?? "Room")}
        />

        <div className="flex min-h-0 min-w-0 flex-1">
          <div className="min-w-0 flex-1 overflow-y-auto p-5">{children}</div>

          <aside className="hidden w-72 shrink-0 border-l border-accent p-5 lg:block">
            <MembersBar members={members} />
          </aside>
        </div>
      </main>
    </SidebarProvider>
  );
}
