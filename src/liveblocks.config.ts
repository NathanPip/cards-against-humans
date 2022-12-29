import {
  type BaseUserMeta,
  createClient,
  type LiveObject,
} from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import { type Card, type CAHGameOptions } from "./types/game";

const client = createClient({
  authEndpoint: async (room) => {
    const response = await fetch("/api/liveblocksauth", {
      method: "POST",
      headers: {
        Authentication: "token",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ room }),
    });
    return await response.json();
  },
});

export type Presence = {
  name: string;
  score?: number;
  isHost?: boolean;
  canPlay: boolean;
  currentAction:
    | "waiting"
    | "drawing"
    | "judging"
    | "selecting"
    | "ready to start"
    | "revealing";
  CAHWhiteCardIds?: string[];
  CAHBlackCardIds?: string[];
  CAHturn?: boolean;
  CAHCardsPicked?: Required<Card>[];
  CAHCardsToPick?: number;
  CAHCardsRevealed?: number;
};

export type Storage = {
  name: string;
  owner: string;
  currentGame: null | "Cards Against Humanity";
  CAH: LiveObject<{
    options: CAHGameOptions;
    started: boolean;
    winner: string | null;
    whiteCards: Card[];
    blackCards: Card[];
    cardsInRound: { cards: Required<Card>[]; playerId: string }[] | undefined;
    playerHands: Record<string, Card[]>;
    handsRevealed: number;
    currentWhiteCardIndex: number | undefined;
    currentBlackCard: Card;
    currentHost: string | undefined;
    whiteCardsToPick: number | undefined;
    connectedPlayers: string[];
    currentPlayerDrawing: string | undefined;
    currentPlayerTurn: string | undefined;
    activeState:
      | "dealing whites"
      | "starting game"
      | "waiting for players"
      | "players picked"
      | "judge revealing"
      | "waiting for judge"
      | "ending round"
      | "waiting for players to draw"
      | "ready to start round"
      | "starting round"
      | "ending game"
      | "game over"
  }>;
};

type UserMetaData = { name?: string } & BaseUserMeta;

type RoomEvents = {
  type:
    | "game action"
    | "judge"
    | "card revealed"
    | "next card"
    | "player action"
    | "disconnect player";
} & { action?: string; data?: { id: string; card: Card }; id?: string };

export const {
  suspense: {
    RoomProvider,
    useMyPresence,
    useSelf,
    useOthersMapped,
    useOthers,
    useStorage,
    useMutation,
    useUpdateMyPresence,
    useBroadcastEvent,
    useEventListener,
  },
} = createRoomContext<Presence, Storage, UserMetaData, RoomEvents>(client);
