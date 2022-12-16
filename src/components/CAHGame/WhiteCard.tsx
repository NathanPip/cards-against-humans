import { useState } from "react";
import {
  useSelf,
  useStorage,
  useMutation as liveblocksMutation,
  useBroadcastEvent,
  useUpdateMyPresence,
  useEventListener,
} from "../../liveblocks.config";
import { type Card } from "../../types/game";

type WhiteCardProps = {
  card: Card;
  setHand?:
    | React.Dispatch<React.SetStateAction<Card[] | undefined>>
    | undefined;
  setRevealedAmt?: React.Dispatch<React.SetStateAction<number>>;
  type: "hand" | "round";
  isRevealed?: boolean;
};

const WhiteCard: React.FC<WhiteCardProps> = ({ card, setHand, type, setRevealedAmt, isRevealed }) => {
  const isTurn = useSelf((me) => me.presence.CAHturn);
  const actionState = useSelf((me) => me.presence.currentAction);
  const gameState = useStorage((root) => root.CAH.activeState);
  const selfId = useSelf((me) => me.id);
  const cardsRevealed = useSelf((me) => me.presence.CAHCardsRevealed);
  const [revealed, setRevealed] = useState(type === "hand" || isRevealed ? true : false);

  const broadcast = useBroadcastEvent();

  const updatePresence = useUpdateMyPresence();

  useEventListener(({event}) => {
    if(event.type === "card revealed") {
      if(event.id === card.id) {
        setRevealed(true);
      }
    }
  })

  const selectCard = liveblocksMutation(
    async ({ storage, setMyPresence, self }, card: Card) => {
      const cardsInRound = storage.get("CAH").get("cardsInRound") || [];
      if (selfId === undefined) throw new Error("No selfId");
      const cardsPicked = self.presence.CAHCardsPicked || [];
      const numCardsNeeded = storage.get("CAH").get("whiteCardsToPick");
      if (numCardsNeeded === undefined)
        throw new Error("No numCardsNeeded found");
      if (cardsPicked.length < numCardsNeeded - 1) {
        setMyPresence({
          CAHCardsPicked: [...cardsPicked, { ...card, playerId: selfId }],
        });
      } else if (cardsPicked.length >= numCardsNeeded - 1) {
        setMyPresence({
          CAHCardsPicked: [...cardsPicked, { ...card, playerId: selfId }],
        });
        storage.get("CAH").set("cardsInRound", [
          ...cardsInRound,
          {
            cards: [...cardsPicked, { ...card, playerId: selfId }],
            playerId: selfId,
          },
        ]);
        setMyPresence({ currentAction: "drawing" });
      }
    },
    []
  );
  const cardClickHandler = () => {
    if (!card) return; //Error
    console.log(
      "action state: " + actionState,
      "game state: " + gameState,
      "turn " + isTurn
    );
    if (
      type === "hand" &&
      actionState === "selecting" &&
      gameState === "waiting for players" &&
      !isTurn &&
      setHand
    ) {
      console.log("hand");
      setHand((prev) => prev?.filter((prev) => prev !== card));
      selectCard(card);
    } else if (
      type === "round" &&
      isTurn
    ) {
      if(gameState === "waiting for judge"){
        if (!card.playerId) throw new Error("No player id attached to card");
      } else if( gameState === "judge revealing" && !revealed){
        if(cardsRevealed === undefined) throw new Error("No cards revealed amount found");
        if(!setRevealedAmt) throw new Error("No setRevealedAmt function found");
        setRevealed(true);
        setRevealedAmt(prev => prev+1);
        broadcast({type: "card revealed", id: card.id})
        updatePresence({CAHCardsRevealed: cardsRevealed + 1});
      }
    }
    console.log("completed");
  };

  return (
    <div onClick={cardClickHandler} className={`w-fit px-4 py-2 h-full bg-white rounded-lg ${type === "round" && "h-52"}`}>
      <p className={`text-black w-48 text-xl`}>{revealed ? card.text : "reveal card"}</p>
    </div>
  );
};

export default WhiteCard;
