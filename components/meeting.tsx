import { useEffect, useState } from "react"
import lightning from "../client/webRTC-connection";
import Stream from "./stream";
import TopBar from "./topBar";
import ChatBar from "./chatBar";
import BottomBar from "./bottomBar";

const Meeting = () => {
    
    const [state, setState] = useState({
        localStream: <Stream user_name={lightning.localUser.user_name} />,
        remoteStream: <Stream />
    })
    

    useEffect(() => {

        lightning.on('new-stream', () => {
            setState(prevState => ({
                localStream: prevState.localStream,
                remoteStream: <Stream user_name={lightning.remotePeer.user_name} stream={lightning.remotePeer.stream}/>
            }));
        })

        lightning.on('local-stream-updated', () => {
            setState(prevState => ({
                localStream: <Stream user_name={lightning.localUser.user_name} stream={lightning.localUser.stream}/>,
                remoteStream: prevState.remoteStream
            }));
        })

        lightning.on('user-disconnected', () => {
            setState(prevState => ({
                localStream: prevState.localStream,
                remoteStream: <Stream />
            }));
        })

        lightning.getLocalMedia();

    }, [])
    
    return (
        <div className = "fixed left-0 m-0 right-80 bg-gray-700 h-screen text-gray-500 flex top-12 py-20 pt-40">
            <TopBar/>
            <div className = "px-12"></div>
            {state.localStream}
            <div className = "px-6"></div>
            {state.remoteStream}
            <BottomBar/>
            <ChatBar/>
        </div>
    )
}

export default Meeting