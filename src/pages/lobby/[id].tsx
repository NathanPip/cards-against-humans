import { ClientSideSuspense } from "@liveblocks/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import GameScreen from "../../components/GameScreen";
import { RoomProvider } from "../../liveblocks.config";
import { trpc } from "../../utils/trpc";

const GameRoom: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  if (!id || Array.isArray(id)) return null;
  const lobby = trpc.lobby.getLobby.useQuery({ id });

  return (
    <>
    { lobby.data?.id ?
      <RoomProvider id={id} initialPresence={{ rand: Math.random() }}>
        <ClientSideSuspense fallback={<div>Loading...</div>}>
          {() => <GameScreen />}
        </ClientSideSuspense>
      </RoomProvider>
    : <>None found</> }
    </>
  );
};

export default GameRoom;
