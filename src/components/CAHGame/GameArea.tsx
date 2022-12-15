import { useStorage } from "../../liveblocks.config";
import BlackCard from "./BlackCard";
import RevealShowcase from "./RevealShowcase";
import CurrentPicks from "./CurrentPicks";
import JudgingArea from "./JudgingArea";

const GameArea: React.FC = () => {
  const currentBlackCard = useStorage((root) => root.CAH.currentBlackCard);
  const gameState = useStorage((root) => root.CAH.activeState);

  return (
    <div className="flex max-w-full flex-col items-center justify-center overflow-x-hidden py-4">
      {currentBlackCard && <BlackCard card={currentBlackCard} />}
      {(gameState === "judge revealing") && (
        <RevealShowcase />
      )}
      {gameState === "waiting for players" && <CurrentPicks />}
      {(gameState === "waiting for judge" ||
        gameState === "judge revealing") && <JudgingArea />}
    </div>
  );
};

export default GameArea;
