const express = require('express')
const router = express.Router()
const logoutController = require('../../controllers/old/logout')

// logout user
router.get('/', logoutController)

module.exports = router