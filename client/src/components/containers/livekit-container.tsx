import { useState } from "react";
import { Button } from "../../@providers/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../@providers/components/ui/card";
import { Badge } from "../../@providers/components/ui/badge";
import { Video, Users, Wifi, WifiOff, Mic } from "lucide-react";
import { liveKitGetToken, liveKitListRooms } from "../../pixels/pixel-calls";
import { Room, RoomEvent } from "livekit-client";
import { setLogLevel, LogLevel } from "livekit-client";
setLogLevel(LogLevel.debug);

type LiveKitContainerProps = {
  // Optional callback: your method to enable media. Receives the current Room (or null if not connected).
  onEnableMedia?: (room: Room | null) => Promise<void> | void;
};

interface RoomInfo {
  activeRecording_: boolean;
  creationTime_: number;
  maxParticipants_: number;
  name_: string;
  numParticipants_: number;
}

const LiveKitContainer: React.FC<LiveKitContainerProps> = ({
  onEnableMedia,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [roomName, setRoomName] = useState("");
  const [roomState, setRoomState] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);

  const connectToExistingRoom = async (roomId: String) => {
    try {
      setIsConnecting(true);
      const existingRoom = new Room({
        adaptiveStream: true,
        dynacast: true,
      });
    } catch (err) {
      console.error("Failed to connect to room:", err);
      setError(
        err instanceof Error ? err.message : "Failed to connect to room"
      );
      setIsConnecting(false);
    }
  };

  const connectToRoom = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      const newRoom = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      newRoom.on(RoomEvent.Connected, () => {
        console.log("Connected to room", newRoom.name);
        setIsConnected(true);
        setIsConnecting(false);
      });

      newRoom.on(RoomEvent.Disconnected, () => {
        console.log("Disconnected from room");
        setIsConnected(false);
        setRoom(null);
      });

      const finalRoomName = roomName.trim() || `room-${Date.now()}`;
      console.log("Room name: ", finalRoomName);

      const response = await liveKitGetToken(finalRoomName);
      const token = response.jwt || (response["jwt"] as string);

      const liveKitUrl = process.env.LIVEKIT_URL;

      if (!liveKitUrl) {
        throw new Error("LIVEKIT_URL is not defined in environment variables");
      }

      await newRoom.connect(liveKitUrl, token);

      setRoom(newRoom);
    } catch (err) {
      console.error("Failed to connect to room:", err);
      setError(
        err instanceof Error ? err.message : "Failed to connect to room"
      );
      setIsConnecting(false);
    }
  };

  const enableCameraAndMic = async () => {
    if (room) {
      await room.localParticipant.enableCameraAndMicrophone();
    }
  };

  const handleEnableMediaClick = async () => {
    try {
      if (onEnableMedia) {
        await onEnableMedia(room);
      } else {
        await enableCameraAndMic();
      }
    } catch (e) {
      console.error("Failed to enable media:", e);
      setError(
        e instanceof Error
          ? e.message
          : "Failed to enable camera and microphone"
      );
    }
  };

  const disconnectFromRoom = () => {
    if (room) {
      room.disconnect();
    }
  };

  const handleListRooms = async () => {
    try {
      setIsLoadingRooms(true);
      const roomsData = await liveKitListRooms();
      console.log("Available rooms:", roomsData);
      setRooms(roomsData as RoomInfo[]);
    } catch (err) {
      console.error("Failed to list rooms:", err);
    } finally {
      setIsLoadingRooms(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="space-y-4 w-full max-w-md">
        <Card className="w-full shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Video className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">LiveKit Room</CardTitle>
              <CardDescription className="text-muted-foreground">
                Connect to start your video session
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Connection Status */}
            <div className="flex items-center justify-center gap-2">
              {isConnected ? (
                <Badge
                  variant="default"
                  className="bg-green-500/10 text-green-600 border-green-500/20"
                >
                  <Wifi className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-muted">
                  <WifiOff className="w-3 h-3 mr-1" />
                  Disconnected
                </Badge>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive text-center">{error}</p>
              </div>
            )}

            {/* Room Info */}
            {room && isConnected && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Room:</span>
                  <span className="font-medium">
                    {room.name || "default-room"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Participants:</span>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span className="font-medium">{room.numParticipants}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Enable Media */}
            <div className="space-y-2">
              <Button
                onClick={handleEnableMediaClick}
                disabled={!isConnected || !room}
                variant="secondary"
                className="w-full h-10"
                size="sm"
              >
                <Mic className="w-4 h-4 mr-2" /> Enable Camera & Mic
              </Button>
            </div>

            {/* Connect/Disconnect Button */}
            <div className="space-y-2">
              {!isConnected ? (
                <Button
                  onClick={connectToRoom}
                  disabled={isConnecting}
                  className="w-full h-12 text-base font-medium"
                  size="lg"
                >
                  {isConnecting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Video className="w-4 h-4 mr-2" />
                      Connect to Room
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={disconnectFromRoom}
                  variant="destructive"
                  className="w-full h-12 text-base font-medium"
                  size="lg"
                >
                  <WifiOff className="w-4 h-4 mr-2" />
                  Disconnect
                </Button>
              )}
            </div>

            {/* Connection Details */}
            <div className="text-xs text-muted-foreground text-center space-y-1">
              <p>Using adaptive streaming and dynacast optimization</p>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                Room Management
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                List all available rooms
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button
              onClick={handleListRooms}
              disabled={isLoadingRooms}
              variant="outline"
              className="w-full h-12 text-base font-medium"
              size="lg"
            >
              {isLoadingRooms ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 mr-2" />
                  List Rooms
                </>
              )}
            </Button>

            {rooms.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2 font-medium">Name</th>
                      <th className="text-center py-2 px-2 font-medium">
                        Participants
                      </th>
                      <th className="text-center py-2 px-2 font-medium">
                        Recording
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((room, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td
                          className="py-2 px-2 truncate max-w-[150px]"
                          title={room.name_}
                        >
                          {room.name_}
                        </td>
                        <td className="py-2 px-2 text-center">
                          {room.numParticipants_}/{room.maxParticipants_}
                        </td>
                        <td className="py-2 px-2 text-center">
                          {room.activeRecording_ ? (
                            <Badge variant="destructive" className="text-xs">
                              Recording
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveKitContainer;
