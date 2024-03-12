const Cart = require('../models/Cart')
const jwt = require('jsonwebtoken')

// cart middleware
// const cartMiddleware = async (req, res, next) => {
//     let cart
//     try {
//         if(req.headers !== undefined && req.headers !== null && req.headers.cookie !== undefined) {
//             // console.log(req.headers.cookie, 'cookie')
//             const { cookie } = req.headers
//             const token = cookie.split('token=')[1].split(';')[0].split('%20')[1]
//             jwt.verify(token, process.env.ACCESS_TOKEN, async (err, user) => {
//                 if(err) {
//                     return res.status(400).json({ message: "Could not update cart: Auth is failed!"})
//                 } else {
//                     cart = await Cart.findOne({ user: user.email })
//                     if(cart) {
//                         res.cart = cart
//                         next()
//                     } else {
//                         res.user = user.email
//                         next()
//                     }
//                 }
//             })
//         }
//     } catch(e) {
//         return res.status(500).json({ message: e.message })
//     }
// }

const cartMiddleware = async (req, res, next) => {
    try {
        if(res.email) {
            const email = res.email
            let cart = await Cart.findOne({ user: email })
            res.cart = cart == null ? [] : cart
            next()
        } else {
            res.status(400).json({ message: 'Some fields are missing!' })
        }
    } catch(e) {
        return res.status(500).json({ message: e.message })
    }
}

module.exports = {
    cartMiddleware
}