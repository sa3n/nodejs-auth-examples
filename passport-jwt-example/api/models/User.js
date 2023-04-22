const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    }
}) 

module.exports = model('User', userSchema)