import { useEffect, useMemo, useState } from "react";
import { useOthersMapped, useSelf, useStorage } from "../../liveblocks.config";

const WinnersText: React.FC = () => {
  const [currentWinnerId, setCurrentWinnerId] = useState<string | null>(null);

  const gameState = useStorage((root) => root.CAH.activeState);

  const myId = useSelf((me) => me.id);
  const myName = useSelf((me) => me.presence.name);

  const othersIds = useOthersMapped((other) => other.id);
  const othersNames = useOthersMapped((other) => other.presence.name);
  const winnerConnectionId = othersIds.find((id) => id[1] === currentWinnerId);
  const winnerName = useMemo(() => {
      if(currentWinnerId === myId) return myName;
      if (!winnerConnectionId) return null;
    const name = othersNames.find(
      (other) => other[0] === winnerConnectionId[0]
    );
    if (!name) return null;
    return name[1];
  }, [winnerConnectionId, currentWinnerId, othersNames, myId, myName]);

  useEffect(() => {
    window.addEventListener("winner chosen", (event) => {
      const e = event as CustomEvent;
      const id = e.detail;
      setCurrentWinnerId(id);
    });
  }, []);

  if (
    gameState !== "ending round" &&
    gameState !== "waiting for players to draw" &&
    gameState !== "ready to start round"
  ) return null;
    return <p className="text-2xl left-1/2 -translate-x-1/2text-center text-shadow-lg font-semibold">{winnerName} has won the round</p>;
};

export default WinnersText;
