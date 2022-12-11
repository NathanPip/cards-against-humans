import { LiveList } from "@liveblocks/client";
import { type MouseEvent, useEffect, useState } from "react";
import {
  useSelf,
  useMutation as liveblocksMutation,
  useStorage,
  useUpdateMyPresence,
  useBroadcastEvent
} from "../../liveblocks.config";

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

  const broadcast = useBroadcastEvent();

  const selfId = useSelf((me) => me.id);

  const activeState = useStorage((root) => root.CAH.activeState);

  const isHost = useSelf((me) => me.presence.isHost);
  const isTurn = useSelf((me) => me.presence.CAHturn);
  const actionState = useSelf((me) => me.presence.currentAction);

  const [hand, setHand] = useState<{ text: string; id: string }[]>();

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

  const startGame = liveblocksMutation(async ({ storage, setMyPresence }) => {
    storage.get("CAH").set("activeState", "waiting for players");
    setMyPresence({ currentAction: "selecting" });
  }, []);

  const selectCard = liveblocksMutation( async ({ storage, setMyPresence }, card: {id: string, text: string}) => {
    const cardsInRound = storage.get("CAH").get("cardsInRound") || [];
    
    storage.get("CAH").set("cardsInRound", new LiveList([...cardsInRound, card]));

    setMyPresence({currentAction: "drawing"});
  }, [])

  const cardClickHandler = (e: MouseEvent<HTMLParagraphElement>) => {
    console.log("clicked")
    if(!e.target || !hand) return; //Error
    const cardEl = e.target as HTMLElement;
    const id = cardEl.dataset.id;
    if(!id) return; //Error
    const card = hand.find((card) => card.id === id);
    if(!card) return; //Error
    setHand(prev => prev?.filter(prev => prev !== card))
    selectCard(card);
    console.log("completed")
  }

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
    if (activeState === "starting game") dealWhites();
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
  ]);

  useEffect(() => {
    if(!hand) return;
      updatePresence({ CAHWhiteCardIds: hand.map((card) => card.id) });
  }, [hand, updatePresence])
  console.log(actionState)
  return (
    <div>
      {hand &&
        hand.map((card) => (
          <p
            key={card.id}
            data-id={card.id}
            onClick={(e) =>
              !isTurn &&
              actionState === "selecting" &&
              activeState === "waiting for players"
                ? cardClickHandler(e)
                : null
            }
          >
            {card.text}
          </p>
        ))}
    </div>
  );
};

export default PlayerDeck;
