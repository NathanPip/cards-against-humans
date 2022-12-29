import GameArea from "./GameArea";
import GameManager from "./GameManager";
import GameOptionsModal from "./GameOptionsModal";
import GameOverScreen from "./GameOverScreen";
import InfoPanel from "./InfoPanel";
import JudgesLounge from "./JudgesLounge";
import OtherPlayersModal from "./OtherPlayersModal";
import PlayerContainer from "./PlayerContainer";
import { useAutoAnimate } from '@formkit/auto-animate/react'

const CAHGame: React.FC = () => {

  const [container] = useAutoAnimate<HTMLDivElement>();

  return (
    <div ref={container} className="flex flex-col pt-4 w-screen h-screen max-w-7xl mx-auto">
      <GameOverScreen />
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
