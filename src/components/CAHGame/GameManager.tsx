import { type LiveObject } from "@liveblocks/client";
import { createContext, useEffect } from "react";
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
  const CAHCardsPicked = useSelf((me) => me.presence.CAHCardsPicked);
  const gameState = useStorage((root) => root.CAH.activeState);
  const currentBlackCard = useStorage((root) => root.CAH.currentBlackCard);
  const currentPlayerTurn = useStorage((root) => root.CAH.currentPlayerTurn);
  const broadcast = useBroadcastEvent();
  const actionState = useSelf((me) => me.presence.currentAction);
  const whiteCardsInHand = useSelf((me) => me.presence.CAHWhiteCardIds);
  const whiteCardsPerPlayer = useStorage(
    (root) => root.CAH.options.whiteCardsPerPlayer
  );

  const currentPlayerDrawing = useStorage(
    (root) => root.CAH.currentPlayerDrawing
  );

  const startNewRound = liveblocksMutation(({ storage, setMyPresence }) => {
    const currentPlayer = storage.get("CAH").get("currentPlayerTurn");
    const players = storage.get("CAH").get("connectedPlayers");
    if (!currentPlayer) throw new Error("No current player");
    const index = players.indexOf(currentPlayer);
    const nextPlayerIndex = index + 1 > players.length - 1 ? 0 : index + 1;
    const nextPlayer = players[nextPlayerIndex];

    const currentBlackCard = storage.get("CAH").get("currentBlackCard");
    const blackCards = storage.get("CAH").get("blackCards");
    const blackCardIndex = blackCards.indexOf(currentBlackCard);
    const nextBlackCardIndex =
      blackCardIndex + 1 > blackCards.length - 1 ? 0 : blackCardIndex + 1;
    const nextBlackCard = blackCards[nextBlackCardIndex];
    if (!nextBlackCard) throw new Error("No next black card found");
    storage.get("CAH").set("currentBlackCard", nextBlackCard);
    storage.get("CAH").set("currentPlayerTurn", nextPlayer);
    storage.get("CAH").set("cardsInRound", []);
    storage.get("CAH").set("activeState", "waiting for players");

    setMyPresence({ CAHCardsPicked: []})

    if (id !== nextPlayer) {
      console.log("notTurn");
      setMyPresence({ currentAction: "selecting" });
      setMyPresence({ CAHturn: false });
    } else {
      console.log("isTurn");
      setMyPresence({ currentAction: "waiting" });
      setMyPresence({ CAHturn: true });
    }
    broadcast({ type: "game action", action: "start game" } as never);
  }, []);

  const setWhiteCardsToPick = liveblocksMutation(({ storage }, num: number) => {
    storage.get("CAH").set("whiteCardsToPick", num);
  }, []);

  // LIVEBLOCKS EVENT LISTENER
  useEventListener(({ event }) => {
    // GAME STATE EVENTS
    if (event.type === "game action") {
      if (event.action === "start game") {
        console.log(id);
        console.log(currentPlayerTurn);
        if (id !== currentPlayerTurn) {
          console.log("notTurn");
          updatePresence({ currentAction: "selecting" });
          updatePresence({ CAHturn: false });
        } else {
          console.log("isTurn");
          updatePresence({ currentAction: "waiting" });
          updatePresence({ CAHturn: true });
        }
        updatePresence({ CAHCardsPicked: [] });
      }

      if (event.action === "end game") {
        updatePresence({ currentAction: "waiting" });
        updatePresence({ CAHturn: false });
        updatePresence({ CAHBlackCardIds: [] });
        updatePresence({ CAHCardsPicked: [] });
      }
    }

    // JUDGE EVENTS
    if (event.type === "judge") {
      console.log(event);
      if (event.data) {
        if (event.data.id === id) {
          if (!event.data.card.id) throw new Error("no card id");
          updatePresence({
            CAHBlackCardIds: blackCards
              ? [...blackCards, event.data.card.id]
              : [event.data.card.id],
          });
          console.log("won");
        }
      }
    }
  });

  // START GAME ONCE PLAYERS HAVE DRAWN
  const startGame = liveblocksMutation(
    async ({ storage, setMyPresence }) => {
      const currentTurn = storage.get("CAH").get("currentPlayerTurn");
      if (id !== currentTurn) {
        console.log("notTurn");
        setMyPresence({ currentAction: "selecting" });
        updatePresence({ CAHturn: false });
      } else {
        console.log("isTurn");
        setMyPresence({ currentAction: "waiting" });
        setMyPresence({ CAHturn: true });
      }
      storage.get("CAH").set("activeState", "waiting for players");
      broadcast({ type: "game action", action: "start game" } as never);
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
    }
  }, [isHost, currentPlayerDrawing, gameState, startGame, broadcast]);

  // TRIGGER RESTART ROUND
  useEffect(() => {
    if (isHost && gameState === "ending round") {
      let allDrawn = true;
      othersDrawing.forEach((other) => {
        // if any other player is still drawing, don't start new round
        console.log(other[1])
        if (other[1] === "drawing" || actionState === "drawing") {
          allDrawn = false;
        }
      });
      console.log(allDrawn)
      if (allDrawn) {
        startNewRound();
        // broadcast({ type: "game action", action: "start game" } as never);
      }
    }
  }, [gameState, othersDrawing, isHost, startNewRound, broadcast, actionState]);

  // SET AMOUNT OF WHITE CARDS TO PICK
  useEffect(() => {
    if (currentBlackCard && isHost) {
      const whiteCardAmt = currentBlackCard.text.split("_").length - 1;
      setWhiteCardsToPick(whiteCardAmt);
    }
  }, [currentBlackCard, setWhiteCardsToPick, isHost]);

  // STOP DRAWING ONCE ALL CARDS HAVE BEEN PICKED
  useEffect(() => {
    if (gameState === "dealing whites") return;
    if (actionState !== "drawing") return;
    if (!whiteCardsInHand || !whiteCardsPerPlayer) return;
    console.log(whiteCardsInHand.length >= whiteCardsPerPlayer)
    if (whiteCardsInHand.length >= whiteCardsPerPlayer) {
      updatePresence({ currentAction: "waiting" });
    }
  }, [gameState, whiteCardsInHand, whiteCardsPerPlayer, updatePresence]);

  return <></>;
};

export default GameManager;
