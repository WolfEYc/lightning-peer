import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import lightning from "../client/lightning";
import Loading from "../components/loading";
import Meeting from "../components/meeting";
import UserName from "../components/username";



const MeetingPage: NextPage = () => {
    
    
    const router = useRouter();
    const { pid } = router.query

    const [view, setView] = useState(<Loading />)

    useEffect(() => {
        if(pid) {
            
            const joinRoom = () => {
                lightning.on('joined-room', () => {
                    setView(<Meeting />);
                })
                
                lightning.joinRoom(pid.toString());
            }

            if(lightning.localUser.user_name && lightning.localUser.user_name?.length < 3) {
                
                const handleSubmit = (username: string) => {
                    if(username.length > 3){
                        lightning.setName(username);
                        joinRoom()
                    }
                }

                setView(<UserName onSubmit={handleSubmit}/>)
            } else {
                joinRoom()                
            }

        }
    }, [pid])
    
    return (
        <div className="bg-gray-700 h-screen">
            {view}
        </div>               
    )
}



export default MeetingPage