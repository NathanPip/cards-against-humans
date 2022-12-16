import { useSelf } from "../../liveblocks.config";
import InfoPanelContent from "./InfoPanelContent";

const InfoPanel: React.FC = () => {

    const isTurn = useSelf((me) => me.presence.CAHturn);

    if(isTurn) return null;

    return (
        <div>
            <InfoPanelContent />
        </div>
    )
}

export default InfoPanel;