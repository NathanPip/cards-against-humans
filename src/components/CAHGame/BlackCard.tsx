import { useStorage } from "../../liveblocks.config";

const BlackCard: React.FC = ({}) => {
  const card = useStorage((root) => root.CAH.currentBlackCard);
  const gameState = useStorage((root) => root.CAH.activeState);

  return (
    <div className={`mt-4 h-72 w-fit max-w-sm rounded-lg bg-black py-2 px-4 text-white ${gameState === "judge revealing" ? "scale-75 -mt-8 -mb-8" : ""}`}>
      {card && <p className="w-48 text-xl">{card.text}</p>}
    </div>
  );
};

export default BlackCard;
