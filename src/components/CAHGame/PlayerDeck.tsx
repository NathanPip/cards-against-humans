import { useEffect, useState } from "react";
import {
  useSelf,
  useMutation as liveblocksMutation,
  useStorage,
  useUpdateMyPresence,
  useBroadcastEvent,
} from "../../liveblocks.config";
import { trpc } from "../../utils/trpc";

const PlayerDeck: React.FC = () => {
  const updatePresence = useUpdateMyPresence();
  const currentPlayerDrawing = useStorage(
    (root) => root.CAH.currentPlayerDrawing
  );
  const connectedPlayers = useStorage((root) => root.CAH.connectedPlayers);
  const whiteCards = useStorage((root) => root.CAH.whiteCards);
  const currentCard = useStorage((root) => root.CAH.currentCard);
  const whiteCardsPerPlayer = useStorage(
    (root) => root.CAH.options.whiteCardsPerPlayer
  );
  const selfId = useSelf((me) => me.id);

  const broadcast = useBroadcastEvent();

  const activeState = useStorage((root) => root.CAH.activeState);

  const isHost = useSelf((me) => me.presence.isHost);

  const [hand, setHand] =
    useState<{ text: string; id: string }[]>();

  const drawInitialCards = liveblocksMutation(
    async ({ storage }, nextPlayer: string | undefined, hand: string[]) => {
      if (!currentCard) throw new Error("No current card");
      storage.get("CAH").set("currentCard", currentCard - hand.length);
      storage.get("CAH").set("currentPlayerDrawing", nextPlayer);
    },
    [currentPlayerDrawing, selfId]
  );

  const dealWhites = liveblocksMutation(async ({ storage }) => {
    storage.get("CAH").set("activeState", "dealing whites");
  }, []);

  const dealBlacks = liveblocksMutation(async ({ storage }) => {
    storage.get("CAH").set("activeState", "waiting for players");
  }, [])

  // Initial Draw
  useEffect(() => {
    if (
      !selfId ||
      !whiteCards ||
      !currentCard ||
      !whiteCardsPerPlayer ||
      !connectedPlayers
    )
      return;
    if(activeState === "starting game") dealWhites();
    if (activeState === "dealing whites") {
      if (currentPlayerDrawing === selfId) {
        updatePresence({ currentAction: "drawing" });
        const hand = whiteCards.slice(
          currentCard - whiteCardsPerPlayer - 1,
          currentCard
        );
        const nextPlayer =
          connectedPlayers[connectedPlayers.length - 1] !== selfId
            ? connectedPlayers[connectedPlayers.indexOf(selfId) + 1]
            : "";
        console.log("next player",nextPlayer);
        updatePresence({ CAHWhiteCardIds: hand.map(card => card.id) });
        drawInitialCards(nextPlayer, hand.map(card => card.id));
        setHand(hand);
      }
      console.log("current player drawing " + currentPlayerDrawing)
      if (isHost && currentPlayerDrawing === "") {
        console.log("run");
        dealBlacks();
      }
    }
    updatePresence({ currentAction: "waiting" });
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
    dealBlacks,
    dealWhites
  ]);

  return (
    <div>{hand && hand.map((card) => <p key={card.id}>{card.text}</p>)}</div>
  );
};

export default PlayerDeck;
