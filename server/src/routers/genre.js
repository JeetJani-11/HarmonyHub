const express = require('express')
const SpotifyWebApi = require('spotify-web-api-node')
const router = new express.Router()
const auth = require('../middleware/auth')
const refresh_access_token = require('../utils/refreshAccessToken')

let credentials = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
}
let loggedInSpotifyApi = new SpotifyWebApi(credentials)

function addToGenreDict(genre, genreDict) {
  genre.forEach(genre => {
    genreDict[genre] = (genreDict[genre] || 0) + 1;
  });
  return genreDict;
}
router.get('/genre/top', auth, (req, res) => {
  const artistObject = {
    time_range: 'short_term',
    limit: 25
  }
  if (req.query.time_range) {
    artistObject.time_range = req.query.time_range
  }
  var access_token = req.access_token
  loggedInSpotifyApi.setAccessToken(access_token);
  loggedInSpotifyApi.getMyTopArtists(artistObject).then(function (data) {
    let topArtists = data.body.items
    let genreDict = {}
    topArtists.forEach(artist => {
      genreDict = addToGenreDict(artist.genres, genreDict);
    })
    res.send(genreDict)
  }, async function (err) {
    const body = await refresh_access_token(err.message, req.refresh_token, loggedInSpotifyApi)
    if (body.error) {
      return res.send({
        error: error.message
      })
    }
    loggedInSpotifyApi.getMyTopArtists(artistObject).then(function (data) {
      let topArtists = data.body.items
      let genreDict = {}
      topArtists.forEach(artist => {
        genreDict = addToGenreDict(artist.genres, genreDict);
      })
      res.cookie("access_token", body.access_token, { path: "/", httpOnly: false })
      res.send(genreDict)
    }, function (err) {

      res.send({
        error: err.message
      })
    })

  })
})

module.exports = router