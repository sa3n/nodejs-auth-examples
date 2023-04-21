const User = require('../models/User')
const { randomBytes } = require('node:crypto')

const passport = require('passport')
const { Router } = require('express')

const scryptAsync = require('../../utils/scryptAsync')

const authRouter = new Router()


authRouter.post('/register', async (req, res, next) => {
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
        const passwordHash = await scryptAsync(password, salt)

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

authRouter.post('/login', 
    (req, res, next) => {
        // console.log(req.body)
        next()
    },
    passport.authenticate(
        'local', 
        {
            successRedirect: '/dashboard',
            failureRedirect: '/login.html',
            failureMessage: true
        }, 
        // () => {
        //     console.log('PASSPORT AUTHENTICATE CALLBACK')
        // }
    )
)

authRouter.post('/logout', (req, res, next) => {
    req.logOut((err) => {
        if (err) return next(err)
        return res.redirect('/')
    })
})

module.exports = authRouter