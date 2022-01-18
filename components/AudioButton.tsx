import { useState } from "react";
import lightning from "../client/lightning"
import MicIcon from './micIcon'
import {BsFillMicFill} from 'react-icons/bs'

const AudioButton = () => {

    const [muted, setMuted] = useState(false)

    const handleClick = () => {
        lightning.setAudio(muted);
        setMuted(!muted);
    }

    return (
        <button onClick={handleClick}>{ muted ? <MicIcon/> : <BsFillMicFill size="30" /> }</button>
    )
}

export default AudioButton