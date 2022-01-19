import { useState } from 'react'
import { MdOutlineScreenShare, MdComputer } from "react-icons/md"
import lightning from '../client/lightning'

const BottomBarScreen = () => {
    const [expanded, setExpanded] = useState(false)
    
    const handleClick = async () => {
        
        if(!expanded) {
            setExpanded(await lightning.getShareScreen());            
        } else {
            lightning.stopShareScreen();
            setExpanded(false);
        }
        //setMuted(!muted);
    }

    return(
        <article className='bottomIcons'>
            <header>
                <h4 className='onOff'></h4>
                <button className='inline-flex font-bold text-gray-500 text-sm hover:text-white pt-1' onClick={handleClick}> 
                {expanded ? <MdComputer size="30" color='green'/> : <MdComputer size="30"/>} 
                </button>
            </header>
        </article>
    );
}

export default BottomBarScreen;
