const path = require('node:path')

const { Router } = require('express')

const userRouter = new Router()

userRouter.get('/dashboard', (req, res, next) => {
    // console.log(req.session)
    // console.log(req.user)
    // console.log(req.isAuthenticated())
    if (req.isAuthenticated()) {
        return res.sendFile(path.join(__dirname, '..', '..', 'public', 'dashboard.html'))
    } else {
        return res.json({ error: 'Only authorized users' })
    }
})

module.exports = userRouter