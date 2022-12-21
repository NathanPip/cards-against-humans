import { useEffect, useMemo, useState } from "react";
import {
  useStorage,
} from "../../liveblocks.config";
import PickedHand from "./PickedHand";

const RevealShowcase: React.FC = () => {
  const cardsInRound = useStorage((root) => root.CAH.cardsInRound);
  const [handsRevealed, setHandsRevealed] = useState(0);
  const animationAmt = useMemo(() => {
    if (handsRevealed === 0) return "0";
    const amt = (handsRevealed * 100);
    return `${amt}%`;
  }, [handsRevealed])
  const handsRevealedStorage = useStorage((root) => root.CAH.handsRevealed);

  useEffect(() => {
    setHandsRevealed(handsRevealedStorage)
  }, [handsRevealedStorage, setHandsRevealed])

  return (
    <div style={{transform: `translateX(-${animationAmt})`}} className={`mt-4 mb-10 w-full self-start flex overflow-visible`}>
        {cardsInRound &&
          cardsInRound.map((cards) => (
            <PickedHand key={cards.playerId} hand={cards} />
          ))}
    </div>
  );
};

export default RevealShowcase;
