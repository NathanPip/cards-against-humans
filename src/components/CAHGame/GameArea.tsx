import { type CAHBlackCard } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { useOthersMapped, useSelf, useStorage, useMutation as liveblocksMutation, useUpdateMyPresence } from "../../liveblocks.config";
import { trpc } from "../../utils/trpc";

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

    const fetchBlackCard = useCallback(async () => {
        if(!currentBlackCardIndex || !blackCards || !blackCards[currentBlackCardIndex]) return;
        try{
            const blackCard = blackCards[currentBlackCardIndex];
            setCurrentBlackCard(blackCard);
        } catch(e) {
            if(e instanceof Error) console.log(e.message)
        }
    }, [currentBlackCardIndex, blackCards])

    useEffect(() => {
        if(currentBlackCardIndex) {
            fetchBlackCard();
        }
    }, [currentBlackCardIndex, fetchBlackCard])

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
    </div>
    )
}

export default GameArea;