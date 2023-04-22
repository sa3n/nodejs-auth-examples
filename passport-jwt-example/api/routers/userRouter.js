const path = require('node:path')

const { Router } = require('express')
const passport = require('passport')


const userRouter = new Router()

userRouter.get('/dashboard', 
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        res.sendFile(path.join(__dirname, '..', '..', 'public', 'dashboard.html'))
    }
)

module.exports = userRouter