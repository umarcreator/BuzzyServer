const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    accessToken: {
        type: [{ token: String, device: String, time: Date }],
        required: false,
    },
    refreshToken: {
        type: [{ token: String, device: String, time: Date }],
        required: false,
    },
    verification: {
        type: { code: Number, time: Date },
        required: false,
    },
    verified: {
        type: Boolean,
        required: false,
    }
})

module.exports = mongoose.model('User', UserSchema)