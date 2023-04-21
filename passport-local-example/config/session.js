const session = require('express-session')

module.exports = session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    // store:
})