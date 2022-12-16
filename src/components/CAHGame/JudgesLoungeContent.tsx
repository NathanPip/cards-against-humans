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
        console.log("I am judge");
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
      <div>
        <p>Waiting for players to pick cards...</p>
      </div>
    );

  if (gameState === "players picked")
    return <button onClick={setRevealing}>Show me the cards</button>;

  if (gameState === "waiting for players to draw")
    return <p>Waiting for players to draw cards...</p>;

  if (gameState === "ready to start round")
    return <button onClick={newRoundClickHandler}>Start new Round</button>;

  return null;
};

export default JudgesLoungeContent;
