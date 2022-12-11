import { useStorage } from "../../liveblocks.config";


const CardsInRound: React.FC = () => {

    const cardsInRound = useStorage((root) => root.CAH.cardsInRound);

    return (
        <div>
            {cardsInRound && cardsInRound.map((card) => (<p key={card.id}>{card.text}</p>))}
        </div>
    )
}

export default CardsInRound;