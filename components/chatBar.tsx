import {BiHash} from "react-icons/bi"

const chatBar = () => {
    return(
        <div className="fixed top-14 right-0 h-screen bg-gray-800 pt-6 pl-4 font-semibold text-white text-md w-1/5 flex">
            <div className = "bottom-6 border-8 border-gray-700 right-4 rounded-lg m-0 fixed bg-gray-700 w-1/6 focus:outline-none focus:text-white font-normal placeholder-gray-600 textareaElement" contentEditable placeholder="Joe">
            </div>
        </div>
    )
}

export default chatBar;