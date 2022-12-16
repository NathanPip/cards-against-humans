import { useState } from "react";
import {
  useStorage,
  useMutation as liveblocksMutation,
  useSelf,
} from "../../liveblocks.config";

const CardDeck: React.FC = () => {
  const actionState = useSelf((me) => me.presence.currentAction);

  const gameState = useStorage((root) => root.CAH.activeState);

  const [animated, setAnimated] = useState(false);

  const setNewCardIndex = liveblocksMutation(({ storage }, index) => {
    storage.get("CAH").set("currentWhiteCardIndex", index);
  }, []);

  const pickCard = liveblocksMutation(({ storage, self, setMyPresence }) => {
    const currentWhiteCards = self.presence.CAHWhiteCardIds || [];
    const whiteCardsPerPlayer = storage
      .get("CAH")
      .get("options")
      .get("whiteCardsPerPlayer");
    if (currentWhiteCards.length + 1 >= whiteCardsPerPlayer) {
      setMyPresence({ currentAction: "waiting" });
    }
    const deck = storage.get("CAH").get("whiteCards");
    const currentCard = storage.get("CAH").get("currentWhiteCardIndex");
    if (!currentCard) throw new Error("No current card found while drawing");
    const index = currentCard - 1 < 0 ? deck.length - 1 : currentCard - 1;
    setNewCardIndex(index);
    const nextCard = deck[index];
    if (!nextCard) throw new Error("No next card found while drawing");
    window.dispatchEvent(
      new CustomEvent("card picked", { detail: { card: nextCard } })
    );
  }, []);

  if (
    actionState === "drawing" ||
    actionState === "selecting" ||
    actionState === "waiting"
  )
    if (gameState !== "judge revealing" && gameState !== "waiting for judge")
      return (
        <div
          onClick={() => {
            if (actionState === "drawing" && gameState !== "dealing whites") {
              pickCard();
              setAnimated(true)
            }
          }}
          className="fixed bottom-1/3 left-0 m-2 h-fit w-fit"
        >
          <p>{actionState === "drawing" && "draw a card"}</p>
          <div
            className={`absolute transition-transform ${
              actionState === "drawing"
                ? "translate-x-1 rotate-6 hover:translate-x-2 hover:rotate-12"
                : ""
            } ${animated ? "animate-draw-card" : ""} h-20 w-12 rounded-md bg-white text-black shadow-lg`}
            onAnimationEnd={() => setAnimated(false)}
          ></div>
          <div className=" h-20 w-12 rounded-md bg-white text-black shadow-lg "></div>
        </div>
      );

  return null;
};

export default CardDeck;
