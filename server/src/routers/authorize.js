const SpotifyWebApi = require('spotify-web-api-node')
const express = require('express')
const router = new express.Router()

var scopes = ['user-read-private', 'user-read-email', 'user-top-read', 'user-read-recently-played', 'user-read-playback-position', 'playlist-modify-private', 'playlist-read-private', 'playlist-read-collaborative', 'playlist-modify-public'],
  redirectUri = process.env.REDIRECT_URI,
  clientId = process.env.CLIENT_ID,
  state = 'some-state-of-my-choice';
var spotifyApi = new SpotifyWebApi({
  redirectUri: redirectUri,
  clientId: clientId
});
var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state)

router.get('/authorize', (req, res) => {
  res.redirect(authorizeURL)
})

module.exports = router