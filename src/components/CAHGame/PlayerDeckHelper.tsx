import { useSelf } from "../../liveblocks.config";

const PlayerDeckHelper: React.FC = () => {
    
    const actionState = useSelf((me) => me.presence.currentAction);

    if(actionState === "selecting")return (
    <p className={`absolute top-0 left-16 -mt-8 text-xl text-shadow-lg animate-pulse animate-delay-5000 opacity-0`}>Click a Card to Play it</p>)

    return null;
}

export default PlayerDeckHelper;