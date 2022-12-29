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
    <div className="bg-zinc-800 p-8 rounded-xl mx-4 w-96 h-96 flex flex-col justify-center items-center">
      <h2 className="text-zinc-50 text-2xl font-semibold drop-shadow-lg rounded-lg">Options</h2>
      <button className="bg-zinc-50 text-2xl font-semibold drop-shadow-lg px-4 py-2 rounded-lg mt-auto" onClick={() => isHost ? endGameClickHandler() : disconnectClickHandler()}>
        exit
      </button>
    </div>
  );
};

export default GameOptions;
