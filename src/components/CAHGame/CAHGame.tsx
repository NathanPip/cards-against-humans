import {
  useSelf,
  useMutation as liveblocksMutation,
} from "../../liveblocks.config";
import PlayerDeck from "./PlayerDeck";

const CAHGame: React.FC = () => {
  const endGame = liveblocksMutation(async ({ storage }) => {
    storage.set("currentGame", null);
    storage.get("CAH").set("currentPlayerDrawing", undefined);
  }, []);
  const isHost = useSelf((me) => me.presence.isHost);

  return (
    <>
      {isHost && <button onClick={endGame}>exit</button>}
      <PlayerDeck />
    </>
  );
};

export default CAHGame;
