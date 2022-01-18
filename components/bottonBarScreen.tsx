import React, { useState } from 'react'
import {MdOutlineScreenShare,MdComputer} from "react-icons/md"

const bottomBarScreen = () => {
    const [expanded, setExpanded] = useState(false)
    return(
        <article className='bottomIcons'>
            <header>
                <h4 onClick={() => setExpanded(!expanded)} className='onOff'></h4>
                <button className='inline-flex font-bold text-gray-500 text-sm hover:text-white pt-1' onClick={() => setExpanded(!expanded)}> 
                {expanded ? <MdComputer size="30" color='green'/> : <MdComputer size="30"/>} 
                </button>
            </header>
        </article>
    );
}

export default bottomBarScreen;
