import classes from './TopArtistItem.module.css'

const TopArtistItem = (props) => {
    return (
        <li className={classes.listItem}>
            <a href={props.uri} target='blank' className={classes.artists}>
                <img src={props.img} className={classes.img}></img>
                <span>{props.name}</span>
            </a>
        </li>
    )
}

export default TopArtistItem;   