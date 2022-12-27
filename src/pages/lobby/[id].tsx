import { ClientSideSuspense } from "@liveblocks/react";
import { type Lobby } from "@prisma/client";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { createContext, useRef, useState } from "react";
import ErrorPage from "../../components/Error";
import Loading from "../../components/Loading";
import LobbyManager from "../../components/Lobby/LobbyManager";
import LobbyScreen from "../../components/Lobby/LobbyScreen";
import { type Presence, RoomProvider } from "../../liveblocks.config";
import { trpc } from "../../utils/trpc";

const defaultPlayer: Presence = {
  name: "",
  score: 0,
  isHost: false,
  canPlay: true,
  currentAction: "waiting",
  CAHWhiteCardIds: [],
  CAHBlackCardIds: [],
  CAHturn: false,
  CAHCardsPicked: [],
  CAHCardsRevealed: 0,
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
                <LobbyManager />
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
    <div className="m-auto flex h-screen w-screen items-center justify-center">
      <div className=" max-h-1/5 max-w-1/5 flex h-fit flex-col justify-center gap-3 rounded-3xl border-2 border-black/40 bg-gray-900/40">
        <h2 className="flex justify-center pt-8 text-lg">Enter Your Name</h2>
        <form
          className="flex flex-col items-center justify-center gap-3 px-8 pb-8"
          onSubmit={onSubmitHandler}
        >
          <input
            className="max-w-full rounded-xl border-2 border-black/10 bg-zinc-500/40  tracking-wide text-white"
            ref={inputRef}
            type="text"
            placeholder="Don't Be Racist :)"
          />
          <button
            className="rounded bg-zinc-500/40 py-1 px-2 text-sm text-white hover:bg-zinc-700"
            type="submit"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
};

export default GameRoom;
