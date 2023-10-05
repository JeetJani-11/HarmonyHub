const auth = (req , res , next) => {
    try{
        const access_token = req.header('Authorization').replace('Bearer ' , '')
        const refresh_token = req.header('Refresh')
        req.refresh_token = refresh_token
        req.access_token = access_token
        next()
    }catch(e){
        res.status(401).send({ error :'Please authenticate'})
    }
}

module.exports = auth