import { useStorage } from "../../liveblocks.config";
import BlackCard from "./BlackCard";
import RevealShowcase from "./RevealShowcase";
import CurrentPicks from "./CurrentPicks";
import JudgingArea from "./JudgingArea";

const GameArea: React.FC = () => {
  const gameState = useStorage((root) => root.CAH.activeState);

  return (
    <div className="flex max-w-full flex-col items-center justify-center overflow-x-hidden py-4">
      <BlackCard />
      {gameState === "judge revealing" && <RevealShowcase />}
      {(gameState === "waiting for players" ||
        gameState === "players picked") && <CurrentPicks />}
      {(gameState === "waiting for judge" ||
        gameState === "judge revealing" ||
        gameState === "waiting for players to draw" ||
        gameState === "ready to start round") && <JudgingArea />}
    </div>
  );
};

export default GameArea;
