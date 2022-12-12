import { type LiveObject, type LiveList } from "@liveblocks/client"
import { CAHWhiteCard } from "@prisma/client"

export type CAHGameOptions = LiveObject<{
    pointsToWin: number
    whiteCardsPerPlayer: number,
}>

export type Card = Pick<CAHWhiteCard, "id" | "text">