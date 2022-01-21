import lightning, { Display } from '../../client/lightning'
import Stream from '../stream';

const One = () => {
    return(
        <div className = "pl-36">
            <Stream display={lightning.localDisplay} muted width={500}/>
        </div>
    )
}

export default One;