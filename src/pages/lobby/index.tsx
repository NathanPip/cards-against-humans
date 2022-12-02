import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useRef } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";
import { v4 as uuid } from 'uuid';


const Lobby: NextPage = () => {

    const router = useRouter();
    const input = useRef<HTMLInputElement>(null);
    const { data: sessionData } = useSession();
    const lobbyMutation = trpc.lobby.createLobby.useMutation();
    if(!sessionData) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!input.current || !input.current.value) return;
        const lobbyID = uuid();
        await lobbyMutation.mutateAsync({name: input.current.value, id: lobbyID});
        router.push(`/lobby/${lobbyID}`);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input ref={input} type="text" />
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default Lobby;