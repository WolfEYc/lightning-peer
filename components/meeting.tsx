import { useEffect, useState } from "react"
import lightning from "../client/lightning";
import Stream from "./stream";
import TopBar from "./topBar";
import ChatBar from "./chatBar";
import BottomBar from "./bottomBar";



const Meeting = () => {
    
    const [localStream, setLocalStream] = useState({ stream: <Stream user_name={lightning.localUser.user_name} muted />, state: false });
    const [remoteStream, setRemoteStream] = useState({ stream: <Stream muted />, state: false });
    const [remoteShare, setRemoteShare] = useState({ stream: <Stream muted />, state: false });

    useEffect(() => {

        lightning.on('new-stream', () => {
            setRemoteStream({ 
                stream: <Stream user_name={lightning.remotePeer.user_name} stream={lightning.remotePeer.stream} muted={false} />,
                state: true
            });     
        })

        lightning.on('new-share', () => {
            setRemoteShare({
                stream: <Stream stream={lightning.remotePeer.shareStream} muted={false} />,  
                state: false
            });
        })

        lightning.on('end-share', () => {
            setRemoteShare({
                stream: <Stream muted />,
                state: false
            });
        })

        lightning.on('local-stream-updated', () => {
            setLocalStream({
                stream: <Stream user_name={lightning.localUser.user_name} stream={lightning.localUser.stream} muted />,
                state: true             
            });
        })

        lightning.on('user-disconnected', () => {
            setRemoteStream({
                stream: <Stream muted />,
                state: false
            });

            setRemoteShare({
                stream: <Stream muted />,
                state: false
            });
        })

        lightning.on('remote-video-enabled', (enabled: boolean) => {
            console.log('remote-video-enabled', enabled);
        })

        lightning.on('remote-audio-enabled', (enabled: boolean) => {
            console.log('remote-audio-enabled', enabled);
        })

        lightning.getLocalMedia();
    }, [])
    
    return (
        <div className = "fixed left-0 m-0 right-80 bg-gray-700 h-screen text-gray-500 flex top-12 py-20 pt-40">
            <TopBar/>
            <div className = "px-12"></div>
            {localStream.stream}
            <div className = "px-6"></div>
            {remoteStream.stream}
            {lightning.localStreamActive() ? <BottomBar/> : null}
            <ChatBar/>
        </div>
    )
}

export default Meeting