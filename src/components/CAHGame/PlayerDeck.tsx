import { LiveList } from "@liveblocks/client";
import { type MouseEvent, useEffect, useState } from "react";
import {
  useSelf,
  useMutation as liveblocksMutation,
  useStorage,
  useUpdateMyPresence,
  useBroadcastEvent
} from "../../liveblocks.config";
import WhiteCard from "./WhiteCard";

const PlayerDeck: React.FC = () => {
  const updatePresence = useUpdateMyPresence();
  const currentPlayerDrawing = useStorage(
    (root) => root.CAH.currentPlayerDrawing
  );
  const connectedPlayers = useStorage((root) => root.CAH.connectedPlayers);
  const whiteCards = useStorage((root) => root.CAH.whiteCards);
  const currentCard = useStorage((root) => root.CAH.currentWhiteCard);
  const whiteCardsPerPlayer = useStorage(
    (root) => root.CAH.options.whiteCardsPerPlayer
  );

  const broadcast = useBroadcastEvent();

  const selfId = useSelf((me) => me.id);

  const activeState = useStorage((root) => root.CAH.activeState);

  const isHost = useSelf((me) => me.presence.isHost);

  const [hand, setHand] = useState<{ text: string; id: string }[]>();

  const drawInitialCards = liveblocksMutation(
    async ({ storage }, nextPlayer: string | undefined, hand: string[]) => {
      if (!currentCard) throw new Error("No current card");
      storage.get("CAH").set("currentWhiteCard", currentCard - hand.length);
      storage.get("CAH").set("currentPlayerDrawing", nextPlayer);
    },
    [currentPlayerDrawing, selfId]
  );

  const dealWhites = liveblocksMutation(async ({ storage }) => {
    storage.get("CAH").set("activeState", "dealing whites");
  }, []);

  const startGame = liveblocksMutation(async ({ storage, self, setMyPresence }) => {
    storage.get("CAH").set("activeState", "waiting for players");
    const currentPlayerTurn = storage.get("CAH").get("currentPlayerTurn");
    if(self.id !== currentPlayerTurn){
      setMyPresence({ currentAction: "selecting" });
    } else {
      console.log("isTurn")
      setMyPresence({ currentAction: "waiting" });
      setMyPresence({ CAHturn: true });
    }
  }, []);

  // Initial Draw BE CAREFUL
  useEffect(() => {
    if (
      !selfId ||
      !whiteCards ||
      !currentCard ||
      !whiteCardsPerPlayer ||
      !connectedPlayers
    )
      return;
    if (activeState === "starting game") dealWhites();
    if (activeState === "dealing whites") {
      if (currentPlayerDrawing === selfId) {
        updatePresence({ currentAction: "drawing" });
        const hand = whiteCards.slice(
          currentCard - whiteCardsPerPlayer - 1,
          currentCard
        );
        console.log(hand);
        const nextPlayer =
          connectedPlayers[connectedPlayers.length - 1] !== selfId
            ? connectedPlayers[connectedPlayers.indexOf(selfId) + 1]
            : "";
        console.log("next player", nextPlayer);
        drawInitialCards(
          nextPlayer,
          hand.map((card) => card.id)
        );
        setHand(hand);
      }
      console.log("current player drawing " + currentPlayerDrawing);
      if (isHost && currentPlayerDrawing === "") {
        console.log("run");
        startGame();
        broadcast({ type: "game action", action: "start game"} as never)
      }
    }
  }, [
    currentPlayerDrawing,
    selfId,
    whiteCards,
    currentCard,
    whiteCardsPerPlayer,
    updatePresence,
    connectedPlayers,
    drawInitialCards,
    isHost,
    activeState,
    startGame,
    dealWhites,
    broadcast
  ]);

  useEffect(() => {
    if(!hand) return;
      updatePresence({ CAHWhiteCardIds: hand.map((card) => card.id) });
  }, [hand, updatePresence])

  return (
    <div>
      {hand &&
        hand.map((card) => (
          <WhiteCard card={card} type="hand" setHand={setHand} key={card.id}/>
        ))}
    </div>
  );
};

export default PlayerDeck;
