import {
  createClient,
  type LiveList,
  type LiveObject,
} from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import { type CAHWhiteCard } from "@prisma/client";
import { type CAHGameOptions } from "./types/game";

const client = createClient({
  authEndpoint: "/api/liveblocksauth",
});

export type Presence = {
  name: string;
  score?: number;
  isHost?: boolean;
  currentAction: "waiting" | "drawing" | "judging" | "selecting";
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
    whiteCards: LiveList<{id: string, text: string}>;
    blackCards: LiveList<{id: string, text: string}>;
    connectedPlayers: LiveList<string>;
    currentPlayerDrawing: string | undefined;
    currentCard: number | undefined;
    currentBlackCard: number | undefined;
    activeState:
      "dealing whites"
      | "waiting for players"
      | "waiting for judge"
      | "starting game"
      | "ending game";
    currentPlayerTurn: string | undefined;
    cardsInRound: LiveList<Pick<CAHWhiteCard, "id" | "text">> | undefined;
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
    useBroadcastEvent,
    useEventListener
  },
} = createRoomContext<Presence, Storage>(client);
