import { useEffect, useState } from "react";
import { useEventListener } from "../../liveblocks.config";
import CardDeck from "./CardDeck";
import PlayerDeck from "./PlayerDeck";
import PlayerDeckHelper from "./PlayerDeckHelper";
import ShowHandButton from "./ShowHandButton";

const PlayerContainer: React.FC = () => {
  const [isShown, setIsShown] = useState(true);

  return (
    <div
      className={`absolute bottom-0 w-full transition-transform ${
        (!isShown) ? `translate-y-full` : ""
      }`}
    >
      <ShowHandButton setIsShown={setIsShown} isShown/>
      <PlayerDeckHelper />
      <CardDeck />
      <PlayerDeck />
    </div>
  );
};

export default PlayerContainer;
