
interface props {
    onSubmit: (username: string) => void
}

const UserName = (props: props) => {

    let username: string

    const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        username = e.currentTarget.value;
    }

    const handleClick = () => {
        props.onSubmit(username);
    }

    return (
        <div>
            <input placeholder="Beans" onChange={handleChange} />
            <button onClick={handleClick}>Beanos</button>
        </div>
    )
}

export default UserName