
const chatBar = () => {
    return(
        <div className="fixed top-14 right-0 h-screen bg-gray-800 pt-6 pl-4 font-bold text-gray-500 text-sm w-1/5">
            Message here
            <input className = "align-text-top vertical-align:text-top bottom-6 border-8 flex-grow flex-col border-gray-700 right-8 rounded-lg m-0 fixed flex-1 bg-gray-700 h-11 w-1/6 focus:outline-none focus:text-white placeholder-gray-600" placeholder="Type message here...">
            
            </input>
        </div>
    )
}

export default chatBar;