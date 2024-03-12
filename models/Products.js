const mongoose = require('mongoose')

const ProductsSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    keywords: {
        type: [],
        required: true,
    },
    images: {
        type: [],
        required: true,
    },
    variation_type: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    price2: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    variations: {
        type: [],
        required: false,
    },
})

module.exports = mongoose.model('Products', ProductsSchema)