import { useSelf } from "../../liveblocks.config";
import InfoPanelContent from "./InfoPanelContent";

const InfoPanel: React.FC = () => {

    const isTurn = useSelf((me) => me.presence.CAHturn);

    return (
        <div className="h-8">
            {!isTurn ? <InfoPanelContent /> : null}
        </div>
    )
}

export default InfoPanel;