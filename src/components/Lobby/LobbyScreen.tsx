import { useOthersMapped, useSelf, useStorage } from "../../liveblocks.config";
import CAHGame from "../CAHGame/CAHGame";
import GameSelect from "./GameSelect";

const LobbyScreen: React.FC = () => {
  const title = useStorage((root) => root.name);
  const isHost = useSelf((me) => me.presence.isHost);
  const others = useOthersMapped((other) => other.presence.name);
  const currentGame = useStorage((root) => root.currentGame);
  const canPlay = useSelf((me) => me.presence.canPlay);

  if (currentGame && canPlay)
    return (
      <div className="relative h-screen w-full overflow-hidden">
        <CAHGame />
      </div>
    );

  return (
    <>
      <h1 className="flex justify-center text-2xl">{title}</h1>
      {/* <p className="flex justify-end">{id}</p> */}
      <div className="ml-9 h-48 w-48 rounded-2xl border-2 border-black bg-zinc-800/40">
        <h2 className="mt-4 flex w-48 justify-center ">Current Party</h2>
        {others.map((name) => (
          <div className="flex justify-center text-2xl" key={name[0]}>
            {name[1]}
          </div>
        ))}
      </div>
      {isHost && <GameSelect name="Cards Against Humanity"></GameSelect>}
    </>
  );
};

export default LobbyScreen;
