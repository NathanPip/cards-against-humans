import { type Card } from "../../types/game"

type BlackCardProps = {
    card: Card;
}

const BlackCard: React.FC<BlackCardProps> = ({card}) => {

    return (
    <div className="bg-black h-72 w-fit max-w-sm rounded-lg py-2 px-4">
        <p className="text-xl">{card.text}</p>
    </div>)
}

export default BlackCard;