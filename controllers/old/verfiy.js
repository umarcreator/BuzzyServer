const emailFunction = require('../email')

function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const verify = async (req, res) => {
    try {
        if(req.body.code) {
            if(req.body.email === res.user.email && res.user.verification == req.body.code) {
                res.user.verified = true
                try {
                    let user = await res.user.save()
                    res.json({ message: "Successfully verified!" })
                } catch(e) {
                    return res.status(500).json({ message: e.message })
                }
            } else {
                return res.status(400).json({ message: "Verification failed: Code donot match!" })
            }
        } else {
            return res.status(400).json({ message: "Some fields are missing!" })
        }
    } catch(e) {
        return res.status(500).json({ message: e.message })
    }
}

const reVerify = async (req, res) => {
    try {
        const random = randomNumber(100000, 999999)
        res.user.verification = random
        const email = await emailFunction(req.body.email, random);
        if(email == true) {
            await res.user.save()
            res.status(201).json({ message: 'Email sent successfully!' })
        } else {
            return res.status(500).json({ message: "Error in sending verification email!" })
        }
    } catch(e) {
        // console.log(e.message)
        return res.status(500).json({ message: e.message })
    }
}

module.exports = {
    verify,
    reVerify,
}