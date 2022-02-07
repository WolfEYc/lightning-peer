import lightning from '../../client/lightning'
import Stream from '../stream';

const Zero = () => {
    return (
        <div className="">
             <Stream stream={lightning.localUser.stream} muted width={100} height={100}/>
        </div>
    )
}

export default Zero