const Orders = require('../models/Orders')
const Cart = require('../models/Cart')
const emailFunction = require('./email')

const getOrder = async (req, res) => {
    try {
        if(req.headers.orderNo) {
            let order = await Orders.findOne({ orderNo: req.headers.orderNo })
            if(order == null) {
                return res.status(404).json({ message: "Order could not found!"})
            }
            res.json(order)
        } else {
            return res.status(404).json({ message: "Some fields are missing!"})
        }
    } catch(e) {
        return res.status(500).json({ message: e.message })
    }
}

const getOrders = async (req, res) => {
    try {
        if(req.headers.userID) {
            let orders = await Orders.findOne({ email: req.headers.userID })
            if(orders == null) {
                orders = await Orders.findOne({ user: req.headers.userID })
                if(orders == null) {
                    return res.status(404).json({ message: "Order could not found!"})
                }
            }
            res.json(orders)
        } else {
            return res.status(404).json({ message: "Some fields are missing!"})
        }
    } catch(e) {
        return res.status(500).json({ message: e.message })
    }
}

const createOrder = async (req, res) => {
    try {
        if(req.body.userName && req.body.orderEmail && req.body.phone && req.body.address && req.body.city && req.body.products && req.body.delivery && req.body.totalAmount) {
            if(req.body.products?.length > 0) {
                // validating fields inside req.body.products
                let products = req.body.products
                const product = ['code', 'title', 'price', 'qty', 'image', '_id']
                let valid = true
                product.forEach(i => {
                    products.forEach(j => {
                        const result = Object.keys(j).findIndex(val => {
                            return val == i
                        })
                        if(result == -1) {
                            valid = false
                        }
                    })
                })
                if(valid == false) {
                    return res.status(404).json({ message: "Fields inside Products are not correct!!"})
                }
                // changing ._id property to .id
                products = products.map(i => {
                    i.id = i._id
                    delete i._id
                    return i
                })
                // creating order after validation
                const lastOrder = await Orders.find({}).sort({ date: -1 }).limit(1)
                // console.log('last saved order: ', lastOrder[0]?.orderNo, lastOrder)
                const orderNumber = lastOrder[0].orderNo ? (lastOrder[0]?.orderNo + 1) : 1
                let order = new Orders({
                    orderNo: orderNumber,
                    userName: req.body.userName,
                    email: req.body.email ? req.body.email : '',
                    orderEmail: req.body.orderEmail,
                    phone: req.body.phone,
                    address: req.body.address,
                    city: req.body.city,
                    products: products,
                    delivery: req.body.delivery,
                    totalAmount: req.body.totalAmount,
                })
                const arr = []
                if(req.body.email) {
                    arr.push(Cart.deleteMany({ user: req.body.email }))
                }
                const email = await emailFunction(req.body.email, null, 'order', req.body.products, req.body.totalAmount, orderNumber)
                if(email == true) {
                    if(req.body.email) {
                        arr.push(order.save())
                        const response = await Promise.all(arr)
                        res.status(201).json(response[1])
                    } else {
                        const response = await order.save()
                        res.status(201).json(response)
                    }
                } else {
                    return res.status(500).json({ message: "Error in sending verification email!" })
                }

                // remove this ->
                // res.status(201).json(order)
            } else {
                return res.status(404).json({ message: "Products could not be empty!"})
            }
        } else {
            return res.status(404).json({ message: "Some fields are missing!"})
        }
    } catch(e) {
        // console.log('internal error: ', e)
        return res.status(500).json({ message: e.message })
    }
}

module.exports = {
    getOrder,
    getOrders,
    createOrder,
}