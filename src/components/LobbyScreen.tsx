import { type Lobby } from "@prisma/client";
import { useOthers, useMyPresence, useStorage } from "../liveblocks.config";
import Game from "./Game";

type GameScreenProps = {
  lobby: Lobby | null,
}

const LobbyScreen: React.FC<GameScreenProps> = ({lobby}) => {
  const title = useStorage(root => root.name);
  const [myPresence, updateMyPresence] = useMyPresence();
  const others = useOthers();
  const currentGame = useStorage(root => root.currentGame);
  const options = useStorage(root => root.CAH.options);

  return (
    <>
      <h1>{title}</h1>
      {others.map(({ connectionId, presence }) =>
        presence.name ? (
          <p key={connectionId}>
            {typeof presence.name === "string" ? presence.name : null}
          </p>
        ) : null
      )}
      { currentGame ? 
      <div> We got a new game {currentGame}</div> :
      <Game name="Cards Against Humanity"></Game> 
      }
    </>
  );
};

export default LobbyScreen;
