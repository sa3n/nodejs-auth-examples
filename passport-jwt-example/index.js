require('dotenv').config()

const { createServer } = require('node:http')
const { readFileSync } = require('node:fs')
const path = require('node:path')

const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const JWTStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')

const User = require('./api/models/User')
const authRouter = require('./api/routers/authRouter')
const userRouter = require('./api/routers/userRouter')
const errorRouter = require('./api/routers/errorRouter')

const app = express()

const publicKey = readFileSync(path.join(__dirname, 'config', 'rsaPublicKey.pem'))

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: publicKey,
    algorithms: ['RS256'],
}, async (payload, done) => {
    const id = payload.sub // check issueJWT function
    const user = await User
        .findById(id) 
        .catch(err => done(err, false))
    if (user) {
        return done(null, user)
    } else {
        return done(null, false)
    }
}))

app.use(passport.initialize())

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('./public'))

app.use(
    authRouter,
    userRouter,
    errorRouter
)

const server = createServer(app)

mongoose
    .connect(process.env.DBURI, {})
    .then(() => {
        server.listen(process.env.PORT, process.env.HOST, () => {
            console.log('Server is running')
        })
    })

process.on('uncaughtException', (err) => {
    console.log(err)
    process.exit(1)
})