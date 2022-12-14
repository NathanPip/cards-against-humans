import {
  useStorage,
  useMutation as liveblocksMutation,
  useSelf,
} from "../../liveblocks.config";
import { type Card } from "../../types/game";

type CardDeckProps = {
  setHand: React.Dispatch<React.SetStateAction<Card[] | undefined>> | undefined;
};

const CardDeck: React.FC<CardDeckProps> = ({ setHand }) => {
  const actionState = useSelf((me) => me.presence.currentAction);

  const gameState = useStorage((root) => root.CAH.activeState);

  const setNewCardIndex = liveblocksMutation(({ storage }, index) => {
    storage.get("CAH").set("currentWhiteCardIndex", index)
  }, [])

  const pickCard = liveblocksMutation(({ storage }) => {
    const deck = storage.get("CAH").get("whiteCards");
    const currentCard = storage.get("CAH").get("currentWhiteCardIndex");
    if (!currentCard) throw new Error("No current card found while drawing");
    const index = currentCard + 1 >= deck.length ? 0 : currentCard + 1;
    setNewCardIndex(index)
    const nextCard = deck[index];
    if (!nextCard || !setHand)
      throw new Error("No next card found while drawing");
    setHand((prev) => (prev ? [...prev, nextCard] : [nextCard]));
  }, []);

  return (
    <div
      onClick={() =>
        actionState === "drawing" && gameState !== "dealing whites"
          ? pickCard()
          : null
      }
      className="bg-red-400 px-12 py-36"
    ></div>
  );
};

export default CardDeck;
