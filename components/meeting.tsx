import { useEffect, useState } from "react"
import lightning from "../client/webRTC-connection";
import Stream from "./stream";

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
        <div>
            {state.localStream}
            {state.remoteStream}
        </div>
    )
}

export default Meeting