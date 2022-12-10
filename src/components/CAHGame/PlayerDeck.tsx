import { useEffect, useState } from "react";
import {
  useSelf,
  useMutation as liveblocksMutation,
  useStorage,
  useUpdateMyPresence,
} from "../../liveblocks.config";
import { trpc } from "../../utils/trpc";

const PlayerDeck: React.FC = () => {
  const updatePresence = useUpdateMyPresence();
  const currentPlayerDrawing = useStorage(
    (root) => root.CAH.currentPlayerDrawing
  );
  const connectedPlayers = useStorage((root) => root.CAH.connectedPlayers);
  const whiteCardIds = useStorage((root) => root.CAH.options.whiteCardIds);
  const currentCard = useStorage((root) => root.CAH.currentCard);
  const whiteCardsPerPlayer = useStorage(
    (root) => root.CAH.options.whiteCardsPerPlayer
  );
  const selfId = useSelf((me) => me.id);

  const [hand, setHand] = useState<{text: string, type: string, id: string}[]>();

  const trpcContext = trpc.useContext();

  const drawInitialCards = liveblocksMutation(
    async ({ storage }, nextPlayer: string | undefined, hand: string[] ) => {
      const cards = await trpcContext.game.getSelectedCards.fetch( hand );
      storage.get("CAH").set("currentCard", currentCard-hand.length);
      setHand(cards.whiteCards);
      storage.get("CAH").set("currentPlayerDrawing", nextPlayer);
    },
    [currentPlayerDrawing, selfId]
  );

  console.log(currentCard);

  useEffect(() => {
    if (
      !currentPlayerDrawing ||
      !selfId ||
      !whiteCardIds ||
      !currentCard ||
      !whiteCardsPerPlayer ||
      !connectedPlayers
    )
      return;

    console.log("ran")
    console.log(currentPlayerDrawing, selfId)
    if (currentPlayerDrawing === selfId) {
      console.log(whiteCardIds)
      console.log(whiteCardIds.length - whiteCardsPerPlayer - 1);
      const hand = whiteCardIds.slice(
        currentCard - whiteCardsPerPlayer - 1,
        currentCard
      );
      console.log(hand);
      const nextPlayer =
        connectedPlayers[connectedPlayers.length - 1] !== selfId
          ? connectedPlayers[connectedPlayers.indexOf(selfId) + 1]
          : undefined;
      updatePresence({ CAHWhiteCardIds: hand });
      drawInitialCards(nextPlayer, hand);
    }
  }, [
    currentPlayerDrawing,
    selfId,
    whiteCardIds,
    currentCard,
    whiteCardsPerPlayer,
    updatePresence,
    connectedPlayers,
    drawInitialCards,
  ]);

  return <div>
    {hand && hand.map((card) => <p key={card.id}>{card.text}</p>)}
  </div>;
};

export default PlayerDeck;
