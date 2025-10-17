import { runPixel, partial } from "@semoss/sdk";

export const getUserProjectList = async () => {
  const { errors, pixelReturn } = await runPixel(`GetProjectList();`);

  if (errors.length > 0) {
    throw new Error(errors.join(""));
  }
  const { output } = pixelReturn[0];

  return output;
};

export const getUserInfo = async () => {
  const { errors, pixelReturn } = await runPixel(`GetUserInfo();`);

  if (errors.length > 0) {
    throw new Error(errors.join(""));
  }
  const { output } = pixelReturn[0];

  return output;
};

export const getOpenInsights = async () => {
  const { errors, pixelReturn } = await runPixel(`MyOpenInsights();`);

  if (errors.length > 0) {
    throw new Error(errors.join(""));
  }
  const { output } = pixelReturn[0];

  return output;
};

export const getAvailableEngines = async () => {
  const { errors, pixelReturn } = await runPixel(
    `MyEngines ( engineTypes = [ "MODEL" ] ) ;`
  );

  if (errors.length > 0) {
    throw new Error(errors.join(""));
  }
  const { output } = pixelReturn[0];

  return output;
};

interface LiveKitTokenResponse {
  jwt: string;
  roomId: string;
}

export const liveKitGetToken = async (
  engineId: string,
  operation: string,
  roomName: string
): Promise<LiveKitTokenResponse> => {
  let pixel = `LiveKitJoinRoom()`;
  if (roomName != null) {
    pixel = `LiveKitJoinRoom(engine=["${engineId}"], operation=["${operation}"], roomId=["${roomName}"])`;
  }
  const { errors, pixelReturn } = await runPixel(pixel);

  if (errors.length > 0) {
    throw new Error(errors.join(""));
  }
  const { output } = pixelReturn[0];
  return output as LiveKitTokenResponse;
};

export const liveKitListRooms = async () => {
  const pixel = `LiveKitListRoomsAdmin()`;
  const { errors, pixelReturn } = await runPixel(pixel);
  if (errors.length > 0) {
    throw new Error(errors.join(""));
  }
  const { output } = pixelReturn[0];
  return output;
};

export const liveKitListParticipants = async () => {
  const pixel = `LiveKitListParticipants()`;

  const { errors, pixelReturn } = await runPixel(pixel);
  if (errors.length > 0) {
    throw new Error(errors.join(""));
  }
  const { output } = pixelReturn[0];
  return output;
};

export interface AudioModel {
  id: string;
  name: string;
}

export const getAudioModels = async () => {
  const pixel = `MyEngines(engineTypes = [ "MODEL" ]);`;

  const { errors, pixelReturn } = await runPixel(pixel);
  if (errors.length > 0) {
    throw new Error(errors.join(""));
  }
  const { output } = pixelReturn[0];

  let audioModels: AudioModel[] = (output as any[])
    .filter((model: any) => model?.tag === "audio")
    .map((model: any) => ({
      id: model.database_id,
      name: model.database_name,
    }));

  return audioModels;
};
