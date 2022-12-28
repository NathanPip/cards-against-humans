import { useState } from "react";
import OtherPlayers from "./OtherPlayers";

const OtherPlayersModal: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        className="absolute top-0 right-0 z-20 m-2 "
        onClick={() => {
          setShowModal((prev) => !prev);
        }}
      >
        Players
      </button>
      <div
        className={`${
          showModal ? "" : "hidden"
        } fixed left-1/2 top-1/2 z-10 flex h-full w-full -translate-x-1/2 -translate-y-1/2 animate-fade items-center justify-center bg-zinc-700 bg-opacity-80`}
      >
        <OtherPlayers />
      </div>
    </>
  );
};

export default OtherPlayersModal;
