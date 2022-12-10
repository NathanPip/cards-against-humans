import { z } from "zod";
import { env } from "../../env/server.mjs";

type CreateRoomParams = {
  id: string;
  defaultAccesses: [] | ["room:write"];
  userAccesses?: { [key: string]: [] | ["room:write"] };
  groupAccesses?: { [key: string]: [] | ["room:write"] };
};

type CreateRoomResponse = {
  type: string;
  id: string;
  lastConnectionAt: string;
  createdAt: string;
  defaultAccesses: [] | ["room:write"];
  metadata?: object;
  userAccesses?: { [key: string]: [] | ["room:write"] };
  groupAccesses?: { [key: string]: [] | ["room:write"] };
};

export const createRoom = async (
  params: CreateRoomParams
): Promise<CreateRoomResponse> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`https://api.liveblocks.io/v2/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.LIVEBLOCKS_SECRET_KEY}`,
        },
        body: JSON.stringify(params),
      });
      const data = (await response.json()) as CreateRoomResponse;
      resolve(data);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

type InitialRoomStorageParams = {
  name: string;
  owner: string;
};

const initialRoomStorageBody = {
  liveblocksType: "LiveObject",
  data: {
    name: "",
    owner: "",
    currentGame: null,
    CAH: {
      liveblocksType: "LiveObject",
      data: {
        options: {
          pointsToWin: 10,
          whiteCardsPerPlayer: 10,
          cardPacks: {
            liveblocksType: "LiveList",
            data: [],
          },
        },
        currentPlayableBlacks: {
          liveblocksType: "LiveList",
          data: [],
        },
        currentPlayableWhites: {
          liveblocksType: "LiveList",
          data: [],
        },
      },
    },
  },
};

const initialRoomStorageBodyParser = z.object({
  liveblocksType: z.literal("LiveObject"),
  data: z.object({
    name: z.string(),
    owner: z.string().cuid(),
    currentGame: z.literal("Cards Against Humanity").nullish(),
    CAH: z.object({
      liveblocksType: z.literal("LiveObject"),
      data: z.object({
        options: z.object({
          pointsToWin: z.number().min(1).max(100),
          whiteCardsPerPlayer: z.number().min(1).max(25),
          cardPacks: z.object({
            liveblocksType: z.literal("LiveList"),
            data: z.array(z.string()),
          }),
        }),
        
      }),
    }),
  }),
});

export const setInitialRoomStorage = async (
  roomId: string,
  initialRoomStorage: InitialRoomStorageParams
): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      initialRoomStorageBody.data.name = initialRoomStorage.name;
      initialRoomStorageBody.data.owner = initialRoomStorage.owner;

      const parsedInitialStorageBody = initialRoomStorageBodyParser.parse(
        initialRoomStorageBody
      );

      await fetch(`https://api.liveblocks.io/v2/rooms/${roomId}/storage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.LIVEBLOCKS_SECRET_KEY}`,
        },
        body: JSON.stringify(parsedInitialStorageBody),
      });
      resolve(true);
    } catch (error) {
      reject(error);
      console.log(error);
    }
  });
};

type GetExistingRoomResponse = {
  type: "room";
  id: string;
  lastConnectionAt: string;
  createdAt: string;
  metadata?: object;
  defaultAccesses: [] | ["room:write"];
  userAccesses?: { [key: string]: [] | ["room:write"] };
  groupAccesses?: { [key: string]: [] | ["room:write"] };
};

export const getExistingRoom = async (
  roomId: string
): Promise<GetExistingRoomResponse> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `https://api.liveblocks.io/v2/rooms/${roomId}`,
        {}
      );
      const data = (await response.json()) as GetExistingRoomResponse;
      resolve(data);
    } catch (error) {
      reject(error);
      console.log(error);
    }
  });
};

const existingPlayersBodyParser = z.object({
  data: z.array(
    z.object({
      type: z.literal("user"),
      connectionId: z.number(),
      id: z.string().uuid(),
      info: z.object({}).nullish(),
    })
  ),
});

type ExistingPlayersBody = typeof existingPlayersBodyParser._output.data;

export const getConnectedPlayers = async (
  roomId: string
): Promise<ExistingPlayersBody> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `https://api.liveblocks.io/v2/rooms/${roomId}/active_users`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${env.LIVEBLOCKS_SECRET_KEY}`,
          },
        }
      );
      const data = await response.json();
      const parsedData = existingPlayersBodyParser.parse(data);
      resolve(parsedData.data);
    } catch (error) {
      reject(error);
      console.log(error);
    }
  });
};
