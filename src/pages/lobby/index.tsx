import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useRef } from "react";
import { useSession } from "next-auth/react";


const Lobby: NextPage = () => {

    const router = useRouter();
    const input = useRef<HTMLInputElement>(null);
    const { data: sessionData } = useSession();

    if(!sessionData) return null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!input.current || !input.current.value) return;
        console.log("Submitted");
        router.push(`/lobby/${input.current.value}`);
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