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
   

router.get('/track/top', auth, (req, res) => {
    let access_token = req.access_token
    loggedInSpotifyApi.setAccessToken(access_token)
    const trackObject = {
        time_range: 'short_term',
        limit: 25
    }
    if (req.query.time_range) {
        trackObject.time_range = req.query.time_range
    }
    console.log(trackObject, req.query.time_range)
    loggedInSpotifyApi.getMyTopTracks(
        trackObject
    ).then(function (data) {
        res.send(data.body.items)
    }, async function (err) {
        const body = await refresh_access_token(err.message , req.refresh_token , loggedInSpotifyApi)
        if(body.error){
          return res.send({
                error: body.error.message
            })
        }
        loggedInSpotifyApi.getMyTopTracks(
            trackObject
        ).then(function (data) {
            console.log(data)
            res.cookie("access_token"  , body.access_token , { path: "/", httpOnly: false} )
            res.send(data.body.items)
        }, function (err) {
            console.log(err)
            res.send({
                error: err.message
            })
        })

    })
})

router.get('/track/recent', auth, (req, res) => {
    var access_token = req.access_token
    loggedInSpotifyApi.setAccessToken(access_token)
    loggedInSpotifyApi.getMyRecentlyPlayedTracks({
        limit: 20
    }).then(function (data) {
        res.send(data.body.items)
    },async function (err) {
        const body = await refresh_access_token(err.message , 'AQB01SIV2nW9sP7hVr7NG80ajCb5kCyGtW-53biHluTlRSHEdItvz-yLFxwNgMt9bmcPvuwr2LrvNAcAbRIJzlS_YIDNVFxKtvDMnFsxOF12IsBcD-jvWbJFrLwv0vZh5ew' , loggedInSpotifyApi)
        if(body.error){
          return res.send({
                error: body.error.message
            })
        }

        loggedInSpotifyApi.getMyRecentlyPlayedTracks({
            limit: 20
        }).then(function (data) {
            res.cookie("access_token" , body.access_token,
                {  httpOnly: false  , secure: true})
            res.send(data.body.items)
        },function (err) {
            res.send({
                error: err.message
            })
        });
    });
})

module.exports = router