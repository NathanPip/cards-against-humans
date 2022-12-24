import { useOthersMapped, useSelf, useStorage } from "../../liveblocks.config";
import CAHGame from "../CAHGame/CAHGame";
import GameSelect from "./GameSelect";

const LobbyScreen: React.FC = () => {
  const title = useStorage((root) => root.name);
  const id = useSelf((me) => me.id);
  const isHost = useSelf((me) => me.presence.isHost);
  const others = useOthersMapped((other) => other.presence.name);
  const currentGame = useStorage((root) => root.currentGame);

  if (currentGame)
    return (
      <div className="relative h-screen w-full overflow-hidden">
        <CAHGame />
      </div>
    );

  return (
    <>
      <h1 className="mb-4 flex justify-center text-4xl">{title}</h1>
      {/* <p className="flex justify-end">{id}</p> */}
      <div className="max-w-full ">
        <h2 className=" mt-8 mb-4 flex w-full  justify-center text-lg">
          Players
        </h2>
        <div className="max-w-70  mb-4 h-44 shadow-inset ">
          <div className=" ml-8 h-24 max-w-full  ">
            {others.map((name) => (
              <div className=" flex justify-start text-lg" key={name[0]}>
                {name[1]}
              </div>
            ))}
          </div>
        </div>
      </div>
      {isHost && <GameSelect name="Cards Against Humanity"></GameSelect>}
    </>
  );
};

export default LobbyScreen;
