import { type Lobby } from "@prisma/client";
import { useRouter } from "next/router";
import { useOthers, useMyPresence, useStorage } from "../liveblocks.config";

type GameScreenProps = {
  lobby: Lobby | null,
}

const LobbyScreen: React.FC<GameScreenProps> = ({lobby}) => {
  const router = useRouter();
  const { id } = router.query;
  const title = useStorage(root => root.name);
  // const [myPresence, updateMyPresence] = useMyPresence();
  const others = useOthers();

  if (!id || Array.isArray(id)) return null;

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
