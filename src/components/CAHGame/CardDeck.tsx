import { useState } from "react";
import {
  useStorage,
  useMutation as liveblocksMutation,
  useSelf,
  useBroadcastEvent,
  useEventListener,
} from "../../liveblocks.config";

const CardDeck: React.FC = () => {
  const actionState = useSelf((me) => me.presence.currentAction);

  const gameState = useStorage((root) => root.CAH.activeState);

  const [animateDraw, setAnimateDraw] = useState(false);
  const [animateWiggle, setAnimateWiggle] = useState(true);

  const setNewCardIndex = liveblocksMutation(({ storage }, index) => {
    storage.get("CAH").set("currentWhiteCardIndex", index);
  }, []);

  const broadcast = useBroadcastEvent();

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
    broadcast({ type: "player action", action: "picked card" });
  }, []);

  useEventListener(({ event }) => {
    if (event.type === "player action") {
      if (event.action === "picked card") {
           setAnimateDraw(true)
      }
    }
  });

  // if (
  //   actionState === "drawing" ||
  //   actionState === "selecting" ||
  //   actionState === "waiting"
  // )
  //   if (gameState !== "judge revealing" && gameState !== "waiting for judge")
      return (
        <div
          onClick={() => {
            if (actionState === "drawing" && gameState !== "dealing whites") {
              pickCard();
              setAnimateDraw(true);
            }
          }}
          className="absolute top-0 mx-2 -my-28 h-fit w-fit"
        >
          <p className="ml-2 mb-4 font-semibold drop-shadow-md absolute w-max top-0 -my-10 ">{actionState === "drawing" && "draw a card"}</p>
          <div
            className={`absolute transition-transform ${
              actionState === "drawing"
                ? `translate-x-1 rotate-6 hover:translate-x-2 hover:rotate-12 ${animateWiggle ? "animate-wiggle-card" : ""}`
                : ""
            } ${
              animateDraw ? "animate-draw-card" : ""
            } h-20 w-12 rounded-md bg-white text-black shadow-lg`}
            onAnimationEnd={() => setAnimateDraw(false)}
            onMouseEnter={() => setAnimateWiggle(false)}
            onMouseLeave={() => setAnimateWiggle(true)}
          ></div>
          <div className=" h-20 w-12 rounded-md bg-white text-black shadow-lg "></div>
        </div>
      );

  return null;
};

export default CardDeck;
