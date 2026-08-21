"use client";

import { HelpCircle, Settings } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useRooms } from "@/hooks/useRooms";
import { useAuth } from "@/hooks/useAuth";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Logo from "./logo";

// Remplace par ta vraie source de données (props, store, fetch...

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const { rooms, loading } = useRooms();
  return (
    <Sidebar className="relative border-r border-accent bg-[#0a0e17] text-slate-300">
      <SidebarHeader className="gap-3 px-4 py-4">
        <div className="flex flex-col gap-3">
          <Logo />
          {user && (
            <p className="flex items-center gap-1.5 text-[11px] text-emerald-400/90">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Connecté
            </p>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="font-mono text-[11px] uppercase tracking-wider text-slate-500">
            Channels
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {!loading &&
                rooms.map((room) => {
                  const isActive = location.pathname === `/rooms/${room.id}`;

                  return (
                    <SidebarMenuItem
                      key={room.id}
                      onClick={() => navigate(`/rooms/${room.id}`)}
                    >
                      <SidebarMenuButton
                        isActive={isActive}
                        className="font-mono data-[active=true]:bg-cyan-400/10 data-[active=true]:text-cyan-300 data-[active=true]:font-medium"
                      >
                        <span># {room.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-1 px-2 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="font-mono text-slate-400">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="font-mono text-slate-400">
              <HelpCircle className="h-4 w-4" />
              <span>Support</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
