import { useOthersMapped, useSelf, useStorage } from "../../liveblocks.config";
import CAHGame from "../CAHGame/CAHGame";
import GameSelect from "./GameSelect";

const LobbyScreen: React.FC = () => {
  const title = useStorage(root => root.name);
  const id = useSelf((me) => me.id);
  const isHost = useSelf((me) => me.presence.isHost);
  const others = useOthersMapped((other) => other.presence.name);
  const currentGame = useStorage(root => root.currentGame);

  if(currentGame) return (
    <CAHGame />
  )

  return (
    <>
      <h1>{title}</h1>
      <p>{id}</p>
      {others.map((name) => (
        <div key={name[0]}>{name[1]}</div>))}
      {isHost && <GameSelect name="Cards Against Humanity"></GameSelect>} 
    </>
  );
};

export default LobbyScreen;
