import { useSelf } from "../../liveblocks.config";
import JudgesLoungeContent from "./JudgesLoungeContent";

const JudgesLounge: React.FC = () => {
  const isTurn = useSelf((me) => me.presence.CAHturn);

  if(!isTurn) return null;

  return( 
  <div>
    <JudgesLoungeContent />
  </div>);
};

export default JudgesLounge;
