const passport = require('passport')
const localStrategy = require('passport-local').Strategy

const User = require('../api/models/User')
const scryptAsync = require('../utils/scryptAsync')


passport.serializeUser((user, done) => {
    done(null, user.id) // will be saved to req.session.passport.user
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id)
        done(null, user)
    } catch (err) {
        done(err, false)
    }
    
})

passport.use(new localStrategy({ usernameField: 'email' }, async (email, password, done) => {
    const user = await User.findOne({ email })

    if (!user) {
        return done(null, false, { 
            message: 'That email is not register '
        })
    }

    try {
        const providedPasswordHash = await scryptAsync(password, user.salt)

        if (providedPasswordHash.toString('base64') !== user.passwordHash) {
            return done(null, false, { 
                message: 'Password incorrect' 
            })
        }
        

        return done(null, user)
    } catch (err) {
        return done(err, false)
    }
}))