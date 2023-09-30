import SongContext from "./song-context";
import Cookies from "js-cookie";

const defaultSongState = {
    loadedSongs: [],
    isLoggedIn: false,
    isLoginPage: true
};

const songReducer = (state, action) => {
    if (action.type === 'LOGIN') {
        if(Cookies.get("access_token")) {
            return {
                loadedSongs: state.loadedSongs,
                isLoggedIn: true,
                isLoginPage: state.isLoginPage
            }
        }
    }

    if(action.type === 'TOPTRACK') {
        return {
            loadedSongs: action.item,
            isLoggedIn: state.isLoggedIn,
            isLoginPage: false
        }
    }

    return defaultSongState;
};

const SongProvider = (props) => {
    const [songState, dispatchSongAction] = useReducer(songReducer, defaultSongState);

    const getTopTracks = async () => {
        const songs = []
        if (songState.isLoggedIn) {
            const response = await fetch('http://localhost:3001/track/top')
            const data = await response.json();
            if (data.error) {
                setIsError(data.error)
            } else {
                for (const song in data) {
                    songs.push({
                        id: song.id,
                        name: song.name
                    })
                }
            }
            dispatchSongAction({ type: 'TOPTRACK', item: songs})
        } else {
            setIsError("The session has expired!. Please Login Again!")
        }
    }

    const setIsLoggedIn = () => {
        dispatchSongAction({ type: 'LOGIN' })
    }

    const songContext = {
        loadedSongs: songState.loadedSongs,
        isLoggedIn: songState.isLoggedIn,
        isLoginPage: songState.isLoginPage,
        topTracks: getTopTracks,
        setIsLoggedIn: setIsLoggedIn
    };

    return (
        <SongContext.Provider value={songContext} >
            {props.children}
        </SongContext.Provider>
    )
}

export default SongProvider;