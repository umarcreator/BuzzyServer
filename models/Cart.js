const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema({
    products: [{
        code: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        qty: {
            type: Number,
            required: true,
        },
    }],
    user: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('Cart', CartSchema)