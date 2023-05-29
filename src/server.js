const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')
const connectDatabase = require('./config/database')

const postRoute = require('./controllers/Post')
const authRoute = require('./controllers/Auth')
const userRoute = require('./controllers/User')

app.use(
  cors(),
  express.urlencoded({ extended: true }),
  express.json()
)

dotenv.config({ path: __dirname + '/.env' })

//connect to database
connectDatabase()

//add routes
app.use("/api/post", postRoute)
app.use("/api", authRoute)
app.use("/api/user", userRoute)

const PORT = process.env.PORT || 5050
app.listen(
  PORT,
  console.log(`Server running at ${PORT}`)
)
