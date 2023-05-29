const mongoose = require('mongoose')
const dotenv = require('dotenv')
const express = require('express')
const app = express()

mongoose.set('strictQuery', true)

dotenv.config({path:__dirname+'/.env'})

//connect to database
const connectDatabase = () => {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("connected to database"))
  .catch((err) => {console.log(err)})
}

module.exports = connectDatabase