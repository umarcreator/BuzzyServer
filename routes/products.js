const express = require('express')
const router = express.Router()
const productController = require('../controllers/products')

// Getting one
router.get('/:id', productController.getOneProduct)

// Getting all
router.get('/home/:limit', productController.getProducts)

module.exports = router