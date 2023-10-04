import { useContext } from 'react'
import SongContext from '../../store/song-context'
import classes from './Header.module.css'

const Header = () => {
    const ctx = useContext(SongContext)
    console.log("Hello")

    const present = localStorage.getItem("access_token")
    
    return (
        <header className={classes.header}>
            <h2 onClick={ctx.login}>HarmonyHub</h2>
            {present && <button onClick={() => {ctx.getTopTracks('short_term')}}>Top Tracks</button>}
            {present && <button onClick={() => {ctx.getTopArtists('short_term')}}>Top Artists</button>} 
            {present && <button onClick={() => {ctx.getTopGenres('short_term')}}>Top Genres</button>}
            {present && <button onClick={ctx.getRecentlyPlayed}>Recently Played</button>}
            {localStorage.getItem("access_token") && !ctx.isLoginPage && <button onClick={ctx.logout}>Logout</button>}
        </header>
    )
}

export default Header;