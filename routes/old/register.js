const express = require('express')
const router = express.Router()
const registerController = require('../../controllers/old/register')
const { registerMiddleware } = require('../../middlewares/user')

// Getting user
router.post('/', registerMiddleware, registerController)

module.exports = router