import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useOthersMapped, useSelf, useStorage } from "../../liveblocks.config";
import CAHGame from "../CAHGame/CAHGame";
import GameSelect from "./GameSelect";

const LobbyScreen: React.FC = () => {
  const title = useStorage((root) => root.name);
  const isHost = useSelf((me) => me.presence.isHost);
  const others = useOthersMapped((other) => other.presence.name);
  const currentGame = useStorage((root) => root.currentGame);
  const canPlay = useSelf((me) => me.presence.canPlay);

  const [playerContainer] = useAutoAnimate<HTMLDivElement>();

  if (currentGame && canPlay)
    return (
      <div className="relative h-screen w-full overflow-hidden">
        <CAHGame />
      </div>
    );

  return (
    <>
      <h1 className="mb-4 flex justify-center text-4xl">{title}</h1>
      {/* <p className="flex justify-end">{id}</p> */}
      <div className="max-w-md mx-auto">
        <h2 className=" mt-8 mb-4 flex w-full  justify-center text-lg">
          Players
        </h2>
          <div ref={playerContainer} className="shadow-inset p-4 flex flex-col items-center">
            {others.map((name) => (
              <div className="text-lg" key={name[0]}>
                {name[1]}
              </div>
            ))}
        </div>
      </div>
      {isHost && <GameSelect name="Cards Against Humanity"></GameSelect>}
    </>
  );
};

export default LobbyScreen;
