import {
  useSelf,
  useMutation as liveblocksMutation,
  useEventListener,
  useUpdateMyPresence,
} from "../../liveblocks.config";
import GameArea from "./GameArea";
import PlayerDeck from "./PlayerDeck";

const CAHGame: React.FC = () => {
  const endGame = liveblocksMutation(async ({ storage }) => {
    storage.set("currentGame", null);
    storage.get("CAH").set("currentPlayerDrawing", undefined);
  }, []);
  const isHost = useSelf((me) => me.presence.isHost);
  const updatePresence = useUpdateMyPresence();

  useEventListener(({event}) => {
    const e = event as {type: string, action: string}
    if(e.type === "game action") {
        if(e.action === "start game") {
            updatePresence({currentAction: "selecting"})
        }
    }
  })

  return (
    <>
      {isHost && <button onClick={endGame}>exit</button>}
      <GameArea />
      <PlayerDeck />
    </>
  );
};

export default CAHGame;
