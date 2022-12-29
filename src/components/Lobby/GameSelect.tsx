import { trpc } from "../../utils/trpc";
import Loading from "../Loading";
import CAHOptions from "./CAHOptions/CAHOptionsContainer";

type GameProps = {
  name: "Cards Against Humanity";
};

const GameSelect: React.FC<GameProps> = ({ name }) => {
  const gameInfo = trpc.game.getBasicGameInfo.useQuery({ name });

  if (gameInfo.isLoading) return <Loading />;

  if (gameInfo.isError || !gameInfo.data) return <div>Error</div>;

  return (
    <div className="px-2">
      <h1 className="mt-8 flex h-24 justify-center pt-4 text-3xl  ">
        Game Options
      </h1>
      {/* <h1 className="flex justify-center text-4xl ">{name}</h1> */}
      <CAHOptions data={gameInfo.data} />
    </div>
  );
};

export default GameSelect;
