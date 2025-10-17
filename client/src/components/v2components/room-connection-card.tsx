"use client";

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
import type { Room } from "livekit-client";
import type { AudioModel } from "../../pixels/pixel-calls";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "../../@providers/components/ui/select";

const OPERATIONS = [
  {
    id: "turn_based_transcription",
    name: "Turn-Based Transcription",
  },
  {
    id: "real_time_transcription",
    name: "Real-Time Transcription",
  },
];

interface RoomConnectionCardProps {
  isConnecting: boolean;
  isConnected: boolean;
  room: Room | null;
  error: string | null;
  audioModels: AudioModel[];
  selectedAudioModel: AudioModel | null;
  selectedOperation: string;
  isLoadingAudioModels: boolean;
  audioModelsError: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  onEnableMedia: () => void;
  onAudioModelChange: (model: AudioModel | null) => void;
  onOperationChange: (operation: string) => void;
}

export function RoomConnectionCard({
  isConnecting,
  isConnected,
  room,
  error,
  audioModels,
  selectedAudioModel,
  selectedOperation,
  isLoadingAudioModels,
  audioModelsError,
  onConnect,
  onDisconnect,
  onEnableMedia,
  onAudioModelChange,
  onOperationChange,
}: RoomConnectionCardProps) {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Video className="w-8 h-8 text-primary" />
        </div>
        <div>
          <CardTitle className="text-2xl font-bold">LiveKit Room</CardTitle>
          <CardDescription className="text-muted-foreground">
            Connect to start your session
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
              <span className="font-medium">{room.name || "default-room"}</span>
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

        {/* Audio Model Selector */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Audio Model</div>
          <Select
            disabled={
              isConnecting ||
              isConnected ||
              isLoadingAudioModels ||
              audioModels.length === 0
            }
            value={selectedAudioModel?.id ?? ""}
            onValueChange={(val) => {
              const model = audioModels.find((m) => m.id === val) || null;
              onAudioModelChange(model);
            }}
          >
            <SelectTrigger className="w-full h-10">
              <SelectValue
                placeholder={
                  isLoadingAudioModels
                    ? "Loading audio models..."
                    : audioModels.length === 0
                    ? "No audio models found"
                    : "Select an audio model"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {audioModels.length > 0 && (
                <SelectGroup>
                  <SelectLabel>Available Models</SelectLabel>
                  {audioModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
            </SelectContent>
          </Select>
          {audioModelsError && (
            <div className="text-xs text-destructive">{audioModelsError}</div>
          )}
        </div>

        {/* Operation Selector */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Operation</div>
          <Select
            disabled={isConnecting || isConnected}
            value={selectedOperation}
            onValueChange={onOperationChange}
          >
            <SelectTrigger className="w-full h-10">
              <SelectValue placeholder="Select an operation" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Available Operations</SelectLabel>
                {OPERATIONS.map((op) => (
                  <SelectItem key={op.id} value={op.id}>
                    {op.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Enable Media */}
        <div className="space-y-2">
          <Button
            onClick={onEnableMedia}
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
              onClick={onConnect}
              disabled={isConnecting || !selectedAudioModel}
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
              onClick={onDisconnect}
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
  );
}
