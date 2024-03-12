const bcrypt = require('bcrypt')
const emailFunction = require('../email')
const saltRounds = 10
const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const register = async (req, res) => {
    try {
        if(req.body && req.body.email && req.body.password && req.body.name) {
            if(emailRegexp.test(req.body.email)) {
                const hash = await bcrypt.hash(req.body.password, saltRounds)
                // const random = crypto.randomBytes(16).toString('hex')
                const random = randomNumber(100000, 999999)
                const user = new User({
                    email: req.body.email,
                    password: hash,
                    name: req.body.name,
                    verification: random,
                    verified: false,
                })
                console.log('trying email ...')
                const email = await emailFunction(req.body.email, random);
                if(email == true) {
                    await user.save()
                    res.status(201).json({ message: 'Successfully added user!' })
                } else {
                    return res.status(500).json({ message: "Error in sending verification email!" })
                }
            } else {
                return res.status(400).json({ message: "Email is not valid!"})
            }
        } else {
            return res.status(400).json({ message: "Some fields are missing!"})
        }
    } catch(e) {
        // console.log(e.message)
        return res.status(500).json({ message: e.message })
    }
}

module.exports = register