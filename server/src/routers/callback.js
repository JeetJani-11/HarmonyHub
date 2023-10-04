const express = require('express')
const SpotifyWebApi = require('spotify-web-api-node')
const router = new express.Router()


router.get('/callback', async (req, res) => {
    const code = req.query.code
    var credentials = {
        clientId: 'daa3f493706649d192c579e546334d04',
        clientSecret: '74f77af1b7674593ac2922ee70ad6ffb',
        redirectUri: 'http://localhost:3001/callback',
    }
    var spotifyApi = new SpotifyWebApi(credentials);

    spotifyApi.authorizationCodeGrant(code).then(
        function (data) {
            spotifyApi.setAccessToken(data.body['access_token'])
            spotifyApi.setRefreshToken(data.body['refresh_token'])
            res.cookie("access_token",data.body['access_token'],
                { path: "/", httpOnly: false })
            res.cookie("refresh_token", data.body['refresh_token'] ,
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