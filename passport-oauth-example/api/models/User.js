const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    googleId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
})

module.exports = model('User', userSchema)