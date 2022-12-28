import { useEffect } from "react";
import { useSelf, useStorage, useUpdateMyPresence } from "../../liveblocks.config";

const LobbyManager: React.FC = () => {
    const updatePresence = useUpdateMyPresence();
    const myId = useSelf((me) => me.id);
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

    return null;
}

export default LobbyManager;