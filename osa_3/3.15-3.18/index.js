require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/persons')
const morgan = require('morgan')
const cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(express.static('build'))


// LOGGAUS KONSOLIIN
morgan.token('body', function (req, res) { return JSON.stringify(req.body) });
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));


// GET ALL
app.get('/api/persons', (req, res) => {
    Person.find({})
        .then(persons => {res.json(persons)})
        .catch(error => next(error))
})

// GET BY ID
app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person)
                res.json(person.toJSON())
            else
                res.status(404).end()  // tyhjä
        })
        .catch(error => next(error))  // virheiden käsittely middlewaressa
})

// DELETE
app.delete(`/api/persons/:id`, (req, res) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

// POST
app.post('/api/persons', (req, res) => {
    const body = req.body

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    // lisätään uusi henilö
    person
        .save()
        .then(saved => {res.json(saved)})
        .catch(error => next(error))
})

// UPDATE
app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(req.params.id, person, {new: true})
        .then(updated => {
            res.json(updated)
        })
        .catch(error => next(error))
})


// VIRHEKÄSITTELYT

// tuntematon osoite
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// next(error) tuo virhekäsittelyt kaikki tänne
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError')
        return response.status(400).send({ error: 'wrong id'})

    next(error)
}

app.use(errorHandler)


// PORTTI
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

