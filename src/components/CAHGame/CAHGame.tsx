import { LiveList } from "@liveblocks/client";
import {
  useSelf,
  useMutation as liveblocksMutation,
  useBroadcastEvent,
} from "../../liveblocks.config";
import GameArea from "./GameArea";
import GameManager from "./GameManager";
import PlayerDeck from "./PlayerDeck";

const CAHGame: React.FC = () => {

  const broadcast = useBroadcastEvent();

  const endGame = liveblocksMutation(async ({ storage, setMyPresence }) => {
    storage.set("currentGame", null);
    storage.get("CAH").set("currentPlayerDrawing", undefined);
    storage.get("CAH").set("cardsInRound", []);
    storage.get("CAH").set("currentPlayerTurn", undefined)
    broadcast({type: "game action", action: "end game"} as never)
    setMyPresence({ CAHturn: false });
    setMyPresence({ CAHBlackCardIds: [] });
    setMyPresence({ CAHWhiteCardIds: [] });
    setMyPresence({ CAHCardsPicked: [] });
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
