import { ClientSideSuspense } from "@liveblocks/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import GameScreen from "../../components/GameScreen";
import {
  RoomProvider,
} from "../../liveblocks.config";

const GameRoom: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id || Array.isArray(id)) return null;

  return (
    <RoomProvider id={id} initialPresence={{ rand: Math.random() }}>
      <ClientSideSuspense fallback={<div>Loading...</div>}>
        {() => (
          <GameScreen />
        )}
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default GameRoom;
