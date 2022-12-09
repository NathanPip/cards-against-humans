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

  const drawCards = liveblocksMutation(
    async ({ storage }, nextPlayer: string | undefined, hand: string[] ) => {
      const cards = await trpcContext.game.getSelectedCards.fetch( hand );
      setHand(cards.whiteCards);
      storage.get("CAH").set("currentPlayerDrawing", nextPlayer);
    },
    [currentPlayerDrawing, selfId]
  );

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
    if (currentPlayerDrawing === selfId) {
      const hand = whiteCardIds.slice(
        whiteCardIds.length - whiteCardsPerPlayer - 1,
        whiteCardsPerPlayer
      );
      const nextPlayer =
        connectedPlayers[connectedPlayers.length - 1] !== selfId
          ? connectedPlayers[connectedPlayers.indexOf(selfId) + 1]
          : undefined;
      updatePresence({ CAHWhiteCardIds: hand });
      drawCards(nextPlayer, hand);
    }
  }, [
    currentPlayerDrawing,
    selfId,
    whiteCardIds,
    currentCard,
    whiteCardsPerPlayer,
    updatePresence,
    connectedPlayers,
    drawCards,
  ]);

  return <div>

  </div>;
};

export default PlayerDeck;
