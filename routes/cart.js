const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cart')
const cartMiddleware = require('../middlewares/cart')
const authMiddleware = require('../middlewares/auth')

// Getting all
router.get('/', authMiddleware.verifyToken, cartMiddleware.cartMiddleware, cartController.getCart)
router.get('/app', authMiddleware.verifyToken, cartMiddleware.cartMiddleware, cartController.getCartApp)

// Uploading one
router.post('/', authMiddleware.verifyToken, cartMiddleware.cartMiddleware, cartController.addCart)

// Deleting one
router.delete('/', authMiddleware.verifyToken, cartMiddleware.cartMiddleware, cartController.deleteCart)


module.exports = router