import {BsFillMicFill,BsSlashLg} from 'react-icons/bs'

const micIcon = () => {
    return(
        <span style={{ display: 'inline-block', position: 'relative' }}>
          <BsFillMicFill textAnchor="middle" alignmentBaseline="middle" size="30" />
          <BsSlashLg
          textAnchor="middle"
            alignmentBaseline="middle"
            color='red'
            size='30'
            style={{ fontSize: '.2em', position: 'absolute', left: '.10em', bottom: '.1em' }}
            />
          </span>
    )
}

export default micIcon;