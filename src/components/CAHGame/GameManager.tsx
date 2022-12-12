import { LiveList } from "@liveblocks/client";
import { useEffect } from "react";
import {
  useEventListener,
  useOthersMapped,
  useSelf,
  useUpdateMyPresence,
  useMutation as liveblocksMutation,
  useStorage,
  useBroadcastEvent,
} from "../../liveblocks.config";

const GameManager: React.FC = () => {
  const id = useSelf((me) => me.id);
  const updatePresence = useUpdateMyPresence();
  const blackCards = useSelf((me) => me.presence.CAHBlackCardIds);
  const isHost = useSelf((me) => me.presence.isHost);
  const othersDrawing = useOthersMapped(
    (others) => others.presence.currentAction
  );
  const gameState = useStorage((root) => root.CAH.activeState);
  const currentPlayerTurn = useStorage((root) => root.CAH.currentPlayerTurn);
  const broadcast = useBroadcastEvent();

  const startNewRound = liveblocksMutation(({ storage }) => {
    const currentPlayer = storage.get("CAH").get("currentPlayerTurn");
    const players = storage.get("CAH").get("connectedPlayers").toArray();
    if (!currentPlayer) throw new Error("No current player");
    const index = players.indexOf(currentPlayer);
    const nextPlayerIndex = index + 1 > players.length - 1 ? 0 : index + 1;
    const nextPlayer = players[nextPlayerIndex];
    storage.get("CAH").set("currentPlayerTurn", nextPlayer);
    storage.get("CAH").set("cardsInRound", new LiveList());
    storage.get("CAH").set("activeState", "waiting for players");
  }, []);

  useEventListener(({ event }) => {
    const e = event as {
      type: "game action" | "judge";
      action?: string;
      card?: { text: string; id: string; playerId: string };
    };
    if (e.type === "game action") {
      if (e.action === "start game") {
          if (id !== currentPlayerTurn) {
            updatePresence({ currentAction: "selecting" });
          }else {
          console.log("isTurn");
          updatePresence({ currentAction: "waiting" });
          updatePresence({ CAHturn: true });
        }
      }
    }
    if (e.type === "judge") {
      if (e.card) {
        if (e.card.playerId === id) {
          updatePresence({
            CAHBlackCardIds: blackCards
              ? [...blackCards, e.card.id]
              : [e.card.id],
          });
        }
      }
    }
  });

  useEffect(() => {
    if (isHost && gameState === "ending round") {
      let allDrawn = true;
      othersDrawing.forEach((other) => {
        if (other[1] === "drawing") {
          allDrawn = false;
        }
      });
      if (allDrawn) {
        startNewRound();
        broadcast({ type: "game action", action: "start game"} as never)
      }
    }
  }, [gameState, othersDrawing, isHost, startNewRound, broadcast]);

  return <></>;
};

export default GameManager;
