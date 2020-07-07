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
    .then(savedNote => {
      response.json(savedNote.toJSON())
    })
    .catch(error => next(error))
})

// GET BY ID
blogsRouter.get('/:id', (request, response) => {
  Blog.findById(request.params.id)
    .then(note => {
      if(note)
        response.json(note.toJSON())
      else
        response.status(404).end()  // tyhjä
    })
  // eslint-disable-next-line no-undef
    .catch(error => next(error))
})

// DELETE
blogsRouter.delete('/:id', (request, response) => {
  Blog.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
  // eslint-disable-next-line no-undef
    .catch(error => next(error))
})

// UPDATE
blogsRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Blog.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

module.exports = blogsRouter
