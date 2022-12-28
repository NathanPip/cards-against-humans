
type PlayerBlackCardProps = {
    amt: number | undefined;
}

const PlayerBlackCard: React.FC<PlayerBlackCardProps> = ({amt}) => {
    return (
    <div className={`bg-black text-white w-12 h-20 flex justify-center items-center overflow-hidden p-2 rounded-md text-2xl`}>{amt}</div>
    )
}

export default PlayerBlackCard;