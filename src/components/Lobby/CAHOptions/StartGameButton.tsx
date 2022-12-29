import { useEffect, useState } from "react";
import { useOthersMapped } from "../../../liveblocks.config";

const StartGameButton: React.FC = () => {
  const othersIds = useOthersMapped((other) => other.id);

  return (
    <button
      className={`${
        othersIds && othersIds.length >= 2
          ? "bg-zinc-50 hover:bg-zinc-800 hover:text-zinc-50"
          : "pointer-events-none bg-zinc-500"
      } mt-14 mb-4 h-14 w-28 rounded-lg transition-colors duration-500 py-1 font-bold text-zinc-900`}
      type="submit"
    >
      Start Game
    </button>
  );
};

export default StartGameButton;
