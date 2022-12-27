import { useSelf } from "../../liveblocks.config";

const GameOptions: React.FC = () => {
  const myId = useSelf((me) => me.id);

  const endGameClickHandler = () => {
    window.dispatchEvent(new CustomEvent("end game"));
  };
  const disconnectClickHandler = () => {
    window.dispatchEvent(
      new CustomEvent("disconnect player", { detail: myId })
    );
  };
  const isHost = useSelf((me) => me.presence.isHost);

  return (
    <>
      <button className="" onClick={() => isHost ? endGameClickHandler() : disconnectClickHandler()}>
        exit
      </button>
    </>
  );
};

export default GameOptions;
