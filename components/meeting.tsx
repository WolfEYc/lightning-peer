import { useEffect, useState } from "react"
import lightning from "../client/lightning";
import Stream from "./stream";
import TopBar from "./topBar";
import ChatBar from "./chatBar";
import BottomBar from "./bottomBar";



const Meeting = () => {
    
    const [state, setState] = useState({
        localStream: <Stream user_name={lightning.localUser.user_name} muted />,
        remoteStream: <Stream muted />,
        remoteShare: <Stream muted />
    })


    useEffect(() => {

        lightning.on('new-stream', () => {
            setState(prevState => ({
                localStream: prevState.localStream,
                remoteStream: <Stream user_name={lightning.remotePeer.user_name} stream={lightning.remotePeer.stream} muted={false}/>,
                remoteShare: prevState.remoteShare
            }));
            
        })

        lightning.on('new-share', () => {
            setState(prevState => ({
                localStream: prevState.localStream,
                remoteStream: prevState.remoteStream,
                remoteShare: <Stream muted={false} stream={lightning.remotePeer.shareStream} />             
            }));
        })

        lightning.on('end-share', () => {
            setState(prevState => ({
                localStream: prevState.localStream,
                remoteStream: prevState.remoteStream,
                remoteShare: <Stream muted />         
            }));
        })

        lightning.on('local-stream-updated', () => {
            setState(prevState => ({
                localStream: <Stream user_name={lightning.localUser.user_name} stream={lightning.localUser.stream} muted/>,
                remoteStream: prevState.remoteStream,
                remoteShare: prevState.remoteShare              
            }));
        })

        

        lightning.on('user-disconnected', () => {
            setState(prevState => ({
                localStream: prevState.localStream,
                remoteStream: <Stream muted />,
                remoteShare: <Stream muted />
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
            {lightning.localStreamActive() ? <BottomBar/> : null}
            <ChatBar/>

        </div>
    )
}

export default Meeting