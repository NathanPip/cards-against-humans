type GameSettingsProps = {
  pointsToWinInput: React.RefObject<HTMLSelectElement>;
  cardsPerPlayerInput: React.RefObject<HTMLSelectElement>;
};

const GameSettings: React.FC<GameSettingsProps> = ({
  pointsToWinInput,
  cardsPerPlayerInput,
}) => {
  return (
    <div className="flex  h-full  items-center  ">
      <div className="flex w-48 flex-col items-center">
        <label className="mt-4 text-lg font-semibold drop-shadow-md" htmlFor="points-to-win">
          Score To Win
        </label>
        <select
          className="number-select mt-2 w-24 rounded-xl border border-zinc-900 bg-zinc-50 text-zinc-900 text-center font-semibold"
          defaultValue={10}
          id="points-to-win"
          ref={pointsToWinInput}
        >
          {(() => {
            const options = [];
            for (let i = 1; i <= 25; i++) {
              options.push(
                <option className="appearance-none text-zinc-900 text-center font-semibold hover:bg-zinc-900 hover:text-zinc-50" key={i} value={i}>
                  {i}
                </option>
              );
            }
            return options;
          })()}
        </select>
      </div>
      <div className="ml-24 flex flex-col items-center">
        <label className="mt-4 text-lg font-semibold drop-shadow-md" htmlFor="cards-per-player">
          White Cards Per Player
        </label>
        <select
          className="number-select mt-2 w-24 rounded-xl border border-zinc-900 bg-zinc-50 text-zinc-900 text-center font-semibold"
          defaultValue={10}
          id="cards-per-player"
          ref={cardsPerPlayerInput}
        >
          {(() => {
            const options = [];
            for (let i = 1; i <= 15; i++) {
              options.push(
                <option className="appearance-none text-zinc-900 text-center font-semibold hover:bg-zinc-900 hover:text-zinc-50" key={i} value={i}>
                  {i}
                </option>
              );
            }
            return options;
          })()}
        </select>
      </div>
    </div>
  );
};

export default GameSettings;
