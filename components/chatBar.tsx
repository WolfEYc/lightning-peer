import {BsFillPlusCircleFill} from 'react-icons/bs'

const ChatBar = () => {
    
    return(
        <div className="fixed top-14 right-0 h-screen bg-gray-800 pt-6 pl-4 font-semibold text-white text-md w-1/5 flex">
            <div>
                <textarea className="bottom-6 border-8 border-gray-700 right-6 rounded-lg m-0 bg-gray-700 w-80 flex">
                    
                </textarea>
            </div>
        </div>
    )
}

export default ChatBar;