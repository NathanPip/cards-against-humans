import { useMemo } from "react";
import { useOthersMapped, useSelf, useStorage } from "../../liveblocks.config";

const GameOverScreen: React.FC = () => {

    const gameState = useStorage((root) => root.CAH.activeState);
    const winner = useStorage((root) => root.CAH.winner);
    const othersNames = useOthersMapped((other) => other.presence.name);
    const othersIds = useOthersMapped((other) => other.id);
    const myName = useSelf((me) => me.presence.name);
    const myId = useSelf((me) => me.id);
    const isHost = useSelf((me) => me.presence.isHost);

    const winnersName = useMemo(() => {
        if(!winner) return null;
        if(winner === myId) return myName;
        const winnerConnectionId = othersIds.find((id) => id[1] === winner);
        if(!winnerConnectionId) return null;
        const name = othersNames.find(
            (other) => other[0] === winnerConnectionId[0]
        );
        if(!name) return null;
        return name[1];
    }, [winner, othersIds, othersNames, myId, myName])

    const returnClickHandler = () => {
        window.dispatchEvent(new CustomEvent("end game"));
    }

    if(!winner || gameState !== "game over") return null;

    return (
    <div className="fixed w-full h-screen flex flex-col justify-center z-50 items-center bg-zinc-700 bg-opacity-80 top-0 left-0">
        <h1>{winnersName} has won the game</h1>
        {isHost && <button onClick={returnClickHandler}>Return to Lobby Menu</button>}
    </div>)
}

export default GameOverScreen;