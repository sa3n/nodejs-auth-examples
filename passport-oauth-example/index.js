require('dotenv').config()

const { createServer } = require('node:http')
const path = require('node:path')

const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

const User = require('./api/models/User')

passport.use(new GoogleStrategy(
    {
        clientID: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_SECRET,
        callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        const { id } = profile

        try {
            let user = await User.findOne({ googleId: id })

            if (user) {
                done(null, user)
            } else {
                user = await User.create({
                    googleId: id,
                    name: profile.displayName
                })
                done(null, user)
            } 
        } catch (err) {
            done(err, false)
        }
    }
))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    const user = await User
        .findById(id)
        .catch(err => done(err, false))
    done(null, user)
})

const app = express()

app.use(session({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: false,
    // store:
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('./public'))

app.get('/login', passport.authenticate('google', {
    // https://oauth.net/2/scope/
    scope: ['profile']
}))

app.get('/auth/google/callback', 
    passport.authenticate(
        'google', 
        {
            failureRedirect: '/'
        }
    ), 
    (req, res, next) => {
        res.redirect('/dashboard')
    }
)

function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.json({ error: 'Not authorized' })
    }
} 

app.get('/dashboard', isAuth, (req, res, next) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'))
})

app.post('/logout', (req, res, next) => {
    req.logout({}, (err) => {
        if (err) return next(err)
        res.redirect('/')
    })
})

app.use((req, res, next) => {
    res.send('404')
})

app.use((err, req, res, next) => {
    console.log(err)
})

const server = createServer(app)

mongoose
    .connect(process.env.DBURI, {})
    .then(() => {
        console.log("Connected to DB")
        server.listen(process.env.PORT, process.env.HOST, () => {
            console.log("Server is running")
        })
    })
