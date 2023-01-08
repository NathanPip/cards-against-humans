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
      console.log(data);
      if (response.status !== 200) throw new Error("Couldn't create room");
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
          liveblocksType: "LiveObject",
          data:{
            pointsToWin: 10,
            whiteCardsPerPlayer: 10,
          },
        },
        currentHost: undefined,
        whiteCardIds: {liveblocksType: "LiveList", data: []},
        blackCardIds: {liveblocksType: "LiveList", data: []},
        whiteCards: {liveblocksType: "LiveList", data: []},
        blackCards: {liveblocksType: "LiveList", data: []},
        cardsInRound: {liveblocksType: "LiveList", data: []},
        connectedPlayers: {liveblocksType: "LiveList", data: []},
        currentWhiteCard: 0,
        currentBlackCard: 0,
        whiteCardsToPick: 0,
        winner: null,
        started: false,
        currentPlayerDrawing: "",
        currentPlayerTurn: "",
        activeState: "ending game",
      },
    },
  },
};

export const setInitialRoomStorage = async (
  roomId: string,
  initialRoomStorage: InitialRoomStorageParams
): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      initialRoomStorageBody.data.name = initialRoomStorage.name;
      initialRoomStorageBody.data.owner = initialRoomStorage.owner;
      const res = await fetch(`https://api.liveblocks.io/v2/rooms/${roomId}/storage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.LIVEBLOCKS_SECRET_KEY}`,
        },
        body: JSON.stringify(initialRoomStorageBody),
      });
      const data = await res.json();
      console.log(data)
      if(res.status !== 200) throw new Error("Serverless error");
      console.log("the response", data);
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
      id: z.string(),
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
