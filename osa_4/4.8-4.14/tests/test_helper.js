const Blog = require('../models/blog')

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

module.exports = {
    initialBlogs, nonExistingId, blogsInDb
}