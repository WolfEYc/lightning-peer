import lightning from '../../client/lightning'
import Stream from '../stream';

const One = () => {
    return(
        <div className = "pl-36 h-screen">
            <Stream stream={lightning.localUser.stream} muted />
        </div>
    )
}

export default One;