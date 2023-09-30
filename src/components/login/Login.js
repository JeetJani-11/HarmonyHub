import { useContext } from 'react';
import classes from './Login.module.css'
import SongContext from '../../store/song-context';
import SongItem from '../songs/SongItem';

const Login = () => {
    const ctx = useContext(SongContext)

    const songsList = loadedSongs.map((song) => (
        <SongItem
          id={song.id}
          name={song.name}
        />
      ));

    return (
        <div className={classes.container}>
            <h1>Statistics for Spotify</h1>
            <p>Please login with your spotify account, to see your track or artist ranking!</p>
            {!ctx.isLoggedIn && ctx.isLoginPage && <button><a href="http://localhost:3001/authorize">Login with Spotify</a></button>}
            {ctx.isLoggedIn && ctx.isLoginPage && <h2>You have successfully logged in!</h2>}
            {ctx.isLoggedIn && !ctx.isLoginPage && <ul>{SongItem}</ul>}
        </div>
    )
}

export default Login;