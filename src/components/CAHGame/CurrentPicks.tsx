import { useStorage } from "../../liveblocks.config";

const CurrentPicks: React.FC = () => {
  const cardsInRound = useStorage((root) => root.CAH.cardsInRound);

  return (
    <div className="flex gap-4">
      {cardsInRound &&
        cardsInRound.map((cards) => (
          <div key={cards.playerId} className="flex">
            {cards.cards.map((card) => (
                <div key={card.id} className={`w-12 h-24 first:ml-0 ml-[calc(2rem*-1)] shadow-lg bg-white rounded-sm`}> </div>
            ))}
          </div>
        ))}
    </div>
  );
};

export default CurrentPicks;
