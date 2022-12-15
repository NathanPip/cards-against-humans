import { LiveList } from "@liveblocks/client";
import { type Card } from "../../types/game";
import WhiteCard from "./WhiteCard";
import {
  useBroadcastEvent,
  useMutation as liveblocksMutation,
  useSelf,
  useStorage,
} from "../../liveblocks.config";
import { useEffect, useState } from "react";

type PickedHandProps = {
  hand: { readonly cards: readonly Readonly<Required<Card>>[]; readonly playerId: string };
};

const PickedHand: React.FC<PickedHandProps> = ({ hand }) => {
  const gameState = useStorage((root) => root.CAH.activeState);
  const isTurn = useSelf((me) => me.presence.CAHturn);
  const broadcast = useBroadcastEvent();
  const [numRevealed, setNumRevealed] = useState(0);
  const [canMove, setCanMove] = useState(false);
  const [clicked, setClicked] = useState(false);
  const handsRevealed = useStorage((root) => root.CAH.handsRevealed);
  const connectedPlayersLength = useStorage((root) => root.CAH.connectedPlayers.length);

  const chooseWinner = liveblocksMutation(
    async ({ storage, setMyPresence }, id: string) => {
      storage.get("CAH").set("activeState", "ending round");
      const currentBlackCard = storage.get("CAH").get("currentBlackCard");
      const hand = storage
        .get("CAH")
        .get("cardsInRound")
        ?.filter((hand) => hand.playerId === id)[0];
      if (hand === undefined) throw new Error("No winning hand found");
      storage.get("CAH").set("cardsInRound", [hand]);
      broadcast({ type: "judge", data: { id, card: currentBlackCard } } as never);
      setMyPresence({ currentAction: "waiting" });
    },
    []
  );

  const setJudging = liveblocksMutation(
    async ({ storage, self, setMyPresence }) => {
      storage.get("CAH").set("activeState", "waiting for judge");
      storage.get("CAH").set("handsRevealed", 0);
      const isTurn = self.presence.CAHturn;
      if (isTurn) {
        console.log("I am judge");
        setMyPresence({ currentAction: "judging" });
      }
    },
    []
  );

  const incrementHandsRevealedAmt = liveblocksMutation(
    async ({ storage } ) => {
      const handsRevealed = storage.get("CAH").get("handsRevealed");
      storage.get("CAH").set("handsRevealed", handsRevealed + 1);
    }, []
  )

  const handClickHandler = () => {
    if (gameState === "waiting for judge" && isTurn) {
      chooseWinner(hand.playerId);
    }
  };

  const nextClickHandler = () => {
    if (gameState === "judge revealing" && isTurn && !clicked) {
      if(handsRevealed === connectedPlayersLength - 2) {
        setJudging();
        setClicked(true);
        return;
      }
      console.log("clicked");
      incrementHandsRevealedAmt()
      setClicked(true);
    } 
  }
  console.log(gameState);
  useEffect(() => {
    if (numRevealed === hand.cards.length) {
      setCanMove(true);
    }
  }, [numRevealed, setCanMove, hand.cards.length])

  return (
    <div onClick={handClickHandler} className={`${gameState !== "waiting for judge" ? "w-screen" : ""} gap-2 flex flex-col items-center`}>
      <button onClick={nextClickHandler} className={`${!canMove || clicked ? "hidden" : ""} text-white text-xl`}>Next Hand</button>
      {hand.cards.map((card) => {
        return <WhiteCard key={card.id} card={card} type="round" setRevealedAmt={setNumRevealed} />;
      })}
    </div>
  );
};

export default PickedHand;
