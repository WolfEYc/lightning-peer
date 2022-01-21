import { useEffect, useState } from "react"
import lightning from "../client/lightning";
import TopBar from "./topBar";
import ChatBar from "./chatBar";
import BottomBar from "./bottomBar";
import One from "./screens/1";
import Zero from "./screens/0";



const Meeting = () => {


    const [state, setState] = useState(<Zero />);
    useEffect(() => {

        lightning.on('state-change', () => {
            switch (lightning.getState()) {
                case 0:
                    setState(<Zero />)
                case 1:
                    setState(<One />)
            }
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
            {state}
            {lightning.localStreamActive() ? <BottomBar/> : null}
            <ChatBar/>
        </div>
    )
}

export default Meeting