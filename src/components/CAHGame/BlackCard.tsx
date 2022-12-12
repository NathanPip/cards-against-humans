import { type Card } from "../../types/game"

type BlackCardProps = {
    card: Card;
}

const BlackCard: React.FC<BlackCardProps> = ({card}) => {

    return (<div>
        <p>{card.text}</p>
    </div>)
}

export default BlackCard;