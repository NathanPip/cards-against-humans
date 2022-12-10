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
  const whiteCardIds = useStorage((root) => root.CAH.whiteCardIds);
  const currentCard = useStorage((root) => root.CAH.currentCard);
  const whiteCardsPerPlayer = useStorage(
    (root) => root.CAH.options.whiteCardsPerPlayer
  );
  const selfId = useSelf((me) => me.id);

  const broadcast = useBroadcastEvent();

  const activeState = useStorage((root) => root.CAH.activeState);

  const isHost = useSelf((me) => me.presence.isHost);

  const [hand, setHand] =
    useState<{ text: string; type: string; id: string }[]>();

  const trpcContext = trpc.useContext();

  const drawInitialCards = liveblocksMutation(
    async ({ storage }, nextPlayer: string | undefined, hand: string[]) => {
      if (!currentCard) throw new Error("No current card");
      const cards = await trpcContext.game.getSelectedCards.fetch(hand);
      storage.get("CAH").set("currentCard", currentCard - hand.length);
      setHand(cards.whiteCards);
      storage.get("CAH").set("currentPlayerDrawing", nextPlayer);
    },
    [currentPlayerDrawing, selfId]
  );

  const dealWhites = liveblocksMutation(async ({ storage }) => {
    storage.get("CAH").set("activeState", "dealing whites");
  }, []);

  const dealBlacks = liveblocksMutation(async ({ storage }) => {
    storage.get("CAH").set("activeState", "dealing blacks");
  }, [])

  // Initial Draw
  useEffect(() => {
    if (
      !selfId ||
      !whiteCardIds ||
      !currentCard ||
      !whiteCardsPerPlayer ||
      !connectedPlayers
    )
      return;
    if(activeState === "starting game") dealWhites();
    if (activeState === "dealing whites") {
      if (currentPlayerDrawing === selfId) {
        updatePresence({ currentAction: "drawing" });
        const hand = whiteCardIds.slice(
          currentCard - whiteCardsPerPlayer - 1,
          currentCard
        );
        const nextPlayer =
          connectedPlayers[connectedPlayers.length - 1] !== selfId
            ? connectedPlayers[connectedPlayers.indexOf(selfId) + 1]
            : "";
        console.log("next player",nextPlayer);
        updatePresence({ CAHWhiteCardIds: hand });
        drawInitialCards(nextPlayer, hand);
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
    whiteCardIds,
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
