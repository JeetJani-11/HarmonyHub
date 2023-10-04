import SongContext from "./song-context";
import { useReducer } from 'react';
import Cookies from "js-cookie";

const defaultSongState = {
    loadedSongs: [],
    recentlyPlayed: [],
    topArtists: [],
    topGenres: [],
    isLoginPage: true,
    isError: '',
    isSuccess: ''
};

const songReducer = (state, action) => {
    if(action.type === 'TOPTRACK') {
        return {
            loadedSongs: action.item,
            recentlyPlayed: [],
            topArtists: [],
            topGenres: [],
            isLoginPage: false,
            isError: '',
            isSuccess: ''
        }
    }

    if(action.type === 'ARTISTS') {
        return {
            loadedSongs: [],
            recentlyPlayed: [],
            topArtists: action.item,
            topGenres: [],
            isLoginPage: false,
            isError: '',
            isSuccess: ''
        }
    }

    if(action.type === 'GENRES') {
        return {
            loadedSongs: [],
            recentlyPlayed: [],
            topArtists: [],
            topGenres: action.item,
            isLoginPage: false,
            isError: '',
            isSuccess: ''
        }
    }

    if(action.type === 'RECENTS') {
        return {
            loadedSongs: [],
            recentlyPlayed: action.item,
            topArtists: [],
            topGenres: [],
            isLoginPage: false,
            isError: '',
            isSuccess: ''
        }
    }

    if(action.type === 'ERROR') {
        return {
            loadedSongs: state.loadedSongs,
            recentlyPlayed: state.recentlyPlayed,
            topArtists: state.topArtists,
            topGenres: state.topGenres,
            isLoginPage: state.isLoginPage,
            isError: action.item,
            isSuccess: ''
        }
    }

    if(action.type === 'SUCCESS') {
        return {
            loadedSongs: state.loadedSongs,
            recentlyPlayed: state.recentlyPlayed,
            topArtists: state.topArtists,
            topGenres: state.topGenres,
            isLoginPage: state.isLoginPage,
            isError: '',
            isSuccess: action.item
        }
    }

    return defaultSongState;
};

