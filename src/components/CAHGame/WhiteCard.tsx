import { LiveList, LiveObject } from "@liveblocks/client";
import { useState } from "react";
import {
  useSelf,
  useStorage,
  useMutation as liveblocksMutation,
  useBroadcastEvent,
} from "../../liveblocks.config";
import { type Card } from "../../types/game";

type WhiteCardProps = {
  card: Card;
  setHand?:
    | React.Dispatch<React.SetStateAction<Card[] | undefined>>
    | undefined;
  type: "hand" | "round";
};

const WhiteCard: React.FC<WhiteCardProps> = ({ card, setHand, type }) => {
  const isTurn = useSelf((me) => me.presence.CAHturn);
  const actionState = useSelf((me) => me.presence.currentAction);
  const gameState = useStorage((root) => root.CAH.activeState);
  const selfId = useSelf((me) => me.id);
  const [revealed, setRevealed] = useState(type === "hand" ? true : false);

  const broadcast = useBroadcastEvent();

  const selectCard = liveblocksMutation(
    async ({ storage, setMyPresence, self }, card: Card) => {
      const cardsInRound = storage.get("CAH").get("cardsInRound") || [];
      if (selfId === undefined) throw new Error("No selfId");
      const cardsPicked = self.presence.CAHCardsPicked || [];
      console.log(cardsPicked);
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
      isTurn &&
      gameState === "waiting for judge"
    ) {
      if (!card.playerId) throw new Error("No player id attached to card");
      setRevealed(true);
    }
    console.log("completed");
  };

  return (
    <div>
      <p onClick={cardClickHandler}>{card.text}</p>
    </div>
  );
};

export default WhiteCard;
