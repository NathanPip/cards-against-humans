import { useStorage } from "../../liveblocks.config";

const BlackCard: React.FC = ({}) => {
    const card = useStorage((root) => root.CAH.currentBlackCard);

    return (
    <div className="bg-black text-white h-72 w-fit max-w-sm rounded-lg py-2 px-4">
        {card && <p className="text-xl w-48">{card.text}</p>}
    </div>)
}

export default BlackCard;