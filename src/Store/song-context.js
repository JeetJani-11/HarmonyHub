import React from 'react';

const SongContext = React.createContext({
  loadedSongs: [],
  isLoggedIn: false,
  isLoginPage: true,
  getTopTracks: () => {},
  setIsLoggedIn: () => {}
});

export default SongContext;