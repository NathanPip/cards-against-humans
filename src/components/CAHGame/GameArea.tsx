import { useStorage, useMutation as liveblocksMutation, useUpdateMyPresence } from "../../liveblocks.config";
import BlackCard from "./BlackCard";
import CardsInRound from "./CardsInRound";

const GameArea: React.FC = () => {

    const updatePresence = useUpdateMyPresence();
    const activeState = useStorage((root) => root.CAH.activeState);
    const currentBlackCard = useStorage((root) => root.CAH.currentBlackCard);

    const setNextBlackCard = liveblocksMutation(async ({ storage }) => {
        if(!currentBlackCard) return;
        // storage.get("CAH").set("currentBlackCard", currentBlackCardIndex + 1);
    }, [currentBlackCard])

    console.log(activeState);

    return (
    <div className="p-4 bg-sky-400">
        {currentBlackCard && <BlackCard card={currentBlackCard}/>}
        <CardsInRound />
    </div>
    )
}

export default GameArea;