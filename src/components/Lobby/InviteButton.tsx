import { useState } from "react"

const InviteButton: React.FC = () => {

    const [displayMessage, setDisplayMessage] = useState(false)

    const copyUrlToClipboard = () => {
        navigator.clipboard.writeText(window.location.href)
    }

    const clickHandler = () => {
        copyUrlToClipboard()
        setDisplayMessage(true)
        setTimeout(() => {
            setDisplayMessage(false)
        }, 2000)
    }

    return (
        <div className="absolute top-0 left-0 m-4">
            {displayMessage && <p className="absolute text-clip -bottom-6 font-semibold text-sm w-32 animate-fade-down">Link Copied!</p>}
            <button className="bg-white font-semibold px-3 py-2 rounded-md text-lg" onClick={clickHandler}>Invite</button>
        </div>
    )
}

export default InviteButton