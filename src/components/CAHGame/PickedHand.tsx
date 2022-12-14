import { LiveList } from "@liveblocks/client";
import { type Card } from "../../types/game";
import WhiteCard from "./WhiteCard";
import {
  useBroadcastEvent,
  useMutation as liveblocksMutation,
  useSelf,
  useStorage,
} from "../../liveblocks.config";

type PickedHandProps = {
  hand: { readonly cards: readonly Readonly<Required<Card>>[]; readonly playerId: string };
};

const PickedHand: React.FC<PickedHandProps> = ({ hand }) => {
  const gameState = useStorage((root) => root.CAH.activeState);
  const isTurn = useSelf((me) => me.presence.CAHturn);
  const broadcast = useBroadcastEvent();

  const chooseWinner = liveblocksMutation(
    async ({ storage, setMyPresence }, id: string) => {
      storage.get("CAH").set("activeState", "ending round");
      const currentBlackCard = storage.get("CAH").get("currentBlackCard");
      const hand = storage
        .get("CAH")
        .get("cardsInRound")
        ?.filter((hand) => hand.playerId === id)[0];
      if (hand === undefined) throw new Error("No winning hand found");
      storage.get("CAH").set("cardsInRound", [hand]);
      broadcast({ type: "judge", data: { id, card: currentBlackCard } } as never);
      setMyPresence({ currentAction: "waiting" });
    },
    []
  );

  const clickHandler = () => {
    if (gameState === "waiting for judge" && isTurn) {
      chooseWinner(hand.playerId);
    }
  };

  return (
    <div onClick={clickHandler}>
      {hand.cards.map((card) => {
        return <WhiteCard key={card.id} card={card} type="round" />;
      })}
    </div>
  );
};

export default PickedHand;
