const { Router } = require('express')

const errorRouter = new Router()

errorRouter.use((req, res, next) => {
    res.send('404')
})

errorRouter.use((err, req, res, next) => {
    console.log(err)
})

module.exports = errorRouter