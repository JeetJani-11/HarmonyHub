import classes from './TopGenresItem.module.css'

const TopGenresItem = (props) => {
    const fillHeight = (props.count / props.max) * 60 + '%';

    return (
        <li className={classes.genres}>
            <div className={classes.name}>{props.name}</div>
            <div className={classes.fill} style={{ width: fillHeight }}>&nbsp;</div>
        </li>
    )
}

export default TopGenresItem;