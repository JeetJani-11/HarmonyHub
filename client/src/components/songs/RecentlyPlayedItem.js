import classes from './RecentlyPlayedItem.module.css'

const RecentlyPlayedItem = (props) => {
    let str = ''
    props.artists.map((artist) => str = str + ", " + artist.name)
    str = str.substring(2, str.length);
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(props.playedAt).toLocaleDateString([],options);

    return (
        <li>
            <a href={props.uri} target='blank' className={classes.song}>
                <img src={props.imgUrl} className={classes.img}></img>
                <div className={classes.details}>
                    <div className={classes.name}>{props.name}</div>
                    <div>{str}</div>
                </div>
                <div>{date}</div>
            </a>
        </li>
    )
}

export default RecentlyPlayedItem;