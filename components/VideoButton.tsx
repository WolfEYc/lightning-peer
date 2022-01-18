import { useState } from "react";
import lightning from "../client/lightning"


const VideoButton = () => {

    const [muted, setMuted] = useState(false)

    const handleClick = () => {
        lightning.setVideo(muted);
        setMuted(!muted);
    }

    return (
        <button onClick={handleClick}>{ muted ? 'video muted' : 'video unmuted' }</button>
    )
}

export default VideoButton