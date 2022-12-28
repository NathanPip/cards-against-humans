import { useMemo } from "react";
import { useSelf, useStorage } from "../../liveblocks.config";
import PlayerBlackCard from "./PlayerBlackCard";

const PlayerBlackCards: React.FC = () => {

    const myBlackCards = useSelf(self => self.presence.CAHBlackCardIds)
    if(myBlackCards && myBlackCards?.length <= 0) return null;

    return (
    <div className="absolute -top-2 -mt-32 flex flex-col gap-2">
            <PlayerBlackCard amt={myBlackCards?.length} />
    </div>
    )
}

export default PlayerBlackCards;