const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

router.post('/register', async (req, res) => {

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    })

    const result = await user.save()

    //separate password from JSON data
    const { password, ...data } = await result.toJSON()

    res.send(data)

})

router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return res.status(404).send({
            message: 'User not found in DB'
        })
    }

    if (await bcrypt.compare(req.body.password, user.password)) {
        return res.status(400).send({
            message: 'Invalid credentials'
        })
    }

    const token = jwt.sign({ _id: user._id }, "secret")

    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day cookie life
    })

    res.send({
        message: 'success'
    })

})

router.get('/user', async (req, res) => {

    try {
        const cookie = req.cookies['jwt']

        const claims = jwt.verify(cookie, "secret")

        if (!claims) {
            return res.status(401).send({
                message: 'Unauthorized'
            })
        }

        const user = await User.findOne({ _id: claims._id })

        const { password, ...data } = await user.toJSON()

        res.send(data)
    } catch (e) {
        return res.status(401).send({
            message: 'Unauthorized'
        })
    }
})

router.post('/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 0 })

    res.send({
        message: 'you logout'
    })
})


module.exports = router;