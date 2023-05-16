const { join } = require('node:path')

const { Router } = require('express')

const isAuth = require('../middleware/isAuth')
const { staticFolderPath } = require('../config/static')

const mainRouter = new Router()

mainRouter.get('/dashboard', isAuth, (req, res, next) => {
    res.sendFile(join(staticFolderPath, 'dashboard.html'))
})

module.exports = mainRouter