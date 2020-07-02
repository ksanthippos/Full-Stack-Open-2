const express = require('express')
const app = express()
app.use(express.json())

let persons = [
        {
            "name": "Arto Hellas",
            "number": "040-123456",
            "id": 1
        },
        {
            "name": "Ada Lovelace",
            "number": "39-44-5323523",
            "id": 2
        },
        {
            "name": "Dan Abramov",
            "number": "12-43-234345",
            "id": 3
        },
        {
            "name": "Mary Poppendieck",
            "number": "39-23-6423122",
            "id": 4
        }
]

// GET
app.get('/', (req, res) => {
    res.send('<h1>Phonebook root</h1>')
})

app.get('/info', (req, res) => {

    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0

    res.send('<h1>Phonebook info</h1>' +
        'Phonebook has info for ' + maxId + ' people <p/>' +
        new Date()
        )
})

app.get('/api/persons', (req, res) => {
    if (persons)
        res.json(persons)
    else
        res.status(404).end()
})


app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)    // json-muodossa id on merkkijono --> muunnos luvuksi
    const person = persons.find(person => person.id === id)

    if (person)
        res.json(person)
    else
        res.status(404).end()
})

// DELETE
app.delete(`/api/persons/:id`, (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})


// POST
const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}

app.post('/api/persons', (req, res) => {

    const body = req.body

    if (!body.name || !body.number) {    // ei hyväksytä tyhjää contentia
        return res.status(400).json({
            error: 'content missing'
        })
    }

    // ei hyväksytä samoja nimiä
    const found = persons.filter(person => person.name === body.name)

    if (found !== null) {
        console.log("Duplicate found!")
        return res.status(400).json({
            error: 'duplicate name'
        })
    }
    else {
        console.log("No duplicates.")
    }


    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }
    persons = persons.concat(person)

    res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


