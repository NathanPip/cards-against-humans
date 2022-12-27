
type OtherPlayersProps = {
    name: string | undefined,
    id: string | undefined
}

const OtherPlayer: React.FC<OtherPlayersProps> = ({name, id}) => {
    
    const kickPlayerClickHandler = () => {
        window.dispatchEvent(new CustomEvent('disconnect player', {detail: id}));
    }
    
    if(!name || !id) return null;

    return (
    <li>
        <div className="flex">
            <p>{name}</p>
            <button onClick={kickPlayerClickHandler}>Kick</button>
        </div>
    </li>
    )
}

export default OtherPlayer;