const { createServer } = require('node:http')

const express = require('express')
const passport = require('passport')

const sessionMiddleware = require('./session')
const authRouter = require('../api/routers/authRouter')
const userRouter = require('../api/routers/userRouter')
const errorRouter = require('../api/routers/errorRouter')

const app = express()

require('./passport')

// MIDDLEWARES

app.use(sessionMiddleware)

app.use(passport.initialize())
app.use(passport.session())

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(express.static('public'))

// ROUTERS

app.use(
    authRouter,
    userRouter,
    errorRouter
)

const server = createServer(app)

module.exports = server