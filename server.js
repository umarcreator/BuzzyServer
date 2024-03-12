const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
mongoose.connect('mongodb://127.0.0.1:27017/buzzy')

const db = mongoose.connection
db.on('error', e => console.log(e))
db.once('open', () => console.log('connected to db'))

app.use(express.json())
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:8081', 'http://192.168.0.190:8081', 'exp://192.168.0.190:8081'],
    credentials: true,
}))
// app.use(cors())

app.listen(3000, err => {
    if(err) console.log('There is an error in port')
    console.log('Listening at port 3000')
})

// api/products
const productsRouter = require('./routes/products')
app.use('/api/products', productsRouter)

// api/cart
const cartRouter = require('./routes/cart')
app.use('/api/cart', cartRouter)

// api/auth
const authRouter = require('./routes/auth')
app.use('/api/auth', authRouter)

// api/user
const userRouter = require('./routes/user')
app.use('/api/user', userRouter)

// api/order
const ordersRouter = require('./routes/orders')
app.use('/api/order', ordersRouter)

// api/admin
const adminRouter = require('./routes/admin')
app.use('/api/admin', adminRouter)

// static/images, etc
app.use('/static', express.static(path.join(__dirname, 'public')))

app.use('/', (req, res) => {
    res.send('<h1 style="margin-top: 2rem">Hi, successfully connected to Buzzy server! Thanks.</h1>');
})