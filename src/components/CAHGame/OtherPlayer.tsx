
type OtherPlayersProps = {
    name: string | undefined,
    id: string | undefined,
    isHost: boolean | undefined,
    isPlaying: boolean | undefined,
    currentAction: string | undefined
}

const OtherPlayer: React.FC<OtherPlayersProps> = ({name, id, isHost, currentAction, isPlaying}) => {
    
    const kickPlayerClickHandler = () => {
        window.dispatchEvent(new CustomEvent('disconnect player', {detail: id}));
    }
    
    if(!name || !id || !isPlaying) return null;

    return (
    <li>
        <div className="flex gap-2 bg-zinc-50 mt-4 p-2 rounded-lg items-center">
            <p className="mr-auto text-xl font-semibold drop-shadow-xl">{name}</p>
            <p className="font-semibold">{currentAction}</p>
            {isHost && <button className="bg-zinc-800 text-white text-base py-2 px-4 rounded-xl border-2 border-zinc-800 transition-colors hover:bg-zinc-50 hover:text-zinc-800" onClick={kickPlayerClickHandler}>Kick</button>}
        </div>
    </li>
    )
}

export default OtherPlayer;