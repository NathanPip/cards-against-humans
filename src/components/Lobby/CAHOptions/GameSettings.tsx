
type GameSettingsProps = {
    pointsToWinInput: React.RefObject<HTMLInputElement>;
    cardsPerPlayerInput: React.RefObject<HTMLInputElement>;
};

const GameSettings: React.FC<GameSettingsProps> = ({pointsToWinInput, cardsPerPlayerInput}) => {
  return (
    <div className="flex  h-full  items-center  ">
      <div className="flex w-48 flex-col items-center">
        <label className="mt-4 text-lg" htmlFor="points-to-win">
          Score To Win
        </label>
        <input
          className="mt-2 w-12 rounded-xl border-2 border-black/10 bg-zinc-500/40 text-white"
          type="text"
          defaultValue={10}
          id="points-to-win"
          ref={pointsToWinInput}
        />
      </div>
      <div className="ml-24 flex flex-col items-center">
        <label className="mt-4 text-lg" htmlFor="cards-per-player">
          White Cards Per Player
        </label>
        <input
          className="mt-2 w-12 rounded-xl border-2 border-black/10 bg-zinc-500/40 text-white"
          type="text"
          defaultValue={10}
          id="cards-per-player"
          ref={cardsPerPlayerInput}
        />
      </div>
    </div>
  );
};

export default GameSettings;
