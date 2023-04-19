const { createServer } = require('node:http')
const path = require('node:path')
const { scrypt, randomBytes } = require('node:crypto')
const { promisify } = require('node:util')

const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')

const scryptAsync = promisify(scrypt)

const User = require('./models/User')

const passport = require('passport')
const localStrategy = require('passport-local').Strategy

// const = N, blockSize = r
const scryptOpts = { 
    cost: 16384, 
    blockSize: 8 
}

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
        const providedPasswordHash = await scryptAsync(password, user.salt, 64, scryptOpts)

        if (providedPasswordHash.toString('base64') !== user.passwordHash) {
            console.log('HERE!')
            return done(null, false, { 
                message: 'Password incorrect' 
            })
        }
        

        return done(null, user)
    } catch (err) {
        return next(err)
    }
}))

const app = express()

// MIDDLEWARES

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    // store:
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(express.static('public'))

// ROUTER

app.get('/dashboard', (req, res, next) => {
    console.log(req.session)
    console.log(req.user)
    console.log(req.isAuthenticated())
    if (req.isAuthenticated()) {
        return res.sendFile(path.join(__dirname, 'public', 'dashboard.html'))
    } else {
        return res.json({ error: 'Only authorized users' })
    }
})

app.post('/register', async (req, res, next) => {
    const { name, email, password, passwordConfirmation } = req.body 

    const response = { error: null, data: {}}

    if (!name || !email || !password || !passwordConfirmation) {
        response.error = 'Please provide all required data'
        return res.json(response)
    }

    if (password !== passwordConfirmation) {
        response.error = 'Passwords do not match'
        return res.json(response)
    }

    const user = await User.findOne({ email })
    
    if (user) {
        response.error = 'Email is already registered'
        return res.json(response)
    } 
    
    const salt = randomBytes(16).toString('base64')

    try {
        const passwordHash = await scryptAsync(password, salt, 64, scryptOpts)

        await User.create({
            name,
            email,
            passwordHash: passwordHash.toString('base64'),
            salt
        })

    } catch (err) {
        return next(err)
    }
    
    return res.redirect('/login.html')
})

app.post('/login', 
    (req, res, next) => {
        console.log(req.body)
        next()
    },
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login.html',
        failureMessage: true
    })
)

app.use((req, res, next) => {
    return res.send('404')
})

app.use((err, req, res, next) => {
    console.log(err)
})

// START SERVER

const server = createServer(app)

mongoose
    .connect('mongodb://127.0.0.1:27017/authExamples', {})
    .then(result => {
        console.log('MongoDB connected')
        server.listen(3000, () => {
            console.log('Server is running')
        })
    }
    )
    .catch(err => {
        console.log(err)
    })

