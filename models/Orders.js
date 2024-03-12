const mongoose = require('mongoose')

const OrdersSchema = new mongoose.Schema({
    orderNo: {
        type: Number,
        required: true,
        default: 1,
    },
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
    },
    orderEmail: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    products: {
        type: [{ id: mongoose.Schema.Types.ObjectId, code: String, title: String, price: Number, qty: Number, image: String }],
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    delivery: {
        type: Number,
        required: true,
    }
})

module.exports = mongoose.model('Orders', OrdersSchema)