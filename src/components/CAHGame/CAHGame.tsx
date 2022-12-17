import {
  useSelf,
  useMutation as liveblocksMutation,
  useBroadcastEvent,
} from "../../liveblocks.config";
import CardDeck from "./CardDeck";
import GameArea from "./GameArea";
import GameManager from "./GameManager";
import InfoPanel from "./InfoPanel";
import JudgesLounge from "./JudgesLounge";
import PlayerContainer from "./PlayerContainer";
import PlayerDeck from "./PlayerDeck";

const CAHGame: React.FC = () => {
  const broadcast = useBroadcastEvent();

  const endGame = liveblocksMutation(async ({ storage, setMyPresence }) => {
    storage.set("currentGame", null);
    storage.get("CAH").set("currentPlayerDrawing", undefined);
    storage.get("CAH").set("cardsInRound", []);
    storage.get("CAH").set("currentPlayerTurn", undefined);
    storage.get("CAH").set("handsRevealed", 0);
    broadcast({ type: "game action", action: "end game" } as never);
    setMyPresence({ CAHturn: false });
    setMyPresence({ CAHBlackCardIds: [] });
    setMyPresence({ CAHWhiteCardIds: [] });
    setMyPresence({ CAHCardsPicked: [] });
    setMyPresence({ CAHCardsRevealed: 0 });
  }, []);
  const isHost = useSelf((me) => me.presence.isHost);

  return (
    <div className="flex flex-col overflow-y-scroll py-12">
      {isHost && (
        <button className="absolute top-0" onClick={endGame}>
          exit
        </button>
      )}
      <GameManager />
      <InfoPanel />
      <GameArea />
      <JudgesLounge />
      <PlayerContainer />
    </div>
  );
};

export default CAHGame;
