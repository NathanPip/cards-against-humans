import { useEffect } from "react";
import { useStorage, useMutation as liveblocksMutation, useSelf } from "../../liveblocks.config";
import WhiteCard from "./WhiteCard";


const CardsInRound: React.FC = () => {

    const cardsInRound = useStorage((root) => root.CAH.cardsInRound);
    const connectedPlayers = useStorage((root) => root.CAH.connectedPlayers);
    const gameState = useStorage((root) => root.CAH.activeState);

    const setJudging = liveblocksMutation(async ({ storage, self, setMyPresence }) => {
        storage.get("CAH").set("activeState", "waiting for judge");
        const isTurn = self.presence.CAHturn;
        if(isTurn) {
            console.log("I am judge");
            setMyPresence({ currentAction: "judging" });
        }
    }, [])

    useEffect(() => {
        if(gameState === "waiting for players"){
            if(cardsInRound?.length === connectedPlayers.length-1) {
                setJudging();
            }
        }
    }, [cardsInRound, connectedPlayers, setJudging, gameState])

    return (
        <div>
            {cardsInRound && cardsInRound.map((card) => (<WhiteCard key={card.id} card={card} type="round" />))}
        </div>
    )
}

export default CardsInRound;