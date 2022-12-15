import { useEffect, useState } from "react";
import { useStorage } from "../../liveblocks.config";
import BlackCard from "./BlackCard";
import CardsInRound from "./CardsInRound";
import CurrentPicks from "./CurrentPicks";

const GameArea: React.FC = () => {
    const currentBlackCard = useStorage((root) => root.CAH.currentBlackCard);
    const gameState = useStorage((root) => root.CAH.activeState);

    return (
    <div className="py-4 flex flex-col justify-center items-center max-w-full overflow-x-hidden">
        {currentBlackCard && <BlackCard card={currentBlackCard}/>}
        {gameState === "waiting for judge" || gameState === "ending round" || gameState === "judge revealing" ? <CardsInRound /> : <CurrentPicks/>}
    </div>
    )
}

export default GameArea;