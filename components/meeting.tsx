import { useEffect, useState } from "react"
import lightning from "../client/lightning";
import AudioButton from "./AudioButton";
import ShareButton from "./ShareButton";
import Stream from "./stream";
import VideoButton from "./VideoButton";

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
        <div>
            {state.localStream}
            {state.remoteStream}
            {state.remoteShare}
            {lightning.localStreamActive() ? <><AudioButton /> <VideoButton /> <ShareButton /></>: null }
        </div>
    )
}

export default Meeting