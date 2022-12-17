import { useEffect, useState } from "react";
import { useEventListener } from "../../liveblocks.config";
import CardDeck from "./CardDeck";
import PlayerDeck from "./PlayerDeck";
import ShowHandButton from "./ShowHandButton";

const PlayerContainer: React.FC = () => {
  const [isShown, setIsShown] = useState(true);

//   useEventListener(({event}) => {
//     if(event.type === "game action") {
//         if(event.action === "start game") {
//             setIsShown(true);
//         }
//     }
//   })

  return (
    <div
      className={`absolute bottom-0 w-full transition-transform ${
        (!isShown) ? `translate-y-full` : ""
      }`}
    >
      <ShowHandButton setIsShown={setIsShown} isShown/>
      <CardDeck />
      <PlayerDeck />
    </div>
  );
};

export default PlayerContainer;
