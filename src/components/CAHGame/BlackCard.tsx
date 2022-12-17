import { useStorage } from "../../liveblocks.config";

const BlackCard: React.FC = ({}) => {
  const card = useStorage((root) => root.CAH.currentBlackCard);

  return (
    <div className="mt-4 h-72 w-fit max-w-sm rounded-lg bg-black py-2 px-4 text-white">
      {card && <p className="w-48 text-xl">{card.text}</p>}
    </div>
  );
};

export default BlackCard;
