import { ClientSideSuspense } from "@liveblocks/react";
import { type Lobby } from "@prisma/client";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { createContext, useRef, useState } from "react";
import ErrorPage from "../../components/Error";
import Loading from "../../components/Loading";
import LobbyScreen from "../../components/Lobby/LobbyScreen";
import { type Presence, RoomProvider } from "../../liveblocks.config";
import { trpc } from "../../utils/trpc";

const defaultPlayer: Presence = {
  name: "",
  score: 0,
  isHost: false,
  currentAction: "waiting",
  CAHWhiteCardIds: [],
  CAHBlackCardIds: [],
  CAHturn: false,
};

export const LobbyContext = createContext<null | Lobby>(null);

const GameRoom: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const lobby = trpc.lobby.getLobby.useQuery({ id: id as string });
  const session = useSession();
  const [name, setName] = useState<string | undefined | null>(
    session.data?.user?.name
  );

  if (!id || Array.isArray(id) || lobby.isLoading) return <Loading />;

  if (lobby.error || lobby.isLoadingError) return <ErrorPage />;

  if (!lobby.data?.id) return <ErrorPage message="Not Found" />;

  return (
    <>
      {name || session.data?.user?.id ? (
        <RoomProvider
          id={id}
          initialPresence={{
            ...defaultPlayer,
            name: session.data?.user?.name || name || "unknown",
            isHost: lobby.data.userId === session.data?.user?.id,
          }}
        >
          <ClientSideSuspense fallback={<Loading />}>
            {() => (
              <LobbyContext.Provider value={lobby.data}>
                <LobbyScreen />
              </LobbyContext.Provider>
            )}
          </ClientSideSuspense>
        </RoomProvider>
      ) : (
        <NameInput setName={setName} />
      )}
    </>
  );
};

const NameInput: React.FC<{
  setName: React.Dispatch<React.SetStateAction<string | undefined | null>>;
}> = ({ setName }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmitHandler = () => {
    if (!inputRef) return;
    const name = inputRef.current?.value;
    setName(name);
  };

  return (
    <form onSubmit={onSubmitHandler}>
      <input ref={inputRef} type="text" placeholder="Enter your name" />
      <button type="submit">Enter</button>
    </form>
  );
};

export default GameRoom;
