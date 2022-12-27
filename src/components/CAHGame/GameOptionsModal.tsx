import { useState } from "react";
import GameOptions from "./GameOptions";

const GameOptionsModal: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        className="absolute top-0 left-0 z-10 m-4"
        onClick={() => {
          setShowModal((prev) => !prev);
        }}
      >
        Exit
      </button>
      <div
        className={`${
          showModal ? "" : "hidden"
        } fixed left-1/2 top-1/2 flex h-full w-full -translate-x-1/2 -translate-y-1/2 animate-fade items-center justify-center bg-zinc-700 bg-opacity-30`}
      >
        <GameOptions />
      </div>
    </>
  );
};

export default GameOptionsModal;
