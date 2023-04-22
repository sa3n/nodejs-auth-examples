const { randomBytes, pbkdf2Sync } = require('node:crypto')
const { readFileSync } = require('node:fs')
const path = require('node:path')
const { createPrivateKey } = require('node:crypto')

const { Router } = require('express')
const passport = require('passport')
const jsonwebtoken = require('jsonwebtoken')

const User = require('../models/User')

const privateKey = readFileSync(path.join(__dirname, '..', '..', 'config', 'rsaPrivateKey.pem'), 'utf8')

const authRouter = new Router()

// TODO: move to module
function issueJWT(user) {
    const { _id } = user

    const token = jsonwebtoken.sign(
        {
            sub: _id,
            iat: Date.now(),
        },
        privateKey,
        {
            expiresIn: '2w',
            algorithm: 'RS256'
        }
    )

    return {
        token: 'Bearer ' + token,
        expires: '2w'
    }
}

authRouter.post('/register', async (req, res, next) => {
    const { username, password } = req.body

    const salt = randomBytes(32).toString('hex')
    const hash = pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex') 

    const user = await User
        .create({
            username,
            hash,
            salt
        })
        .catch(err => {
            next(err)
        })

    const { token, expires } = issueJWT(user)

    return res.json({ user, token, expires })
})

authRouter.post('/login', 
    // passport.authenticate(), 
    async (req, res, next) => {
        const { username, password } = req.body

        const user = await User.findOne({ username })

        if (!user) {
            res.json({ error: 'Could not find user' })
        }

        const { hash, salt } = user

        const isPasswordValid = hash === pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')

        if (isPasswordValid) {
            const { token, expires } = issueJWT(user)
            res.json({ token, expires })
        } else {
            res.json({ error: 'Wrong password' })
        }
    }
)

authRouter.post('/logout', (req, res, next) => {
    res.send()
})

module.exports = authRouter