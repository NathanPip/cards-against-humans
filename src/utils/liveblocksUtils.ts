import type { CAHBlackCard, CAHWhiteCard } from "@prisma/client";
import { env } from "../env/server.mjs";

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
          cardPacks: [],
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

export const setInitialRoomStorage = async (
  roomId: string,
  initialRoomStorage: InitialRoomStorageParams
): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      initialRoomStorageBody.data.name = initialRoomStorage.name;
      initialRoomStorageBody.data.owner = initialRoomStorage.owner;
      const storageRes = await fetch(
        `https://api.liveblocks.io/v2/rooms/${roomId}/storage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.LIVEBLOCKS_SECRET_KEY}`,
          },
          body: JSON.stringify(initialRoomStorageBody),
        }
      );
      const data = (await storageRes.json()) as typeof initialRoomStorageBody;
      console.log(data);
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
  lastConnectionAt: Date;
  createdAt: Date;
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
