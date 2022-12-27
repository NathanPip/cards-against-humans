import { useEffect } from "react";
import { useOthersMapped, useSelf, useStorage, useUpdateMyPresence } from "../../liveblocks.config";

const LobbyManager: React.FC = () => {
    const updatePresence = useUpdateMyPresence();
    const myId = useSelf((me) => me.id);
    const currentGame = useStorage((root) => root.currentGame);
    const othersIds = useOthersMapped((other) => other.id);
    const connectedPlayers = useStorage((root) => root.CAH.connectedPlayers);
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


    ///////////////////////////////// Conditional Events //////////////////////////////////////

  // Start Game
  useEffect(() => {
    if(othersIds.length < 2) {
      window.dispatchEvent(new CustomEvent("can start", { detail: false }));
    } else {
      window.dispatchEvent(new CustomEvent("can start", { detail: true }));
    }
  }, [othersIds, currentGame])

    return null;
}

export default LobbyManager;