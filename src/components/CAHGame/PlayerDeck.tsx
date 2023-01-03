import {  useEffect, useState } from "react";
import {
  useSelf,
  useMutation as liveblocksMutation,
  useStorage,
  useUpdateMyPresence,
  useBroadcastEvent
} from "../../liveblocks.config";
import { useGameStore } from "../../pages/lobby/[id]";
import { type Card } from "../../types/game";
import WhiteCard from "./WhiteCard";

const PlayerDeck: React.FC = () => {
  const updatePresence = useUpdateMyPresence();
  const currentPlayerDrawing = useStorage(
    (root) => root.CAH.currentPlayerDrawing
  );
  const connectedPlayers = useStorage((root) => root.CAH.connectedPlayers);
  const whiteCards = useGameStore((state) => state.whiteCards);
  const whiteCardsPerPlayer = useStorage(
    (root) => root.CAH.options.whiteCardsPerPlayer
  );

  const broadcast = useBroadcastEvent();
  
  const selfId = useSelf((me) => me.id);

  const gameState = useStorage((root) => root.CAH.activeState);

  const isHost = useSelf((me) => me.presence.isHost);

  const hand = useGameStore(state => state.hand)
  const addToHand = useGameStore(state => state.addToHand)
  const setHand = useGameStore(state => state.setHand)

  // Initial Draw BE CAREFUL ** CHECKS FAIL AFTER FIRST FULL RUN THROUGH SO DON'T WORRY TOO MUCH **
  useEffect(() => {
    if(!selfId) return;
    if(gameState === "starting game") {
      const index = connectedPlayers.indexOf(selfId);
      const startingHand = whiteCards.splice(index * whiteCardsPerPlayer, whiteCardsPerPlayer);
      setHand(startingHand);
    }
  }, [gameState, selfId, connectedPlayers, whiteCards, whiteCardsPerPlayer, setHand])

  useEffect(() => {
    if(!hand) return;
      updatePresence({ CAHWhiteCardIds: hand.map((card) => card.id) });
  }, [hand, updatePresence])

  return (
    <div className="player_deck p-4 mb-4 flex gap-4 overflow-x-scroll overflow-y-visible">
      {hand &&
        hand.map((card, index) => (
          <WhiteCard card={card} type="hand" key={card.id + index*Math.random()}/>
        )).reverse()}
        {/* {hand && <CardDeck />} */}
    </div>
  );
};

export default PlayerDeck;
