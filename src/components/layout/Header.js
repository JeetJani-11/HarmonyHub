import classes from './Header.module.css'
import Cookies from "js-cookie";

const Header = () => {
    return (
        <header className={classes.header}>
            <h2>HarmonyHub</h2>
            <button onClick={getTopTracks}>Top Tracks</button> 
            <button>Top Artists</button> 
            <button>Top Genres</button> 
            <button>Recently Played</button> 
        </header>
    )
}

export default Header;