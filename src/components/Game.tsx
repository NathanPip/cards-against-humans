import { type inferRouterOutputs } from "@trpc/server";
import { useRef, useState } from "react";
import { useMutation as liveblocksMutation} from "../liveblocks.config";
import { type AppRouter } from "../server/trpc/router/_app";
import { CAHGameOptions } from "../types/game";
import { trpc } from "../utils/trpc"

type GameProps = {
    name: "Cards Against Humanity"
}

const Game: React.FC<GameProps> = ({name}) => {

    const gameInfo = trpc.game.getBasicGameInfo.useQuery({name});

    if(gameInfo.isLoading) return <div>Loading...</div>

    if(gameInfo.isError || !gameInfo.data) return <div>Error</div>

    return (
    <div>
        <h1>{name}</h1>
        <CAHOptions data={gameInfo.data}/>
    </div>)
}

type CAHOptionsProps = {data: inferRouterOutputs<AppRouter>['game']['getBasicGameInfo']};


const CAHOptions: React.FC<CAHOptionsProps> = ({data}) => {

    const pointsToWinInput = useRef<HTMLInputElement>(null);
    const cardsPerPlayerInput = useRef<HTMLInputElement>(null);
    const cardPacksSelect = useRef<HTMLSelectElement>(null);

    const setOptions = liveblocksMutation(({storage}, options: CAHGameOptions) => {
        storage.get("CAH").set("options", options);
    }, [])

    const setisPlaying = liveblocksMutation(({storage}) => {
        if(storage.get("currentGame"))
            storage.set("currentGame", "CAH");
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const pointsToWin = pointsToWinInput.current?.value;
        const cardsPerPlayer = cardsPerPlayerInput.current?.value;
        const cardPacks = cardPacksSelect.current?.value;
        
        const gameOptions: CAHGameOptions = {
            pointsToWin: pointsToWin ? parseInt(pointsToWin) : 10,
            whiteCardsPerPlayer: cardsPerPlayer ? parseInt(cardsPerPlayer) : 10,
            cardPacks: cardPacks ? [cardPacks] : []
        }
        setOptions(gameOptions);
        setisPlaying();
    }

    return(
        <form onSubmit={handleSubmit}>
            <label htmlFor="points-to-win">Score To Win</label>
            <input type="text" id="points-to-win" ref={pointsToWinInput} />
            <label htmlFor="cards-per-player">White Cards Per Player</label>
            <input type="text" id="cards-per-player" ref={cardsPerPlayerInput} />
            <label htmlFor="packs">Card Packs</label>
            <select name="packs" id="packs" ref={cardPacksSelect}>
                {data.cardPacks.map(pack => <option key={pack.id} value={pack.id}>{pack.name}</option>)}
            </select>
        </form>
        )
}

export default Game;