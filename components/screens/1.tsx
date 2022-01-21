import lightning from '../../client/lightning'
import Stream from '../stream';

const One = () => {
    return(
        <div className = "pl-36">
            <Stream stream={lightning.localUser.stream} muted width={500}/>
        </div>
    )
}

export default One;