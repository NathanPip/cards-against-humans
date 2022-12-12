import { useEffect } from "react";
import { useStorage, useMutation as liveblocksMutation, useSelf } from "../../liveblocks.config";


const CardsInRound: React.FC = () => {

    const cardsInRound = useStorage((root) => root.CAH.cardsInRound);
    const connectedPlayers = useStorage((root) => root.CAH.connectedPlayers);

    const setJudging = liveblocksMutation(async ({ storage, self, setMyPresence }) => {
        storage.get("CAH").set("activeState", "waiting for judge");
        const isTurn = self.presence.CAHturn;
        if(isTurn) {
            setMyPresence({ currentAction: "judging" });
        }
    }, [])

    useEffect(() => {
        if(cardsInRound?.length === connectedPlayers.length-1) {
            setJudging();
        }
    }, [cardsInRound, connectedPlayers, setJudging])

    return (
        <div>
            {cardsInRound && cardsInRound.map((card) => (<p key={card.id}>{card.text}</p>))}
        </div>
    )
}

export default CardsInRound;