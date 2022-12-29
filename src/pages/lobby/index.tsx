import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";
import { v4 as uuid } from "uuid";
import ErrorPage from "../../components/Error";

const Lobby: NextPage = () => {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const { data: sessionData } = useSession();
  const lobbyMutation = trpc.lobby.createLobby.useMutation();
  const [error, setError] = useState<Error | undefined>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!input.current || !input.current.value) return;
      const lobbyID = uuid();
      await lobbyMutation.mutateAsync({
        name: input.current.value,
        id: lobbyID,
      });
      console.log("completed");
      router.push(`/lobby/${lobbyID}`);
    } catch (e) {
      let error;
      if(e instanceof Error){ 
        error = e;
      }
      setError(error)
    }
  };
  if (!sessionData) return null;
  if(error) return <ErrorPage />
  return (
    <div className="m-auto flex h-screen w-screen items-center justify-center">
      <div className="flex h-96 w-72 flex-col gap-3 rounded-3xl border-2">
        <h2 className=" mb-12 flex justify-center pt-8 text-3xl font-semibold">Create Lobby</h2>
        <form
          className="flex flex-col items-center justify-evenly h-full gap-3 px-8 pb-8"
          onSubmit={handleSubmit}
        >
          <input
            className="max-w-full rounded-xl tracking-wide text-center text-zinc-900 font-semibold px-3 py-1"
            ref={input}
            type="text"
          />
          <button
            className="rounded bg-zinc-900 py-2 px-4 text-xl transition-colors duration-200 text-zinc-50 hover:bg-zinc-50 hover:text-zinc-900"
            type="submit"
          >
            create
          </button>
        </form>
      </div>
    </div>
  );
};

export default Lobby;
