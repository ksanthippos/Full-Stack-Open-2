const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

// GET ALL
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog
      .find({})
      .populate('user', { username: 1, name: 1 })

  await res.json(blogs.map(blog => blog.toJSON()))
})

// POST
blogsRouter.post('/', async (req, res) => {
  const body = req.body

  const user = await User.findById(body.userId)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  await res.json(savedBlog.toJSON())
})

// DELETE
blogsRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

// UPDATE
blogsRouter.put('/:id', async (req, res) => {
  const body = req.body

  const blog = {
    likes: body.likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {new: true, })
  await res.json(updatedBlog.toJSON())
})

module.exports = blogsRouter
