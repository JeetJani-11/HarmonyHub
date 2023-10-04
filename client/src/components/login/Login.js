import { useContext, useState } from 'react';
import classes from './Login.module.css'
import SongContext from '../../store/song-context';
import SongItem from '../songs/SongItem';
import RecentlyPlayedItem from '../songs/RecentlyPlayedItem';
import TopArtistItem from '../songs/TopArtistItem';
import TopGenresItem from '../songs/TopGenresItem';
import Cookies from 'js-cookie';

const Login = () => {
  const ctx = useContext(SongContext)
  const [isRecentlyPlayed, setIsRecentlyPlayed] = useState(false)

  let data
  if (ctx.loadedSongs.length !== 0) {
    data = ctx.loadedSongs.map((song) => (
      <SongItem
        key={song.key}
        id={song.id}
        imgUrl={song.imgUrl}
        name={song.name}
        artists={song.artists}
        uri={song.uri}
      />
    ));
    if (isRecentlyPlayed) {
      setIsRecentlyPlayed(false)
    }
  } else if (ctx.recentlyPlayed.length !== 0) {
    data = ctx.recentlyPlayed.map((song) => (
      <RecentlyPlayedItem
        key={song.key}
        imgUrl={song.imgUrl}
        name={song.name}
        artists={song.artists}
        uri={song.uri}
        playedAt={song.playedAt}
      />
    ));
    if (!isRecentlyPlayed) {
      setIsRecentlyPlayed(true)
    }
  } else if (ctx.topArtists.length !== 0) {
    data = ctx.topArtists.map((song) => (
      <TopArtistItem
        id={song.id}
        name={song.name}
        img={song.img}
        uri={song.uri}
      />
    ));
    if (isRecentlyPlayed) {
      setIsRecentlyPlayed(false)
    }
  } else if (ctx.topGenres.length !== 0) {
    const max = ctx.topGenres[0].count
    data = ctx.topGenres.map((song) => (
      <TopGenresItem
        key={song.key}
        name={song.name}
        count={song.count}
        max={max}
      />
    ));
    if (isRecentlyPlayed) {
      setIsRecentlyPlayed(false)
    }
  }

  const isShowLoginPage = !localStorage.getItem("access_token") && ctx.isLoginPage
  const head = ctx.recentlyPlayed.length !== 0 || ctx.loadedSongs.length !== 0 || ctx.topArtists.length !== 0 || ctx.topGenres.length !== 0

  const onClickHandler = (button) => {
    if(button === 'FIRST') {
      if(ctx.loadedSongs.length !== 0) {
        ctx.getTopTracks('short_term')
      } else if(ctx.topArtists.length !== 0) {
        ctx.getTopArtists('short_term')
      } else if(ctx.topGenres.length !== 0) {
        ctx.getTopGenres('short_term')
      }
    } else if(button === 'SECOND') {
      if(ctx.loadedSongs.length !== 0) {
        ctx.getTopTracks('medium_term')
      } else if(ctx.topArtists.length !== 0) {
        ctx.getTopArtists('medium_term')
      } else if(ctx.topGenres.length !== 0) {
        ctx.getTopGenres('medium_term')
      }
    } else {
      if(ctx.loadedSongs.length !== 0) {
        ctx.getTopTracks('long_term')
      } else if(ctx.topArtists.length !== 0) {
        ctx.getTopArtists('long_term')
      } else if(ctx.topGenres.length !== 0) {
        ctx.getTopGenres('long_term')
      }
    }
  }

  const buttons = <div className={classes.buttons}>
    <button className={classes.btn} onClick={() => onClickHandler('FIRST')}>1 Month</button>
    <button className={classes.btn} onClick={() => onClickHandler('SECOND')}>6 Months</button>
    <button className={classes.btn} onClick={() => onClickHandler('THIRD')}>All Time</button>
  </div>

  return (
    <div className={classes.login}>
      <div className={classes.container}>
        {!head && <h1>Statistics for Spotify</h1>}
        {head && ctx.loadedSongs.length !== 0 && <h1>Top Tracks</h1>}
        {head && ctx.recentlyPlayed.length !==0 && <h1>Recently Played</h1>}
        {head && ctx.topArtists.length !== 0 && <h1>Top Artists</h1>}
        {head && ctx.topGenres.length !== 0 && <h1>Top Genres</h1>}
        {isShowLoginPage && <p>Please login with your spotify account, to see your track or artist ranking!</p>}
        {isShowLoginPage && <button><a href='http://localhost:3001/authorize'>Login with Spotify</a></button>}
        {Cookies.get("access_token") && !ctx.isError && ctx.isLoginPage && <h2>You have successfully logged in!</h2>}
        {ctx.isError && <p className={classes.error}>{ctx.isError}</p>}
      </div>
      {Cookies.get("access_token") && !ctx.isError && !ctx.isLoginPage && !isRecentlyPlayed && buttons}
      {Cookies.get("access_token") && !ctx.isLoginPage && <ul className={ctx.topArtists.length !== 0 && classes.card}>{data}</ul>}
      {ctx.loadedSongs.length !== 0 && <button className={classes.create} onClick={ctx.createPlaylist}>Create Playlist</button>}
      {ctx.isSuccess && <h2 className={classes.success}>{ctx.isSuccess}</h2>}
    </div>
  )
}

export default Login;