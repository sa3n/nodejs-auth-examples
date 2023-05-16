const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    google: {
        id: String
    }
})

module.exports = model('User', userSchema)