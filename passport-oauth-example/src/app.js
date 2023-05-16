const { createServer } = require('node:http')

const express = require('express')
const passport = require('passport')

const sessionMiddleware = require('./config/session')
const { staticFolderPath } = require('./config/static')

const mainRouter = require('./routes/mainRouter')
const authRouter = require('./routes/authRouter')
const apiRouter = require('./routes/apiRouter')

const notFoundMiddleware = require('./middleware/notFoundHandler')
const errorHandler = require('./middleware/errorHandler')

const app = express()

require('./config/passport')

app.use(sessionMiddleware)
app.use(passport.initialize())
app.use(passport.session()
)
app.use(express.static(staticFolderPath))

app.use('/auth', authRouter)
app.use('/api', apiRouter)
app.use('/', mainRouter)
app.use(notFoundMiddleware)
app.use(errorHandler)

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

exports.httpApp = createServer(app)
