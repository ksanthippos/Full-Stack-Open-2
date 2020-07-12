const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


// GET ALL
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs.map(blog => blog.toJSON()))
})

// POST
blogsRouter.post('/', async (req, res) => {
  const body = req.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: 0
  })

  const savedBlog = await blog.save()
  res.json(savedBlog.toJSON())
})


module.exports = blogsRouter
