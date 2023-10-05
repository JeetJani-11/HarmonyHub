const express = require('express')
const app = express()

const playlistRouter = require('./routers/playlist')
const genreRouter = require('./routers/genre')
const artistRouter = require('./routers/artist')
const authorizeRouter = require('./routers/authorize')
const callbackRouter = require('./routers/callback')
const trackRouter = require('./routers/track')
const cors=require("cors");

const corsOptions ={
   origin:"http://localhost:3000",        
   credentials: true,
   withCredentials: true ,
   exposedHeaders: ["set-cookie"]
}

console.log(process.env.CLIENT_SECRET)
const port = process.env.PORT || 3001

app.use(cors(corsOptions))
app.use(express.json())
app.use(genreRouter)
app.use(trackRouter)
app.use(artistRouter)
app.use(authorizeRouter)
app.use(callbackRouter)
app.use(playlistRouter)


app.listen(port, () => {
  console.log("Server is up on port" + port)
})


