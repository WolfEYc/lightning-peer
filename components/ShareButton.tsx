import lightning from "../client/lightning"
import { useState } from "react"

const ShareButton = () => {

    const [muted, setMuted] = useState(true)

    const handleClick = async () => {
        
        if(muted) {
            setMuted(!(await lightning.getShareScreen()));            
        } else {
            lightning.stopShareScreen();
            setMuted(true);
        }

         
        //setMuted(!muted);
    }

    return (
        <button onClick={handleClick}>{ muted ? 'Share Screen' : 'Stop Share'}</button>
    )
}

export default ShareButton