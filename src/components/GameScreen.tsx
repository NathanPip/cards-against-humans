import { type Lobby } from "@prisma/client";
import { useRouter } from "next/router";
import { useOthers, useUpdateMyPresence } from "../liveblocks.config";

type GameScreenProps = {
  lobby: Lobby | null,
}

const GameScreen: React.FC<GameScreenProps> = ({lobby}) => {
  const router = useRouter();
  const { id } = router.query;
  const updateMyPresence = useUpdateMyPresence();
  const others = useOthers();


  if (!id || Array.isArray(id)) return null;

  return (
    <>
      <button onClick={() => updateMyPresence({ name: "" })}>
        {lobby?.name}
      </button>
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

export default GameScreen;