let time = ''
const SongProvider = (props) => {
    const [songState, dispatchSongAction] = useReducer(songReducer, defaultSongState);
    const headers = new Headers({
        'Authorization' : `Bearer ${Cookies.get("access_token")}`,
        'Refresh': `${Cookies.get("refresh_token")}`
    })

    const getTopTracks = async (button) => {
        let songs = []
        time = button
        console.log(time)
        if (localStorage.getItem("access_token")) {
            let url = 'http://localhost:3001/track/top?time_range=' + button 
            const response = await fetch(url, {
                method: 'GET', 
                withCredentials: true ,
                credentials: 'include' ,
                headers
            })
            const data = await response.json();
            console.log(data)
            if (data.error) {
                dispatchSongAction({type: 'ERROR', item: data.error})
            } else {
                for (const song in data) {
                    songs.push({
                        key: data[song].id,
                        id: parseInt(song) + 1,
                        imgUrl: data[song].album.images[data[song].album.images.length - 1].url,
                        name: data[song].name,
                        artists: data[song].artists,
                        uri: data[song].external_urls.spotify
                    })
                }
            }
            dispatchSongAction({ type: 'TOPTRACK', item: songs})
        } else {
            console.log("Hello")
            dispatchSongAction({type: 'ERROR', item: "The session has expired!. Please Login Again!"})
        }
    }

    const getTopArtists = async (button) => {
        let songs = []
        time = button
        if (localStorage.getItem("access_token")) {
            let url = 'http://localhost:3001/artist/top?time_range=' + button 
            const response = await fetch(url, {
                method: 'GET', 
                withCredentials: true ,
                credentials: 'include' ,
                headers: new Headers({
                    'Authorization' : `Bearer ${Cookies.get("access_token")}`,
                    'accept': 'application/json',
                    'Refresh': `${Cookies.get("refresh_token")}`
                })
            })
            const data = await response.json();
            if (data.error) {
                dispatchSongAction({type: 'ERROR', item: data.error})
            } else {
                for (const song in data) {
                    songs.push({
                        id: data[song].id,
                        name: data[song].name,
                        img: data[song].images[data[song].images.length - 2].url,
                        uri: data[song].external_urls.spotify
                    })
                }
            }
            dispatchSongAction({ type: 'ARTISTS', item: songs})
        } else {
            dispatchSongAction({type: 'ERROR', item: "The session has expired!. Please Login Again!"})
        }
    }

    const getRecentlyPlayed = async () => {
        let recents = []
        if (localStorage.getItem("access_token")) {
            const response = await fetch('http://localhost:3001/track/recent', {
                method: 'GET', 
                withCredentials: true ,
                credentials: 'include' ,
                headers
            })
            const data = await response.json();
            console.log('rp',data)
            if (data.error) {
                dispatchSongAction({type: 'ERROR', item: data.error})
            } else {
                for (const song in data) {
                    recents.push({
                        key: data[song].played_at,
                        imgUrl: data[song].track.album.images[data[song].track.album.images.length - 1].url,
                        name: data[song].track.name,
                        artists: data[song].track.album.artists,
                        uri: data[song].track.album.external_urls.spotify,
                        playedAt: data[song].played_at
                    })
                }
            }
            dispatchSongAction({ type: 'RECENTS', item: recents})
        } else {
            dispatchSongAction({type: 'ERROR', item: "The session has expired!. Please Login Again!"})
        }
    }

    const getTopGenres = async (button) => {
        const songs = []
        time = button
        if (localStorage.getItem("access_token")) {
            let url = 'http://localhost:3001/genre/top?time_range=' + button 
            const response = await fetch(url, {
                method: 'GET', 
                withCredentials: true ,
                credentials: 'include' ,
                headers
            })
            const data = await response.json();
            console.log(data);
            if (data.error) {
                dispatchSongAction({type: 'ERROR', item: data.error})
            } else {
                console.log(data);
                Object.keys(data).map((type) => {
                    songs.push({
                        key: type, 
                        count: data[type],
                        name: type
                    })
                })
            }
            songs.sort((a, b) => (b.count > a.count) ? 1 : -1)
            console.log(songs)
            dispatchSongAction({ type: 'GENRES', item: songs})
        } else {
            dispatchSongAction({type: 'ERROR', item: "The session has expired!. Please Login Again!"})
        }
    }

    const createPlaylist = async () => {
        console.log("Hi")
        let url = `http://localhost:3001/playlist?time_range=${time}`
        const respone = await fetch(url, {
            method: 'GET', 
            withCredentials: true ,
            credentials: 'include' ,
            headers
        })
        const data = await respone.json()
        dispatchSongAction({type: 'SUCCESS', item: data.message})
    }

    const logout = () => {
        localStorage.removeItem("access_token")
        Cookies.remove("access_token")
        Cookies.remove("refresh_token")
        dispatchSongAction({type: 'LOGOUT'})
    }

    const login = () => {
        dispatchSongAction({type: 'LOGIN'})
    }

    const songContext = {
        loadedSongs: songState.loadedSongs,
        recentlyPlayed: songState.recentlyPlayed,
        isLoginPage: songState.isLoginPage,
        topGenres: songState.topGenres,
        isError: songState.isError,
        isSuccess: songState.isSuccess,
        topArtists: songState.topArtists,
        getTopTracks: getTopTracks,
        getTopArtists: getTopArtists,
        getRecentlyPlayed: getRecentlyPlayed,
        getTopGenres: getTopGenres,
        createPlaylist: createPlaylist,
        logout: logout,
        login: login
    };

    return (
        <SongContext.Provider value={songContext} >
            {props.children}
        </SongContext.Provider>
    )
}

export default SongProvider;