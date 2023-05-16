const session = require('express-session')
const MongoStore = require('connect-mongo')

const { DB_URI, SESSION_SECRET } = process.env

module.exports = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: DB_URI
    })
})

