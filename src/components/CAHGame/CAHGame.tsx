import {
  useSelf,
} from "../../liveblocks.config";
import GameArea from "./GameArea";
import GameManager from "./GameManager";
import GameOptionsModal from "./GameOptionsModal";
import InfoPanel from "./InfoPanel";
import JudgesLounge from "./JudgesLounge";
import OtherPlayersModal from "./OtherPlayersModal";
import PlayerContainer from "./PlayerContainer";

const CAHGame: React.FC = () => {

  return (
    <div className="flex flex-col pt-4 w-screen">
      <GameOptionsModal />
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
