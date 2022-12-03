import { type Lobby } from "@prisma/client";
import { useOthers, useMyPresence, useStorage } from "../liveblocks.config";

type GameScreenProps = {
  lobby: Lobby | null,
}

const LobbyScreen: React.FC<GameScreenProps> = ({lobby}) => {
  const title = useStorage(root => root.name);
  const [myPresence, updateMyPresence] = useMyPresence();
  const others = useOthers();

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
    </>
  );
};

export default LobbyScreen;
