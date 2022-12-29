import { useOthers, useSelf} from "../../liveblocks.config";
import OtherPlayer from "./OtherPlayer";

const OtherPlayers: React.FC = () => {
  const others = useOthers();
  const isHost = useSelf((me) => me.presence.isHost);

  return (
    <ul
      className={`z-index-10 mx-4 min-h-72 h-fit w-96 rounded-xl bg-zinc-800 p-8`}
    >
      {others.map((other) => {
        return (
          <OtherPlayer
            key={other.id}
            id={other.id}
            isPlaying={other.presence.canPlay}
            currentAction={other.presence.currentAction}
            name={other.presence.name}
            isHost={isHost}
          />
        );
      })}
    </ul>
  );
};

export default OtherPlayers;
