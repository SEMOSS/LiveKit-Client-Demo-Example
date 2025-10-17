import type React from "react";
import { useEffect, useState } from "react";
import { liveKitGetToken, liveKitListRooms } from "../../pixels/pixel-calls";
import { Room, RoomEvent, Track } from "livekit-client";
import { getAudioModels, type AudioModel } from "../../pixels/pixel-calls";
import { setLogLevel, LogLevel } from "livekit-client";
import { RoomConnectionCard } from "../v2components/room-connection-card";
import { TranscriptionPanel } from "../v2components/transcription-panel";
import { RoomListSidebar } from "../v2components/room-list-sidebar";

setLogLevel(LogLevel.debug);

type LiveKitContainerProps = {
  onEnableMedia?: (room: Room | null) => Promise<void> | void;
};

interface RoomInfo {
  activeRecording_: boolean;
  creationTime_: number;
  maxParticipants_: number;
  name_: string;
  numParticipants_: number;
}

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

const LiveKitContainer: React.FC<LiveKitContainerProps> = ({
  onEnableMedia,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [roomName, setRoomName] = useState("");
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState("");
  const [audioModels, setAudioModels] = useState<AudioModel[]>([]);
  const [selectedAudioModel, setSelectedAudioModel] =
    useState<AudioModel | null>(null);
  const [selectedOperation, setSelectedOperation] = useState<string>(
    OPERATIONS[0].id
  );
  const [isLoadingAudioModels, setIsLoadingAudioModels] = useState(false);
  const [audioModelsError, setAudioModelsError] = useState<string | null>(null);
  const [isMediaEnabled, setIsMediaEnabled] = useState(false);

  useEffect(() => {
    let isSubscribed = true;
    const load = async () => {
      try {
        setIsLoadingAudioModels(true);
        setAudioModelsError(null);
        const models = await getAudioModels();
        if (!isSubscribed) return;
        setAudioModels(models);
        if (models && models.length > 0) {
          setSelectedAudioModel(models[0]);
        }
      } catch (e) {
        if (!isSubscribed) return;
        console.error("Failed to load audio models", e);
        setAudioModelsError(
          e instanceof Error ? e.message : "Failed to load audio models"
        );
      } finally {
        if (isSubscribed) setIsLoadingAudioModels(false);
      }
    };
    load();
    return () => {
      isSubscribed = false;
    };
  }, []);

  useEffect(() => {
    handleListRooms();
  }, []);

  const connectToRoom = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      setIsMediaEnabled(false);

      const newRoom = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      newRoom.on(RoomEvent.Connected, () => {
        console.log("Connected to room", newRoom.name);
        setIsConnected(true);
        setIsConnecting(false);
        handleListRooms();
      });

      newRoom.on(RoomEvent.Disconnected, () => {
        console.log("Disconnected from room");
        setIsConnected(false);
        setRoom(null);
        setIsMediaEnabled(false);
        handleListRooms();
      });

      newRoom.on(RoomEvent.DataReceived, (payload, participant) => {
        const decoder = new TextDecoder();
        const jsonString = decoder.decode(payload);
        const data = JSON.parse(jsonString);

        if (data.type === "transcription") {
          console.log(
            `Received transcription from ${participant?.identity}:`,
            data.text
          );
          setTranscriptionText((prev) => prev + (prev ? " " : "") + data.text);
        }
      });

      newRoom.on(RoomEvent.AudioPlaybackStatusChanged, (playing) => {
        console.log("AudioPlaybackStatusChanged:", playing);
      });

      newRoom.on(
        RoomEvent.TrackSubscribed,
        (track, publication, participant) => {
          console.log(
            "TrackSubscribed:",
            participant.identity,
            publication.kind
          );
          if (track.kind === Track.Kind.Audio) {
            console.log("Subscribed to remote audio; should be audible now.");
            const el = track.attach();
            el.autoplay = true;
            el.muted = false;
            document.body.appendChild(el);
            console.log("Attached remote bot audio from", participant.identity);
          }
        }
      );

      const finalRoomName = roomName.trim() || `room-${Date.now()}`;
      const engineId = selectedAudioModel?.id;
      const operation = selectedOperation;

      if (!engineId) {
        throw new Error("No audio model selected");
      }

      const response = await liveKitGetToken(
        engineId,
        operation,
        finalRoomName
      );
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
      try {
        await room.startAudio();
        console.log("startAudio(): playing");
        await room.localParticipant.enableCameraAndMicrophone();
      } catch (error) {
        console.log("startAudio(): blocked", error);
      }
    }
  };

  const handleEnableMediaClick = async () => {
    try {
      if (onEnableMedia) {
        await onEnableMedia(room);
      } else {
        await enableCameraAndMic();
      }
      setIsMediaEnabled(true);
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
      setTranscriptionText("");
    }
    setIsMediaEnabled(false);
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
    <div className="flex min-h-screen">
      {/* Sidebar with room list */}
      <RoomListSidebar
        rooms={rooms}
        isLoadingRooms={isLoadingRooms}
        onRefresh={handleListRooms}
      />

      {/* Main content area */}
      <div className="flex-1 flex  justify-center bg-gradient-to-br from-background to-muted/20 p-4">
        <div className="w-full max-w-md">
          <RoomConnectionCard
            isConnecting={isConnecting}
            isConnected={isConnected}
            room={room}
            error={error}
            audioModels={audioModels}
            selectedAudioModel={selectedAudioModel}
            selectedOperation={selectedOperation}
            isLoadingAudioModels={isLoadingAudioModels}
            audioModelsError={audioModelsError}
            isMediaEnabled={isMediaEnabled}
            onConnect={connectToRoom}
            onDisconnect={disconnectFromRoom}
            onEnableMedia={handleEnableMediaClick}
            onAudioModelChange={setSelectedAudioModel}
            onOperationChange={setSelectedOperation}
          />
        </div>
      </div>

      {/* Floating transcription panel */}
      {isConnected && (
        <TranscriptionPanel
          transcriptionText={transcriptionText}
          onClear={() => setTranscriptionText("")}
        />
      )}
    </div>
  );
};

export default LiveKitContainer;
