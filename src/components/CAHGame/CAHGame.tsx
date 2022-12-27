import {
  useSelf,
} from "../../liveblocks.config";
import GameArea from "./GameArea";
import GameManager from "./GameManager";
import InfoPanel from "./InfoPanel";
import JudgesLounge from "./JudgesLounge";
import OtherPlayersModal from "./OtherPlayersModal";
import PlayerContainer from "./PlayerContainer";

const CAHGame: React.FC = () => {

  const endGameClickHandler = () => {
    window.dispatchEvent(new CustomEvent("end game"));
  }
  const isHost = useSelf((me) => me.presence.isHost);
  
  return (
    <div className="flex flex-col pt-4 w-screen">
      {isHost && (
        <button className="absolute top-0" onClick={endGameClickHandler}>
          exit
        </button>
      )}
      <OtherPlayersModal />
      <GameManager />
      <InfoPanel />
      <GameArea />
      <JudgesLounge />
      <PlayerContainer />
    </div>
  );
};

export default CAHGame;
