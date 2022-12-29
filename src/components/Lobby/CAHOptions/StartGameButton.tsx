import { useEffect, useState } from "react";
import { useOthersMapped } from "../../../liveblocks.config";

const StartGameButton: React.FC = () => {
  const othersIds = useOthersMapped((other) => other.id);

  return (
    <button
      className={`${
        othersIds && othersIds.length >= 2
          ? "bg-blue-500"
          : "pointer-events-none bg-slate-700"
      } mt-14 mb-4 h-14 w-28 rounded-lg bg-blue-500 py-1 font-bold text-white hover:bg-blue-700`}
      type="submit"
    >
      Start Game
    </button>
  );
};

export default StartGameButton;
