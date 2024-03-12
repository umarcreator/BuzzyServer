const Cart = require('../models/Cart')

const getCart = async (req, res) => {
    if(res.cart) {
        res.json(res.cart)
    } else if (res.user) {
        res.json(null)
    }
}

const getCartApp = async (req, res) => {
    res.json(res.cart);
}

const addCart = async (req, res) => {
    try {
        if(req.body && req.body.code && req.body.title && req.body.image && req.body.price) {
            const product = {
                code: req.body.code,
                title: req.body.title,
                image: req.body.image,
                price: req.body.price,
                qty: req.body.qty,
            }
            if(res.cart) {
                if(res.cart?.products) {
                    if(res.cart.products.find(i => i.code === req.body.code) === undefined) {
                        res.cart.products.push(product)
                        const newCart = await res.cart.save()
                        res.status(201).json(newCart)
                    } else {
                        if(res.cart.products.find(i => i.code === req.body.code).qty == req.body.qty) {
                            return res.status(200).json({ message: 'Already in the cart!' })
                        } else {
                            res.cart.products = res.cart.products.map(i => {
                                if(i.code == req.body.code) {
                                    i.qty = req.body.qty;
                                }
                                return i;
                            })
                            const newCart = await res.cart.save()
                            res.status(201).json(newCart)
                        }
                    }
                } else {
                    const cart = new Cart({
                        products: [product],
                        user: res.email
                    })
                    const newCart = await cart.save()
                    res.status(201).json(newCart)
                }
            } else {
                return res.status(400).json({ message: "Something bad in your request!"})
            }
        } else {
            return res.status(400).json({ message: "Some fields are missing!"})
        }
    } catch(e) {
        // console.log('database error: ', e)
        return res.status(500).json({ message: e.message })
    }
}

const deleteCart = async (req, res) => {
    if(req.body && req.body.code) {
        const code = req.body.code
        if(res.cart) {
            res.cart.products = res.cart.products.filter(i => {
                return i.code != code
            })
            try {
                const newCart = await res.cart.save()
                res.status(201).json(newCart)
            } catch(e) {
                // console.log('database error: ', e)
                return res.status(500).json({ message: e.message })
            }
        } else if(res.user) {
            return res.status(400).json({ message: "No cart available in DB!"})
        } else {
            return res.status(400).json({ message: "Something bad in your request!"})
        }
    } else {
        return res.status(400).json({ message: "Some fields are missing!"})
    }
}

module.exports = {
    getCart,
    getCartApp,
    addCart,
    deleteCart,
}