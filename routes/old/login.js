const express = require('express')
const router = express.Router()
const loginController = require('../../controllers/old/login')
const { loginMiddleware } = require('../../middlewares/user')

// Getting user
router.post('/', loginMiddleware, loginController)


module.exports = router