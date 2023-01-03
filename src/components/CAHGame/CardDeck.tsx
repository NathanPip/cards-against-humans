import { useState } from "react";
import {
  useStorage,
  useMutation as liveblocksMutation,
  useSelf,
  useBroadcastEvent,
  useEventListener,
} from "../../liveblocks.config";
import { useGameStore } from "../../pages/lobby/[id]";
import PlayerBlackCards from "./PlayerBlackCards";

const CardDeck: React.FC = () => {
  const actionState = useSelf((me) => me.presence.currentAction);

  const gameState = useStorage((root) => root.CAH.activeState);
  const hand = useGameStore((state) => state.hand);
  const whiteCards = useGameStore((state) => state.whiteCards);
  const addToHand = useGameStore(state => state.addToHand)

  const [animateDraw, setAnimateDraw] = useState(false);
  const [animateWiggle, setAnimateWiggle] = useState(true);

  const setNewCardIndex = liveblocksMutation(({ storage }, index) => {
    storage.get("CAH").set("currentWhiteCardIndex", index);
  }, []);

  const broadcast = useBroadcastEvent();

  const pickCard = liveblocksMutation(({ storage, self, setMyPresence }) => {
    const whiteCardsPerPlayer = storage
      .get("CAH")
      .get("options")
      .get("whiteCardsPerPlayer");
    if (hand.length + 1 >= whiteCardsPerPlayer) {
      setMyPresence({ currentAction: "waiting" });
    }
    const currentCard = storage.get("CAH").get("currentWhiteCardIndex");
    if (!currentCard) throw new Error("No current card found while drawing");
    const index = currentCard - 1 < 0 ? whiteCards.length - 1 : currentCard - 1;
    setNewCardIndex(index);
    const nextCard = whiteCards[index];
    if (!nextCard) throw new Error("No next card found while drawing");
    addToHand(nextCard)
    broadcast({ type: "player action", action: "picked card" });
  }, [hand]);

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
            if (actionState === "drawing") {
              pickCard();
              setAnimateDraw(true);
            }
          }}
          className="absolute top-0 mx-2 -my-28 h-fit w-fit"
        >
          <PlayerBlackCards />
          <p className="mb-4 font-semibold animate-bounce text-shadow-xl absolute w-max top-0 -my-10 ">{actionState === "drawing" && "draw a card"}</p>
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
