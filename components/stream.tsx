import ReactPlayer from 'react-player'

interface props {
    stream?: MediaStream
    label?: string 
    muted: boolean
    width?: number
    height?: number
}

const Stream = (props: props) => {
    
    return (
        <div>
            <div className='border-gray-900 border-4'>
                <ReactPlayer url={props.stream} playing muted={props.muted} width={props.width || 640} height={props.height || 480}/>  
            </div>
            <button className='font-semibold text-lg text-gray-400'>{props.label}</button>
        </div>
    )
}

export default Stream