import { ClientSideSuspense } from "@liveblocks/react";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import LobbyScreen from "../../../components/GameScreen";
import { type Presence, RoomProvider } from "../../../liveblocks.config";
import { trpc } from "../../../utils/trpc";

const defaultPlayer: Presence = {
    name: "",
    score: 0,
    isHost: false,
    CAH: {
        whites: [],
        blacks: [],
        turn: false
    }
}

const GameRoom: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const lobby = trpc.lobby.getLobby.useQuery({id: (id as string)});
  const session = useSession();
  const [name, setName] = useState<string | undefined | null>(session.data?.user?.name)
  const [isHost] = useState(lobby ? lobby.data?.userId === session.data?.user?.id : false);

  if (!id || Array.isArray(id) || lobby.isLoading) return <>loading</>;

  if(lobby.error || lobby.isLoadingError) return <>error</>

  if(!lobby.data?.id) return <>None Found</>

  return (
    <>
    { name || session.data?.user?.id ?
      <RoomProvider id={id} initialPresence={{ ...defaultPlayer, name: session.data?.user?.name || name || "unknown", isHost: isHost }}>
        <ClientSideSuspense fallback={<div>Loading...</div>}>
          {() => <LobbyScreen lobby={lobby.data} />}
        </ClientSideSuspense>
      </RoomProvider>
    : <NameInput setName={setName} /> }
    </>
  );
};

const NameInput: React.FC<{setName: React.Dispatch<React.SetStateAction<string | undefined | null>>}> = ({setName}) => {

    const inputRef = useRef<HTMLInputElement>(null);

    const onSubmitHandler = () => {
        if(!inputRef) return;
        const name = inputRef.current?.value;
        setName(name);
    }

    return (
    <form onSubmit={onSubmitHandler}>
        <input ref={inputRef} type="text" placeholder="Enter your name"/>
        <button type="submit">Enter</button>
    </form>)
}

export default GameRoom;
