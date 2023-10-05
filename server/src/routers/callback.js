const express = require('express')
const SpotifyWebApi = require('spotify-web-api-node')
const router = new express.Router()


router.get('/callback', async (req, res) => {
    const code = req.query.code
    let credentials = {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        redirectUri: process.env.REDIRECT_URI,
    }
    let spotifyApi = new SpotifyWebApi(credentials)

    spotifyApi.authorizationCodeGrant(code).then(
        function (data) {
            spotifyApi.setAccessToken(data.body['access_token'])
            spotifyApi.setRefreshToken(data.body['refresh_token'])
            res.cookie("access_token", data.body['access_token'],
                { path: "/", httpOnly: false })
            res.cookie("refresh_token", data.body['refresh_token'],
                { path: "/", httpOnly: false })
            res.redirect('http://localhost:3000')
        },
        function (err) {
            res.send({
                error: err.message
            })
        }
    );

})



module.exports = router