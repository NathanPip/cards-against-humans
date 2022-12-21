import {
  useStorage,
  useMutation as liveblocksMutation,
  useBroadcastEvent,
  useSelf,
} from "../../liveblocks.config";

const JudgesLoungeContent: React.FC = () => {
  const gameState = useStorage((root) => root.CAH.activeState);
  const isHost = useSelf((me) => me.presence.isHost);
  const setRevealing = liveblocksMutation(
    async ({ storage, self, setMyPresence }) => {
      storage.get("CAH").set("activeState", "judge revealing");
      const isTurn = self.presence.CAHturn;
      if (isTurn) {
        setMyPresence({ currentAction: "revealing" });
      }
    },
    []
  );

  const broadcast = useBroadcastEvent();

  const newRoundClickHandler = () => {
    if (!isHost) {
      broadcast({ type: "judge", action: "start round" });
    } else {
      window.dispatchEvent(new CustomEvent("start round"));
    }
  };

  if (gameState === "waiting for players")
    return (
      <p className="mt-2 text-xl font-semibold text-shadow-lg">
        Waiting for players to pick cards...
      </p>
    );

  if (gameState === "waiting for players to draw")
    return (
      <p className="mt-2 text-xl font-semibold text-shadow-lg">
        Waiting for players to draw cards...
      </p>
    );

  if (gameState === "players picked")
    return <button className="text-xl mt-2 text-shadow-lg font-semibold bg-zinc-50 hover:bg-zinc-300 transition-colors p-3 rounded-md" onClick={setRevealing}>Show me the cards</button>;
  if (gameState === "ready to start round")
    return <button className="text-xl mt-2 text-shadow-lg font-semibold bg-zinc-50 hover:bg-zinc-300 transition-colors p-3 rounded-md" onClick={newRoundClickHandler}>Start new Round</button>;

  return null;
};

export default JudgesLoungeContent;
