import { useState } from 'react'
import { BsFillMicFill } from 'react-icons/bs'
import MicIcon from './micIcon'
import lightning from '../client/lightning'

const bottomBarMic = () => {
    const [pressed, setPressed] = useState(false)

    const handleClick = () => {
        lightning.setAudio(pressed);
        setPressed(!pressed)
    }

    return(
        <article className='bottomIcons'>
            <header>
                <h4 className='onOff'></h4>
                <button className='inline-flex text-gray-500 text-sm hover:text-white px-2 pt-1' onClick={handleClick}> 
                {pressed ? <MicIcon/> : <BsFillMicFill size="30" />}
                </button>
            </header>
        </article>
    );
}

export default bottomBarMic;
