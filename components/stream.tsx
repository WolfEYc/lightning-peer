import ReactPlayer from 'react-player'

interface props {
    stream?: MediaStream
    label?: string 
    muted: boolean
    width: Number
}

const Stream = (props: props) => {
    
    return (
        <div>
            <div className='border-gray-900 bg-red'>
                <ReactPlayer url={props.stream} playing muted={props.muted} width="640px" height="600px"/>  
            </div>
            <button className='font-semibold text-lg text-gray-400'>{props.label}</button>
        </div>
    )
}

export default Stream