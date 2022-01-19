import { useState } from 'react'
import {BsFillCameraVideoFill} from 'react-icons/bs'
import lightning from '../client/lightning'
import VideoIcon from './videoIcon'

const BottomBarVid = () => {
    const [expanded, setExpanded] = useState(false)

    const handleClick = () => {
        lightning.setVideo(expanded);
        setExpanded(!expanded)
    }

    return(
        <article className='bottomIcons'>
            <header>
                <h4 className='onOff'></h4>
                <button className='inline-flex font-bold text-gray-500 text-sm hover:text-white pt-1' onClick={handleClick}> 
                {expanded ? <VideoIcon/> : <BsFillCameraVideoFill size="30" />} 
                </button>
            </header>
        </article>
    );
}

export default BottomBarVid;
