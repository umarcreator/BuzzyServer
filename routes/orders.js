const express = require('express')
const router = express.Router()
const ordersController = require('../controllers/orders')

// Getting Order
router.get('/', ordersController.getOrder)

// Getting Orders
router.get('s', ordersController.getOrders)

// Uploading order
router.post('/checkout', ordersController.createOrder)

module.exports = router