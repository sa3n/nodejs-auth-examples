require('dotenv').config()
const mongoose = require('mongoose')

const server = require('./config/server')
const startServer = require('./config/startServer')

startServer(
    server, 
    process.env.HOST, 
    process.env.PORT, 
    mongoose, 
    process.env.DBURI
)