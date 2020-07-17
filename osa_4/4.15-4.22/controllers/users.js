const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    const body = request.body

    // tarkistetaan salasanan pituus
    if (body.password.length < 3)
        return response.status(400).json({
            error: 'password length minimum length is 3 characters'
        })

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
    })

    const savedUser = await user.save()

    await response.json(savedUser)

})

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({})
        .populate('blogs', { url: 1, title: 1, author: 1 })

    await response.json(users.map(u => u.toJSON()))
})

module.exports = usersRouter