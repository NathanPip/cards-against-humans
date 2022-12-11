import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useRef } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";
import { v4 as uuid } from "uuid";

const Lobby: NextPage = () => {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const { data: sessionData } = useSession();
  const lobbyMutation = trpc.lobby.createLobby.useMutation();
  if (!sessionData) return null;

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
      console.log(e);
    }
  };

  return (
    <div className="m-auto flex h-screen w-screen items-center justify-center">
      <div className=" max-h-1/5 max-w-1/5 flex h-fit flex-col justify-center gap-3 rounded-3xl border-2 border-black/40 bg-gray-900/40">
        <h2 className=" flex justify-center pt-8 text-lg">Create a Lobby</h2>
        <form
          className="flex flex-col items-center justify-center gap-3 px-8 pb-8"
          onSubmit={handleSubmit}
        >
          <input
            className="max-w-full rounded-xl border-2 border-black/10 bg-zinc-500/40  tracking-wide text-white"
            ref={input}
            type="text"
          />
          <button
            className="rounded bg-zinc-500/40 py-1 px-2 text-sm text-white hover:bg-zinc-700"
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
