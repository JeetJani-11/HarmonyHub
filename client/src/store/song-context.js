import React from 'react';

const SongContext = React.createContext({
  loadedSongs: [],
  recentlyPlayed: [],
  topArtists: [],
  topGenres: [],
  isLoginPage: true,
  isError: '',
  isSuccess: '',
  getTopTracks: () => {},
  getTopArtists: () => {},
  getRecentlyPlayed: () => {},
  getTopGenres: () => {},
  createPlaylist: () => {},
  logout: () => {}, 
  login: () => {}
});

export default SongContext;