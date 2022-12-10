import { type LiveObject, type LiveList } from "@liveblocks/client"

export type CAHGameOptions = LiveObject<{
    pointsToWin: number
    whiteCardsPerPlayer: number,
}>