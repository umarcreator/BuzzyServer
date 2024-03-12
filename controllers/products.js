const Products = require('../models/Products')

const getOneProduct = async (req, res) => {
    try {
        let product = await Products.findOne({ code: req.params.id })
        if(product == null) {
            return res.status(404).json({ message: "Product could not found!"})
        }
        res.json(product)
    } catch(e) {
        return res.status(500).json({ message: e.message })
    }
}

const getProducts = async (req, res) => {
    try {
        let products = await Products.find().limit(req.params.limit)
        if(products == null) {
            return res.status(404).json({ message: "Product could not found!"})
        }
        res.json(products)
    } catch(e) {
        return res.status(500).json({ message: e.message })
    }
}

module.exports = {
    getOneProduct,
    getProducts,
}