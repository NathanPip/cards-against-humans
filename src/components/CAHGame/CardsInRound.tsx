import { useEffect } from "react";
import {
  useStorage,
  useMutation as liveblocksMutation,
  useSelf,
} from "../../liveblocks.config";
import PickedHand from "./PickedHand";

const CardsInRound: React.FC = () => {
  const cardsInRound = useStorage((root) => root.CAH.cardsInRound);

  return (
    <div className="my-4 gap-4 flex self-start">
        {cardsInRound &&
          cardsInRound.map((cards) => (
            <PickedHand key={cards.playerId} hand={cards} />
          ))}
    </div>
  );
};

export default CardsInRound;
