import { type CAHBlackCard } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { useOthersMapped, useSelf, useStorage, useMutation as liveblocksMutation, useUpdateMyPresence } from "../../liveblocks.config";
import { trpc } from "../../utils/trpc";
import CardsInRound from "./CardsInRound";

type BlackCardData = Pick<CAHBlackCard, "id" | "text" >;

const GameArea: React.FC = () => {

    const updatePresence = useUpdateMyPresence();
    const [currentBlackCard, setCurrentBlackCard] = useState<BlackCardData>();
    const activeState = useStorage((root) => root.CAH.activeState);
    const currentPlayerTurn = useStorage((root) => root.CAH.currentPlayerTurn);
    const currentBlackCardIndex = useStorage((root) => root.CAH.currentBlackCard);
    const blackCards = useStorage((root) => root.CAH.blackCards);
    const id = useSelf((me) => me.id);

    const setTurnStart = liveblocksMutation(async ({ storage }) => {
        storage.get("CAH").set("activeState", "waiting for players");
    }, [])

    const setNextBlackCard = liveblocksMutation(async ({ storage }) => {
        if(!currentBlackCardIndex) return;
        storage.get("CAH").set("currentBlackCard", currentBlackCardIndex + 1);
    }, [currentBlackCardIndex])

    console.log(activeState);

    useEffect(() => {
        if(currentBlackCardIndex && blackCards) {
            setCurrentBlackCard(blackCards[currentBlackCardIndex]);
        }
    }, [currentBlackCardIndex, blackCards])

    useEffect(() => {
        if(currentBlackCard && currentPlayerTurn === id) {
            updatePresence({ CAHturn: true });
        } else if (currentBlackCard && currentPlayerTurn !== id) {
            updatePresence({ CAHturn: false });
        }
    }, [currentBlackCard, currentPlayerTurn, updatePresence, id])

    return (
    <div>
        {currentBlackCard && <div>{currentBlackCard.text}</div>}
        <CardsInRound />
    </div>
    )
}

export default GameArea;