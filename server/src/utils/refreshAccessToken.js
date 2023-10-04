const refresh_access_token = async (err , refresh_token, loggedInSpotifyApi) => {
    if (err === "An error occurred while communicating with Spotify's Web API.\nDetails: The access token expired.") {
        try {
            loggedInSpotifyApi.setRefreshToken(refresh_token)
            const data = await loggedInSpotifyApi.refreshAccessToken()
            if (!data) {
                throw new Error()
            }
            loggedInSpotifyApi.setAccessToken(data.body['access_token'])
            console.log("Refresh Function" , data.body['access_token'])
            return {access_token : data.body['access_token']}
        } catch (error) {
            console.log ( "Refresh Function" , error)
            return {error}
        }
    } else {
        console.log("dckfhg;lj" , err)
       return err
    }

}

module.exports = refresh_access_token

//'AQB01SIV2nW9sP7hVr7NG80ajCb5kCyGtW-53biHluTlRSHEdItvz-yLFxwNgMt9bmcPvuwr2LrvNAcAbRIJzlS_YIDNVFxKtvDMnFsxOF12IsBcD-jvWbJFrLwv0vZh5ew'