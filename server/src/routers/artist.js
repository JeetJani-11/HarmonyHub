const express = require('express')
const SpotifyWebApi = require('spotify-web-api-node')
const router = new express.Router()
const auth = require('../middleware/auth')
const refresh_access_token = require('../utils/refreshAccessToken')

var credentials = {
    clientId: 'daa3f493706649d192c579e546334d04',
    clientSecret: '74f77af1b7674593ac2922ee70ad6ffb',
    redirectUri: 'http://localhost:3001/callback',
  }
let loggedInSpotifyApi = new SpotifyWebApi(credentials)

router.get('/artist/top', auth, (req, res) => {
  
    const artistObject = {
        time_range: 'short_term',
        limit: 25
    }
    if(req.query.time_range){
        artistObject.time_range = req.query.time_range
    }
    var access_token = req.access_token
    loggedInSpotifyApi.setAccessToken(access_token)
    loggedInSpotifyApi.getMyTopArtists(artistObject).then(function(data) {
      let topArtists = data.body.items;
      console.log(topArtists)
      res.send(topArtists)
    }, async function(err) {
        const body = await refresh_access_token(err.message , req.refresh_token , loggedInSpotifyApi)
        if(body.error){
          return res.send({
                error: body.error.message
            })
        }
        loggedInSpotifyApi.getMyTopArtists(artistObject).then(function(data) {
            res.cookie("access_token"  , body.access_token , { path: "/", HttpOnly: false , SameSite : 'None' , Secure : false})
            console.log(data.body.items)
            res.send(data.body.items)
          }, function(err) {
            res.send({
                error: err.message
            })
          })
    })
})

module.exports = router