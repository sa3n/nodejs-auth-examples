const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

const User = require('../models/User')

passport.use(new GoogleStrategy(
    {
        clientID: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_SECRET,
        callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        const { id } = profile

        try {
            let user = await User.findOne({ "google.id": id })

            if (user) {
                return done(null, user)
            } else {
                user = await User.create({
                    name: profile.displayName,
                    google: {
                        id
                    }
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