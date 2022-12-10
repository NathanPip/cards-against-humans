import { type CAHBlackCard } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { useOthersMapped, useSelf, useStorage, useMutation as liveblocksMutation } from "../../liveblocks.config";
import { trpc } from "../../utils/trpc";

type BlackCardData = Pick<CAHBlackCard, "id" | "text" | "type">;

const GameArea: React.FC = () => {

    const trpcContext = trpc.useContext().game.getSelectedCards;
    const [currentBlackCard, setCurrentBlackCard] = useState<BlackCardData>();
    const activeState = useStorage((root) => root.CAH.activeState);
    const currentBlackCardIndex = useStorage((root) => root.CAH.currentBlackCard);
    const blackCardIds = useStorage((root) => root.CAH.blackCardIds);

    const setTurnStart = liveblocksMutation(async ({ storage }) => {
        storage.get("CAH").set("activeState", "waiting for players");
    }, [])

    console.log(activeState);

    const fetchBlackCard = useCallback(async () => {
        console.log(currentBlackCardIndex)
        console.log(blackCardIds)
        console.log(blackCardIds[currentBlackCardIndex!])
        if(!currentBlackCardIndex || !blackCardIds || !blackCardIds[currentBlackCardIndex]) return;
        try{
            const blackCard = await trpcContext.fetch( [blackCardIds[currentBlackCardIndex]!] );
            setCurrentBlackCard(blackCard.blackCards[0]);
            setTurnStart();
        } catch(e) {
            if(e instanceof Error) console.log(e.message)
        }
    }, [currentBlackCardIndex, blackCardIds, trpcContext, setTurnStart])

    useEffect(() => {
        if(activeState === "dealing blacks") {
            fetchBlackCard();
        }
    }, [activeState, fetchBlackCard])

    return (
    <div>
        {currentBlackCard && <div>{currentBlackCard.text}</div>}
    </div>
    )
}

export default GameArea;