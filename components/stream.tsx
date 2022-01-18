import ReactPlayer from 'react-player'

interface props {
    user_name?: string
    stream?: MediaStream
    muted: boolean
}

const Stream = (props: props) => {
    
    return (
        <div>
            {props.user_name}
            <ReactPlayer url={props.stream} playing muted={props.muted}/>
        </div>
    )
}

export default Stream