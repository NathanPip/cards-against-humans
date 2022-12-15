import { useStorage } from "../../liveblocks.config";
import PickedHand from "./PickedHand";

const JudgingArea: React.FC = () => {
  const cardsInRound = useStorage((root) => root.CAH.cardsInRound);
  const handsRevealed = useStorage((root) => root.CAH.handsRevealed);
    const gameState = useStorage((root) => root.CAH.activeState);

  return (
    <div className={`my-4 flex gap-4 self-start w-full justify-center flex-wrap`}>
      {cardsInRound &&
        (() => {
          const hands = [];
          if(gameState === "judge revealing"){
          for (let i = 0; i < handsRevealed; i++) {
            if (cardsInRound[i] !== undefined)
              hands.push(
                <PickedHand
                  key={cardsInRound[i]!.playerId}
                  hand={cardsInRound[i]!}
                  isJudgingHand={true}
                />
              );
          }
          } else {
            return cardsInRound.map((cards) => (
                <PickedHand key={cards.playerId} hand={cards} isJudgingHand={true}/>
            ));
          }
          return hands;
        })()}
    </div>
  );
};

export default JudgingArea;
