import { useStorage, useMutation as liveblocksMutation, useSelf } from "../../liveblocks.config";

const JudgesLoungeContent: React.FC = () => {
  const gameState = useStorage((root) => root.CAH.activeState);
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
  
  if (gameState === "waiting for players")
    return (
      <div>
        <p>Waiting for players to pick cards...</p>
      </div>
    );

  if(gameState === "players picked")    return <button onClick={setRevealing}>Show me the cards</button>;

  return null;
};

export default JudgesLoungeContent;
