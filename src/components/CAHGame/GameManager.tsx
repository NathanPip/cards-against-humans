import { type LiveObject } from "@liveblocks/client";
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
import { type Card } from "../../types/game";

const GameManager: React.FC = () => {
  const id = useSelf((me) => me.id);
  const updatePresence = useUpdateMyPresence();
  const blackCards = useSelf((me) => me.presence.CAHBlackCardIds);
  const isHost = useSelf((me) => me.presence.isHost);
  const othersDrawing = useOthersMapped(
    (others) => others.presence.currentAction
  );
  const gameState = useStorage((root) => root.CAH.activeState);
  const currentBlackCard = useStorage((root) => root.CAH.currentBlackCard);
  const currentPlayerTurn = useStorage((root) => root.CAH.currentPlayerTurn);
  const broadcast = useBroadcastEvent();

  const currentPlayerDrawing = useStorage(
    (root) => root.CAH.currentPlayerDrawing
  );

  const startNewRound = liveblocksMutation(({ storage }) => {
    const currentPlayer = storage.get("CAH").get("currentPlayerTurn");
    const players = storage.get("CAH").get("connectedPlayers").toArray();
    if (!currentPlayer) throw new Error("No current player");
    const index = players.indexOf(currentPlayer);
    const nextPlayerIndex = index + 1 > players.length - 1 ? 0 : index + 1;
    const nextPlayer = players[nextPlayerIndex];
    storage.get("CAH").set("currentPlayerTurn", nextPlayer);
    storage.get("CAH").set("cardsInRound", []);
    storage.get("CAH").set("activeState", "waiting for players");
  }, []);

  const setWhiteCardsToPick = liveblocksMutation(({ storage }, num: number) => {
    storage.get("CAH").set("whiteCardsToPick", num);
  }, []);

  // LIVEBLOCKS EVENT LISTENER
  useEventListener(({ event }) => {
    const e = event as {
      type: "game action" | "judge";
      action?: string;
      data?: {id: string;
      card: Card;
      }
    };
    // GAME STATE EVENTS
    if (e.type === "game action") {
      if (e.action === "start game") {
        if (id !== currentPlayerTurn) {
          console.log("notTurn");
          updatePresence({ currentAction: "selecting" });
          updatePresence({ CAHturn: false });
        } else {
          console.log("isTurn");
          updatePresence({ currentAction: "waiting" });
          updatePresence({ CAHturn: true });
        }
      }

      if(e.action === "end game") {
        updatePresence({ currentAction: "waiting" });
        updatePresence({ CAHturn: false });
        updatePresence({ CAHBlackCardIds: [] });
        updatePresence({ CAHWhiteCardIds: [] });
        updatePresence({ CAHCardsPicked: [] });
      }
    }

    // JUDGE EVENTS
    if (e.type === "judge") {
      console.log(e);
      if (e.data) {
        if (e.data.id === id) {
          if(!e.data.card.id) throw new Error("no card id");
          updatePresence({
            CAHBlackCardIds: blackCards
              ? [...blackCards, e.data.card.id]
              : [e.data.card.id],
          });
          console.log("won");
        }
      }
    }
  });

  // START GAME ONCE PLAYERS HAVE DRAWN
  const startGame = liveblocksMutation(
    async ({ storage, self, setMyPresence }) => {
      if (id !== currentPlayerTurn) {
        console.log("notTurn");
        setMyPresence({ currentAction: "selecting" });
        updatePresence({ CAHturn: false });
      } else {
        console.log("isTurn");
        setMyPresence({ currentAction: "waiting" });
        setMyPresence({ CAHturn: true });
      }
      storage.get("CAH").set("activeState", "waiting for players");
    },
    []
  );

  useEffect(() => {
    if (
      isHost &&
      currentPlayerDrawing === "" &&
      gameState === "dealing whites"
    ) {
      startGame();
      broadcast({ type: "game action", action: "start game" } as never);
    }
  }, [isHost, currentPlayerDrawing, gameState, startGame, broadcast]);

  // TRIGGER RESTART ROUND
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
        broadcast({ type: "game action", action: "start game" } as never);
      }
    }
  }, [gameState, othersDrawing, isHost, startNewRound, broadcast]);

  // SET AMOUNT OF WHITE CARDS TO PICK
  useEffect(() => {
    if (currentBlackCard && isHost) {
      const whiteCardAmt = currentBlackCard.text.split("_").length - 1;
      setWhiteCardsToPick(whiteCardAmt);
    }
  }, [currentBlackCard, setWhiteCardsToPick, isHost]);

  return <></>;
};

export default GameManager;
