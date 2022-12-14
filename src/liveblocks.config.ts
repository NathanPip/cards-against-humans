import {
  type BaseUserMeta,
  createClient,
  type LiveObject,
} from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import { type Card, type CAHGameOptions } from "./types/game";

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
  CAHCardsPicked?: (Required<Card>)[];
  CAHCardsToPick?: number;
};

export type Storage = {
  name: string;
  owner: string;
  currentGame: null | "Cards Against Humanity";
  CAH: LiveObject<{
    options: CAHGameOptions;
    whiteCards: Card[];
    blackCards: Card[];
    cardsInRound: {cards: Required<Card>[], playerId: string}[] | undefined;
    playerHands: Record<string, Card[]>;
    currentWhiteCardIndex: number | undefined;
    currentBlackCard: Card;
    whiteCardsToPick: number | undefined;
    connectedPlayers: string[];
    currentPlayerDrawing: string | undefined;
    currentPlayerTurn: string | undefined;
    activeState:
      "dealing whites"
      | "waiting for players"
      | "waiting for judge"
      | "starting game"
      | "ending round"
      | "starting round"
      | "ending game";
  }>;
};

type UserMetaData = {name?: string} & BaseUserMeta;

type RoomEvents = { type: "game action" | "judge" } & {action?: string, data?: {id: string, card: Card}};

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
} = createRoomContext<Presence, Storage, UserMetaData, RoomEvents >(client);
