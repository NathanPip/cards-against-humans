import { CAHPack } from "@prisma/client"

export type CAHGame = {
    whites: string[],
    blacks: string[]
}

type GameOptions = {
    pointsToWin: number
} 

export interface CAHGameOptions extends GameOptions {
    whiteCardsPerPlayer: number,
    cardPacks: string[]
}