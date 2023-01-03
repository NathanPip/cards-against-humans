import { useEffect } from "react";
import { useEventListener, useOthersMapped, useSelf, useStorage, useUpdateMyPresence, useMutation as liveblocksMutation } from "../../liveblocks.config";
import { useGameStore } from "../../pages/lobby/[id]";
import { trpc } from "../../utils/trpc";

const LobbyManager: React.FC = () => {
    const updatePresence = useUpdateMyPresence();
    const myId = useSelf((me) => me.id);
    const connectedPlayers = useStorage((root) => root.CAH.connectedPlayers);
    const trpcContext = trpc.useContext();
    const setWhiteCards = useGameStore((state) => state.setWhiteCards);
    const setBlackCards = useGameStore((state) => state.setBlackCards);
    const othersLoading = useOthersMapped((other) => other.presence.loadingGame);
    const isHost = useSelf((me) => me.presence.isHost);
    const isLoading = useSelf((me) => me.presence.loadingGame);
    const currentGame = useStorage((root) => root.currentGame);
    const resetGameStore = useGameStore((state) => state.resetGame);
  // if users ID does not exist in current players playing array, route player to lobby
  useEffect(() => {
    if(!myId) return;
    if(!connectedPlayers.length) return;
    if (!connectedPlayers.includes(myId)) {
      updatePresence({canPlay: false})
    } else {
      updatePresence({canPlay: true})
    }
  }, [myId, connectedPlayers, updatePresence])

  useEventListener(async ({event}) => {
    if(event.type !== "card packs selected") return;
    const packIds = event.cardPacks as string[];
    console.log("event received", packIds)
    if(!packIds.length) return;
    const cards = await trpcContext.game.getSelectedCardPacks.fetch(packIds);
    if(!cards) return;
    const whiteCards = cards.cardPacks.map((card) => card.whiteCards).flat();
    setWhiteCards(whiteCards);
    updatePresence({loadingGame: false});
  })

  useEffect(() => {
    const handler = async (event: Event) => {
      const e = event as CustomEvent;
      const packIds = e.detail.cardPacks as string[];
      if(!packIds.length) return;
      const cards = await trpcContext.game.getSelectedCardPacks.fetch(packIds);
      if(!cards) return;
      const whiteCards = cards.cardPacks.map((card) => card.whiteCards).flat();
      const blackCards = cards.cardPacks.map((card) => card.blackCards).flat();
      setWhiteCards(whiteCards);
      setBlackCards(blackCards);
      updatePresence({loadingGame: false});
    }
    window.addEventListener("card packs selected", handler);
    return () => window.removeEventListener("card packs selected", handler);
  }, [setWhiteCards, trpcContext.game.getSelectedCardPacks, setBlackCards, updatePresence ])

  const resetPlayerState = liveblocksMutation(({setMyPresence}) => {
    setMyPresence({canPlay: true})
    setMyPresence({currentAction: "waiting"})
    setMyPresence({CAHWhiteCardIds: []})
    setMyPresence({CAHBlackCardIds: []})
    setMyPresence({CAHturn: false})
    setMyPresence({CAHCardsPicked: []})
    setMyPresence({CAHCardsRevealed: 0})
    setMyPresence({loadingGame: true})
  }, [])

  const resetCAHGameStorage = liveblocksMutation(({storage}) => {
    storage.get("CAH").set("activeState", "starting game");
    storage.get("CAH").set("currentPlayerDrawing", undefined);
    storage.get("CAH").set("cardsInRound", []);
    storage.get("CAH").set("currentPlayerTurn", undefined);
    storage.get("CAH").set("handsRevealed", 0);
    storage.get("CAH").set("started", false);
    storage.get("CAH").set("winner", null);
  }, []);

  useEffect(() => {
    if(currentGame === null) {
      resetPlayerState();
      resetGameStore();
      if(isHost) resetCAHGameStorage();
      return
    }
  }, [currentGame, resetGameStore, resetPlayerState, resetCAHGameStorage, isHost])

  const setStartGame = liveblocksMutation(({ storage }) => {
    console.log("ran");
    storage.set("currentGame", "Cards Against Humanity");
  }, []);

  useEffect(() => {
    if(!isHost || isLoading) return;
    let allLoaded = true;
    othersLoading.forEach((loading) => {
      if(loading[1]) allLoaded = false;
    })
    if(allLoaded) {
      console.log("all loaded")
      setStartGame();
    }
  }, [isLoading, isHost, othersLoading, setStartGame])

    ///////////////////////////////// Conditional Events //////////////////////////////////////

    return null;
}

export default LobbyManager;