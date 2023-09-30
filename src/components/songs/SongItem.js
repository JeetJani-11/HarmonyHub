const SongItem = (props) => {
    return (
        <li className={classes.song}>
            <div>
                <div>{props.name}</div>
            </div>
        </li>
    )
}

export default SongItem;