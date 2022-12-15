import { useEffect, useMemo, useState } from "react";
import {
  useStorage,
  useMutation as liveblocksMutation,
  useSelf,
} from "../../liveblocks.config";
import PickedHand from "./PickedHand";

const CardsInRound: React.FC = () => {
  const cardsInRound = useStorage((root) => root.CAH.cardsInRound);
  const [handsRevealed, setHandsRevealed] = useState(0);
  const animationAmt = useMemo(() => {
    if (handsRevealed === 0) return "0";
    const amt = (handsRevealed * .5) * 100;
    return `${amt}%`;
  }, [handsRevealed])

  return (
    <div className={`my-4 gap-4 flex self-start -translate-x-[${animationAmt}]`}>
        {cardsInRound &&
          cardsInRound.map((cards) => (
            <PickedHand key={cards.playerId} hand={cards} setHandsRevealed={setHandsRevealed} />
          ))}
    </div>
  );
};

export default CardsInRound;
