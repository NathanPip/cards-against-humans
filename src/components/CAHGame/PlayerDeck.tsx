import {  useEffect, useState } from "react";
import {
  useSelf,
  useMutation as liveblocksMutation,
  useStorage,
  useUpdateMyPresence,
  useBroadcastEvent
} from "../../liveblocks.config";
import { type Card } from "../../types/game";
import WhiteCard from "./WhiteCard";

const PlayerDeck: React.FC = () => {
  const updatePresence = useUpdateMyPresence();
  const currentPlayerDrawing = useStorage(
    (root) => root.CAH.currentPlayerDrawing
  );
  const connectedPlayers = useStorage((root) => root.CAH.connectedPlayers);
  const whiteCards = useStorage((root) => root.CAH.whiteCards);
  const currentCardIndex = useStorage((root) => root.CAH.currentWhiteCardIndex);
  const whiteCardsPerPlayer = useStorage(
    (root) => root.CAH.options.whiteCardsPerPlayer
  );

  const broadcast = useBroadcastEvent();

  const isTurn = useSelf((me) => me.presence.CAHturn);

  const selfId = useSelf((me) => me.id);

  const gameState = useStorage((root) => root.CAH.activeState);

  const isHost = useSelf((me) => me.presence.isHost);

  const [hand, setHand] = useState<{ text: string; id: string }[]>();

  const drawInitialCards = liveblocksMutation(
    async ({ storage }, nextPlayer: string | undefined) => {
      if (!currentCardIndex) throw new Error("No current card");
      const cardsPerPlayer = storage.get("CAH").get("options").get("whiteCardsPerPlayer");
      storage.get("CAH").set("currentWhiteCardIndex", currentCardIndex - cardsPerPlayer);
      storage.get("CAH").set("currentPlayerDrawing", nextPlayer);
    },
    [currentPlayerDrawing, selfId]
  );

  const dealWhites = liveblocksMutation(async ({ storage }) => {
    storage.get("CAH").set("activeState", "dealing whites");
  }, []);

  // Initial Draw BE CAREFUL ** CHECKS FAIL AFTER FIRST FULL RUN THROUGH SO DON'T WORRY TOO MUCH **
  useEffect(() => {
    if (
      !selfId ||
      !whiteCards ||
      !currentCardIndex ||
      !whiteCardsPerPlayer ||
      !connectedPlayers
    )
      return;
    if (gameState === "starting game") dealWhites();
    if (gameState === "dealing whites") {
      if (currentPlayerDrawing === selfId) {
        updatePresence({ currentAction: "drawing" });
        const hand = whiteCards.slice(
          currentCardIndex - whiteCardsPerPlayer,
          currentCardIndex
        );
        console.log(hand);
        const nextPlayer =
          connectedPlayers[connectedPlayers.length - 1] !== selfId
            ? connectedPlayers[connectedPlayers.indexOf(selfId) + 1]
            : "";
        console.log("next player", nextPlayer);
        drawInitialCards(
          nextPlayer,
        );
        setHand(hand);
      }
    }
  }, [
    currentPlayerDrawing,
    selfId,
    whiteCards,
    currentCardIndex,
    whiteCardsPerPlayer,
    updatePresence,
    connectedPlayers,
    drawInitialCards,
    isHost,
    gameState,
    dealWhites,
    broadcast
  ]);

  useEffect(() => {
    const handler = (e: unknown) => {
      const card = (e as CustomEvent).detail as {card: Card};
      setHand(prev => prev ? [...prev, card.card] : [card.card]);
    }
    window.addEventListener("card picked", handler);
    return () => window.removeEventListener("card picked", handler);
  }, [setHand])

  useEffect(() => {
    if(!hand) return;
      updatePresence({ CAHWhiteCardIds: hand.map((card) => card.id) });
  }, [hand, updatePresence])

  return (
    <div className="p-4 flex gap-4 overflow-x-scroll overflow-y-visible">
      {hand &&
        hand.map((card, index) => (
          <WhiteCard card={card} type="hand" setHand={setHand} key={card.id + index*Math.random()}/>
        )).reverse()}
        {/* {hand && <CardDeck />} */}
    </div>
  );
};

export default PlayerDeck;
