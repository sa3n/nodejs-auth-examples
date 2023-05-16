const { Router } = require('express')
const passport = require('passport')

const authRouter = new Router()

authRouter.get('/login', passport.authenticate('google', {
    // https://oauth.net/2/scope/
    scope: ['profile']
}))

authRouter.get('/google/callback', 
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

authRouter.post('/logout', (req, res, next) => {
    req.logout({}, (err) => {
        if (err) return next(err)
        res.redirect('/')
    })
})

module.exports = authRouter