import {
  createClient,
  type LiveList,
  type LiveObject,
} from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import { type CAHGameOptions } from "./types/game";

const client = createClient({
  authEndpoint: "/api/liveblocksauth",
});

export type Presence = {
  name: string;
  score?: number;
  isHost?: boolean;
  currentAction: string;
  CAHWhiteCardIds?: string[];
  CAHBlackCardIds?: string[];
  CAHturn?: boolean;
};

export type Storage = {
  name: string;
  owner: string;
  currentGame: null | "Cards Against Humanity";
  CAH: LiveObject<{
    options: CAHGameOptions;
    whiteCardIds: LiveList<string>;
    blackCardIds: LiveList<string>;
    connectedPlayers: LiveList<string>;
    currentPlayerDrawing: string | undefined;
    currentCard: number | undefined;
    activeState:
      | "dealing whites"
      | "dealing blacks"
      | "waiting for players"
      | "waiting for judge"
      | "starting game"
      | "ending game";
  }>;
};

export const {
  suspense: {
    RoomProvider,
    useMyPresence,
    useSelf,
    useOthersMapped,
    useStorage,
    useMutation,
    useUpdateMyPresence,
  },
} = createRoomContext<Presence, Storage>(client);
