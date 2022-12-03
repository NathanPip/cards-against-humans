export type Player = {
    name: string,
	score?: number,
    isHost?: boolean,
	CAH?: {
		whites: string[],
		blacks: string[],
		turn: boolean
	}
}