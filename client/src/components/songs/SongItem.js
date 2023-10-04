import classes from './SongItem.module.css'

const SongItem = (props) => {
    let str = ''
    props.artists.map((artist) => str = str + ", " + artist.name)
    str = str.substring(2, str.length);

    return (
        <li>
            <a href={props.uri} target='blank' className={classes.song}>
                <div className={classes.id}>{props.id}</div>
                <img src={props.imgUrl} className={classes.img}></img>
                <div className={classes.details}>
                    <div className={classes.name}>{props.name}</div>
                    <div>{str}</div>
                </div>
            </a>
        </li>
    )
}

export default SongItem;