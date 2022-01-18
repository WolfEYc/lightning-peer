import { useState } from "react";
import lightning from "../client/lightning"


const AudioButton = () => {

    const [muted, setMuted] = useState(false)

    const handleClick = () => {
        lightning.setAudio(muted);
        setMuted(!muted);
    }

    return (
        <button onClick={handleClick}>{ muted ? 'audio muted' : 'audio unmuted' }</button>
    )
}

export default AudioButton