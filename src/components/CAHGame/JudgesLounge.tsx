import { useSelf } from "../../liveblocks.config";
import JudgesLoungeContent from "./JudgesLoungeContent";

const JudgesLounge: React.FC = () => {
  const isTurn = useSelf((me) => me.presence.CAHturn);

  if(!isTurn) return null;

  return( 
  <div className="w-full flex justify-center">
    <JudgesLoungeContent />
  </div>);
};

export default JudgesLounge;
