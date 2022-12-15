import {
  useStorage,
  useMutation as liveblocksMutation,
  useSelf,
} from "../../liveblocks.config";

// type CardDeckProps = {
//   setHand: React.Dispatch<React.SetStateAction<Card[] | undefined>> | undefined;
// };

const CardDeck: React.FC = () => {
  const actionState = useSelf((me) => me.presence.currentAction);

  const gameState = useStorage((root) => root.CAH.activeState);

  const setNewCardIndex = liveblocksMutation(({ storage }, index) => {
    storage.get("CAH").set("currentWhiteCardIndex", index)
  }, [])

  const pickCard = liveblocksMutation(({ storage, self, setMyPresence }) => {
    const currentWhiteCards = self.presence.CAHWhiteCardIds || []; 
    const whiteCardsPerPlayer = storage.get("CAH").get("options").get("whiteCardsPerPlayer");
    if(currentWhiteCards.length+1 >= whiteCardsPerPlayer) {
      setMyPresence({currentAction: "waiting"});
    }
    const deck = storage.get("CAH").get("whiteCards");
    const currentCard = storage.get("CAH").get("currentWhiteCardIndex");
    if (!currentCard) throw new Error("No current card found while drawing");
    const index = currentCard - 1 < 0 ? deck.length-1 : currentCard - 1;
    setNewCardIndex(index)
    const nextCard = deck[index];
    if (!nextCard)
      throw new Error("No next card found while drawing");
    // setHand((prev) => (prev ? [...prev, nextCard] : [nextCard]));
    window.dispatchEvent(new CustomEvent("card picked", { detail: { card: nextCard } }))
  }, []);

  if(actionState === "drawing") return (
    <div
      onClick={() =>
        actionState === "drawing" && gameState !== "dealing whites"
          ? pickCard()
          : null
      }
      className="fixed bg-white text-xl rounded-md p-6 m-2 shadow-lg text-black bottom-1/3 left-0"
    >Pick New Card</div>
  );

  return null;
};

export default CardDeck;
