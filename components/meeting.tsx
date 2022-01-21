import { useEffect, useState } from "react"
import lightning from "../client/lightning";
import Stream from "./stream";
import TopBar from "./topBar";
import ChatBar from "./chatBar";
import BottomBar from "./bottomBar";
import One from "./screens/one";
import Zero from "./screens/zero";



const Meeting = () => {

    const [state, setState] = useState(<Zero />);

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
            <One localStream={localStream}/>
            {lightning.localStreamActive() ? <BottomBar/> : null}
            <ChatBar/>
        </div>
    )
}

export default Meeting