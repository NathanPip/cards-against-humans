import { LiveList } from "@liveblocks/client";
import {
  useSelf,
  useStorage,
  useMutation as liveblocksMutation,
  useBroadcastEvent,
  useEventListener,
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

  const broadcast = useBroadcastEvent();

  const selectCard = liveblocksMutation(
    async ({ storage, setMyPresence }, card: { id: string; text: string }) => {
      const cardsInRound = storage.get("CAH").get("cardsInRound") || [];
      if (!selfId) throw new Error("No selfId");
      storage
        .get("CAH")
        .set(
          "cardsInRound",
          new LiveList([...cardsInRound, { ...card, playerId: selfId }])
        );

      setMyPresence({ currentAction: "drawing" });
    },
    []
  );

  const chooseWinner = liveblocksMutation(
    async (
      { storage, setMyPresence },
      card: { id: string; text: string; playerId: string }
    ) => {
      storage.get("CAH").set("activeState", "ending round");
      storage.get("CAH").set("cardsInRound", new LiveList([card]));
      broadcast({ type: "judge", data: { card } } as never);
      setMyPresence({ currentAction: "waiting" });
    },
    []
  );

  const cardClickHandler = () => {
    if (!card) return; //Error
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
      console.log("round");
      chooseWinner({ ...card, playerId: card.playerId });
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
