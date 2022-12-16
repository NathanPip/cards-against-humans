import { useSelf, useStorage } from "../../liveblocks.config";

const InfoPanelContent: React.FC = () => {
  const gameState = useStorage((root) => root.CAH.activeState);
  const actionState = useSelf((me) => me.presence.currentAction);

  if (
    (gameState === "waiting for players" && actionState === "selecting") ||
    (gameState === "waiting for players to draw" && actionState === "drawing")
  )
    return <p>Draw a card</p>;
  if (
    (gameState === "waiting for players" && actionState === "waiting") ||
    gameState === "waiting for players to draw"
  )
    return <p>Waiting for players to draw Cards</p>;

  if (gameState === "players picked") return <p>Waiting for Judge</p>;
  if (gameState === "judge revealing") return <p>Judge Revealing Cards</p>;
  if (gameState === "waiting for judge") return <p>Judge picking a winner</p>;
  if (gameState === "ready to start round") return <p>Waiting for Judge to start next round</p>;
  return null;
};

export default InfoPanelContent;
