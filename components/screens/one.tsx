import { Display } from '../../client/lightning'

interface props {
    localStream: Display,
}

const One = (props: props) => {
    return(
        <div className = "pl-36">
            {props.localStream.stream}
        </div>
    )
}

export default One;