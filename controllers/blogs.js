/* eslint-disable linebreak-style */
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

const jwt = require('jsonwebtoken')

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

  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!req.token || !decodedToken.id)
    return res.status(401).json({ error: 'token missing or invalid' })

  // user id saadaan tokenista
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: 0,
    comments: [],
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  await res.json(savedBlog.toJSON())
})

// DELETE
blogsRouter.delete('/:id', async (req, res) => {

  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!req.token || !decodedToken.id)
    return res.status(401).json({ error: 'token missing or invalid' })

  const blogId = req.params.id
  const blog = await Blog.findById(blogId)
  const user = await User.findById(decodedToken.id)

  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndRemove(blogId)
    res.status(204).end()
  }
  else {
    await res.status(401).json( {
      error: 'unauthorized access'
    })
  }
})

// UPDATE
blogsRouter.put('/:id', async (req, res) => {
  const body = req.body

  const blog = {
    likes: body.likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true, })
  await res.json(updatedBlog.toJSON())
})

module.exports = blogsRouter
