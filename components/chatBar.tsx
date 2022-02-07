import {BsFillPlusCircleFill} from 'react-icons/bs'
import MessageBox from './messageBox';

const ChatBar = () => {
    
    return(
        <div className="fixed top-14 right-0 h-screen bg-gray-800 pt-6 pl-4 font-semibold text-white text-md w-1/5 flex">
            <div>
                <MessageBox />
            </div>
        </div>
    )
}

export default ChatBar;