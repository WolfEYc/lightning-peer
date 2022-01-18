import React, { useState } from 'react'
import {BsFillMicFill} from 'react-icons/bs'
import MicIcon from './micIcon'

const bottomBarMic = () => {
    const [expanded, setExpanded] = useState(false)
    return(
        <article className='bottomIcons'>
            <header>
                <h4 onClick={() => setExpanded(!expanded)} className='onOff'></h4>
                <button className='inline-flex font-bold text-gray-500 text-sm hover:text-white px-2 pt-1' onClick={() => setExpanded(!expanded)}> 
                {expanded ? <MicIcon/> : <BsFillMicFill size="30" />} 
                </button>
            </header>
        </article>
    );
}

export default bottomBarMic;
