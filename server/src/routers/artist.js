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

router.get('/artist/top', auth, (req, res) => {
  const artistObject = {
    time_range: 'short_term',
    limit: 25
  }
  if (req.query.time_range) {
    artistObject.time_range = req.query.time_range
  }
  var access_token = req.access_token
  loggedInSpotifyApi.setAccessToken(access_token)
  loggedInSpotifyApi.getMyTopArtists(artistObject).then(function (data) {
    let topArtists = data.body.items;
    res.send(topArtists)
  }, async function (err) {
    const body = await refresh_access_token(err.message, req.refresh_token, loggedInSpotifyApi)
    if (body.error) {
      return res.send({
        error: body.error.message
      })
    }
    loggedInSpotifyApi.getMyTopArtists(artistObject).then(function (data) {
      res.cookie("access_token", body.access_token, { path: "/", HttpOnly: false, SameSite: 'None', Secure: false })
      res.send(data.body.items)
    }, function (err) {
      res.send({
        error: err.message
      })
    })
  })
})

module.exports = router