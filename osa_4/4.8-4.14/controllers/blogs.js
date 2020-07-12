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
    likes: 0,
  })

  const savedBlog = await blog.save()
  res.json(savedBlog.toJSON())
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
  res.json(updatedBlog.toJSON())

})

module.exports = blogsRouter
