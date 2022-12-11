import { LiveList } from "@liveblocks/client";
import { MouseEvent } from "react";
import { useSelf, useStorage, useMutation as liveblocksMutation } from "../../liveblocks.config";
import { Card } from "../../types/game";

type WhiteCardProps = {
    card: Card;
    setHand: React.Dispatch<React.SetStateAction<Card[] | undefined>>;
}

const WhiteCard: React.FC<WhiteCardProps> = ({card, setHand}) => {

  const isTurn = useSelf((me) => me.presence.CAHturn);
  const actionState = useSelf((me) => me.presence.currentAction);
  const activeState = useStorage((root) => root.CAH.activeState);
  const selfId = useSelf((me) => me.id);

  const cardClickHandler = (e: MouseEvent<HTMLParagraphElement>) => {
    console.log("clicked")
    if(!e.target || !setHand) return; //Error
    const cardEl = e.target as HTMLElement;
    const id = cardEl.dataset.id;
    if(!id) return; //Error
    if(!card) return; //Error
    setHand(prev => prev?.filter(prev => prev !== card))
    selectCard(card);
    console.log("completed")
  }

  const selectCard = liveblocksMutation( async ({ storage, setMyPresence }, card: {id: string, text: string}) => {
    const cardsInRound = storage.get("CAH").get("cardsInRound") || [];
    if(!selfId) throw new Error("No selfId");
    storage.get("CAH").set("cardsInRound", new LiveList([...cardsInRound, {...card, playerId: selfId}]));

    setMyPresence({currentAction: "drawing"});
  }, [])

    return (
        <div>
            <p
            onClick={(e) =>
                !isTurn &&
                actionState === "selecting" &&
                activeState === "waiting for players"
                  ? cardClickHandler(e)
                  : null
              }>{card.text}</p>
        </div>
    )
}

export default WhiteCard;