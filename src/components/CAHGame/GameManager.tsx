import { useContext, useEffect } from "react";
import { z } from "zod";
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
  const myId = useSelf((me) => me.id);
  const updatePresence = useUpdateMyPresence();
  const blackCards = useSelf((me) => me.presence.CAHBlackCardIds);
  const isHost = useSelf((me) => me.presence.isHost);
  const othersDrawing = useOthersMapped(
    (others) => others.presence.currentAction
  );
  const gameStarted = useStorage((root) => root.CAH.started);
  const currentHost = useStorage((root) => root.CAH.currentHost);
  const otherIds = useOthersMapped((others) => others.id);
  const cardsInRound = useStorage((root) => root.CAH.cardsInRound);
  const gameState = useStorage((root) => root.CAH.activeState);
  const currentBlackCard = useStorage((root) => root.CAH.currentBlackCard);
  const currentPlayerTurn = useStorage((root) => root.CAH.currentPlayerTurn);
  const broadcast = useBroadcastEvent();
  const actionState = useSelf((me) => me.presence.currentAction);
  const othersActions = useOthersMapped(
    (others) => others.presence.currentAction
  );
  const currentPlayerDrawing = useStorage(
    (root) => root.CAH.currentPlayerDrawing
  );
  const connectedPlayers = useStorage((root) => root.CAH.connectedPlayers);

  ///////////////////////////////// EVENT LISTENER //////////////////////////////////////

  // LIVEBLOCKS EVENT LISTENER
  useEventListener(({ event }) => {
    // GAME STATE EVENTS
    if (event.type === "game action") {
      // check if it's player's turn and update presence
      if (event.action === "start game") {
        if (myId !== currentPlayerTurn) {
          console.log("notTurn");
          updatePresence({ currentAction: "selecting" });
          updatePresence({ CAHturn: false });
        } else {
          console.log("isTurn");
          updatePresence({ currentAction: "waiting" });
          updatePresence({ CAHturn: true });
        }
        updatePresence({ CAHCardsPicked: [] });
        updatePresence({ CAHCardsRevealed: 0 });
      }

      if (event.action === "end game") {
        updatePresence({ currentAction: "waiting" });
        updatePresence({ CAHturn: false });
        updatePresence({ CAHBlackCardIds: [] });
        updatePresence({ CAHCardsPicked: [] });
        updatePresence({ CAHCardsRevealed: 0 });
      }
    }

    // JUDGE EVENTS
    if (event.type === "judge") {
      // check if player has won round and update presence
      if (event.data) {
        if (event.data.id === myId) {
          if (!event.data.card.id) throw new Error("no card id");
          updatePresence({
            CAHBlackCardIds: blackCards
              ? [...blackCards, event.data.card.id]
              : [event.data.card.id],
          });
        }
      }
    }
  });


  ///////////////////////////////// GAME STATE MUTATIONS //////////////////////////////////////

  // STARTING A NEW ROUND
  const startNewRound = liveblocksMutation(({ storage, setMyPresence }) => {
    // set the next player turn
    const currentPlayer = storage.get("CAH").get("currentPlayerTurn");
    const players = storage.get("CAH").get("connectedPlayers");
    if (!currentPlayer) throw new Error("No current player");
    const index = players.indexOf(currentPlayer);
    const nextPlayerIndex = index + 1 > players.length - 1 ? 0 : index + 1;
    const nextPlayer = players[nextPlayerIndex];
    storage.get("CAH").set("currentPlayerTurn", nextPlayer);

    // set the next black card
    const currentBlackCard = storage.get("CAH").get("currentBlackCard");
    const blackCards = storage.get("CAH").get("blackCards");
    const blackCardIndex = blackCards.indexOf(currentBlackCard);
    const nextBlackCardIndex =
      blackCardIndex + 1 > blackCards.length - 1 ? 0 : blackCardIndex + 1;
    const nextBlackCard = blackCards[nextBlackCardIndex];
    if (!nextBlackCard) throw new Error("No next black card found");
    storage.get("CAH").set("currentBlackCard", nextBlackCard);

    // reset round data
    storage.get("CAH").set("cardsInRound", []);
    storage.get("CAH").set("handsRevealed", 0);

    // set game state to starting round
    storage.get("CAH").set("activeState", "starting round");

    // since person whos turn ran function is the only client who can run function, update their presence based on new data
    setMyPresence({ CAHCardsPicked: [] });
    setMyPresence({ CAHCardsRevealed: 0 });

    console.log("my id is", myId);
    console.log("current player turn is", nextPlayer);

    if (myId !== nextPlayer) {
      console.log("notTurn");
      setMyPresence({ currentAction: "selecting" });
      setMyPresence({ CAHturn: false });
    } else {
      console.log("isTurn");
      setMyPresence({ currentAction: "waiting" });
      setMyPresence({ CAHturn: true });
    }
  }, []);

  // starts a new round when all players are ready
  const setRoundStart = liveblocksMutation(({ storage }) => {
    storage.get("CAH").set("activeState", "waiting for players");
  }, []);

  const setReadyToStartRound = liveblocksMutation(({ storage }) => {
    storage.get("CAH").set("activeState", "ready to start round");
  }, []);

  const setWaitingForPlayersToDraw = liveblocksMutation(({ storage }) => {
    storage.get("CAH").set("activeState", "waiting for players to draw");
  }, []);

  // if host, check if all players are ready to start new round, and if so, start new round
  useEffect(() => {
    if (gameState === "starting round" && isHost) {
      let allReady = true;
      othersActions.forEach((other) => {
        // if any other player is still waiting for data, don't start new round
        if (other[1] !== "ready to start") {
          allReady = false;
        }
      });
      if (allReady) {
        broadcast({ type: "game action", action: "start game" });
        setRoundStart();
        window.dispatchEvent(new CustomEvent("start new game"));
      }
    }
  }, [gameState, isHost, othersActions, broadcast, setRoundStart]);

  // if NOT host and game state is starting round, check if other data has changed, and if changes have been received, set ready to start
  useEffect(() => {
    if (
      gameState === "starting round" &&
      !isHost &&
      cardsInRound?.length === 0
    ) {
      updatePresence({ currentAction: "ready to start" });
    }
  }, [gameState, isHost, cardsInRound, updatePresence]);

  useEffect(() => {
    if(!isHost) return;
    const handler = () => {
        startNewRound();
    }
    window.addEventListener("start round", handler)
    return () => window.removeEventListener("start round", handler)
  }, [isHost, startNewRound])

  useEventListener(({event}) => {
    if(!isHost) return;
    if(event.type === "judge") {
      if(event.action === "start round") {
        startNewRound();
      }
    }
  });

  // triggers ready for restart round if all players have drawn and round has ended
  useEffect(() => {
    if (isHost && (gameState === "ending round" || gameState === "waiting for players to draw")) {
      let allDrawn = true;
      othersDrawing.forEach((other) => {
        // if any other player is still drawing, don't start new round
        console.log(other[1]);
        if (other[1] === "drawing" || actionState === "drawing") {
          allDrawn = false;
        }
      });
      console.log(allDrawn);
      if (allDrawn) {
        setReadyToStartRound();
      } else {
        setWaitingForPlayersToDraw();
      }
    }
  }, [gameState, othersDrawing, isHost, setReadyToStartRound, setWaitingForPlayersToDraw, broadcast, actionState]);

  /////////////////////////////// GAME START //////////////////////////////////////

  // START GAME ONCE PLAYERS HAVE DRAWN
  const startGame = liveblocksMutation(async ({ storage, setMyPresence }) => {
    const currentTurn = storage.get("CAH").get("currentPlayerTurn");
    if (myId !== currentTurn) {
      console.log("notTurn");
      setMyPresence({ currentAction: "selecting" });
      updatePresence({ CAHturn: false });
    } else {
      console.log("isTurn");
      setMyPresence({ currentAction: "waiting" });
      setMyPresence({ CAHturn: true });
    }
    storage.get("CAH").set("activeState", "waiting for players");
    storage.get("CAH").set("handsRevealed", 0);
    storage.get("CAH").set("started", true);
    broadcast({ type: "game action", action: "start game" } as never);
  }, []);

  useEffect(() => {
    if (
      isHost &&
      currentPlayerDrawing === "" &&
      gameState === "dealing whites"
    ) {
      startGame();
    }
  }, [isHost, currentPlayerDrawing, gameState, startGame, broadcast]);

  // set amount of white cards to pick
  const setWhiteCardsToPick = liveblocksMutation(({ storage }, num: number) => {
    storage.get("CAH").set("whiteCardsToPick", num);
  }, []);

  // check amount of white cards that are needed for black card and set that amount
  useEffect(() => {
    if (currentBlackCard && isHost) {
      const whiteCardAmt = currentBlackCard.text.split("_").length - 1;
      setWhiteCardsToPick(whiteCardAmt);
    }
  }, [currentBlackCard, setWhiteCardsToPick, isHost]);

  // SET JUDGING STATE WHEN ALL PLAYERS HAVE PICKED

  const setPlayersReady = liveblocksMutation(
    async ({ storage }) => {
      storage.get("CAH").set("activeState", "players picked");},
      []
  )

  useEffect(() => {
    if (gameState === "waiting for players") {
      if (cardsInRound?.length === connectedPlayers.length - 1) {
        setPlayersReady();
      }
    }
  }, [cardsInRound, connectedPlayers, setPlayersReady, gameState]);

  // End Game and Reset Game State
  const endGame = liveblocksMutation(async ({ storage, setMyPresence }) => {
    storage.set("currentGame", null);
    storage.get("CAH").set("currentPlayerDrawing", undefined);
    storage.get("CAH").set("cardsInRound", []);
    storage.get("CAH").set("currentPlayerTurn", undefined);
    storage.get("CAH").set("handsRevealed", 0);
    storage.get("CAH").set("started", false);
    broadcast({ type: "game action", action: "end game" } as never);
    setMyPresence({ CAHturn: false });
    setMyPresence({ CAHBlackCardIds: [] });
    setMyPresence({ CAHWhiteCardIds: [] });
    setMyPresence({ CAHCardsPicked: [] });
    setMyPresence({ CAHCardsRevealed: 0 });
  }, [broadcast]);

  // Listen for end game event
  useEffect(() => {
    const handler = () => {
      endGame();
    }
    window.addEventListener("end game", handler)
    return () => window.removeEventListener("end game", handler)
  }, [endGame])

  //disconnect player based on id
  const disconnectPlayer = liveblocksMutation(({storage}, playerId: string) => {
    const connectPlayers  = storage.get("CAH").get("connectedPlayers");
    const newConnectedPlayers = connectPlayers.filter((player: string) => player !== playerId);
    storage.get("CAH").set("connectedPlayers", newConnectedPlayers);
    const currentJudge = storage.get("CAH").get("currentPlayerTurn");
    if (currentJudge === playerId) {
      storage.get("CAH").set("currentPlayerTurn", newConnectedPlayers[Math.floor(Math.random()*newConnectedPlayers.length)]);
    }
    const cardsInRound = storage.get("CAH").get("cardsInRound");
    if(cardsInRound?.length) {
      const newCardsInRound = cardsInRound.filter((card) => card.playerId !== playerId);
      storage.get("CAH").set("cardsInRound", newCardsInRound);
    }
  }, [])

  // Listen for disconnect player event
  useEffect(() => {
    const handler = (evt: CustomEvent) => {
      const id = z.string().parse(evt.detail);
      disconnectPlayer(id);
    }
    window.addEventListener("disconnect player", handler as EventListener);
    return () => window.removeEventListener("disconnect player", handler as EventListener);
  }, [disconnectPlayer])

  // End game if host disconnects
  useEffect(() => {
    if(!gameStarted) return;
    if(isHost) return;
    const ids = otherIds.map((other) => other[1]);
    if(!ids.includes(currentHost) || ids.length < 2 || connectedPlayers.length < 3) {
      console.log("ending game")
      endGame();
    }
  }, [otherIds, currentHost, endGame, gameStarted, isHost, connectedPlayers])

  return <></>;
};

export default GameManager;
