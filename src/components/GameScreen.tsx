import { useRouter } from "next/router";
import { useOthers, useUpdateMyPresence } from "../liveblocks.config";

const GameScreen: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const updateMyPresence = useUpdateMyPresence();
  const others = useOthers();

  if (!id || Array.isArray(id)) return null;

  return (
    <>
      <button onClick={() => updateMyPresence({ rand: Math.random() })}>
        GameRoom: {id}
      </button>
      {others.map(({ connectionId, presence }) =>
        presence.rand ? (
          <p key={connectionId}>
            {connectionId}:{" "}
            {typeof presence.rand === "number" ? presence.rand : null}
          </p>
        ) : null
      )}
    </>
  );
};

export default GameScreen;
