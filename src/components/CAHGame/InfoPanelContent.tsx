import { useSelf, useStorage } from "../../liveblocks.config";

const InfoPanelContent: React.FC = () => {
  const gameState = useStorage((root) => root.CAH.activeState);
  const actionState = useSelf((me) => me.presence.currentAction);

  return (
    <p className="flex justify-center text-xl mt-2 text-shadow-lg font-semibold">
      {(gameState === "waiting for players" && actionState === "waiting") ||
      gameState === "waiting for players to draw"
        ? "Waiting for players to draw Cards"
        : ""}
        {gameState === "players picked" ? "Waiting for Judge to Start" : ""}
        {gameState === "judge revealing" ? "Judge Revealing Cards" : ""}
        {gameState === "waiting for judge" ? "Judge Picking a Winner" : ""}
        {gameState === "ready to start round" ? "Waiting for Judge to Start Next Round" : ""}
    </p>
  );
};

export default InfoPanelContent;
