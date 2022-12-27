import { useState } from "react";
import OtherPlayers from "./OtherPlayers";

const OtherPlayersModal: React.FC = () => {

    const [showModal, setShowModal] = useState(false);


  return (
    <>
    <button className="absolute top-0 right-0 m-4 z-10" onClick={() => {setShowModal(prev => !prev)}}>Players</button>
    <div className={`${showModal ? "" : "hidden"} items-center fixed left-1/2 top-1/2 flex h-full w-full -translate-x-1/2 -translate-y-1/2 animate-fade justify-center bg-zinc-700 bg-opacity-30`}>
      <OtherPlayers />
    </div>
    </>
  );
};

export default OtherPlayersModal;
