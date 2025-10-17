"use client";

import { Button } from "../../@providers/components/ui/button";
import { Badge } from "../../@providers/components/ui/badge";
import { Users, RefreshCw } from "lucide-react";
import { ScrollArea } from "../../@providers/components/ui/scroll-area";

interface RoomInfo {
  activeRecording_: boolean;
  creationTime_: number;
  maxParticipants_: number;
  name_: string;
  numParticipants_: number;
}

interface RoomListSidebarProps {
  rooms: RoomInfo[];
  isLoadingRooms: boolean;
  onRefresh: () => void;
}

export function RoomListSidebar({
  rooms,
  isLoadingRooms,
  onRefresh,
}: RoomListSidebarProps) {
  return (
    <aside className="hidden lg:flex lg:flex-col w-80 flex-shrink-0 h-screen sticky top-0 border-r bg-sidebar text-sidebar-foreground">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Users className="size-4" />
            </div>
            <div className="flex min-w-0 flex-col leading-none">
              <span className="font-semibold truncate">Active Rooms</span>
              <span className="text-xs text-muted-foreground truncate">
                {rooms.length} room{rooms.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            disabled={isLoadingRooms}
            className="h-8 w-8"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoadingRooms ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Room List */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {rooms.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No active rooms</p>
              <p className="text-xs mt-1">Click refresh to check again</p>
            </div>
          ) : (
            rooms.map((room, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4
                      className="font-medium text-sm truncate flex-1"
                      title={room.name_}
                    >
                      {room.name_}
                    </h4>
                    {room.activeRecording_ && (
                      <Badge variant="destructive" className="text-xs shrink-0">
                        REC
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>
                        {room.numParticipants_}/{room.maxParticipants_}
                      </span>
                    </div>
                    <span>
                      {new Date(room.creationTime_).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t">
        <Button
          onClick={onRefresh}
          disabled={isLoadingRooms}
          variant="outline"
          className="w-full bg-transparent"
          size="sm"
        >
          {isLoadingRooms ? (
            <>
              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              Loading...
            </>
          ) : (
            <>
              <RefreshCw className="w-3 h-3 mr-2" />
              Refresh Rooms
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
