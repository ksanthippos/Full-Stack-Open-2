const Blog = require('../models/blog')
const User = require('../models/user')

// "tietokanta" testejä varten
const initialBlogs = [
    {
        title: 'Most clever blog eva!',
        author: 'DT jr',
        url: 'www.real-dt.org',
        likes: 123
    },
    {
        title: 'Most stupid blog evr',
        author: 'DT sr',
        url: 'www.unreal-dt.org',
        likes: 666
    }
]

/*const initialUser = [
    {
        username: 'testi',
        name: 'Testi 123',
        password: 'salainen'
    }
]*/

const nonExistingId = async () => {
    const blog = new Blog({ content: 'removed soon' })
    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs, nonExistingId, blogsInDb, usersInDb
}