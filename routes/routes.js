const router = require('express').Router()
const bcrypt = require('bcryptjs')
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
            message
        })
    }
})


module.exports = router;