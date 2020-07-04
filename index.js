require('dotenv').config()
const express = require('express')
const app = express()

// mongoDB
const Person = require('./models/persons')
const morgan = require('morgan')
const cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

//datan loggaus
morgan.token('body', function (req, res) { return JSON.stringify(req.body) });
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));

// apufunktio
const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}


// ROOT
app.get('/', (req, res) => {
    res.send('<h1>Phonebook root</h1>')
})

/*app.get('/info', (req, res) => {

    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0

    res.send('<h1>Phonebook info</h1>' +
        'Phonebook has info for ' + maxId + ' people <p/>' +
        new Date()
        )
})*/

// GET ALL
app.get('/api/persons', (req, res) => {
/*    if (persons)
        res.json(persons)
    else
        res.status(404).end()*/
    Person.find({}).then(notes => {
        res.json(notes)
    })
})

/*app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)    // json-muodossa id on merkkijono --> muunnos luvuksi
    const person = persons.find(person => person.id === id)

    if (person)
        res.json(person)
    else
        res.status(404).end()
})*/


/*// DELETE
app.delete(`/api/persons/:id`, (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})*/


// POST
app.post('/api/persons', (req, res) => {
    const body = req.body

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(saved => {
        res.json(saved)
    })

/*    // tyhjä nimi tai numero --> ei hyväksytä
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    // tarkistetaan löytyykö samoja nimiä --> ei hyväksytä
    const found = persons.find(person => person.name === body.name)

    if (found) {
        return res.status(400).json({
            error: 'duplicate name found!'
        })
    }

    // lisääminen ok
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)
    res.json(person)*/
})


const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

