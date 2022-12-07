import { createClient, type LiveList, type LiveObject } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

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
  currentGame: null | "CAH";
  CAH: LiveObject<{
    options: LiveObject<{
      pointsToWin: number;
      whiteCardsPerPlayer: number;
      cardPacks: LiveList<string>;
    }>
    currentPlayableBlacks?: LiveList<
      LiveObject<{ id: string; type: "black"; text: string; packId: string }>
    >;
    currentPlayableWhites?: LiveList<
      LiveObject<{ id: string; type: "white"; text: string; packId: string }>
    >;
  }>;
};

export const {
  suspense: { RoomProvider, useMyPresence, useOthers, useStorage, useMutation },
} = createRoomContext<Presence, Storage>(client);
