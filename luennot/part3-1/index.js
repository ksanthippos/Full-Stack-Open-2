const express = require('express')
const app = express()
app.use(express.json())

let persons = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2020-01-10T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2020-01-10T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2020-01-10T19:20:14.298Z",
        important: true
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello!</h1>')
})

app.get('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id)    // json-muodossa id on merkkijono --> muunnos luvuksi
    const note = persons.find(note => note.id === id)

    if (note)
        res.json(note)
    else
        res.status(404).end()
})

app.delete(`/api/notes/:id`, (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(note => note.id !== id)

    res.status(204).end()
})

// tarkistetaan mikä on tämän hetkinen suurin id ja luodaan siitä yhtä suurempi
const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}

app.post('/api/notes', (req, res) => {

    const body = req.body
    console.log(body)
    if (!body.content) {    // ei hyväksytä tyhjää contentia
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        id: generateId(),
        content: body.content,
        important: body.important || false,
        date: new Date(),
    }
    persons = persons.concat(note)

    res.json(note)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


