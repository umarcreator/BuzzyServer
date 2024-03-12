const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const { verifyRefreshToken } = require('../middlewares/auth')
const { registerMiddleware, loginMiddleware, verifyMiddleware } = require('../middlewares/user')

// login user
router.post('/login', loginMiddleware, userController.login)

// register user
router.post('/register', registerMiddleware, userController.register)

// logout user
router.get('/logout', verifyRefreshToken, userController.logout)

// verify user
router.post('/verify', verifyMiddleware, userController.verify)

// re-verify user
router.post('/re-verify', verifyMiddleware, userController.reVerify)

module.exports = router