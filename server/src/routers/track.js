const express = require('express')
const util = require('util')
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
    loggedInSpotifyApi.getMyTopTracks(
        trackObject
    ).then(function (data) {
        res.send(data.body.items)
    }, async function (err) {
        const body = await refresh_access_token(err, req.refresh_token, loggedInSpotifyApi)
        if (body.error) {
            return res.send({
                error: body.error.message
            })
        }
        loggedInSpotifyApi.getMyTopTracks(
            trackObject
        ).then(function (data) {
            res.cookie("access_token", body.access_token, { path: "/", httpOnly: false })
            res.send(data.body.items)
        }, function (err) {
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
    }, async function (err) {
        const body = await refresh_access_token(err.message, req.refresh_token, loggedInSpotifyApi)
        if (body.error) {
            return res.send({
                error: body.error.message
            })
        }
        loggedInSpotifyApi.getMyRecentlyPlayedTracks({
            limit: 20
        }).then(function (data) {
            res.cookie("access_token", body.access_token,
                { httpOnly: false, secure: true })
            res.send(data.body.items)
        }, function (err) {
            res.send({
                error: err.message
            })
        });
    });
})

module.exports = router