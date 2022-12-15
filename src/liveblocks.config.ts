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
  currentAction: "waiting" | "drawing" | "judging" | "selecting" | "ready to start" | "revealing";
  CAHWhiteCardIds?: string[];
  CAHBlackCardIds?: string[];
  CAHturn?: boolean;
  CAHCardsPicked?: (Required<Card>)[];
  CAHCardsToPick?: number;
  CAHCardsRevealed?: number;
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
    handsRevealed: number;
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
      | "judge revealing"
      | "starting game"
      | "ending round"
      | "starting round"
      | "ending game";
  }>;
};

type UserMetaData = {name?: string} & BaseUserMeta;

type RoomEvents = { type: "game action" | "judge" | "card revealed" } & {action?: string, data?: {id: string, card: Card}, id?: string};

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
