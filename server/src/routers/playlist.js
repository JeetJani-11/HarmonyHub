const express = require('express')
const SpotifyWebApi = require('spotify-web-api-node')
const router = new express.Router()
const auth = require('../middleware/auth')
const refresh_access_token = require('../utils/refreshAccessToken')

let credentials = {
    clientId: 'daa3f493706649d192c579e546334d04',
    clientSecret: '74f77af1b7674593ac2922ee70ad6ffb',
    redirectUri: 'http://localhost:3001/callback',
}

let loggedInSpotifyApi = new SpotifyWebApi(credentials)

const createPlaylist = async (trackObject, access_token) => {
    try {
        let tracksToBeAdded = []
        console.log(access_token)
        console.log("called")
        loggedInSpotifyApi.setAccessToken(access_token)
        const tracks = await loggedInSpotifyApi.getMyTopTracks(trackObject)
        tracks.body.items.forEach((item) => {
            tracksToBeAdded.push(item.uri)
        })
        console.log(tracksToBeAdded)
        const playlist = await loggedInSpotifyApi.createPlaylist('Top Songs', { 'description': 'Top 25 Songs', 'public': true })
        console.log(playlist.body)
        await loggedInSpotifyApi.addTracksToPlaylist(playlist.body.id, tracksToBeAdded)
        return {
            message: "Playlist Created Successfully!"
        }
    } catch (e) {
        console.log(e)
        return { error: e.message }
    }

}

router.get('/playlist', auth, async (req, res) => {
    const trackObject = {
        time_range: 'short_term',
        limit: 25
    }
    if (req.query.time_range) {
        trackObject.time_range = req.query.time_range
    }

    let access_token = req.access_token

    let ret = await createPlaylist(trackObject, access_token)
    if (ret.error) {
        console.log("Hey sdfghjk")
        const body = await refresh_access_token(ret.error, req.refresh_token, loggedInSpotifyApi)
        if (body.error) {
            return res.send({
                error: body.error.message
            })
        }
        createPlaylist(trackObject, body.access_token).then((ret1)=>{
            if (ret1.error) {
                return res.send({
                    error: ret1.error
                })
            }
            console.log(ret1)
            res.cookie("access_token", body.access_token,  { path: "/", httpOnly: false})  
            res.send({
                message: ret1.message
            }) 
        })

    }
    res.send({
        message: ret.message
    }) 
})

module.exports = router