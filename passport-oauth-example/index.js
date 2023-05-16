require('dotenv').config()

const startServer = require('./src/config/startServer.js')
const { httpApp } = require('./src/app.js')

const dbDriver = require('mongoose')

startServer(httpApp, dbDriver)