const express = require('express')
const router = express.Router()
const { verify } = require('../../controllers/old/verfiy')
const { verifyMiddleware } = require('../../middlewares/user')

// Getting user
router.post('/', verifyMiddleware, verify)

module.exports = router