import {BsFillCameraVideoFill,BsSlashLg} from 'react-icons/bs'

const VideoIcon = () => {
    return(
        <span style={{ display: 'inline-block', position: 'relative' }}>
          <BsFillCameraVideoFill textAnchor="middle" alignmentBaseline="middle" size="30" />
          <BsSlashLg
          textAnchor="middle"
            alignmentBaseline="middle"
            color='red'
            size='30'
            style={{ fontSize: '.2em', position: 'absolute', left: '.55em', bottom: '.1em' }}
            />
          </span>
    )
}

export default VideoIcon;