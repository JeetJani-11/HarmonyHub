const util = require('util')
const refresh_access_token = async (err, refresh_token, loggedInSpotifyApi) => {
    if (err === "An error occurred while communicating with Spotify's Web API.\nDetails: The access token expired.") {
        try {
            loggedInSpotifyApi.setRefreshToken(refresh_token)
            const data = await loggedInSpotifyApi.refreshAccessToken()
            if (!data) {
                throw new Error()
            }
            loggedInSpotifyApi.setAccessToken(data.body['access_token'])
            return { access_token: data.body['access_token'] }
        } catch (error) {
            return { error }
        }
    } else {
        return err
    }
}

module.exports = refresh_access_token

