import { useStorage } from "../../liveblocks.config";

const CurrentPicks: React.FC = () => {
  const cardsInRound = useStorage((root) => root.CAH.cardsInRound);

  return (
    <div className="my-2 flex h-24 gap-4">
      {cardsInRound &&
        cardsInRound.map((cards) => (
          <div key={cards.playerId} className="flex">
            {cards.cards.map((card) => (
              <div
                key={card.id}
                className={`ml-[calc(2rem*-1)] h-24 w-12 rounded-lg border border-solid border-zinc-800/40 bg-white shadow-lg first:ml-0`}
              >
                {" "}
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

export default CurrentPicks;
