import { LiveList } from "@liveblocks/client";
import {
  useSelf,
  useMutation as liveblocksMutation,
  useEventListener,
  useUpdateMyPresence,
} from "../../liveblocks.config";
import GameArea from "./GameArea";
import GameManager from "./GameManager";
import PlayerDeck from "./PlayerDeck";

const CAHGame: React.FC = () => {
  const endGame = liveblocksMutation(async ({ storage }) => {
    storage.set("currentGame", null);
    storage.get("CAH").set("currentPlayerDrawing", undefined);
    storage.get("CAH").set("cardsInRound",new LiveList());
  }, []);
  const isHost = useSelf((me) => me.presence.isHost);


  
  return (
    <>
      {isHost && <button onClick={endGame}>exit</button>}
      <GameArea />
      <PlayerDeck />
      <GameManager />
    </>
  );
};

export default CAHGame;
