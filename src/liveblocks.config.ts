import { createClient, type LiveList, type LiveObject } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import { CAHGameOptions } from "./types/game";

const client = createClient({
  publicApiKey:
    "pk_dev_QITbJuUdEm4yTqHo3K0X8C9wj_zUhT6zde13RVdNBg9GI2iYSgfQPpQnDhpNgD44",
});

export type Presence = {
  name: string;
  score?: number;
  isHost?: boolean;
  CAH?: {
    whites: string[];
    blacks: string[];
    turn: boolean;
  };
};

export type Storage = {
  name: string;
  owner: string;
  currentGame: null | "Cards Against Humanity";
  CAH: LiveObject<{
    options: CAHGameOptions
  }>;
};

export const {
  suspense: { RoomProvider, useMyPresence, useOthers, useStorage, useMutation },
} = createRoomContext<Presence, Storage>(client);
