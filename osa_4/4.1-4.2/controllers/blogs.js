const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


// GET ALL
blogsRouter.get('/', (req, res) => {
  Blog.find({})
    .then(blogs => {
      res.json(blogs.map(blog => blog.toJSON()))
    })
})

// POST
blogsRouter.post('/', (request, response, next) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: 0
  })

  blog.save()
    .then(saved => {
      response.json(saved.toJSON())
    })
    .catch(error => next(error))
})


module.exports = blogsRouter
