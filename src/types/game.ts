import { LiveObject, type LiveList } from "@liveblocks/client"

export type CAHGame = {
    whites: string[],
    blacks: string[]
}

export type CAHGameOptions = LiveObject<{
    pointsToWin: number
    whiteCardsPerPlayer: number,
    cardPacks: LiveList<string>
}>